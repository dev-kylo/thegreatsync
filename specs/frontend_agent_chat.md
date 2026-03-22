# 🤖 SPEC: Multi-Agent Chat Frontend Interface

**Version:** 1.1 (with Streaming)
**Date:** November 2025
**Status:** DRAFT - Ready for Implementation

⚠️ **STREAMING ENABLED**: Backend now supports Server-Sent Events (SSE) for real-time token streaming

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technical Requirements](#technical-requirements)
4. [Component Structure](#component-structure)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Routing & Navigation](#routing--navigation)
8. [Menu System Design](#menu-system-design)
9. [Chat Interface Design](#chat-interface-design)
10. [Source Display System](#source-display-system)
11. [Implementation Strategy](#implementation-strategy)
12. [File Structure](#file-structure)
13. [Testing Considerations](#testing-considerations)
14. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

### Purpose

Create a frontend interface in the existing CourseHub Next.js application (`apps/coursehub`) that allows users to interact with the five AI agents defined in the multi-agent backend service (`apps/agents`).

### Key Requirements

1. **New Route**: `/agents` page with full chat interface
2. **Agent Selection**: Side menu with 5 agent options (similar to course menu pattern)
3. **Chat Interface**: Main panel with message history, input box, and source toggle
4. **Streaming Support**: Real-time token-by-token responses via Server-Sent Events (SSE)
5. **Zero Regression**: Completely isolated from existing course pages—no risk to current functionality
6. **Style Consistency**: Match existing CourseHub design (Tailwind CSS, Headless UI components)

### Five Agents

| Agent ID | Name | Purpose |
|----------|------|---------|
| `product_owner` | Product Owner Agent | Improves course materials based on feedback |
| `model_builder` | Model Builder Agent | Creates new metaphor models |
| `teacher_qa` | Teacher QA Agent | Answers student questions using metaphors |
| `realm_builder` | Realm Builder Agent | Guides custom metaphor world creation |
| `course_instructor` | Course Instructor Agent | Teaches structured lessons |

---

## 🏗️ Architecture

### Design Principles

1. **Isolation**: Create new components that don't interfere with existing course infrastructure
2. **Reusability**: Build generic menu and layout components that could be used elsewhere
3. **Type Safety**: Full TypeScript coverage with proper type definitions
4. **Progressive Enhancement**: Basic functionality first, advanced features later
5. **Authentication**: Leverage existing NextAuth.js session management

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (Pages Router) | Existing app framework |
| **Styling** | Tailwind CSS | Match existing design system |
| **UI Components** | Headless UI | Accessible, unstyled components |
| **State** | React Context API + useState | Session and UI state management |
| **API Client** | Fetch API (streaming) | Server-Sent Events for real-time |
| **Auth** | NextAuth.js | Existing authentication |
| **Chat UI** | Custom (not assistant-ui) | Full control over design/behavior |
| **Streaming** | Server-Sent Events (SSE) | Real-time token streaming |

### Decision: Custom Chat UI vs assistant-ui

**Choice**: Build custom chat components

**Reasoning**:
- **Control**: Full control over styling to match existing CourseHub aesthetic
- **Simplicity**: The chat pattern is straightforward (messages array + input + sources)
- **Integration**: Easier to integrate with existing Tailwind/Headless UI patterns
- **Learning Curve**: Team already familiar with CourseHub patterns
- **Flexibility**: Can add Great Sync-specific features (metaphor highlighting, source cards)

**Trade-off**: More code to write initially, but better long-term maintainability and design consistency.

---

## 🛠️ Technical Requirements

### Environment Variables

Add to `apps/coursehub/.env`:

```bash
# Agent Service API (already running on port 8787)
NEXT_PUBLIC_AGENT_SERVICE_URL=http://localhost:8787
```

### Dependencies

No new dependencies required. Existing packages provide all needed functionality:
- `axios` - API client
- `@headlessui/react` - UI components
- `tailwindcss` - Styling
- `react-markdown` - Message rendering (already in package.json)
- `next-auth` - Authentication

### Browser Support

Follow existing CourseHub browser support:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

---

## 🧩 Component Structure

### Component Hierarchy

```
/agents (page)
├── AgentLayout
│   ├── AgentNavbar
│   │   ├── Burger (existing)
│   │   ├── TitleStrip (existing)
│   │   └── ProfileDropdown (existing)
│   ├── AgentSidebar (SlideOver)
│   │   ├── ProfileDropdown (mobile)
│   │   └── GenericMenu
│   │       └── GenericMenuItem (recursive)
│   └── AgentChatPanel
│       ├── AgentHeader
│       ├── ChatMessageList
│       │   ├── ChatMessage (user)
│       │   ├── ChatMessage (assistant)
│       │   └── LoadingMessage
│       ├── SourcePanel (collapsible)
│       │   └── SourceCard
│       └── ChatInput
│           ├── textarea
│           ├── SourceToggle
│           └── SendButton
```

### Component Details

#### 1. `/agents` Page Component

**File**: `apps/coursehub/pages/agents.tsx`

**Responsibilities**:
- Root page for `/agents` route
- Fetches initial agent list
- Handles authentication check
- Renders AgentLayout
- Manages active agent selection
- Persists chat sessions

**Props**: None (page component)

**State**:
```typescript
{
  activeAgentId: AgentId | null;
  sessionId: string | null;
  sessions: Record<AgentId, string>; // Map agent to session_id
}
```

**Key Functions**:
- `getServerSideProps()` - Server-side auth check
- `handleAgentSelect(agentId)` - Switch active agent
- `handleNewSession()` - Start fresh conversation

---

#### 2. AgentLayout Component

**File**: `apps/coursehub/components/agents/AgentLayout.tsx`

**Responsibilities**:
- Container for entire agents interface
- Provides consistent layout structure
- Matches course page grid layout
- Manages sidebar open/close state

**Props**:
```typescript
interface AgentLayoutProps {
  activeAgentId: AgentId | null;
  sessionId: string | null;
  onAgentSelect: (agentId: AgentId) => void;
  children: React.ReactNode;
}
```

**Layout Structure**:
```jsx
<div className="grid grid-cols-1 grid-rows-[10vh,83vh,7vh]">
  <AgentNavbar />
  {children} {/* Chat panel */}
  <div /> {/* Footer space */}
</div>
```

---

#### 3. AgentNavbar Component

**File**: `apps/coursehub/components/agents/AgentNavbar.tsx`

**Responsibilities**:
- Top navigation bar (10vh height)
- Burger menu to open sidebar
- Agent name display
- Profile dropdown

**Props**:
```typescript
interface AgentNavbarProps {
  agentName: string | null;
  onOpenMenu: () => void;
}
```

**Styling**: Clone `components/ui/Navbar.tsx` styling but remove course-specific logic

**Layout**:
```
[Burger Icon] [Agent Name] [Profile Icon]
```

---

#### 4. GenericMenu Component

**File**: `apps/coursehub/components/ui/GenericMenu.tsx`

**Responsibilities**:
- Reusable menu component for hierarchical navigation
- Supports 1, 2, or 3 levels of nesting
- Click handlers for leaf nodes
- Disclosure pattern for parent nodes
- Matches styling of existing `Menu.tsx`

**Props**:
```typescript
interface GenericMenuProps<T = any> {
  items: GenericMenuItem<T>[];
  onItemClick: (item: GenericMenuItem<T>) => void;
  activeItemId?: string | number;
  onClose?: () => void;
}

interface GenericMenuItem<T = any> {
  id: string | number;
  name: string;
  description?: string;
  level: 1 | 2 | 3;
  icon?: React.ReactNode;
  data?: T; // Custom data payload
  children?: GenericMenuItem<T>[];
  isDisabled?: boolean;
}
```

**Key Features**:
- **Recursive rendering** for children
- **Active state** highlighting
- **Keyboard navigation** support
- **Icon support** (optional)
- **Disabled state** (for future features)

**Styling**: Exact copy of `Menu.tsx` styling but generic:
- Same padding levels (`pl-4`, `pl-8`, `pl-20`)
- Same disclosure animations
- Same hover/active states
- Remove course-specific icons (progress, lock, etc.)

**Example Usage**:
```tsx
const agents: GenericMenuItem[] = [
  { id: 'product_owner', name: 'Product Owner', level: 1 },
  { id: 'model_builder', name: 'Model Builder', level: 1 },
  // ... etc
];

<GenericMenu
  items={agents}
  activeItemId={activeAgentId}
  onItemClick={(item) => handleAgentSelect(item.id)}
  onClose={closeMenu}
/>
```

---

#### 5. AgentSidebar Component

**File**: `apps/coursehub/components/agents/AgentSidebar.tsx`

**Responsibilities**:
- Slide-over menu for agent selection
- Wraps GenericMenu with agent-specific data
- Provides profile dropdown (mobile)
- Handles menu close on selection

**Props**:
```typescript
interface AgentSidebarProps {
  open: boolean;
  onClose: () => void;
  activeAgentId: AgentId | null;
  onAgentSelect: (agentId: AgentId) => void;
}
```

**Data Structure**:
```typescript
const AGENT_MENU_ITEMS: GenericMenuItem<AgentData>[] = [
  {
    id: 'product_owner',
    name: 'Product Owner Agent',
    description: 'Improves existing course materials',
    level: 1,
    data: { session_type: 'improvement' }
  },
  // ... all 5 agents
];
```

**Component Structure**:
```tsx
<SlideOver open={open} setOpen={onClose} title="AI Agents">
  <ProfileDropdown mobile />
  <GenericMenu
    items={AGENT_MENU_ITEMS}
    activeItemId={activeAgentId}
    onItemClick={(item) => {
      onAgentSelect(item.id as AgentId);
      onClose();
    }}
  />
</SlideOver>
```

---

#### 6. AgentChatPanel Component

**File**: `apps/coursehub/components/agents/AgentChatPanel.tsx`

**Responsibilities**:
- Main chat interface (83vh height)
- Message list with scroll
- Input box at bottom
- Source panel toggle
- Loading and error states

**Props**:
```typescript
interface AgentChatPanelProps {
  agentId: AgentId;
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
}
```

**State**:
```typescript
{
  messages: ChatMessage[];
  sources: SourceReference[];
  showSources: boolean;
  inputValue: string;
  isLoading: boolean;
  error: string | null;
}
```

**Layout**:
```
┌──────────────────────────────┐
│ Agent Header                 │ 8%
├──────────────────────────────┤
│                              │
│ Message List (scroll)        │ 84%
│                              │
├──────────────────────────────┤
│ Input Box + Source Toggle    │ 8%
└──────────────────────────────┘
```

**Key Functions**:
- `loadHistory()` - Fetch existing session messages
- `sendMessage(content)` - POST to `/agents/:agent/chat`
- `toggleSources()` - Show/hide source panel
- `handleError(err)` - Error display and recovery

---

#### 7. ChatMessageList Component

**File**: `apps/coursehub/components/agents/ChatMessageList.tsx`

**Responsibilities**:
- Scrollable message container
- Renders ChatMessage components
- Auto-scroll to bottom on new messages
- Empty state for new sessions

**Props**:
```typescript
interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
```

**Auto-scroll Logic**:
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

**Empty State**:
```tsx
{messages.length === 0 && (
  <div className="flex items-center justify-center h-full">
    <p className="text-white/60">
      Start a conversation with {agentName}
    </p>
  </div>
)}
```

---

#### 8. ChatMessage Component

**File**: `apps/coursehub/components/agents/ChatMessage.tsx`

**Responsibilities**:
- Individual message bubble
- Different styling for user vs assistant
- Markdown rendering for assistant messages
- Timestamp display

**Props**:
```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

**Styling**:
```tsx
// User message - right-aligned, green
<div className="flex justify-end">
  <div className="bg-primary_green text-white rounded-lg px-4 py-2 max-w-[80%]">
    {content}
  </div>
</div>

// Assistant message - left-aligned, blue/gray
<div className="flex justify-start">
  <div className="bg-[#031b4352] text-white rounded-lg px-4 py-2 max-w-[80%]">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
</div>
```

**Markdown Support**:
- Use `react-markdown` for assistant messages (already in dependencies)
- Support code blocks with syntax highlighting (prismjs already in dependencies)
- Support lists, headers, bold, italic

---

#### 9. LoadingMessage Component

**File**: `apps/coursehub/components/agents/LoadingMessage.tsx`

**Responsibilities**:
- Visual feedback during API call
- Typing indicator animation
- Matches assistant message styling

**Props**: None

**Implementation**:
```tsx
<div className="flex justify-start">
  <div className="bg-[#031b4352] text-white rounded-lg px-4 py-2">
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
    </div>
  </div>
</div>
```

---

#### 10. ChatInput Component

**File**: `apps/coursehub/components/agents/ChatInput.tsx`

**Responsibilities**:
- Multi-line textarea input
- Send button
- Source toggle checkbox
- Keyboard shortcuts (Enter to send)
- Character limit display (optional)

**Props**:
```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  showSources: boolean;
  onToggleSources: () => void;
}
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│ [Textarea - grows with content]             │
├─────────────────────────────────────────────┤
│ [x] Show Sources          [Send Button →]   │
└─────────────────────────────────────────────┘
```

**Keyboard Handling**:
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  // Enter without shift = send
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSubmit();
  }
  // Shift+Enter = new line (default behavior)
};
```

**Styling**:
```tsx
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
    <button
      onClick={onSubmit}
      disabled={isLoading || !value.trim()}
      className="bg-primary_green text-white px-4 py-2 rounded-md
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-green-600 transition"
    >
      {isLoading ? <Spinner /> : 'Send'}
    </button>
  </div>
</div>
```

---

#### 11. SourcePanel Component

**File**: `apps/coursehub/components/agents/SourcePanel.tsx`

**Responsibilities**:
- Collapsible panel showing RAG sources
- Renders after assistant response
- Lists source cards with metadata
- Smooth expand/collapse animation

**Props**:
```typescript
interface SourcePanelProps {
  sources: SourceReference[];
  visible: boolean;
}
```

**Layout**:
```tsx
{visible && sources.length > 0 && (
  <div className="mt-4 border-t border-white/10 pt-4 animate-fadeIn">
    <h4 className="text-white/80 font-medium mb-2">
      Sources ({sources.length})
    </h4>
    <div className="space-y-2">
      {sources.map((source, idx) => (
        <SourceCard key={source.chunk_uid} source={source} index={idx} />
      ))}
    </div>
  </div>
)}
```

**Styling Considerations**:
- Max height with scroll if many sources
- Smooth transition on toggle
- Subtle background to differentiate from messages

---

#### 12. SourceCard Component

**File**: `apps/coursehub/components/agents/SourceCard.tsx`

**Responsibilities**:
- Display individual source metadata
- Show relevance score
- Display collection tag
- Show page/chapter hierarchy
- Badge for images/code

**Props**:
```typescript
interface SourceCardProps {
  source: SourceReference;
  index: number;
}

interface SourceReference {
  chunk_uid: string;
  collection: string;
  page_title?: string;
  course_title?: string;
  chapter_title?: string;
  subchapter_title?: string;
  score: number;
  has_image: boolean;
  code_languages: string[];
}
```

**Layout**:
```tsx
<div className="bg-[#031b4352] rounded-lg p-3 text-sm">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-primary_green font-medium">
          [Source {index + 1}]
        </span>
        <span className="text-white/60 text-xs">
          {collection}
        </span>
        <span className="text-white/40 text-xs">
          Score: {(score * 100).toFixed(0)}%
        </span>
      </div>

      {/* Breadcrumb path */}
      {course_title && (
        <div className="text-white/80 text-xs">
          {course_title}
          {chapter_title && ` › ${chapter_title}`}
          {subchapter_title && ` › ${subchapter_title}`}
          {page_title && ` › ${page_title}`}
        </div>
      )}

      {/* Badges */}
      <div className="flex space-x-2 mt-2">
        {has_image && (
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1
                         rounded text-xs">
            📷 Image
          </span>
        )}
        {code_languages.map(lang => (
          <span key={lang} className="bg-purple-500/20 text-purple-300
                                     px-2 py-1 rounded text-xs">
            {lang}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>
```

---

## 🔄 State Management

### Context Architecture

#### 1. AgentChatContext

**File**: `apps/coursehub/context/agentChat.tsx`

**Purpose**: Manage chat state across agent components

**State Shape**:
```typescript
interface AgentChatContextValue {
  // Active agent
  activeAgentId: AgentId | null;
  setActiveAgent: (agentId: AgentId) => void;

  // Sessions (one per agent)
  sessions: Record<AgentId, string>;
  createSession: (agentId: AgentId) => Promise<string>;
  clearSession: (agentId: AgentId) => void;

  // Messages
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  loadHistory: (sessionId: string) => Promise<void>;

  // UI State
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
```

**Provider Location**: Wrap `/agents` page only (not global)

**Persistence**: Store sessions in localStorage:
```typescript
// Key: 'agentSessions'
// Value: { product_owner: 'session-uuid-1', teacher_qa: 'session-uuid-2' }
```

**Why Context?**:
- Multiple components need shared chat state
- Avoids prop drilling
- Easy to add features later (typing indicators, etc.)
- Follows existing CourseHub pattern (NavContext)

---

#### 2. Local Component State

Components manage their own UI-only state:

**AgentNavbar**:
```typescript
const [menuOpen, setMenuOpen] = useState(false);
```

**ChatInput**:
```typescript
const [inputValue, setInputValue] = useState('');
const [showSources, setShowSources] = useState(false);
```

**ChatMessageList**:
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
```

---

### State Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ /agents Page                                    │
│ - activeAgentId                                 │
│ - sessions: { [agentId]: sessionId }            │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │ AgentChatContext        │
        │ - messages[]            │
        │ - isLoading             │
        │ - error                 │
        └─────────────┬───────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ AgentSidebar     │    │ AgentChatPanel   │
│ - menuOpen       │    │ - showSources    │
└──────────────────┘    └──────────┬───────┘
                                   │
                   ┌───────────────┴───────────────┐
                   │                               │
                   ▼                               ▼
         ┌──────────────────┐          ┌──────────────────┐
         │ ChatMessageList  │          │ ChatInput        │
         │ - messagesEndRef │          │ - inputValue     │
         └──────────────────┘          └──────────────────┘
```

---

## 🌐 API Integration

### Agent Service Client

**File**: `apps/coursehub/services/agentService.ts`

**Purpose**: Encapsulate all API calls to agents service

**Base Configuration**:
```typescript
import axios from 'axios';

const agentClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || 'http://localhost:8787',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
agentClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // From NextAuth session
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
agentClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Agent service error:', error);
    return Promise.reject(error);
  }
);
```

---

### Streaming Endpoint (PRIMARY)

#### POST /agents/:agent/chat/stream

**Returns**: Server-Sent Events (SSE) stream

**Event Sequence**:
1. `session` - Session ID (first event)
2. `sources` - RAG sources (before tokens)
3. `token` - Individual tokens (multiple events)
4. `done` - Completion metadata
5. `error` - Error event (terminates stream)

**Example**:
```typescript
const response = await fetch(`/agents/${agentId}/chat/stream`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, session_id }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

// Parse SSE events
for await (const chunk of readStream(reader, decoder)) {
  // Handle: session, sources, token, done, error
}
```

### API Functions

#### 1. List Agents

```typescript
/**
 * GET /agents
 * Fetch all available agents
 */
export async function listAgents(): Promise<AgentInfo[]> {
  const response = await agentClient.get('/agents');
  return response.data.agents;
}

interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  session_type: SessionType;
}
```

---

#### 2. Send Chat Message (Streaming)

```typescript
/**
 * POST /agents/:agent/chat/stream
 * Send message and receive streaming response
 */
export async function* sendChatMessageStream(
  agentId: AgentId,
  params: {
    query: string;
    session_id?: string;
  }
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${baseURL}/agents/${agentId}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.substring(6));
        yield data;
      }
    }
  }
}

type StreamEvent =
  | { type: 'session'; session_id: string }
  | { type: 'sources'; sources: SourceReference[] }
  | { type: 'token'; token: string }
  | { type: 'done'; metadata: any }
  | { type: 'error'; error: string; message: string };
```

#### 3. Send Chat Message (Non-Streaming, Fallback)

```typescript
/**
 * POST /agents/:agent/chat
 * Send message to agent and get complete response
 */
export async function sendChatMessage(
  agentId: AgentId,
  params: {
    query: string;
    session_id?: string;
    user_id?: string;
    topK?: number;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AgentChatResponse> {
  const response = await agentClient.post(`/agents/${agentId}/chat`, params);
  return response.data;
}

interface AgentChatResponse {
  ok: boolean;
  reply: string;
  session_id: string;
  sources: SourceReference[];
  metadata: {
    agent: AgentId;
    model: string;
    chunks_retrieved: number;
    temperature: number;
    max_tokens: number;
    messages_in_context: number;
  };
}
```

---

#### 4. Get Session History

```typescript
/**
 * GET /agents/:agent/session/:sessionId/history
 * Fetch conversation history for a session
 */
export async function getSessionHistory(
  agentId: AgentId,
  sessionId: string,
  limit: number = 50
): Promise<SessionMessage[]> {
  const response = await agentClient.get(
    `/agents/${agentId}/session/${sessionId}/history`,
    { params: { limit } }
  );
  return response.data.messages;
}

interface SessionMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}
```

---

#### 5. Get Session Details

```typescript
/**
 * GET /agents/:agent/session/:sessionId
 * Fetch session metadata
 */
export async function getSessionDetails(
  agentId: AgentId,
  sessionId: string
): Promise<AgentSession> {
  const response = await agentClient.get(
    `/agents/${agentId}/session/${sessionId}`
  );
  return response.data.session;
}

interface AgentSession {
  id: string;
  user_id?: string;
  agent: AgentId;
  session_type: SessionType;
  topic?: string;
  domain?: string;
  context: Record<string, any>;
  started_at: string;
  ended_at?: string;
}
```

---

### Streaming Error Handling

```typescript
// In streaming loop
for await (const event of stream) {
  if (event.type === 'error') {
    throw new AgentServiceError(event.message, 500, event.error);
  }
  // Handle other events
}

// Network errors
try {
  for await (const event of stream) { /* ... */ }
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled
  } else {
    // Network/parse error
  }
}
```

### Error Handling (Non-Streaming)

```typescript
export class AgentServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AgentServiceError';
  }
}

// In API functions:
try {
  const response = await agentClient.post('/agents/teacher_qa/chat', body);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Request failed';
    throw new AgentServiceError(message, status, error.response?.data?.error);
  }
  throw error;
}
```

---

## 🚏 Routing & Navigation

### Route Structure

```
/agents                        # Main agents page
```

**No sub-routes initially.** All functionality on single page with agent selection via sidebar.

**Future consideration**: `/agents/[agentId]` for direct agent links (shareable URLs)

---

### Page Component

**File**: `apps/coursehub/pages/agents.tsx`

```typescript
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AgentLayout from '../components/agents/AgentLayout';
import AgentChatPanel from '../components/agents/AgentChatPanel';
import { AgentId } from '../types/agent';
import { listAgents } from '../services/agentService';

export default function AgentsPage() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
  const [sessions, setSessions] = useState<Record<AgentId, string>>({});

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agentSessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('agentSessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleAgentSelect = (agentId: AgentId) => {
    setActiveAgentId(agentId);
  };

  const handleSessionCreated = (agentId: AgentId, sessionId: string) => {
    setSessions(prev => ({ ...prev, [agentId]: sessionId }));
  };

  return (
    <>
      <Head>
        <title>AI Agents - The Great Sync</title>
      </Head>

      <AgentLayout
        activeAgentId={activeAgentId}
        sessionId={activeAgentId ? sessions[activeAgentId] : null}
        onAgentSelect={handleAgentSelect}
      >
        {activeAgentId ? (
          <AgentChatPanel
            agentId={activeAgentId}
            sessionId={sessions[activeAgentId]}
            onSessionCreated={(sid) => handleSessionCreated(activeAgentId, sid)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 text-lg">
              Select an agent from the menu to start chatting
            </p>
          </div>
        )}
      </AgentLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Require authentication
  if (!session) {
    return {
      redirect: {
        destination: `/signin?redirect=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
```

---

### Navigation Integration

Add link to agents page in existing navigation (optional):

**File**: `apps/coursehub/components/ui/Navbar.tsx`

```tsx
// Add agents icon to navbar (optional)
<NavIcon title="Agents">
  <Link href="/agents">
    <ChatBubbleIcon className="h-6 w-6" />
  </Link>
</NavIcon>
```

---

## 🎨 Menu System Design

### Generic Menu Architecture

The core innovation is creating a **reusable hierarchical menu component** that abstracts away course-specific logic.

#### Comparison: Course Menu vs Generic Menu

| Feature | Course Menu | Generic Menu |
|---------|-------------|--------------|
| **Data Structure** | MenuItem (course-specific) | GenericMenuItem\<T\> (generic) |
| **Icons** | ProgressIcon, MenuIcon (pegs) | Optional icon prop |
| **Progress Tracking** | completed, progress % | N/A (passed via data) |
| **Locking** | isLocked property | isDisabled property |
| **Callbacks** | markPage, callback | onItemClick |
| **Levels** | 1-3 (Chapter, Subchapter, Page) | 1-3 (configurable) |
| **Type Safety** | Strapi course types | Generic with data payload |

---

### GenericMenu Implementation

**File**: `apps/coursehub/components/ui/GenericMenu.tsx`

```typescript
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface GenericMenuItem<T = any> {
  id: string | number;
  name: string;
  description?: string;
  level: 1 | 2 | 3;
  icon?: React.ReactNode;
  data?: T;
  children?: GenericMenuItem<T>[];
  isDisabled?: boolean;
}

interface GenericMenuProps<T = any> {
  items: GenericMenuItem<T>[];
  onItemClick: (item: GenericMenuItem<T>) => void;
  activeItemId?: string | number;
  onClose?: () => void;
}

function GenericMenuItemComponent<T>({
  item,
  onItemClick,
  activeItemId,
  onClose,
}: {
  item: GenericMenuItem<T>;
  onItemClick: (item: GenericMenuItem<T>) => void;
  activeItemId?: string | number;
  onClose?: () => void;
}) {
  const isActive = activeItemId === item.id;
  const hasChildren = item.children && item.children.length > 0;

  // Disabled item (non-clickable)
  if (item.isDisabled) {
    return (
      <div
        className={classNames(
          'py-3 bg-transparent text-gray-500 cursor-not-allowed',
          'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md',
          item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'
        )}
      >
        {item.icon && <div className="mr-4">{item.icon}</div>}
        <span className="flex-1">{item.name}</span>
      </div>
    );
  }

  // Parent item with children (Disclosure)
  if (hasChildren) {
    return (
      <Disclosure as="div" key={item.id} className="space-y-1" defaultOpen={isActive}>
        {({ open }) => (
          <div>
            <DisclosureButton
              className={classNames(
                isActive
                  ? 'py-3 bg-gray-100 text-black'
                  : 'py-3 bg-transparent text-white hover:bg-gray-50 hover:text-gray-900',
                'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'
              )}
            >
              {item.icon && <div className="mr-4">{item.icon}</div>}
              <span className="flex-1">{item.name}</span>
              <ChevronRightIcon
                className={classNames(
                  open ? 'text-white rotate-90' : 'text-gray-300',
                  'ml-3 mr-4 h-6 w-6 flex-shrink-0 transform transition-colors duration-150 ease-in-out'
                )}
              />
            </DisclosureButton>
            <DisclosurePanel className="space-y-1">
              {item.children!.map((child) => (
                <GenericMenuItemComponent
                  key={child.id}
                  item={child}
                  onItemClick={onItemClick}
                  activeItemId={activeItemId}
                  onClose={onClose}
                />
              ))}
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
    );
  }

  // Leaf item (clickable)
  return (
    <button
      type="button"
      onClick={() => {
        onItemClick(item);
        onClose?.();
      }}
      className={classNames(
        isActive ? 'bg-gray-50 text-black' : 'text-white hover:bg-gray-50 hover:text-gray-900',
        'group flex w-full items-center rounded-md py-3 pr-2 text-md font-medium',
        item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-12 sm:pl-20' : 'pl-4'
      )}
    >
      {item.icon && <div className="mr-4">{item.icon}</div>}
      {item.name}
    </button>
  );
}

export default function GenericMenu<T = any>({
  items,
  onItemClick,
  activeItemId,
  onClose,
}: GenericMenuProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <GenericMenuItemComponent
          key={item.id}
          item={item}
          onItemClick={onItemClick}
          activeItemId={activeItemId}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
```

---

### Agent Menu Data

**File**: `apps/coursehub/constants/agents.ts`

```typescript
import { GenericMenuItem } from '../components/ui/GenericMenu';

export const AGENT_MENU_ITEMS: GenericMenuItem[] = [
  {
    id: 'product_owner',
    name: 'Product Owner',
    description: 'Improves existing course materials based on feedback',
    level: 1,
  },
  {
    id: 'model_builder',
    name: 'Model Builder',
    description: 'Creates new metaphor models consistent with Canon',
    level: 1,
  },
  {
    id: 'teacher_qa',
    name: 'Teacher QA',
    description: 'Answers student questions using Great Sync metaphors',
    level: 1,
  },
  {
    id: 'realm_builder',
    name: 'Realm Builder',
    description: 'Guides creation of custom metaphor worlds',
    level: 1,
  },
  {
    id: 'course_instructor',
    name: 'Course Instructor',
    description: 'Teaches structured lessons from canon courses',
    level: 1,
  },
];
```

---

### SlideOver Title Customization

**Update**: `apps/coursehub/components/ui/SlideOver.tsx`

Add `title` prop to make reusable:

```typescript
type SlideOverProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string; // NEW
};

function SlideOver({ children, open, setOpen, title = 'Course Outline' }: SlideOverProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        {/* ... */}
        <DialogTitle className="text-lg font-medium bg-green-400 text-primary_blue px-[2rem] py-[0.1rem]">
          {title}
        </DialogTitle>
        {/* ... */}
      </Dialog>
    </Transition>
  );
}
```

Usage:
```tsx
<SlideOver open={menuOpen} setOpen={setMenuOpen} title="AI Agents">
  {/* content */}
</SlideOver>
```

---

## 💬 Chat Interface Design

### Visual Layout

```
┌────────────────────────────────────────────────────┐
│  [☰] Teacher QA Agent               [@]            │ ← Navbar (10vh)
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │ User: How do closures work in JS?       │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │ Assistant: Great question! In The Great │     │
│  │ Sync, closures are like "portals with   │     │
│  │ kept keys." When a function...           │     │
│  └──────────────────────────────────────────┘     │ ← Chat Area (75vh)
│                                                    │
│  ┌─ Sources (3) ────────────────────────────┐     │
│  │ [1] course_content • JS Foundations      │     │
│  │     Score: 92% | 📷 Image | js           │     │
│  │ [2] meta_canon • Portal Metaphor         │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
├────────────────────────────────────────────────────┤
│  Type your message...                              │
│  ┌───────────────────────────────────────────┐    │
│  │                                           │    │ ← Input Area (8vh)
│  └───────────────────────────────────────────┘    │
│  [✓] Show Sources                    [Send →]     │
└────────────────────────────────────────────────────┘
```

---

### Responsive Behavior

#### Desktop (≥768px)
- Full layout as shown above
- Side menu as slide-over (same as course menu)
- Chat takes full remaining width
- Sources inline below messages

#### Mobile (<768px)
- Same layout, scrollable
- Navbar collapses icons
- Chat messages full width
- Input sticky at bottom

---

### Message Rendering

#### User Messages
```tsx
<div className="flex justify-end mb-4">
  <div className="bg-primary_green text-white rounded-lg px-4 py-3 max-w-[80%] shadow-lg">
    <p className="text-sm">{content}</p>
    <span className="text-xs text-white/60 mt-1 block">
      {formatTime(timestamp)}
    </span>
  </div>
</div>
```

#### Assistant Messages
```tsx
<div className="flex justify-start mb-4">
  <div className="bg-[#031b4352] text-white rounded-lg px-4 py-3 max-w-[80%] shadow-lg">
    <ReactMarkdown
      className="prose prose-invert prose-sm max-w-none"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
    <span className="text-xs text-white/60 mt-1 block">
      {formatTime(timestamp)}
    </span>
  </div>
</div>
```

---

### Empty States

#### No Agent Selected
```tsx
<div className="flex flex-col items-center justify-center h-full">
  <div className="text-white/40 mb-4">
    <ChatBubbleLeftRightIcon className="h-24 w-24" />
  </div>
  <h3 className="text-white text-xl font-medium mb-2">
    Choose an AI Agent
  </h3>
  <p className="text-white/60 text-center max-w-md">
    Select an agent from the menu to start a conversation.
    Each agent specializes in different aspects of learning.
  </p>
</div>
```

#### New Session (No Messages)
```tsx
<div className="flex flex-col items-center justify-center h-full p-8">
  <h3 className="text-white text-lg font-medium mb-2">
    Start chatting with {agentName}
  </h3>
  <p className="text-white/60 text-center max-w-md">
    {agentDescription}
  </p>
  <div className="mt-8 space-y-2">
    <p className="text-white/80 text-sm">Example questions:</p>
    <ul className="text-white/60 text-sm space-y-1">
      <li>• {exampleQuestion1}</li>
      <li>• {exampleQuestion2}</li>
      <li>• {exampleQuestion3}</li>
    </ul>
  </div>
</div>
```

---

### Loading States

#### Sending Message
```tsx
<LoadingMessage />
```

#### Loading History
```tsx
<div className="flex items-center justify-center h-full">
  <Spinner />
  <span className="text-white/60 ml-2">Loading conversation...</span>
</div>
```

---

### Error States

#### API Error
```tsx
<div className="bg-red-500/20 border border-red-500 rounded-lg p-4 m-4">
  <div className="flex items-start">
    <ExclamationCircleIcon className="h-6 w-6 text-red-400 mr-2 flex-shrink-0" />
    <div>
      <h4 className="text-red-400 font-medium">Error sending message</h4>
      <p className="text-white/80 text-sm mt-1">{errorMessage}</p>
      <button
        onClick={retry}
        className="mt-2 text-primary_green underline text-sm"
      >
        Try again
      </button>
    </div>
  </div>
</div>
```

#### Network Error
```tsx
<Alert
  type="error"
  text="Unable to connect to agent service. Please check your connection."
/>
```

---

## 📚 Source Display System

### Source Panel Design

Sources appear **after** each assistant message when "Show Sources" is enabled.

#### Collapsed State
```tsx
// User has "Show Sources" unchecked
// Sources are hidden, but metadata is still received and stored
```

#### Expanded State
```tsx
<div className="mt-4 border-t border-white/10 pt-4">
  <button
    onClick={() => setExpanded(!expanded)}
    className="flex items-center justify-between w-full text-white/80
               hover:text-white transition mb-2"
  >
    <span className="text-sm font-medium">
      Sources ({sources.length})
    </span>
    <ChevronDownIcon
      className={classNames(
        'h-5 w-5 transition-transform',
        expanded ? 'rotate-180' : ''
      )}
    />
  </button>

  {expanded && (
    <div className="space-y-2">
      {sources.map((source, idx) => (
        <SourceCard key={source.chunk_uid} source={source} index={idx} />
      ))}
    </div>
  )}
</div>
```

---

### Source Card Variations

#### Course Content Source
```
┌────────────────────────────────────────┐
│ [Source 1] course_content  Score: 92%  │
│ JavaScript Functions › Closures        │
│ › Understanding Scope                  │
│                                        │
│ [📷 Image] [js]                        │
└────────────────────────────────────────┘
```

#### Meta Canon Source
```
┌────────────────────────────────────────┐
│ [Source 2] meta_canon  Score: 88%      │
│ Core Metaphors › Portal System         │
│                                        │
│ [📷 Image]                             │
└────────────────────────────────────────┘
```

#### User Session Source
```
┌────────────────────────────────────────┐
│ [Source 3] user_sessions  Score: 75%   │
│ Fantasy Realm › Closure Artifacts     │
│                                        │
│ [js] [python]                          │
└────────────────────────────────────────┘
```

---

### Source Metadata Display

```typescript
function formatSourceBreadcrumb(source: SourceReference): string {
  const parts = [
    source.course_title,
    source.chapter_title,
    source.subchapter_title,
    source.page_title,
  ].filter(Boolean);

  return parts.join(' › ');
}

function getCollectionColor(collection: string): string {
  const colors = {
    course_content: 'blue',
    meta_canon: 'purple',
    overviews: 'green',
    user_sessions: 'yellow',
    reflections: 'pink',
    reviews: 'orange',
    mnemonics: 'indigo',
  };
  return colors[collection] || 'gray';
}
```

---

### Source Linking (Future)

**Phase 2 Feature**: Make sources clickable to navigate to original content

```tsx
<button
  onClick={() => navigateToSource(source)}
  className="text-primary_green hover:underline text-xs"
>
  View in course →
</button>
```

Where `navigateToSource` maps chunk_uid to course page URL.

---

## 🎯 Implementation Strategy

### Phase 1: Foundation (Week 1)

**Goal**: Get basic chat interface working for one agent

**Tasks**:
1. ✅ Create agent types (`types/agent.ts`)
2. ✅ Create agent service client (`services/agentService.ts`)
3. ✅ Create `/agents` page with authentication
4. ✅ Create AgentLayout component
5. ✅ Create AgentNavbar (clone Navbar)
6. ✅ Create basic ChatMessage component
7. ✅ Create ChatMessageList component
8. ✅ Create ChatInput component
9. ✅ Test with teacher_qa agent

**Success Criteria**:
- Can select teacher_qa from hardcoded button
- Can send message and receive response
- Messages display in chat panel
- Loading state shows during API call

---

### Phase 2: Menu System (Week 2)

**Goal**: Complete agent selection with reusable menu

**Tasks**:
1. ✅ Create GenericMenu component
2. ✅ Create GenericMenuItem types
3. ✅ Update SlideOver with title prop
4. ✅ Create AgentSidebar component
5. ✅ Define AGENT_MENU_ITEMS constant
6. ✅ Connect menu to agent selection
7. ✅ Add active agent highlighting
8. ✅ Test all 5 agents

**Success Criteria**:
- Menu opens/closes smoothly
- Can select each of 5 agents
- Active agent shows highlighted
- Menu closes after selection
- No regressions in course menu

---

### Phase 3: Sources & Polish (Week 3)

**Goal**: Add source display and improve UX

**Tasks**:
1. ✅ Create SourcePanel component
2. ✅ Create SourceCard component
3. ✅ Add source toggle to ChatInput
4. ✅ Store sources with each message
5. ✅ Add LoadingMessage component
6. ✅ Add error handling and retry
7. ✅ Add empty states
8. ✅ Add markdown rendering
9. ✅ Add code syntax highlighting
10. ✅ Polish animations and transitions

**Success Criteria**:
- Sources display correctly for each agent response
- Toggle works to show/hide sources
- Error messages are clear and actionable
- Loading states are smooth
- Markdown and code render properly

---

### Phase 4: Session Management (Week 4)

**Goal**: Persist sessions and conversation history

**Tasks**:
1. ✅ Create AgentChatContext
2. ✅ Implement localStorage persistence
3. ✅ Add session creation logic
4. ✅ Add history loading on mount
5. ✅ Add "New Session" button
6. ✅ Add session metadata display (optional)
7. ✅ Test session switching between agents

**Success Criteria**:
- Sessions persist across page refreshes
- Each agent has independent session
- Can start new session (clears messages)
- History loads correctly on mount
- Session switching is instant

---

### Phase 5: Advanced Features (Future)

**Not included in initial release:**
- [ ] Typing indicators (WebSocket)
- [ ] Message editing/deletion
- [ ] Export conversation
- [ ] Share conversation link
- [ ] Source click-through to course content
- [ ] Advanced RAG filters UI
- [ ] Multi-turn conversation branching
- [ ] Voice input (Web Speech API)
- [ ] Agent suggestions/autocomplete

---

## 📁 File Structure

### Backend (Completed ✅)

```
apps/agents/src/
├── routes/
│   ├── agent-chat.ts                        # Non-streaming endpoint
│   └── agent-chat-stream.ts                 # ✅ NEW: Streaming SSE endpoint
│
├── types/
│   └── agent.ts                             # ✅ UPDATED: Added streaming types
│
└── index.ts                                 # ✅ UPDATED: Registered streaming route
```

### Frontend (To Implement)

```
apps/coursehub/
├── pages/
│   └── agents.tsx                           # Main agents page
│
├── components/
│   ├── agents/                              # Agent-specific components
│   │   ├── AgentLayout.tsx                  # Main layout wrapper
│   │   ├── AgentNavbar.tsx                  # Top navigation bar
│   │   ├── AgentSidebar.tsx                 # Slide-over menu wrapper
│   │   ├── AgentChatPanel.tsx               # Main chat interface (WITH STREAMING)
│   │   ├── ChatMessageList.tsx              # Message scroll container
│   │   ├── ChatMessage.tsx                  # Individual message bubble
│   │   ├── StreamingMessage.tsx             # NEW: Message with cursor animation
│   │   ├── ChatInput.tsx                    # Input + send + cancel button
│   │   ├── SourcePanel.tsx                  # Source list container
│   │   └── SourceCard.tsx                   # Individual source display
│   │
│   └── ui/
│       └── GenericMenu.tsx                  # NEW: Reusable menu component
│
├── context/
│   └── agentChat.tsx                        # Chat state management
│
├── services/
│   └── agentService.ts                      # API client (WITH STREAMING)
│
├── utils/
│   └── sseParser.ts                         # NEW: SSE parsing utility
│
├── types/
│   └── agent.ts                             # TypeScript types
│
├── constants/
│   └── agents.ts                            # Agent menu data
│
└── hooks/
    ├── useAgentChat.ts                      # Chat logic hook (WITH STREAMING)
    └── useSessionPersistence.ts             # localStorage hook
```

### Modified Files

```
apps/coursehub/
├── components/
│   └── ui/
│       └── SlideOver.tsx                    # Add title prop
│
├── .env                                     # Add NEXT_PUBLIC_AGENT_SERVICE_URL
│
└── types.ts                                 # Export GenericMenuItem type

apps/agents/ (ALREADY COMPLETED ✅)
├── src/
│   ├── routes/
│   │   └── agent-chat-stream.ts            # ✅ Streaming endpoint
│   ├── types/
│   │   └── agent.ts                        # ✅ Streaming types added
│   └── index.ts                            # ✅ Route registered
```

### File Size Estimates

| File | Lines | Purpose |
|------|-------|---------|
| **Backend (Completed ✅)** |
| `agent-chat-stream.ts` | 280 | ✅ SSE streaming endpoint |
| `agent.ts` (types) | +50 | ✅ Streaming type definitions |
| **Frontend (To Do)** |
| `agents.tsx` | ~200 | Page component with state |
| `AgentLayout.tsx` | ~80 | Layout wrapper |
| `AgentNavbar.tsx` | ~60 | Top bar |
| `AgentSidebar.tsx` | ~100 | Menu wrapper |
| `AgentChatPanel.tsx` | ~300 | Main chat with streaming |
| `ChatMessageList.tsx` | ~100 | Message list |
| `ChatMessage.tsx` | ~120 | Message rendering |
| `StreamingMessage.tsx` | ~40 | Streaming cursor |
| `ChatInput.tsx` | ~180 | Input + cancel |
| `SourcePanel.tsx` | ~80 | Source container |
| `SourceCard.tsx` | ~100 | Source display |
| `GenericMenu.tsx` | ~200 | Reusable menu |
| `agentChat.tsx` | ~150 | Context provider |
| `agentService.ts` | ~200 | API with streaming |
| `sseParser.ts` | ~80 | SSE parsing |
| `agent.ts` | ~100 | Type definitions |
| **Frontend Total** | **~2,090 lines** | |

---

## ✅ Backend Implementation Status

**Completed** (November 2025):

1. ✅ **Streaming Endpoint**: `/agents/:agent/chat/stream` fully implemented
2. ✅ **SSE Protocol**: Proper event format (session, sources, token, done, error)
3. ✅ **OpenAI Streaming**: Integrated with `stream: true`
4. ✅ **Error Handling**: Network errors, validation errors, stream failures
5. ✅ **TypeScript Types**: Complete streaming event types added
6. ✅ **Testing**: Verified with curl, streams working correctly
7. ✅ **Route Registration**: Registered in main index.ts

**Test Command**:
```bash
curl -N -X POST 'http://localhost:8787/agents/teacher_qa/chat/stream' \
  -H 'Content-Type: application/json' \
  -d '{"query":"What is a closure?","maxTokens":100}'
```

## 🧪 Testing Considerations

### Unit Tests (Future)

**Components to test**:
- GenericMenu item rendering and click handling
- ChatMessage markdown rendering
- SourceCard metadata formatting
- ChatInput validation and keyboard handling

**Example test**:
```typescript
describe('GenericMenu', () => {
  it('renders all menu items', () => {
    render(<GenericMenu items={mockItems} onItemClick={jest.fn()} />);
    expect(screen.getByText('Product Owner')).toBeInTheDocument();
  });

  it('calls onItemClick when item clicked', () => {
    const onClick = jest.fn();
    render(<GenericMenu items={mockItems} onItemClick={onClick} />);
    fireEvent.click(screen.getByText('Product Owner'));
    expect(onClick).toHaveBeenCalledWith(mockItems[0]);
  });
});
```

---

### Integration Tests

**Scenarios**:
1. Select agent → send message → receive response
2. Switch agents → verify session persistence
3. Toggle sources → verify display changes
4. Send message without agent selected → show error
5. API failure → show error and retry

---

### Manual Testing Checklist

#### Functionality
- [ ] All 5 agents selectable from menu
- [ ] Messages send and responses appear
- [ ] Sessions persist across page refresh
- [ ] Sources toggle on/off correctly
- [ ] Error messages display for API failures
- [ ] Loading states show during requests
- [ ] New session clears messages
- [ ] Agent switching works instantly
- [ ] Authentication required (redirect to signin)

#### UI/UX
- [ ] Menu matches course menu styling
- [ ] Chat messages align correctly (user right, agent left)
- [ ] Markdown renders properly
- [ ] Code blocks have syntax highlighting
- [ ] Sources display with correct metadata
- [ ] Animations are smooth (menu, sources)
- [ ] Mobile responsive (tested on 375px width)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus states visible

#### Performance
- [ ] Chat scrolls smoothly with 50+ messages
- [ ] No lag when typing in input
- [ ] Menu opens/closes without delay
- [ ] API responses under 3 seconds (on good connection)
- [ ] No memory leaks after switching agents 10+ times

#### Regression
- [ ] Course pages still load correctly
- [ ] Course menu still works (no styling changes)
- [ ] Authentication still works site-wide
- [ ] Navbar profile dropdown still works
- [ ] No console errors on any existing page

---

### Edge Cases

1. **No session ID returned**: Create new session automatically
2. **Empty response from agent**: Show "No response" message
3. **Network offline**: Show offline indicator
4. **Session expired**: Clear stale session and start new
5. **Very long message**: Truncate or show "read more"
6. **Rapid message sending**: Disable input until response
7. **Special characters in message**: Escape properly
8. **Markdown parsing errors**: Fallback to plain text

---

## 🚀 Future Enhancements

### Short-term (3-6 months)

1. **Shareable Conversations**
   - Generate public link for conversation
   - View-only mode for shared links
   - Privacy controls (public/private/unlisted)

2. **Export Functionality**
   - Download conversation as Markdown
   - Export as PDF with formatting
   - Include sources and metadata

3. **Advanced RAG Controls**
   - UI for topK slider
   - Temperature control
   - Collection filters (checkboxes)
   - Domain/concept filters

4. **Source Click-through**
   - Link sources to original course pages
   - Highlight relevant passage in page
   - Open in modal or new tab

5. **Message Actions**
   - Copy message text
   - Regenerate response (with different params)
   - Edit user message and resend
   - Delete message (with confirmation)

---

### Long-term (6-12 months)

1. **Real-time Features**
   - WebSocket connection for typing indicators
   - Live collaborative sessions (multi-user)
   - Agent status (online/offline/busy)

2. **Multi-modal Input**
   - Voice input (Web Speech API)
   - Image upload for question context
   - Paste code snippets with formatting
   - Drag-and-drop files

3. **Conversation Intelligence**
   - Suggested follow-up questions
   - Conversation branching (tree view)
   - Conversation search (semantic)
   - Conversation tagging and organization

4. **Specialized Agent Features**
   - **Course Instructor**: Page navigation inline
   - **Realm Builder**: Visual realm editor
   - **Model Builder**: Metaphor diagram generator
   - **Product Owner**: Inline editing suggestions
   - **Teacher QA**: Code playground integration

5. **Analytics Dashboard**
   - Conversation length metrics
   - Most common questions per agent
   - User satisfaction ratings
   - Source retrieval effectiveness

---

### Technical Debt

**Track these for future refactoring:**

1. **State Management**: Consider Zustand/Jotai if context becomes complex
2. **API Client**: Add React Query for caching and optimistic updates
3. **Component Library**: Evaluate shadcn/ui for consistency
4. **Testing**: Add Playwright for E2E tests
5. **Bundle Size**: Code-split agent components with dynamic imports
6. **Accessibility**: Full ARIA audit and keyboard navigation
7. **Internationalization**: Prepare for multi-language support

---

## 📝 Appendix

### Type Definitions Reference

**Full type file**: `apps/coursehub/types/agent.ts`

```typescript
// Agent identifiers
export type AgentId =
  | 'product_owner'
  | 'model_builder'
  | 'teacher_qa'
  | 'realm_builder'
  | 'course_instructor';

// Session types
export type SessionType = 'improvement' | 'model_build' | 'qa' | 'lesson';

// Message role
export type MessageRole = 'user' | 'assistant' | 'system';

// Chat message (frontend)
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: SourceReference[];
  metadata?: Record<string, any>;
}

// Source reference
export interface SourceReference {
  chunk_uid: string;
  collection: string;
  page_title?: string;
  course_title?: string;
  chapter_title?: string;
  subchapter_title?: string;
  score: number;
  has_image: boolean;
  code_languages: string[];
}

// Agent info (from GET /agents)
export interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  session_type: SessionType;
}

// API request
export interface AgentChatRequest {
  query: string;
  session_id?: string;
  user_id?: string;
  topic?: string;
  domain?: string;
  filters?: {
    domain?: string;
    concepts?: string[];
    mnemonic_tags?: string[];
    has_image?: boolean;
    code?: boolean;
  };
  topK?: number;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, any>;
}

// API response
export interface AgentChatResponse {
  ok: boolean;
  reply: string;
  session_id: string;
  sources: SourceReference[];
  metadata: {
    agent: AgentId;
    model: string;
    chunks_retrieved: number;
    temperature: number;
    max_tokens: number;
    messages_in_context: number;
  };
}

// Error response
export interface AgentErrorResponse {
  ok: false;
  error: string;
  message: string;
  details?: any;
}

// Session history item
export interface SessionMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  attachments?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
}
```

---

### API Endpoint Reference

**Base URL**: `http://localhost:8787`

#### List Agents
```
GET /agents
Response: { ok: true, agents: AgentInfo[] }
```

#### Send Chat Message
```
POST /agents/:agent/chat
Body: AgentChatRequest
Response: AgentChatResponse
```

#### Get Session History
```
GET /agents/:agent/session/:sessionId/history?limit=50
Response: { ok: true, messages: SessionMessage[] }
```

#### Get Session Details
```
GET /agents/:agent/session/:sessionId
Response: { ok: true, session: AgentSession }
```

---

### Environment Variables

```bash
# Agent Service (required)
NEXT_PUBLIC_AGENT_SERVICE_URL=http://localhost:8787

# Existing (for reference)
NEXT_PUBLIC_STRAPI_URL=http://127.0.0.1:1337
STRAPI_URL=http://127.0.0.1:1337
NEXTAUTH_URL=http://localhost:1218
NEXTAUTH_SECRET=<secret>
```

---

### Color Palette Reference

From existing CourseHub:

| Color | Tailwind | Hex | Usage |
|-------|----------|-----|-------|
| Primary Blue | `bg-primary_blue` | #03143F | Navbar, background |
| Primary Green | `bg-primary_green` | #4ade80 | Buttons, accents |
| Dark overlay | `bg-[#031b4352]` | rgba(3,27,67,0.32) | Cards, panels |
| White text | `text-white` | #ffffff | Primary text |
| White 80% | `text-white/80` | rgba(255,255,255,0.8) | Secondary text |
| White 60% | `text-white/60` | rgba(255,255,255,0.6) | Tertiary text |
| Gray 50 | `bg-gray-50` | #f9fafb | Active items |
| Gray 100 | `bg-gray-100` | #f3f4f6 | Hover states |

---

## ✅ Success Metrics

### Launch Criteria

Before marking this feature "complete":

1. ✅ All 5 agents functional
2. ✅ Sessions persist correctly
3. ✅ Sources display properly
4. ✅ Zero regressions on course pages
5. ✅ Mobile responsive
6. ✅ Error handling complete
7. ✅ Loading states polished
8. ✅ Manual testing checklist passed
9. ✅ Documentation complete
10. ✅ Code reviewed and approved

### User Experience Goals

- **Fast**: Message send/response cycle under 3 seconds (median)
- **Intuitive**: New users can start chatting within 30 seconds
- **Reliable**: 99%+ uptime, graceful error handling
- **Accessible**: WCAG 2.1 AA compliant (keyboard nav, screen readers)
- **Delightful**: Smooth animations, helpful empty states

---

## 📖 Related Documentation

- [Multi-Agent Backend Spec](./multi_agents.md)
- [RAG System Spec](./rag_v1.md)
- [CourseHub Architecture](../apps/coursehub/README.md)
- [Next.js Pages Router Docs](https://nextjs.org/docs/pages)
- [Headless UI Documentation](https://headlessui.com/)

---

**End of Specification**

*This document provides a complete blueprint for implementing the multi-agent chat interface. Follow the implementation strategy phases for a systematic rollout. Questions or clarifications should be directed to the team lead or documented as GitHub issues.*
