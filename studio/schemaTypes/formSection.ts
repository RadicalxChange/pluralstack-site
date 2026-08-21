import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'formSection',
  title: 'Form',
  description:
    'A form. The fields below describe the form, but nothing is submitted anywhere until a form backend is chosen and wired up.',
  type: 'object',
  icon: SquareIcon,
  groups: SECTION_BASE_GROUPS,
  fields: [
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
      name: 'fields',
      title: 'Fields',
      type: 'array',
      of: [{type: 'formField'}],
      group: 'content',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Submit',
      group: 'content',
    }),
    defineField({
      name: 'isConnected',
      title: 'Form backend is connected',
      description:
        'Leave off until a form backend is chosen and wired up. While off, the form renders disabled with a notice, so nobody thinks a submission was received.',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'notConnectedNotice',
      title: 'Not-connected notice',
      description: 'Shown in place of a working submit button while the backend is not connected.',
      type: 'string',
      initialValue: 'This form is not connected yet.',
      group: 'content',
      hidden: ({parent}) => parent?.isConnected === true,
    }),
    ...SECTION_BASE_FIELDS,
  ],
  preview: {
    select: {
      heading: 'heading',
      isConnected: 'isConnected',
    },
    prepare(selection) {
      return {
        title: `${selection.heading || 'Form'}`,
        subtitle: selection.isConnected ? 'Form' : 'Form — not connected',
      }
    },
  },
})
