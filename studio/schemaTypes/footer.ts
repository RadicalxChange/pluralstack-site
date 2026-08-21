import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'object',
  icon: SquareIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Shown centred above the footer content. Leave empty to hide.',
      type: 'customImage',
      group: 'content',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
      of: [{type: 'actionButton'}, {type: 'actionLink'}],
      group: 'content',
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter',
      description: 'Community or newsletter sign-up. Leave empty to hide.',
      type: 'object',
      group: 'content',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'markdown',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'actionLink'}],
      group: 'content',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      description: 'Closing line, such as a copyright notice.',
      type: 'string',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare(selection) {
      return {
        title: selection.text || 'Footer',
      }
    },
  },
})
