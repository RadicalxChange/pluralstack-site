import {defineField} from 'sanity'

export const SECTION_BASE_GROUPS = [
  {
    name: 'content',
    title: 'Content',
    default: true,
  },
  {
    name: 'styles',
    title: 'Styles',
  },
]

export const SECTION_BASE_FIELDS = [
  defineField({
    name: 'theme',
    title: 'Theme',
    description: 'The color theme of the section.',
    type: 'string',
    options: {
      list: [
        {title: 'Light', value: 'light'},
        {title: 'Dark', value: 'dark'},
        {title: 'Lemonade', value: 'lemonade'},
        {title: 'Cyberpunk', value: 'cyberpunk'},
        {title: 'Plural Theme', value: 'plural-theme'},
        {title: 'Paper Theme', value: 'paper-theme'},
        {title: 'Paper Theme (Yellow heading)', value: 'paper-theme-yellow'},
        {title: 'Paper Theme (Red heading)', value: 'paper-theme-red'},
        {title: 'Paper Theme (Blue heading)', value: 'paper-theme-blue'},
      ],
    },
    initialValue: 'light',
    group: 'styles',
  }),
  defineField({
    name: 'backgroundImage',
    title: 'Background Image',
    type: 'backgroundImage',
    group: 'styles',
  }),
  defineField({
    name: 'width',
    title: 'Width',
    description:
      'The width of the section. If set to "full" the section spans the full width of the screen, otherwise it is equally indented from both sides of the screen.',
    type: 'string',
    options: {
      list: [
        {title: 'Full', value: 'full'},
        {title: 'Inset', value: 'inset'},
      ],
    },
    initialValue: 'full',
    group: 'styles',
  }),
  defineField({
    name: 'headingLevel',
    title: 'Heading Level',
    description:
      "Overrides the HTML tag used for this section's main heading (Hero defaults to H1, every other section defaults to H2). Only change this if the page's heading structure needs it — e.g. promoting a section's heading to H1 on a page where no Hero is present. Each page should normally have exactly one H1.",
    type: 'string',
    options: {
      list: [
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
    },
    group: 'styles',
  }),
  defineField({
    name: 'dividerAfter',
    title: 'Divider after',
    description:
      "Adds the same hairline divider used between stacked sections, but along this section's own bottom edge. For a section that's the last one on the page, where there's no following section for the normal divider to attach to.",
    type: 'boolean',
    initialValue: false,
    group: 'styles',
  }),
]
