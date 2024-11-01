import type { Schema, Attribute } from '@strapi/strapi';

export interface MediaCodeEditor extends Schema.Component {
  collectionName: 'components_media_code_editors';
  info: {
    displayName: 'Code_editor';
    icon: 'layout';
    description: '';
  };
  attributes: {
    file: Attribute.Component<'media.code-file', true>;
    showLineNumbers: Attribute.Boolean;
    showPreview: Attribute.Boolean;
  };
}

export interface MediaCodeFile extends Schema.Component {
  collectionName: 'components_media_code_files';
  info: {
    displayName: 'CodeFile';
    icon: 'folder';
  };
  attributes: {
    fileExtension: Attribute.Enumeration<
      ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.scss']
    >;
    code: Attribute.RichText & Attribute.Required;
  };
}

export interface MediaImage extends Schema.Component {
  collectionName: 'components_media_images';
  info: {
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    image_alt: Attribute.String;
  };
}

export interface MediaLink extends Schema.Component {
  collectionName: 'components_media_links';
  info: {
    displayName: 'link';
    icon: 'link';
    description: '';
  };
  attributes: {
    file: Attribute.Media<'images' | 'files'>;
    type: Attribute.Enumeration<['download', 'link']> & Attribute.Required;
    external_url: Attribute.String;
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
  };
}

export interface MediaTextCode extends Schema.Component {
  collectionName: 'components_media_text_codes';
  info: {
    displayName: 'text_code';
    icon: 'columns';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
    code: Attribute.RichText & Attribute.Required;
  };
}

export interface MediaTextImageCode extends Schema.Component {
  collectionName: 'components_media_text_image_codes';
  info: {
    displayName: 'text_image_code';
    icon: 'broom';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
    image_alt: Attribute.Text & Attribute.Required;
    image: Attribute.Media<'images'> & Attribute.Required;
    code: Attribute.RichText & Attribute.Required;
    transparent_image: Attribute.Boolean;
  };
}

export interface MediaTextImage extends Schema.Component {
  collectionName: 'components_media_text_images';
  info: {
    displayName: 'text_image';
    icon: 'photo-video';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Attribute.Required;
    image_alt: Attribute.Text & Attribute.Required;
    transparent_image: Attribute.Boolean;
  };
}

export interface MediaText extends Schema.Component {
  collectionName: 'components_media_texts';
  info: {
    displayName: 'text';
    icon: 'pencil-alt';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
  };
}

export interface MediaVideo extends Schema.Component {
  collectionName: 'components_media_videos';
  info: {
    displayName: 'video';
    icon: 'video';
    description: '';
  };
  attributes: {
    video: Attribute.Relation<
      'media.video',
      'oneToOne',
      'plugin::mux-video-uploader.mux-asset'
    >;
  };
}

export interface MenuMenuInfo extends Schema.Component {
  collectionName: 'components_menu_menu_infos';
  info: {
    displayName: 'menu_data';
    icon: 'bars';
    description: '';
  };
  attributes: {
    icon: Attribute.Enumeration<
      ['code', 'read', 'watch', 'discover', 'imagine', 'share', 'draw']
    >;
    orderNumber: Attribute.Integer & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'media.code-editor': MediaCodeEditor;
      'media.code-file': MediaCodeFile;
      'media.image': MediaImage;
      'media.link': MediaLink;
      'media.text-code': MediaTextCode;
      'media.text-image-code': MediaTextImageCode;
      'media.text-image': MediaTextImage;
      'media.text': MediaText;
      'media.video': MediaVideo;
      'menu.menu-info': MenuMenuInfo;
    }
  }
}
