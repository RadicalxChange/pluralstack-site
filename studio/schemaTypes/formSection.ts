import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons/Square'
import {SECTION_BASE_FIELDS, SECTION_BASE_GROUPS} from './sectionBase'

export default defineType({
  name: 'formSection',
  title: 'Form',
  description:
    'A form, submitted to Netlify Forms once "Form backend is connected" is on and "Netlify form name" is set. Until then it renders disabled with a notice.',
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
      name: 'formName',
      title: 'Netlify form name',
      description:
        "Identifies this form to Netlify — must be unique across the whole site (two forms sharing a name merge into one in Netlify's dashboard). Netlify's build bot only discovers a form by scanning the built static HTML for this name, so it must be set (and the site redeployed) before \"Form backend is connected\" can do anything. Once submissions exist under a name, changing it starts a new form in Netlify and orphans the old submissions — treat it as fixed after go-live.",
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'isConnected',
      title: 'Form backend is connected',
      description:
        'Turns on real submission via Netlify Forms (see "Netlify form name" below) — requires that field to be set. Leave off until then: the form renders disabled with a notice, so nobody thinks a submission was received.',
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
