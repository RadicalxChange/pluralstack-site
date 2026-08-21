import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'cardsSection',
  title: 'Cards',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small label shown above the heading. For example "Part 1 — Why Now".',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
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
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'card'}],
      group: 'content',
    }),
    defineField({
      name: 'outro',
      title: 'Outro',
      description: 'Closing copy shown below the items.',
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
    ...SECTION_BASE_FIELDS,
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      options: {
        list: [
          {title: '1', value: 'one'},
          {title: '2', value: 'two'},
          {title: '3', value: 'three'},
        ],
      },
      initialValue: 'three',
      group: 'styles',
    }),
    defineField({
      name: 'compactTiles',
      title: 'Compact tiles',
      description:
        'Renders each item\'s heading as an h4 reserving two lines of height, so a one-line and a two-line heading still line up. For a grid of many short, similarly shaped tiles (e.g. a row of organisation names) rather than general card content.',
      type: 'boolean',
      initialValue: false,
      group: 'styles',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      body: 'body',
    },
    prepare(selection) {
      return {
        title: `${selection.heading || selection.body || ''}`,
        subtitle: 'Cards',
      }
    },
  },
})
