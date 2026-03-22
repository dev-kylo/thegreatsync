# 🌊 ADDENDUM: Streaming Support for Multi-Agent Chat

**Version:** 1.1
**Date:** November 2025
**Status:** READY FOR IMPLEMENTATION

---

## 📋 Overview

This document extends the [Multi-Agent Chat Frontend Spec](./frontend_agent_chat.md) with **streaming support** using Server-Sent Events (SSE). This enables real-time token-by-token display of agent responses, providing a more engaging and responsive user experience.

---

## 🎯 Goals

1. **Real-time Response Display**: Show agent responses as they're generated (token-by-token)
2. **Improved Perceived Performance**: User sees content immediately, reducing wait time perception
3. **Backward Compatibility**: Non-streaming fallback for error scenarios
4. **Graceful Degradation**: Works with existing API structure

---

## 🏗️ Architecture Changes

### Backend Updates (Required)

**New Endpoint**: `POST /agents/:agent/chat/stream`

This parallels the existing `/agents/:agent/chat` but returns Server-Sent Events instead of JSON.

---

## 🔧 Backend Implementation

### 1. New Streaming Route

**File**: `apps/agents/src/routes/agent-chat-stream.ts` (NEW)

```typescript
import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { getAgent, isValidAgent } from '../config/agents';
import { queryRAG } from '../services/rag-service';
import {
  getOrCreateSession,
  getSession,
  addMessage,
  getSessionHistory,
} from '../services/agent-session-service';
import {
  buildFullContext,
  buildSystemPrompt,
  buildOpenAIMessages,
  buildMessageMetadata,
  extractSourceReferences,
  buildCourseInstructorContext,
  truncateHistory,
} from '../services/context-builder';
import type { AgentErrorResponse } from '../types/agent';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// Same validation schema as non-streaming
const ChatSchema = z.object({
  query: z.string().min(1),
  session_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  topic: z.string().optional(),
  domain: z.string().optional(),
  filters: z.object({
    domain: z.string().optional(),
    concepts: z.array(z.string()).optional(),
    mnemonic_tags: z.array(z.string()).optional(),
    has_image: z.boolean().optional(),
    code: z.boolean().optional(),
  }).optional(),
  topK: z.number().int().min(1).max(50).default(8),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().min(1).max(4000).default(1000),
  context: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /agents/:agent/chat/stream
 * Streaming chat endpoint using Server-Sent Events
 */
router.post('/agents/:agent/chat/stream', async (req, res) => {
  try {
    const agentParam = req.params.agent;

    // Step 1: Validate agent
    if (!isValidAgent(agentParam)) {
      return res.status(400).json({
        ok: false,
        error: 'invalid_agent',
        message: `Unknown agent: ${agentParam}`,
      } as AgentErrorResponse);
    }

    const agentConfig = getAgent(agentParam);

    // Step 2: Parse request
    const args = ChatSchema.parse(req.body);

    // Step 3: Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Helper to send SSE events
    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Step 4: Get or create session
    let session_id: string;
    if (args.session_id) {
      session_id = args.session_id;
      try {
        await getSession(session_id);
      } catch (error) {
        sendEvent('error', {
          error: 'session_not_found',
          message: `Session not found: ${session_id}`,
        });
        return res.end();
      }
    } else {
      session_id = await getOrCreateSession(
        agentConfig.id,
        args.user_id,
        args.topic,
        args.domain,
        agentConfig.session_type,
        args.context
      );
    }

    // Send session_id immediately
    sendEvent('session', { session_id });

    // Step 5: Query RAG
    const chunks = await queryRAG({
      query: args.query,
      topK: args.topK,
      collections: agentConfig.collections,
      filters: args.filters,
    });

    // Send sources immediately (before streaming response)
    sendEvent('sources', {
      sources: extractSourceReferences(chunks),
      chunks_retrieved: chunks.length,
    });

    // Step 6: Build context and system prompt
    let fullContext = buildFullContext(chunks);
    const session = await getSession(session_id);

    if (agentConfig.id === 'realm_builder' && session.context?.realm_snapshot && session.context?.topic_pack) {
      fullContext = buildCourseInstructorContext(
        session.context.realm_snapshot,
        session.context.topic_pack,
        fullContext
      );
    }

    const systemPrompt = buildSystemPrompt(agentConfig.systemPromptTemplate, fullContext);

    // Step 7: Load message history
    const fullHistory = await getSessionHistory(session_id, 100);
    const recentHistory = truncateHistory(fullHistory, 30);

    // Step 8: Build messages
    const messages = buildOpenAIMessages(systemPrompt, recentHistory, args.query);

    // Step 9: Stream OpenAI response
    const stream = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
      stream: true, // ENABLE STREAMING
    });

    let fullReply = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;

      if (delta) {
        fullReply += delta;

        // Send each token as it arrives
        sendEvent('token', { token: delta });
      }
    }

    // Step 10: Save messages to database
    const metadata = buildMessageMetadata(chunks, args.filters, {
      topK: args.topK,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
    });

    await addMessage(session_id, 'user', args.query, metadata);
    await addMessage(session_id, 'assistant', fullReply);

    // Step 11: Send completion event
    sendEvent('done', {
      metadata: {
        agent: agentConfig.id,
        model: CHAT_MODEL,
        chunks_retrieved: chunks.length,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
        messages_in_context: recentHistory.length,
      },
    });

    res.end();

  } catch (error) {
    console.error('Streaming chat error:', error);

    // Send error event
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({
      error: 'stream_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })}\n\n`);

    res.end();
  }
});

export default router;
```

---

### 2. Register Streaming Route

**File**: `apps/agents/src/index.ts`

```typescript
// ... existing imports
import agentChatStream from './routes/agent-chat-stream'; // NEW

// ... existing setup

app.use(agentChat); // Existing non-streaming endpoint
app.use(agentChatStream); // NEW streaming endpoint

// ... rest of file
```

---

## 🎨 Frontend Implementation

### 1. Update Agent Service Client

**File**: `apps/coursehub/services/agentService.ts`

Add new streaming function:

```typescript
/**
 * POST /agents/:agent/chat/stream
 * Send message to agent and receive streaming response
 * Returns an async generator that yields tokens
 */
export async function* sendChatMessageStream(
  agentId: AgentId,
  params: {
    query: string;
    session_id?: string;
    user_id?: string;
    topK?: number;
    temperature?: number;
    maxTokens?: number;
  }
): AsyncGenerator<StreamEvent> {
  const url = `${process.env.NEXT_PUBLIC_AGENT_SERVICE_URL}/agents/${agentId}/chat/stream`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new AgentServiceError(
      'Stream request failed',
      response.status
    );
  }

  if (!response.body) {
    throw new AgentServiceError('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          const event = line.substring(7).trim();
          continue; // Event type stored for next data line
        }

        if (line.startsWith('data: ')) {
          const data = line.substring(6);

          try {
            const parsed = JSON.parse(data);
            yield parsed as StreamEvent;
          } catch (e) {
            console.error('Failed to parse SSE data:', data);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Stream event types
 */
export type StreamEvent =
  | { type: 'session'; session_id: string }
  | { type: 'sources'; sources: SourceReference[]; chunks_retrieved: number }
  | { type: 'token'; token: string }
  | { type: 'done'; metadata: StreamMetadata }
  | { type: 'error'; error: string; message: string };

interface StreamMetadata {
  agent: AgentId;
  model: string;
  chunks_retrieved: number;
  temperature: number;
  max_tokens: number;
  messages_in_context: number;
}
```

---

### 2. SSE Parser Utility

**File**: `apps/coursehub/utils/sseParser.ts` (NEW)

```typescript
/**
 * Parse Server-Sent Events from a ReadableStream
 */
export async function* parseSSE(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SSEMessage> {
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.substring(7).trim();
        } else if (line.startsWith('data: ')) {
          const data = line.substring(6);

          try {
            const parsed = JSON.parse(data);
            yield {
              event: currentEvent || 'message',
              data: parsed,
            };
            currentEvent = '';
          } catch (e) {
            console.error('SSE parse error:', e);
          }
        } else if (line === '') {
          // Empty line indicates end of event
          currentEvent = '';
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export interface SSEMessage {
  event: string;
  data: any;
}
```

---

### 3. Update Chat Panel Component

**File**: `apps/coursehub/components/agents/AgentChatPanel.tsx`

```typescript
import { useState, useRef, useEffect } from 'react';
import { sendChatMessageStream, StreamEvent } from '../../services/agentService';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import SourcePanel from './SourcePanel';
import type { AgentId, ChatMessage, SourceReference } from '../../types/agent';

interface AgentChatPanelProps {
  agentId: AgentId;
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
}

export default function AgentChatPanel({
  agentId,
  sessionId,
  onSessionCreated,
}: AgentChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<SourceReference[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reference to current streaming message
  const streamingMessageRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    if (sessionId) {
      loadHistory(sessionId);
    }
  }, [sessionId, agentId]);

  const loadHistory = async (sid: string) => {
    try {
      const history = await getSessionHistory(agentId, sid);
      setMessages(history.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        sources: msg.metadata?.sources,
      })));
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsStreaming(true);

    // Create placeholder for streaming assistant message
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      sources: [],
    };

    setMessages(prev => [...prev, assistantMessage]);
    streamingMessageRef.current = '';

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const stream = sendChatMessageStream(agentId, {
        query: userMessage.content,
        session_id: sessionId || undefined,
      });

      for await (const event of stream) {
        // Check if aborted
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        if (event.type === 'session') {
          // First event: session_id
          if (!sessionId) {
            onSessionCreated(event.session_id);
          }
        } else if (event.type === 'sources') {
          // Second event: sources
          setSources(event.sources);

          // Update assistant message with sources
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, sources: event.sources }
              : msg
          ));
        } else if (event.type === 'token') {
          // Stream tokens: update message content incrementally
          streamingMessageRef.current += event.token;

          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamingMessageRef.current }
              : msg
          ));
        } else if (event.type === 'done') {
          // Stream complete
          console.log('Stream complete:', event.metadata);
        } else if (event.type === 'error') {
          // Stream error
          setError(event.message);
        }
      }
    } catch (err) {
      console.error('Streaming error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');

      // Remove failed assistant message
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
      streamingMessageRef.current = '';
      abortControllerRef.current = null;
    }
  };

  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list - 84% */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessageList
          messages={messages}
          isLoading={isStreaming}
          error={error}
        />
      </div>

      {/* Source panel - collapsible */}
      {showSources && sources.length > 0 && (
        <SourcePanel sources={sources} visible={showSources} />
      )}

      {/* Input - 8% */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
        onCancel={handleCancelStream}
        isLoading={isStreaming}
        showSources={showSources}
        onToggleSources={() => setShowSources(!showSources)}
      />
    </div>
  );
}
```

---

### 4. Update Chat Input with Cancel

**File**: `apps/coursehub/components/agents/ChatInput.tsx`

Add cancel button when streaming:

```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void; // NEW
  isLoading: boolean;
  showSources: boolean;
  onToggleSources: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  showSources,
  onToggleSources,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 bg-primary_blue p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question..."
        className="w-full bg-[#031b4352] text-white rounded-lg px-4 py-2
                   resize-none focus:outline-none focus:ring-2
                   focus:ring-primary_green min-h-[60px] max-h-[200px]"
        disabled={isLoading}
      />

      <div className="flex justify-between items-center mt-2">
        <label className="flex items-center text-white/80 cursor-pointer">
          <input
            type="checkbox"
            checked={showSources}
            onChange={onToggleSources}
            className="mr-2"
          />
          Show Sources
        </label>

        <div className="flex space-x-2">
          {isLoading && onCancel && (
            <button
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded-md
                         hover:bg-red-600 transition"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="bg-primary_green text-white px-4 py-2 rounded-md
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-green-600 transition"
          >
            {isLoading ? 'Streaming...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 5. Streaming Message Component

**File**: `apps/coursehub/components/agents/StreamingMessage.tsx` (NEW)

Optional: Add cursor effect to streaming message:

```typescript
interface StreamingMessageProps {
  content: string;
  isActive: boolean; // Whether currently streaming
}

export default function StreamingMessage({
  content,
  isActive,
}: StreamingMessageProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-[#031b4352] text-white rounded-lg px-4 py-3 max-w-[80%] shadow-lg">
        <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
          {content}
        </ReactMarkdown>

        {isActive && (
          <span className="inline-block w-2 h-4 bg-primary_green ml-1 animate-pulse" />
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 User Experience

### Streaming Flow

```
User clicks "Send"
    ↓
User message appears immediately
    ↓
Empty assistant message appears with cursor
    ↓
[100-200ms] Session ID received (invisible to user)
    ↓
[200-500ms] Sources appear below (if enabled)
    ↓
[500ms+] Tokens stream in character-by-character
    ↓
Cursor animates at end of growing text
    ↓
Stream completes, cursor disappears
    ↓
Message finalized in database
```

---

### Visual States

#### 1. Before Sending
```
┌─────────────────────────────────────┐
│ Type your message...                │
│                                     │
└─────────────────────────────────────┘
[✓] Show Sources            [Send →]
```

#### 2. Streaming Active
```
┌──────────────────────────────────────┐
│ Assistant: Closures in JavaScript   │
│ are like portals with kept keys...▊ │
└──────────────────────────────────────┘

┌─ Sources (3) ────────────────────────┐
│ [1] course_content • JS Closures     │
│ [2] meta_canon • Portal Metaphor     │
└──────────────────────────────────────┘

[✓] Show Sources  [Cancel] [Streaming...]
```

#### 3. Stream Complete
```
┌──────────────────────────────────────┐
│ Assistant: Closures in JavaScript   │
│ are like portals with kept keys...  │
└──────────────────────────────────────┘

[✓] Show Sources            [Send →]
```

---

## 🔒 Error Handling

### Connection Errors

```typescript
try {
  for await (const event of stream) {
    // ...
  }
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled
    setError('Stream cancelled by user');
  } else if (error.message.includes('Failed to fetch')) {
    // Network error
    setError('Connection lost. Please check your network.');
  } else {
    // Generic error
    setError('Failed to receive response. Please try again.');
  }

  // Remove incomplete message
  setMessages(prev => prev.filter(msg => msg.id !== streamingMessageId));
}
```

### Retry Logic

```typescript
const handleRetry = async () => {
  // Clear error
  setError(null);

  // Retry with last user message
  const lastUserMessage = messages.findLast(m => m.role === 'user');
  if (lastUserMessage) {
    setInputValue(lastUserMessage.content);
    // User clicks send again
  }
};
```

---

## 🧪 Testing

### Manual Testing Checklist

**Streaming Functionality**:
- [ ] Tokens appear incrementally (not all at once)
- [ ] Cursor animation shows during streaming
- [ ] Cancel button stops stream mid-response
- [ ] Sources appear before first token
- [ ] Session ID persists correctly
- [ ] Error messages show if stream fails
- [ ] Network interruption handled gracefully
- [ ] Works on slow connections (throttle to 3G)

**Edge Cases**:
- [ ] Empty response (no tokens)
- [ ] Very long response (1000+ tokens)
- [ ] Rapid consecutive messages
- [ ] Stream cancellation
- [ ] Network disconnect mid-stream
- [ ] Server error mid-stream

---

## 📊 Performance

### Expected Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **Time to First Token** | <500ms | Perceived start time |
| **Token Throughput** | 20-50 tokens/sec | OpenAI typical rate |
| **Total Response Time** | 3-10s | For 200-500 tokens |
| **Memory Usage** | <10MB increase | During streaming |
| **CPU Usage** | <5% | Text rendering overhead |

### Optimizations

1. **Batch Token Updates**: Group tokens every 50ms to reduce re-renders
```typescript
let tokenBuffer = '';
let flushTimeout: NodeJS.Timeout;

for await (const event of stream) {
  if (event.type === 'token') {
    tokenBuffer += event.token;

    clearTimeout(flushTimeout);
    flushTimeout = setTimeout(() => {
      setMessages(prev => /* update with tokenBuffer */);
      tokenBuffer = '';
    }, 50);
  }
}
```

2. **Virtual Scrolling**: For very long messages (1000+ tokens)
3. **Markdown Lazy Parsing**: Parse markdown on stream complete, not per token

---

## 🔄 Fallback Strategy

### Non-Streaming Fallback

If SSE fails or is not supported:

```typescript
async function sendMessageWithFallback(agentId: AgentId, query: string) {
  // Try streaming first
  try {
    return await sendChatMessageStream(agentId, { query });
  } catch (error) {
    console.warn('Streaming failed, falling back to non-streaming:', error);

    // Fallback to original non-streaming endpoint
    return await sendChatMessage(agentId, { query });
  }
}
```

---

## 🚀 Implementation Phases

### Phase 1: Backend Streaming (Week 1)
1. ✅ Create `agent-chat-stream.ts` route
2. ✅ Add SSE headers and event sending
3. ✅ Enable OpenAI streaming
4. ✅ Test with curl/Postman
5. ✅ Register route in `index.ts`

### Phase 2: Frontend SSE Parser (Week 2)
1. ✅ Create `sseParser.ts` utility
2. ✅ Add `sendChatMessageStream` to agent service
3. ✅ Test SSE parsing in isolation
4. ✅ Add TypeScript types for stream events

### Phase 3: UI Integration (Week 3)
1. ✅ Update `AgentChatPanel` with streaming logic
2. ✅ Add streaming message component
3. ✅ Add cancel functionality
4. ✅ Add cursor animation
5. ✅ Test end-to-end streaming flow

### Phase 4: Polish & Testing (Week 4)
1. ✅ Add error handling and retries
2. ✅ Add token batching optimization
3. ✅ Add fallback to non-streaming
4. ✅ Manual testing checklist
5. ✅ Performance profiling

---

## 📝 Migration Notes

### Updating Existing Spec

The main [frontend_agent_chat.md](./frontend_agent_chat.md) spec should be updated with:

1. **API Integration Section**: Add `sendChatMessageStream()` alongside `sendChatMessage()`
2. **Chat Panel Component**: Include streaming state management
3. **Technology Stack**: Add "Server-Sent Events" for real-time streaming
4. **Testing Section**: Add streaming-specific test cases

### Backward Compatibility

Both endpoints should coexist:
- **Non-streaming**: `POST /agents/:agent/chat` (existing)
- **Streaming**: `POST /agents/:agent/chat/stream` (new)

Frontend can choose based on preference or feature flags.

---

## 🔮 Future Enhancements

1. **WebSocket Alternative**: For bidirectional streaming (typing indicators)
2. **Partial Markdown Rendering**: Render markdown as it streams (complex)
3. **Token Animation**: Smooth fade-in effect for each token
4. **Voice Synthesis**: Read response aloud as it streams
5. **Multi-agent Streaming**: Parallel responses from multiple agents

---

## 📚 References

- [OpenAI Streaming Docs](https://platform.openai.com/docs/api-reference/streaming)
- [MDN Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Fetch API Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

---

**End of Streaming Addendum**

*This document provides complete streaming implementation for the multi-agent chat interface. Follow the implementation phases for systematic rollout.*
