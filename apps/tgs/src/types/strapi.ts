/**
 * TypeScript types for Strapi content structure
 * Based on The Great Sync CMS schema
 */

// ============================================================================
// Base Strapi Types
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// Course Structure
// ============================================================================

export interface Course {
  id: number;
  uid: string;
  title: string;
  description?: any; // DynamicZone
  chapters?: Chapter[];
  imagimodel?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Chapter {
  id: number;
  title: string;
  subchapters?: Subchapter[];
  menu?: MenuInfo;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Subchapter {
  id: number;
  title: string;
  pages?: Page[];
  menu?: MenuInfo;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Page {
  id: number;
  title: string;
  type: PageType;
  content?: PageContent[];
  menu?: MenuInfo[];
  concepts?: Concept[];
  links?: Link[];
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export type PageType =
  | 'text'
  | 'video'
  | 'text_code'
  | 'text_image'
  | 'text_image_code'
  | 'blocks'
  | 'reflection';

// ============================================================================
// Page Content Components
// ============================================================================

export type PageContent =
  | TextComponent
  | VideoComponent
  | TextImageComponent
  | TextImageCodeComponent
  | CodeEditorComponent
  | ImageComponent;

export interface TextComponent {
  __component: 'media.text';
  id: number;
  text: string; // Rich text
}

export interface VideoComponent {
  __component: 'media.video';
  id: number;
  video?: MuxVideo;
}

export interface TextImageComponent {
  __component: 'media.text-image';
  id: number;
  text: string;
  image?: StrapiImage;
  alt?: string;
  caption?: string;
}

export interface TextImageCodeComponent {
  __component: 'media.text-image-code';
  id: number;
  text: string;
  image?: StrapiImage;
  alt?: string;
  code?: string;
  classification?: string;
}

export interface CodeEditorComponent {
  __component: 'media.code-editor';
  id: number;
  files?: CodeFile[];
  showLineNumbers?: boolean;
  showPreview?: boolean;
  description?: any;
  showRunButton?: boolean;
}

export interface ImageComponent {
  __component: 'media.image';
  id: number;
  image?: StrapiImage;
  alt?: string;
  caption?: string;
}

// ============================================================================
// Supporting Types
// ============================================================================

export interface MenuInfo {
  id: number;
  title?: string;
  course?: Course;
}

export interface Concept {
  id: number;
  name: string;
  description?: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
}

export interface CodeFile {
  id: number;
  filename: string;
  code: string;
  language?: string;
}

export interface MuxVideo {
  id: number;
  playbackId: string;
  assetId?: string;
  duration?: number;
}

export interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: Record<string, ImageFormat>;
  url: string;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}
