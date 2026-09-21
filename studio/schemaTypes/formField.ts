import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'formField',
  title: 'Form field',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      description:
        'The name submitted with the form data. Lowercase, no spaces. For example "email".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Email', value: 'email'},
          {title: 'Long text', value: 'textarea'},
          {title: 'Select', value: 'select'},
          {title: 'Checkbox', value: 'checkbox'},
        ],
      },
      initialValue: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Options',
      description: 'The choices offered by a select field.',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({parent}) => parent?.type !== 'select',
    }),
    defineField({
      name: 'isRequired',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: 'label',
      type: 'type',
      isRequired: 'isRequired',
    },
    prepare(selection) {
      return {
        title: `${selection.label}${selection.isRequired ? ' *' : ''}`,
        subtitle: selection.type,
      }
    },
  },
})
