/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strapi } from '@strapi/strapi';
import { toReflection, toUnits, toMnemonics } from '../helpers/shapers';

// Types for clarity
interface EntityRef {
  id?: string | number;
  title?: string;
  uid?: string;
}

/**
 * Normalize Strapi v4 response format
 * Handles both { id, attributes } and flat { id, ...fields } formats
 */
function normalizeEntity(entity: any): any {
  if (!entity) return null;

  // If it already has attributes, extract them and merge with id
  if (entity.attributes) {
    return {
      id: entity.id,
      ...entity.attributes,
    };
  }

  // Otherwise assume it's already flat format
  return entity;
}

/**
 * Resolve Subchapter → Chapter → Course for a given Page id
 *
 * NOTE: Strapi schema has ONE-WAY relations:
 * - subchapter does NOT have a "chapter" field
 * - chapter → subchapters (oneToMany)
 * - course ↔ chapters (manyToMany)
 *
 * So we must query:
 * 1. Find subchapter by page
 * 2. Find chapter that contains this subchapter
 * 3. Find course that contains this chapter
 */
async function resolveHierarchyForPage(strapi: Strapi, pageId: number) {
  // Step 1: Find subchapter by page
  const subRes: any = await strapi.entityService.findMany('api::subchapter.subchapter', {
    filters: { pages: { id: { $eq: pageId } } },
    limit: 1,
  });

  const sub = Array.isArray(subRes) ? subRes[0] : subRes;
  if (!sub) return { subchapter: undefined, chapter: undefined, course: undefined };

  const subData = normalizeEntity(sub);
  const subchapter: EntityRef = { id: subData.id, title: subData.title };

  // Step 2: Find chapter that contains this subchapter
  const chapterRes: any = await strapi.entityService.findMany('api::chapter.chapter', {
    filters: { subchapters: { id: { $eq: subData.id } } },
    populate: { courses: { fields: ['id', 'title', 'uid'] } },
    limit: 1,
  });

  const chap = Array.isArray(chapterRes) ? chapterRes[0] : chapterRes;
  if (!chap) return { subchapter, chapter: undefined, course: undefined };

  const chapData = normalizeEntity(chap);
  const chapter: EntityRef = { id: chapData.id, title: chapData.title };

  // Step 3: Extract course from chapter
  const coursesRaw = chapData.courses?.data || chapData.courses || [];
  const courseItem = Array.isArray(coursesRaw) ? coursesRaw[0] : coursesRaw;
  const courseData = normalizeEntity(courseItem);

  const course: EntityRef | undefined = courseData
    ? {
        id: courseData.id,
        title: courseData.title,
        uid: courseData.uid
      }
    : undefined;

  return { subchapter, chapter, course };
}

export default ({ strapi }: { strapi: Strapi }) => ({
  /**
   * Export Page content units (course_content collection)
   */
  async getPageUnits(pageId: number) {
    const page = await strapi.entityService.findOne('api::page.page', pageId, {
      populate: {
        content: {
          populate: {
            image: { populate: ['*'] },
            file: { populate: ['*'] },
            image_classification: { populate: { concepts: true } },
          },
        },
        menu: { populate: { course: { populate: ['*'] } } },
        concepts: true,
      },
      publicationState: 'live',
    });

    if (!page) return { page: null, units: [] };

    // Normalize the page data format
    const pageData = normalizeEntity(page);

    if (!pageData || !pageData.title) {
      console.warn(`Page ${pageId} has no title, skipping`);
      return { page: null, units: [] };
    }

    const { subchapter, chapter, course } = await resolveHierarchyForPage(strapi, pageId);

    // Debug: log hierarchy resolution
    const fs = require('fs');
    const hierarchyDebug = {
      pageId,
      pageTitle: pageData.title,
      subchapter: subchapter ? { id: subchapter.id, title: subchapter.title } : null,
      chapter: chapter ? { id: chapter.id, title: chapter.title } : null,
      course: course ? { id: course.id, title: course.title, uid: course.uid } : null,
    };
    fs.writeFileSync('/tmp/strapi-hierarchy-debug.json', JSON.stringify(hierarchyDebug, null, 2));
    console.log(`[DEBUG] Hierarchy for page ${pageId}:`, JSON.stringify(hierarchyDebug, null, 2));

    // Debug: log content structure for specific page
    if (pageId === 85 && pageData.content && pageData.content.length > 0) {
      const fs = require('fs');
      const debugData = {
        pageId,
        pageTitle: pageData.title,
        pageType: pageData.type,
        contentLength: pageData.content.length,
        allContentItems: pageData.content,
        concepts: pageData.concepts,
      };
      fs.writeFileSync('/tmp/strapi-page85-full.json', JSON.stringify(debugData, null, 2));
      console.log(`[DEBUG] Page 85 full data written to /tmp/strapi-page85-full.json`);
    }

    const units = toUnits({
      pageId,
      page: pageData,
      course,
      chapter,
      subchapter,
    });

    return { page, units };
  },

  /**
   * Export Imagimodel (mnemonics collection)
   */
  async getImagimodelUnits(modelId: number, course?: EntityRef) {
    const model = await strapi.entityService.findOne('api::imagimodel.imagimodel', modelId, {
      populate: {
        layers: {
          populate: {
            image: { populate: { image: { populate: ['*'] } } },
            summaries: { populate: ['*'] },
          },
        },
        zones: true,
      },
      publicationState: 'live',
    });

    if (!model) return { model: null, units: [] };

    const modelData = normalizeEntity(model);

    const units = toMnemonics({
      imagimodelId: modelId,
      model: modelData,
      course,
    });

    return { model, units };
  },

  /**
   * Export Reflection entries (reflections collection)
   * Each reflection is short free text linked to a user + course structure.
   */
  async getReflectionUnits(reflectionId: number) {
    const reflection = await strapi.entityService.findOne(
      'api::reflection.reflection',
      reflectionId,
      {
        populate: {
          subchapter: { populate: { chapter: { populate: { courses: true } } } },
          chapter: { populate: { courses: true } },
          course: true,
          user: true,
        },
        publicationState: 'live',
      }
    );

    if (!reflection) return { reflection: null, units: [] };

    const reflectionData = normalizeEntity(reflection);

    // Derive hierarchy
    let subchapter: EntityRef | undefined;
    let chapter: EntityRef | undefined;
    let course: EntityRef | undefined;

    if (reflectionData.subchapter) {
      const subData = normalizeEntity(reflectionData.subchapter);
      subchapter = { id: subData.id, title: subData.title };
      if (subData.chapter) {
        const chapData = normalizeEntity(subData.chapter);
        chapter = { id: chapData.id, title: chapData.title };
        const coursesData = chapData.courses?.data || chapData.courses || [];
        const courseItem = Array.isArray(coursesData) ? coursesData[0] : coursesData;
        if (courseItem) {
          const courseData = normalizeEntity(courseItem);
          course = {
            id: courseData.id,
            title: courseData.title,
            uid: courseData.uid
          };
        }
      }
    }
    if (reflectionData.chapter && !chapter) {
      const chapData = normalizeEntity(reflectionData.chapter);
      chapter = { id: chapData.id, title: chapData.title };
      const coursesData = chapData.courses?.data || chapData.courses || [];
      const courseItem = Array.isArray(coursesData) ? coursesData[0] : coursesData;
      if (courseItem) {
        const courseData = normalizeEntity(courseItem);
        course = {
          id: courseData.id,
          title: courseData.title,
          uid: courseData.uid
        };
      }
    }
    if (reflectionData.course && !course) {
      const courseData = normalizeEntity(reflectionData.course);
      course = {
        id: courseData.id,
        title: courseData.title,
        uid: courseData.uid
      };
    }

    const units = toReflection({
      reflectionId,
      reflection: reflectionData,
      course,
      chapter,
      subchapter,
    });

    return { reflection, units };
  },
});
