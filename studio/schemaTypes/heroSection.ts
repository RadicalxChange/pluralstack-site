import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Press Enter for a manual line break where the heading should wrap.',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      description: 'Subtitle shown directly below the heading.',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
      group: 'content',
    }),
    defineField({
      name: 'cta',
      title: 'Call-to-action',
      type: 'array',
      of: [{type: 'actionButton'}, {type: 'actionLink'}],
      group: 'content',
    }),
    defineField({
      name: 'outro',
      title: 'Outro',
      description: 'Small print shown below the call-to-action.',
      type: 'markdown',
      group: 'content',
    }),
    defineField({
      name: 'sketch',
      title: 'Grid sketch',
      description:
        'Renders an interactive p5 grid sketch as a full-bleed, transparent backdrop behind the text, with square size reacting to how close the mouse is to a CTA. Leave unset for no sketch.',
      type: 'string',
      options: {
        list: [
          {title: 'Squares', value: 'squares'},
          {title: 'Mark', value: 'mark'},
        ],
      },
      group: 'styles',
    }),
    ...SECTION_BASE_FIELDS,
  ],
  preview: {
    select: {
      heading: 'heading',
      body: 'body',
    },
    prepare(selection) {
      return {
        title: `${selection.heading || selection.body || ''}`,
        subtitle: 'Hero',
      }
    },
  },
})
