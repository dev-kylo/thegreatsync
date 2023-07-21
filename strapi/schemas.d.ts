import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  TextAttribute,
  ComponentAttribute,
  UIDAttribute,
  DynamicZoneAttribute,
  SingleTypeSchema,
  DateAttribute,
  ComponentSchema,
  MediaAttribute,
  RichTextAttribute,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access']> &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    placeholder: TextAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    enrollments: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::enrollment.enrollment'
    >;
    orders: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::order.order'
    >;
    user_course_progresses: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::user-course-progress.user-course-progress'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginMuxVideoUploaderMuxAsset extends CollectionTypeSchema {
  info: {
    name: 'mux-asset';
    description: 'Represents a Mux Asset item, including upload and playback details';
    displayName: 'Mux Asset';
    singularName: 'mux-asset';
    pluralName: 'mux-assets';
  };
  options: {
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: true;
    };
  };
  attributes: {
    title: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
        maxLength: 255;
      }>;
    upload_id: StringAttribute &
      SetMinMaxLength<{
        maxLength: 255;
      }>;
    asset_id: StringAttribute &
      SetMinMaxLength<{
        maxLength: 255;
      }>;
    playback_id: StringAttribute &
      SetMinMaxLength<{
        maxLength: 255;
      }>;
    error_message: StringAttribute &
      SetMinMaxLength<{
        maxLength: 255;
      }>;
    isReady: BooleanAttribute & DefaultTo<false>;
    duration: DecimalAttribute;
    aspect_ratio: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::mux-video-uploader.mux-asset',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::mux-video-uploader.mux-asset',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiChapterChapter extends CollectionTypeSchema {
  info: {
    singularName: 'chapter';
    pluralName: 'chapters';
    displayName: 'Chapter';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute;
    menu: ComponentAttribute<'menu.menu-info'>;
    subchapters: RelationAttribute<
      'api::chapter.chapter',
      'oneToMany',
      'api::subchapter.subchapter'
    >;
    visible: BooleanAttribute & DefaultTo<true>;
    courses: RelationAttribute<
      'api::chapter.chapter',
      'manyToMany',
      'api::course.course'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::chapter.chapter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::chapter.chapter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiCourseCourse extends CollectionTypeSchema {
  info: {
    singularName: 'course';
    pluralName: 'courses';
    displayName: 'Course';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    uid: UIDAttribute & RequiredAttribute;
    title: StringAttribute & RequiredAttribute;
    chapters: RelationAttribute<
      'api::course.course',
      'manyToMany',
      'api::chapter.chapter'
    >;
    description: DynamicZoneAttribute<['media.text', 'media.video']> &
      RequiredAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::course.course',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiCustomerCustomer extends SingleTypeSchema {
  info: {
    singularName: 'customer';
    pluralName: 'customers';
    displayName: 'customer';
  };
  options: {
    draftAndPublish: true;
    comment: '';
  };
  attributes: {
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiEnrollmentEnrollment extends CollectionTypeSchema {
  info: {
    singularName: 'enrollment';
    pluralName: 'enrollments';
    displayName: 'Enrollment';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    date: DateAttribute & RequiredAttribute;
    user: RelationAttribute<
      'api::enrollment.enrollment',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    course: RelationAttribute<
      'api::enrollment.enrollment',
      'oneToOne',
      'api::course.course'
    >;
    price: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::enrollment.enrollment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::enrollment.enrollment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiMenuMenu extends SingleTypeSchema {
  info: {
    singularName: 'menu';
    pluralName: 'menus';
    displayName: 'Menu';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    uid: UIDAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::menu.menu', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::menu.menu', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiOrderOrder extends CollectionTypeSchema {
  info: {
    singularName: 'order';
    pluralName: 'orders';
    displayName: 'Order';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    email: EmailAttribute & RequiredAttribute;
    country: StringAttribute;
    coupon: StringAttribute;
    currency: StringAttribute;
    custom_data: JSONAttribute;
    customer_name: StringAttribute & RequiredAttribute;
    account_credited: StringAttribute;
    fee: StringAttribute;
    event_time: StringAttribute;
    marketing_consent: BooleanAttribute & RequiredAttribute;
    order_id: StringAttribute & RequiredAttribute & UniqueAttribute;
    tax: StringAttribute;
    sale_gross: StringAttribute;
    user: RelationAttribute<
      'api::order.order',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    release_date: DateAttribute;
    release_course_id: StringAttribute;
    release_price: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiPagePage extends CollectionTypeSchema {
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute & RequiredAttribute;
    type: EnumerationAttribute<
      ['text_image_code', 'text_image', 'text_code', 'video', 'text']
    > &
      RequiredAttribute;
    content: DynamicZoneAttribute<
      [
        'media.text',
        'media.text-image',
        'media.text-image-code',
        'media.video',
        'media.text-code'
      ]
    > &
      RequiredAttribute;
    menu: ComponentAttribute<'menu.menu-info'>;
    visible: BooleanAttribute & DefaultTo<true>;
    links: ComponentAttribute<'media.link', true>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::page.page', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::page.page', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiSubchapterSubchapter extends CollectionTypeSchema {
  info: {
    singularName: 'subchapter';
    pluralName: 'subchapters';
    displayName: 'SubChapter';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute & RequiredAttribute;
    pages: RelationAttribute<
      'api::subchapter.subchapter',
      'oneToMany',
      'api::page.page'
    >;
    menu: ComponentAttribute<'menu.menu-info'> & RequiredAttribute;
    visible: BooleanAttribute & DefaultTo<true>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::subchapter.subchapter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::subchapter.subchapter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiUserCourseProgressUserCourseProgress
  extends CollectionTypeSchema {
  info: {
    singularName: 'user-course-progress';
    pluralName: 'user-course-progresses';
    displayName: 'UserCourseProgress';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    user: RelationAttribute<
      'api::user-course-progress.user-course-progress',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    course: RelationAttribute<
      'api::user-course-progress.user-course-progress',
      'oneToOne',
      'api::course.course'
    >;
    chapters: JSONAttribute;
    subchapters: JSONAttribute;
    pages: JSONAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::user-course-progress.user-course-progress',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::user-course-progress.user-course-progress',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface MediaLink extends ComponentSchema {
  info: {
    displayName: 'link';
    icon: 'link';
    description: '';
  };
  attributes: {
    file: MediaAttribute;
    type: EnumerationAttribute<['download', 'link']> & RequiredAttribute;
    external_url: StringAttribute;
    title: StringAttribute & RequiredAttribute;
    subtitle: StringAttribute;
  };
}

export interface MediaTextCode extends ComponentSchema {
  info: {
    displayName: 'text_code';
    icon: 'columns';
    description: '';
  };
  attributes: {
    text: RichTextAttribute & RequiredAttribute;
    code: RichTextAttribute & RequiredAttribute;
  };
}

export interface MediaTextImageCode extends ComponentSchema {
  info: {
    displayName: 'text_image_code';
    icon: 'broom';
    description: '';
  };
  attributes: {
    text: RichTextAttribute & RequiredAttribute;
    image_alt: TextAttribute & RequiredAttribute;
    image: MediaAttribute & RequiredAttribute;
    code: RichTextAttribute & RequiredAttribute;
    transparent_image: BooleanAttribute;
  };
}

export interface MediaTextImage extends ComponentSchema {
  info: {
    displayName: 'text_image';
    icon: 'photo-video';
    description: '';
  };
  attributes: {
    text: RichTextAttribute & RequiredAttribute;
    image: MediaAttribute & RequiredAttribute;
    image_alt: TextAttribute & RequiredAttribute;
    transparent_image: BooleanAttribute;
  };
}

export interface MediaText extends ComponentSchema {
  info: {
    displayName: 'text';
    icon: 'pencil-alt';
    description: '';
  };
  attributes: {
    text: RichTextAttribute & RequiredAttribute;
  };
}

export interface MediaVideo extends ComponentSchema {
  info: {
    displayName: 'video';
    icon: 'video';
    description: '';
  };
  attributes: {
    video: RelationAttribute<
      'media.video',
      'oneToOne',
      'plugin::mux-video-uploader.mux-asset'
    >;
  };
}

export interface MenuMenuInfo extends ComponentSchema {
  info: {
    displayName: 'menu_data';
    icon: 'bars';
    description: '';
  };
  attributes: {
    icon: EnumerationAttribute<
      ['code', 'read', 'watch', 'discover', 'imagine', 'share', 'draw']
    >;
    orderNumber: IntegerAttribute & RequiredAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::mux-video-uploader.mux-asset': PluginMuxVideoUploaderMuxAsset;
      'api::chapter.chapter': ApiChapterChapter;
      'api::course.course': ApiCourseCourse;
      'api::customer.customer': ApiCustomerCustomer;
      'api::enrollment.enrollment': ApiEnrollmentEnrollment;
      'api::menu.menu': ApiMenuMenu;
      'api::order.order': ApiOrderOrder;
      'api::page.page': ApiPagePage;
      'api::subchapter.subchapter': ApiSubchapterSubchapter;
      'api::user-course-progress.user-course-progress': ApiUserCourseProgressUserCourseProgress;
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
