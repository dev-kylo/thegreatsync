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
    description: '';
  };
  attributes: {
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    image_alt: Attribute.String;
    caption: Attribute.Text;
    image_classification: Attribute.Component<
      'metadata.image-classification',
      true
    >;
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
    image_caption: Attribute.Text;
    image_classification: Attribute.Component<
      'metadata.image-classification',
      true
    >;
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
    image: Attribute.Media<'images' | 'files'> & Attribute.Required;
    image_alt: Attribute.Text & Attribute.Required;
    image_caption: Attribute.Text;
    image_classification: Attribute.Component<
      'metadata.image-classification',
      true
    >;
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

export interface MetadataConcept extends Schema.Component {
  collectionName: 'components_metadata_concepts';
  info: {
    displayName: 'Concept';
    icon: 'crown';
  };
  attributes: {
    concept: Attribute.Enumeration<
      [
        'function-declaration  ',
        'function-execution  ',
        'function-return  ',
        'function-expression  ',
        'function-iife  ',
        'function-constructor  ',
        'function-pure  ',
        'function-container  ',
        'function-callback  ',
        'function-controller  ',
        'execution-context  ',
        'execution-stack  ',
        'execution-hoisting  ',
        'control-conditionals  ',
        'control-loops  ',
        'control-try-catch  ',
        'control-error-handling  ',
        'scope  ',
        'scope-global  ',
        'scope-lexical  ',
        'scope-block  ',
        'scope-function  ',
        'scope-temporal-dead-zone  ',
        'expression  ',
        'operator-coercion  ',
        'operator-assignment  ',
        'operator-return  ',
        'operator-dot-notation  ',
        'operator-square-bracket  ',
        'operator-getters-setters  ',
        'this-pointer',
        'object  ',
        'object-instance  ',
        'object-global  ',
        'object-property  ',
        'object-cloning  ',
        'object-inheritance  ',
        'object-prototype  ',
        'object-class  ',
        'object-array  ',
        'object-array-like  ',
        'object-array-index  ',
        'object-array-methods  ',
        'primitive  ',
        'primitive-string  ',
        'primitive-number  ',
        'primitive-boolean  ',
        'primitive-null  ',
        'primitive-undefined  ',
        'reference-value  ',
        'reference-shared  ',
        'memory-pointer  ',
        'memory-stack  ',
        'memory-heap  ',
        'memory-pass-by-reference  ',
        'memory-pass-by-value  ',
        'memory-garbage-collection  ',
        'async-promises  ',
        'async-async-await  ',
        'async-promise-chain  ',
        'async-chaining-promises  ',
        'async-event-loop  ',
        'async-synchronous  ',
        'async-asynchronous  ',
        'event  ',
        'event-listener  ',
        'event-dom  ',
        'event-dom-api  ',
        'variable  ',
        'variable-assignment  ',
        'variable-temporal-dead-zone  ',
        'dom  ',
        'dom-api  ',
        'dom-manipulation'
      ]
    >;
  };
}

export interface MetadataImageClassification extends Schema.Component {
  collectionName: 'components_metadata_image_classifications';
  info: {
    displayName: 'Classification';
    icon: 'brush';
    description: '';
  };
  attributes: {
    actor: Attribute.Enumeration<
      [
        'engine',
        'genie',
        'genie-crewmember',
        'genie-argonaut',
        'loo',
        'ship-captain',
        'ship',
        'promise-ship',
        'submarine-ship',
        'array-like-submarine-ship',
        'argonaut-ship',
        'function-ship',
        'container-ship',
        'pure-ship',
        'global-ship',
        'document-root-ship',
        'constructor-function-ship',
        'alien-queue-ship',
        'function-invoker',
        'surgeon-operator',
        'rainy-island',
        'desert-island',
        'volcano-island',
        'ice-island',
        'boolean-island',
        'reference-island-with-telescope',
        'statesman',
        'statesman-declaration',
        'statesman-evil-return-statesman',
        'wormhole-expression',
        'wormhole-invocation',
        'turtle',
        'executioner-got-hex',
        'glob',
        'scientist-observer',
        'scope-house',
        'block',
        'levitating-lexical-orb',
        'execution-isle',
        'waterfall',
        'whirlpool-the-great-sync'
      ]
    >;
    action: Attribute.Text;
    concepts: Attribute.Component<'metadata.concept', true>;
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
      'metadata.concept': MetadataConcept;
      'metadata.image-classification': MetadataImageClassification;
    }
  }
}
