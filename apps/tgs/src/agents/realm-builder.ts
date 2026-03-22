/**
 * Realm Builder Agent
 * Guides users in creating their own metaphor worlds using topic packs
 *
 * This agent helps learners build custom metaphor maps for technical concepts
 * by guiding them through realm symbol selection and mental model construction.
 */

import OpenAI from 'openai';
import { loadRealm, loadTopicPack, getNextTopic } from '../services/data-loader';
import { getFinishedTopics, markTopicFinished } from '../services/progress-repository';
import {
  createSession,
  getSession,
  getSessionHistory,
  endSession as endSessionService,
} from '../services/agent-session-service';
import { vectorizeSessionArtifact } from '../services/session-vectorizer';
import { buildExtractionPrompt } from '../prompts/session-prompts';
import type { Realm, TopicPack, SessionArtifact } from '../types/session';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// ============================================================================
// API Response Types
// ============================================================================

export interface StartRealmSessionResponse {
  session_id: string;
  realm: Realm;
  topic: string;
  topic_pack: TopicPack;
  message: string;
}

export interface FinishRealmSessionResponse {
  session_id: string;
  artifact: SessionArtifact;
  chunk_uids: string[];
  message: string;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Start a new realm building session
 * Loads realm and determines next topic based on user progress
 *
 * @param user_id - User identifier (optional)
 * @param realm_id - Realm identifier (e.g., 'fantasy')
 * @returns Session info with realm, topic, and initial message
 */
export async function startRealmSession(
  user_id: string | undefined,
  realm_id: string
): Promise<StartRealmSessionResponse> {
  // Load realm definition
  const realm = loadRealm(realm_id);

  // Get user's completed topics
  const finishedTopics = await getFinishedTopics(user_id, realm_id);

  // Determine next topic
  const nextTopic = getNextTopic(realm_id, finishedTopics);

  if (!nextTopic) {
    throw new Error(`All topics completed in realm: ${realm_id}`);
  }

  // Load topic pack
  const topicPack = loadTopicPack(nextTopic);

  // Create session via agent-session-service
  const session_id = await createSession({
    user_id,
    agent: 'realm_builder',
    session_type: 'model_build',
    topic: nextTopic,
    domain: topicPack.domain,
    context: {
      realm_id,
      realm_snapshot: realm,
      topic_pack: topicPack,
    },
  });

  const message = `Welcome to the ${realm.name}!

Today's topic: **${topicPack.topic}**

Your task is to map these technical entities to symbolic representations from the realm:

${topicPack.entities.map((e) => `- **${e.name}**: ${e.description}`).join('\n')}

Available symbols: ${realm.symbol_inventory.join(', ')}

Let's start building your mental model. Which symbol do you think best represents "${topicPack.entities[0].name}"?`;

  return {
    session_id,
    realm,
    topic: nextTopic,
    topic_pack: topicPack,
    message,
  };
}

/**
 * Finish a realm building session and extract the final artifact
 *
 * This function:
 * 1. Retrieves conversation history
 * 2. Asks OpenAI to extract structured artifact (legend, rules, script, red_flags)
 * 3. Validates the artifact (optional, can be skipped if unstable)
 * 4. Saves artifact to session.output
 * 5. Vectorizes artifact into rag.chunks
 * 6. Marks topic as complete
 *
 * @param session_id - Session identifier
 * @returns Artifact and vectorization info
 */
export async function finishRealmSession(
  session_id: string
): Promise<FinishRealmSessionResponse> {
  // Get session and verify it's a realm_builder session
  const session = await getSession(session_id);

  if (session.agent !== 'realm_builder') {
    throw new Error(`Session ${session_id} is not a Realm Builder session`);
  }

  if (session.ended_at) {
    throw new Error(`Session ${session_id} is already finished`);
  }

  // Get conversation history
  const messages = await getSessionHistory(session_id, 1000); // Get full history

  // Extract context
  const { realm_snapshot, topic_pack } = session.context as {
    realm_snapshot: Realm;
    topic_pack: TopicPack;
  };

  // Build extraction prompt
  const extractionPrompt = buildExtractionPrompt(messages, realm_snapshot, topic_pack);

  // Ask OpenAI to extract structured artifact
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert at extracting structured learning artifacts from conversations. ' +
          'Extract the legend, rules, script, and red_flags from the conversation.',
      },
      { role: 'user', content: extractionPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const artifactText = completion.choices[0]?.message?.content;

  if (!artifactText) {
    throw new Error('Failed to extract artifact from conversation');
  }

  let artifact: SessionArtifact;

  try {
    artifact = JSON.parse(artifactText);

    // Validate artifact structure
    if (!artifact.legend || !artifact.rules || !artifact.script || !artifact.red_flags) {
      throw new Error('Extracted artifact is missing required fields');
    }
  } catch (error) {
    throw new Error(`Failed to parse artifact JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Optional: Validate artifact quality (skip if unstable)
  // const score = await validateArtifact(artifact, topic_pack);

  // End session and save artifact (via agent-session-service)
  await endSessionService(
    session_id,
    `Completed topic: ${session.topic}`,
    artifact
    // score // Optional validation score
  );

  // Vectorize artifact into rag.chunks
  const chunk_uids = await vectorizeSessionArtifact(session_id, artifact);

  // Mark topic as complete
  await markTopicFinished(session.user_id, session.context.realm_id, session.topic!);

  return {
    session_id,
    artifact,
    chunk_uids,
    message: `Congratulations! You've completed the topic "${session.topic}". Your mental model has been saved.`,
  };
}

/**
 * Get user progress in a realm
 *
 * @param user_id - User identifier (optional)
 * @param realm_id - Realm identifier
 * @returns Progress summary
 */
export async function getRealmProgress(user_id: string | undefined, realm_id: string) {
  const finishedTopics = await getFinishedTopics(user_id, realm_id);
  const realm = loadRealm(realm_id);

  return {
    realm_id,
    realm_name: realm.name,
    finished_topics: finishedTopics,
    topics_completed: finishedTopics.length,
  };
}

/**
 * List all available realms
 */
export async function listAvailableRealms() {
  // For now, just return fantasy realm
  // Could be extended to read from data/realms/ directory
  return [
    {
      id: 'fantasy',
      name: 'Fantasy Realm',
      description: 'Learn programming through magical metaphors',
    },
  ];
}
