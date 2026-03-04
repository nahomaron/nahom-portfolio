export default {
    name: 'works',
    title: 'Works',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule) => Rule.required().max(120),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'subtitle',
        title: 'Subtitle',
        type: 'string',
        validation: (Rule) => Rule.max(160),
      },
      {
        name: 'introduction',
        title: 'Introduction',
        type: 'text',
        rows: 3,
        validation: (Rule) => Rule.max(600),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 3,
        validation: (Rule) => Rule.required().max(600),
      },
      {
        name: 'projectLink',
        title: 'Project Link',
        type: 'url',
      },
      {
        name: 'codeLink',
        title: 'Code Link',
        type: 'url',
      },
      {
        name: 'coverImage',
        title: 'Cover Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule) =>
          Rule.custom((value, { parent }) => {
            if (value || parent?.imgUrl) {
              return true;
            }
            return 'Provide at least a cover image or a card image.';
          }),
      },
      {
        name: 'imgUrl',
        title: 'Card Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule) =>
          Rule.custom((value, { parent }) => {
            if (value || parent?.coverImage) {
              return true;
            }
            return 'Provide at least a card image or a cover image.';
          }),
      },
      {
        name: 'galleryImages',
        title: 'Photo Gallery',
        type: 'array',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true,
            },
          },
        ],
        description: 'Upload multiple photos that showcase different parts of the project.',
        options: {
          layout: 'grid',
        },
      },
      {
        name: 'videoUrl',
        title: 'Video URL',
        type: 'url',
        description: 'YouTube or other embeddable link for the demo video.',
      },
      {
        name: 'youtubeUrl',
        title: 'YouTube URL',
        type: 'url',
      },
      {
        name: 'video',
        title: 'Video Upload',
        type: 'file',
        options: {
          accept: 'video/*',
        },
      },
      {
        name: 'detailSections',
        title: 'Detail Sections',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'detailSection',
            fields: [
              {
                name: 'heading',
                title: 'Heading',
                type: 'string',
              },
              {
                name: 'body',
                title: 'Body',
                type: 'array',
                of: [{ type: 'block' }],
              },
            ],
            preview: {
              select: {
                title: 'heading',
              },
            },
          },
        ],
      },
      {
        name: 'details',
        title: 'Details',
        type: 'array',
        of: [{ type: 'block' }],
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [
          {
            name: 'tag',
            title: 'Tag',
            type: 'string',
          },
        ],
      },
    ],
  };
