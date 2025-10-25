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
 */
async function resolveHierarchyForPage(strapi: Strapi, pageId: number) {
  const subRes: any = await strapi.entityService.findMany('api::subchapter.subchapter', {
    filters: { pages: { id: { $eq: pageId } } },
    populate: {
      chapter: {
        populate: {
          courses: { fields: ['id', 'title', 'uid'] }, // adjust if it's `course` not `courses`
        },
      },
    },
    limit: 1,
  });

  const sub = Array.isArray(subRes) ? subRes[0] : subRes;
  if (!sub) return { subchapter: undefined, chapter: undefined, course: undefined };

  const subchapter: EntityRef = { id: sub.id, title: sub.attributes?.title };
  const ch = sub.attributes?.chapter?.data;
  const chapter: EntityRef | undefined = ch
    ? { id: ch.id, title: ch.attributes?.title }
    : undefined;

  const crsData = ch?.attributes?.courses?.data ?? [];
  const courseItem = crsData[0];
  const course: EntityRef | undefined = courseItem
    ? {
        id: courseItem.id,
        title: courseItem.attributes?.title,
        uid: courseItem.attributes?.uid
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
