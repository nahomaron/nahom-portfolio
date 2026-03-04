export default {
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    {
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'string',
    },
    {
      name: 'authorization',
      title: 'Work Authorization',
      type: 'string',
    },
    {
      name: 'resumePdf',
      title: 'Resume PDF',
      type: 'file',
      options: {
        accept: '.pdf,application/pdf',
      },
      description: 'Upload the downloadable PDF version of the resume.',
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
    },
    {
      name: 'technicalSkills',
      title: 'Technical Skills',
      type: 'object',
      fields: [
        {
          name: 'languagesAndFrameworks',
          title: 'Languages & Frameworks',
          type: 'text',
          rows: 2,
        },
        {
          name: 'toolsAndQuality',
          title: 'Tools & Quality',
          type: 'text',
          rows: 2,
        },
        {
          name: 'cloudAndDatabases',
          title: 'Cloud & Databases',
          type: 'text',
          rows: 2,
        },
      ],
    },
    {
      name: 'workExperience',
      title: 'Work Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: 'Role',
              type: 'string',
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
            },
            {
              name: 'period',
              title: 'Period',
              type: 'string',
            },
            {
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'company',
            },
          },
        },
      ],
    },
    {
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'context',
              title: 'Context',
              type: 'string',
            },
            {
              name: 'period',
              title: 'Period',
              type: 'string',
            },
            {
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'techStack',
              title: 'Tech Stack',
              type: 'text',
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'period',
            },
          },
        },
      ],
    },
    {
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'degree',
              title: 'Degree',
              type: 'string',
            },
            {
              name: 'school',
              title: 'School',
              type: 'string',
            },
            {
              name: 'period',
              title: 'Period',
              type: 'string',
            },
            {
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: {
              title: 'degree',
              subtitle: 'school',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'title',
    },
  },
};
