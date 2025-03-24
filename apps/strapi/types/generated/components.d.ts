import type { Schema, Attribute } from '@strapi/strapi';

export interface ImagimodelLayer extends Schema.Component {
  collectionName: 'components_imagimodel_layers';
  info: {
    displayName: 'Layer';
    icon: 'landscape';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    zIndex: Attribute.Integer;
    position: Attribute.Component<'imagimodel.position'>;
    image: Attribute.Component<'media.image'>;
    enabled: Attribute.Boolean & Attribute.DefaultTo<true>;
    summaries: Attribute.Relation<
      'imagimodel.layer',
      'oneToMany',
      'api::summary.summary'
    >;
    description: Attribute.RichText;
  };
}

export interface ImagimodelPosition extends Schema.Component {
  collectionName: 'components_imagimodel_positions';
  info: {
    displayName: 'Position';
    icon: 'pinMap';
  };
  attributes: {
    x: Attribute.Integer;
    y: Attribute.Integer;
    width: Attribute.Integer;
    height: Attribute.Integer;
  };
}

export interface ImagimodelZone extends Schema.Component {
  collectionName: 'components_imagimodel_zones';
  info: {
    displayName: 'Zone';
    icon: 'expand';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    centerPosition: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 100;
        },
        number
      >;
    zoom: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 5;
        },
        number
      >;
    focusPoint: Attribute.Enumeration<
      [
        'center',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ]
    >;
  };
}

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
    descriptionType: Attribute.Enumeration<['explanation', 'answer', 'note']> &
      Attribute.DefaultTo<'note'>;
    description: Attribute.Component<'media.text'>;
    wrapContent: Attribute.Boolean;
    hideRunButtons: Attribute.Boolean;
  };
}

export interface MediaCodeFile extends Schema.Component {
  collectionName: 'components_media_code_files';
  info: {
    displayName: 'CodeFile';
    icon: 'folder';
    description: '';
  };
  attributes: {
    fileExtension: Attribute.Enumeration<
      ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.scss', '.txt', '.md']
    > &
      Attribute.DefaultTo<'.js'>;
    code: Attribute.RichText & Attribute.Required;
    fileName: Attribute.String & Attribute.DefaultTo<'index'>;
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
      [
        'code',
        'read',
        'watch',
        'discover',
        'imagine',
        'share',
        'draw',
        'reflect',
        'peg'
      ]
    >;
    orderNumber: Attribute.Integer & Attribute.Required;
    course: Attribute.Relation<
      'menu.menu-info',
      'oneToOne',
      'api::course.course'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'imagimodel.layer': ImagimodelLayer;
      'imagimodel.position': ImagimodelPosition;
      'imagimodel.zone': ImagimodelZone;
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
