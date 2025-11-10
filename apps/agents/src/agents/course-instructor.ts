/**
 * Course Instructor Agent (NEW)
 * Teaches structured lessons from The Great Sync canon courses
 *
 * This agent guides learners through Strapi course content page-by-page,
 * combining canon material with RAG-enhanced explanations.
 */

import { fetchSubchapterWithPages, fetchPage, extractPageText, getPageCourseTitle } from '../services/strapi-client';
import { createSession, getSession, endSession as endSessionService } from '../services/agent-session-service';
import type { Page, Subchapter } from '../types/strapi';

// TODO: Import OpenAI when implementing reflection generation in finishLessonSession()
// import OpenAI from 'openai';
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
// const CHAT_MODEL = process.env.CHAT_MODEL ?? 'gpt-4o-mini';

// ============================================================================
// Response Types
// ============================================================================

export interface StartLessonResponse {
  session_id: string;
  subchapter: Subchapter;
  first_page: Page;
  total_pages: number;
  message: string;
}

export interface LessonProgressResponse {
  current_page_index: number;
  total_pages: number;
  current_page: Page;
  completed: boolean;
}

export interface FinishLessonResponse {
  session_id: string;
  reflection: string;
  concepts_learned: string[];
  chunk_uids: string[];
  message: string;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Start a new lesson session
 * @param user_id - User identifier (optional)
 * @param course_id - Course ID
 * @param subchapter_id - Subchapter ID to teach
 * @returns Session info with first page
 */
export async function startLessonSession(
  user_id: string | undefined,
  course_id: number,
  subchapter_id: number
): Promise<StartLessonResponse> {
  // Fetch subchapter and pages from Strapi
  const subchapter = await fetchSubchapterWithPages(subchapter_id);

  if (!subchapter.pages || subchapter.pages.length === 0) {
    throw new Error(`Subchapter ${subchapter_id} has no pages`);
  }

  const pages = subchapter.pages.filter(p => p.visible);

  if (pages.length === 0) {
    throw new Error(`Subchapter ${subchapter_id} has no visible pages`);
  }

  const firstPage = pages[0];
  const courseTitle = getPageCourseTitle(firstPage) || 'Unknown Course';

  // Create session via agent-session-service
  const session_id = await createSession({
    user_id,
    agent: 'course_instructor',
    session_type: 'lesson',
    topic: subchapter.title,
    domain: courseTitle,
    context: {
      course_id,
      subchapter_id,
      page_ids: pages.map(p => p.id),
      current_page_index: 0,
      total_pages: pages.length,
    },
  });

  const message = `Welcome to the lesson: **${subchapter.title}**

We'll be working through ${pages.length} pages together. Let's start with "${firstPage.title}".

${extractPageText(firstPage).substring(0, 300)}...

What questions do you have about this concept?`;

  return {
    session_id,
    subchapter,
    first_page: firstPage,
    total_pages: pages.length,
    message,
  };
}

/**
 * Get current lesson progress
 * @param session_id - Session identifier
 * @returns Current page and progress info
 */
export async function getLessonProgress(session_id: string): Promise<LessonProgressResponse> {
  const session = await getSession(session_id);

  if (session.agent !== 'course_instructor') {
    throw new Error(`Session ${session_id} is not a Course Instructor session`);
  }

  const { page_ids, current_page_index, total_pages } = session.context;
  const currentPageId = page_ids[current_page_index];
  const currentPage = await fetchPage(currentPageId);

  return {
    current_page_index,
    total_pages,
    current_page: currentPage,
    completed: current_page_index >= total_pages - 1,
  };
}

/**
 * Finish lesson and generate reflection
 * @param session_id - Session identifier
 * @returns Reflection and learned concepts
 */
export async function finishLessonSession(session_id: string): Promise<FinishLessonResponse> {
  const session = await getSession(session_id);

  if (session.agent !== 'course_instructor') {
    throw new Error(`Session ${session_id} is not a Course Instructor session`);
  }

  if (session.ended_at) {
    throw new Error(`Session ${session_id} is already finished`);
  }

  // TODO: Implement reflection generation using OpenAI
  // For now, create a simple reflection
  const reflection = `Completed lesson on ${session.topic}`;
  const concepts_learned = ['placeholder_concept'];

  // End session
  await endSessionService(session_id, `Completed lesson: ${session.topic}`, {
    reflection,
    concepts_learned,
    pages_completed: session.context.total_pages,
  });

  // Vectorize reflection (placeholder - needs vectorizeReflection implementation)
  const chunk_uids: string[] = [];

  return {
    session_id,
    reflection,
    concepts_learned,
    chunk_uids,
    message: `Great work! You've completed the lesson on "${session.topic}".`,
  };
}
