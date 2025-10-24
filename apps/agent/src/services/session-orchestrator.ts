/**
 * Session orchestrator - coordinates the learning session workflow
 */

import OpenAI from 'openai';
import {
  StartSessionResponse,
  ChatResponse,
  FinishSessionResponse,
  SessionArtifact,
} from '../types/session';
import {  loadRealm, loadTopicPack, getNextTopic } from './data-loader';
import {
  createSession,
  getSession,
  getActiveSession,
  finishSession as finishSessionRepo,
} from './session-repository';
import {
  addEvent,
  getRecentEvents,
  getAllEvents,
} from './events-repository';
import {
  getFinishedTopics,
  markTopicFinished,
} from './progress-repository';
import {
  buildSessionSystemPrompt,
  buildWelcomeMessage,
  buildArtifactExtractionPrompt,
  buildValidationPrompt,
} from '../prompts/session-prompts';
import { vectorizeSessionArtifact } from './session-vectorizer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';
const CONTEXT_WINDOW = 30; // Number of recent messages to include

/**
 * Start or resume a learning session
 * @param userId - The user ID (optional)
 * @param realmId - The realm to learn in
 * @returns Session start response with welcome message
 */
export async function startOrResumeSession(
  userId: string | undefined,
  realmId: string
): Promise<StartSessionResponse> {
  // Check for existing active session
  const activeSession = await getActiveSession(userId, realmId);

  if (activeSession) {
    // Resume existing session
    const realm = loadRealm(activeSession.realm_id);
    const topicPack = activeSession.topic_pack;

    return {
      session_id: activeSession.id,
      realm,
      topic: activeSession.topic,
      topic_pack: topicPack,
      message: `Welcome back! Let's continue working on **${activeSession.topic}**.

What would you like to explore next?`,
    };
  }

  // Load realm data
  const realm = loadRealm(realmId);

  // Get finished topics
  const finishedTopics = await getFinishedTopics(userId, realmId);

  // Get next topic
  const nextTopicId = getNextTopic(realmId, finishedTopics);

  if (!nextTopicId) {
    throw new Error(`All topics completed for realm: ${realmId}`);
  }

  // Load topic pack
  const topicPack = loadTopicPack(nextTopicId);

  // Create new session
  const session = await createSession({
    user_id: userId,
    realm_id: realmId,
    topic: nextTopicId,
    topic_pack: topicPack,
    realm_snapshot: realm,
  });

  // Build system prompt and store as first event
  const systemPrompt = buildSessionSystemPrompt(realm, topicPack);
  await addEvent(session.id, 'system', systemPrompt);

  // Build welcome message
  const welcomeMessage = buildWelcomeMessage(realm, topicPack);

  return {
    session_id: session.id,
    realm,
    topic: nextTopicId,
    topic_pack: topicPack,
    message: welcomeMessage,
  };
}

/**
 * Handle a chat turn in a session
 * @param sessionId - The session ID
 * @param userMessage - The user's message
 * @returns Assistant's response
 */
export async function chatTurn(
  sessionId: number,
  userMessage: string
): Promise<ChatResponse> {
  // Get session
  const session = await getSession(sessionId);

  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  if (session.status !== 'active') {
    throw new Error(`Session is not active: ${sessionId}`);
  }

  // Store user message
  await addEvent(sessionId, 'user', userMessage);

  // Get recent conversation history
  const recentEvents = await getRecentEvents(sessionId, CONTEXT_WINDOW);

  // Build messages for OpenAI
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // Add system message (should be first event)
  const systemEvent = recentEvents.find(e => e.role === 'system');
  if (systemEvent) {
    messages.push({
      role: 'system',
      content: systemEvent.content,
    });
  }

  // Add conversation history (excluding system messages)
  for (const event of recentEvents) {
    if (event.role !== 'system') {
      messages.push({
        role: event.role as 'user' | 'assistant',
        content: event.content,
      });
    }
  }

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const assistantReply = completion.choices[0]?.message?.content ?? 'I apologize, but I need a moment to gather my thoughts. Could you rephrase that?';

  // Store assistant reply
  await addEvent(sessionId, 'assistant', assistantReply);

  return {
    reply: assistantReply,
  };
}

/**
 * Finish a session and extract the metaphor map artifact
 * @param sessionId - The session ID
 * @returns Completed artifact and chunk UIDs
 */
export async function finishSession(
  sessionId: number
): Promise<FinishSessionResponse> {
  // Get session
  const session = await getSession(sessionId);

  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  if (session.status !== 'active') {
    throw new Error(`Session is not active: ${sessionId}`);
  }

  // Get all conversation events
  const allEvents = await getAllEvents(sessionId);

  // Extract artifact using OpenAI
  const artifact = await extractArtifact(
    session.realm_snapshot,
    session.topic_pack,
    allEvents
  );

  // Optionally validate (can add score here)
  // const validation = await validateArtifact(session.topic_pack, artifact);
  // artifact.score = validation.score;

  // Update session with artifact
  await finishSessionRepo(sessionId, artifact);

  // Mark topic as finished in progress
  await markTopicFinished(session.user_id, session.realm_id, session.topic);

  // Vectorize and index the artifact
  const chunkUids = await vectorizeSessionArtifact(
    sessionId,
    artifact,
    session.topic_pack,
    session.realm_id
  );

  return {
    session_id: sessionId,
    artifact,
    chunk_uids: chunkUids,
  };
}

/**
 * Extract the artifact from conversation using OpenAI
 */
async function extractArtifact(
  realm: any,
  topicPack: any,
  events: any[]
): Promise<SessionArtifact> {
  const extractionPrompt = buildArtifactExtractionPrompt(realm, topicPack, events);

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert at analyzing conversations and extracting structured metaphor maps. Return only valid JSON.',
      },
      {
        role: 'user',
        content: extractionPrompt,
      },
    ],
    temperature: 0.3, // Lower temperature for more consistent extraction
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Failed to extract artifact from OpenAI');
  }

  try {
    const artifact = JSON.parse(content);

    // Validate structure
    if (!artifact.legend || !artifact.rules || !artifact.script) {
      throw new Error('Incomplete artifact structure');
    }

    // Ensure red_flags is an array
    if (!artifact.red_flags) {
      artifact.red_flags = [];
    }

    return {
      legend: artifact.legend,
      rules: artifact.rules,
      script: artifact.script,
      red_flags: artifact.red_flags,
    };
  } catch (error) {
    throw new Error(`Failed to parse artifact JSON: ${error}`);
  }
}

/**
 * Validate an artifact against the topic pack (optional)
 */
async function validateArtifact(
  topicPack: any,
  artifact: SessionArtifact
): Promise<{ score: number; feedback: string }> {
  const validationPrompt = buildValidationPrompt(
    topicPack,
    artifact.legend,
    artifact.rules,
    artifact.script
  );

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert educator evaluating learning artifacts. Return only valid JSON.',
      },
      {
        role: 'user',
        content: validationPrompt,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    return { score: 0.7, feedback: 'Unable to validate' };
  }

  try {
    const result = JSON.parse(content);
    return {
      score: result.score ?? 0.7,
      feedback: result.feedback ?? '',
    };
  } catch {
    return { score: 0.7, feedback: 'Validation parse error' };
  }
}
