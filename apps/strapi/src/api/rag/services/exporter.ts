/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strapi } from '@strapi/strapi';
import { toReflection, toUnits, toMnemonics } from '../helpers/shapers';

// Types for clarity
interface EntityRef {
  id?: string | number;
  title?: string;
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
    ? { id: courseItem.id, title: courseItem.attributes?.title }
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

    const { subchapter, chapter, course } = await resolveHierarchyForPage(strapi, pageId);

    const units = toUnits({
      pageId,
      page: page.attributes,
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

    const units = toMnemonics({
      imagimodelId: modelId,
      model: model.attributes as any,
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

    // Derive hierarchy
    let subchapter: EntityRef | undefined;
    let chapter: EntityRef | undefined;
    let course: EntityRef | undefined;

    if (reflection.subchapter) {
      subchapter = { id: reflection.subchapter.id, title: reflection.subchapter.title };
      if (reflection.subchapter.chapter) {
        chapter = {
          id: reflection.subchapter.chapter.id,
          title: reflection.subchapter.chapter.title,
        };
        const crsData = reflection.subchapter.chapter.courses?.data ?? [];
        const courseItem = crsData[0];
        if (courseItem) course = { id: courseItem.id, title: courseItem.attributes?.title };
      }
    }
    if (reflection.chapter && !chapter) {
      chapter = { id: reflection.chapter.id, title: reflection.chapter.title };
      const crsData = reflection.chapter.courses?.data ?? [];
      const courseItem = crsData[0];
      if (courseItem) course = { id: courseItem.id, title: courseItem.attributes?.title };
    }
    if (reflection.course && !course) {
      course = { id: reflection.course.id, title: reflection.course.title };
    }

    const units = toReflection({
      reflectionId,
      reflection,
      course,
      chapter,
      subchapter,
    });

    return { reflection, units };
  },
});
