/**
 * Strapi Client Service
 * Handles fetching course content from The Great Sync Strapi CMS
 */

import axios, { AxiosInstance } from 'axios';
import type {
  Course,
  Subchapter,
  Page,
  StrapiResponse,
  StrapiListResponse,
} from '../types/strapi';

/**
 * Strapi API client configured with admin token
 */
const strapiClient: AxiosInstance = axios.create({
  baseURL: process.env.STRAPI_URL || 'http://localhost:1337',
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
  },
});

/**
 * Build query string for Strapi populate parameters
 * Note: This is a simplified version. For production, consider using 'qs' package
 */
function buildPopulateQuery(fields: string[]): string {
  return fields.map((field, idx) => `populate[${idx}]=${field}`).join('&');
}

/**
 * Fetch a single course by ID
 * @param courseId - Course ID
 * @returns Course data
 */
export async function fetchCourse(courseId: number): Promise<Course> {
  const populate = buildPopulateQuery(['chapters', 'chapters.subchapters']);

  const { data } = await strapiClient.get<StrapiResponse<Course>>(
    `/api/courses/${courseId}?${populate}`
  );

  return data.data;
}

/**
 * Fetch a subchapter with all its pages
 * @param subchapterId - Subchapter ID
 * @returns Subchapter with pages
 */
export async function fetchSubchapterWithPages(subchapterId: number): Promise<Subchapter> {
  const populate = buildPopulateQuery([
    'pages',
    'pages.content',
    'pages.content.image',
    'pages.content.video',
    'pages.concepts',
    'pages.links',
    'menu',
    'menu.course',
  ]);

  const { data } = await strapiClient.get<StrapiResponse<Subchapter>>(
    `/api/subchapters/${subchapterId}?${populate}&publicationState=live`
  );

  return data.data;
}

/**
 * Fetch a single page with all content
 * @param pageId - Page ID
 * @returns Page data with content components
 */
export async function fetchPage(pageId: number): Promise<Page> {
  const populate = buildPopulateQuery([
    'content',
    'content.image',
    'content.video',
    'content.files',
    'concepts',
    'links',
    'menu',
    'menu.course',
  ]);

  const { data} = await strapiClient.get<StrapiResponse<Page>>(
    `/api/pages/${pageId}?${populate}&publicationState=live`
  );

  return data.data;
}

/**
 * Fetch multiple pages by IDs
 * @param pageIds - Array of page IDs
 * @returns Array of pages
 */
export async function fetchPages(pageIds: number[]): Promise<Page[]> {
  const filters = pageIds.map((id, idx) => `filters[id][$in][${idx}]=${id}`).join('&');
  const populate = buildPopulateQuery([
    'content',
    'content.image',
    'concepts',
    'menu',
  ]);

  const { data } = await strapiClient.get<StrapiListResponse<Page>>(
    `/api/pages?${filters}&${populate}&publicationState=live`
  );

  return data.data;
}

/**
 * Extract plain text from page content components
 * Useful for building context strings
 */
export function extractPageText(page: Page): string {
  if (!page.content) return '';

  const textParts: string[] = [];

  for (const component of page.content) {
    switch (component.__component) {
      case 'media.text':
        textParts.push(component.text);
        break;
      case 'media.text-image':
        textParts.push(component.text);
        if (component.caption) textParts.push(`[Image: ${component.caption}]`);
        break;
      case 'media.text-image-code':
        textParts.push(component.text);
        if (component.code) textParts.push(`\`\`\`\n${component.code}\n\`\`\``);
        break;
      case 'media.code-editor':
        if (component.files) {
          component.files.forEach(file => {
            textParts.push(`\`\`\`${file.language || ''}\n// ${file.filename}\n${file.code}\n\`\`\``);
          });
        }
        break;
    }
  }

  return textParts.join('\n\n');
}

/**
 * Get course title from page's menu hierarchy
 */
export function getPageCourseTitle(page: Page): string | undefined {
  return page.menu?.[0]?.course?.title;
}
