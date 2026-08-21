export interface Action {
    _type?: string;
    label: string;
    url?: string;
    ariaLabel?: string;
}

export interface ActionButton extends Action {
    theme?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface ActionLink extends Action {}

export interface BackgroundImage {
    image?: CustomImage;
    opacity?: number;
}

export interface Badge {
    label: string;
    theme?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface Card {
    badge?: Badge;
    heading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
    image?: CustomImage;
    theme?: 'light' | 'dark' | 'transparent' | 'primary' | 'secondary';
    textAlign?: 'left' | 'center';
    hasBorder?: boolean;
}

export interface CardsSection extends Section {
    eyebrow?: string;
    heading?: string;
    body?: string;
    items?: Array<Card>;
    columns?: 'one' | 'two' | 'three';
    outro?: string;
    cta?: Array<ActionButton | ActionLink>;
    /** Renders every item's heading as an h4 reserving two lines of height, so cards with
     * a one-line and a two-line heading still line up — for grids of many short, similarly
     * shaped tiles (e.g. a row of organisation names) rather than general card content. */
    compactTiles?: boolean;
}

export interface Company {
    _id: string;
    name: string;
    logo?: CustomImage;
}

export interface CustomImage {
    _id?: string;
    src: string;
    alt?: string;
    dimensions?: { height: number; width: number };
}

export interface CtaSection extends Section {
    eyebrow?: string;
    heading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
}

export interface DomainSection extends Section {
    heading?: string;
    eyebrow?: string;
    body?: string;
    examples?: Array<string>;
}

export interface Footer {
    logo?: CustomImage;
    navLinks?: Array<ActionButton | ActionLink>;
    newsletter?: Newsletter;
    socialLinks?: Array<ActionLink>;
    text?: string;
}

export interface FormField {
    label: string;
    name: string;
    type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
    options?: Array<string>;
    isRequired?: boolean;
}

export interface FormSection extends Section {
    heading?: string;
    body?: string;
    fields?: Array<FormField>;
    submitLabel?: string;
    isConnected?: boolean;
    notConnectedNotice?: string;
}

export interface Newsletter {
    heading?: string;
    body?: string;
}

export interface Header {
    title?: string;
    logo?: CustomImage;
    navLinks?: Array<ActionButton | ActionLink>;
}

export interface HeroSection extends Section {
    heading?: string;
    subheading?: string;
    body?: string;
    cta?: Array<ActionButton | ActionLink>;
    outro?: string;
    /** Which p5 grid sketch variant (if any) to render as a full-bleed, transparent backdrop
     * behind the text — 'squares' is gridSketch.js, 'mark' is gridSketchMark.js. Square size
     * reacts to mouse proximity to a CTA on the page (see ctaProximity.js). Unset renders none. */
    sketch?: 'squares' | 'mark';
}

export interface LogosSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<CustomImage>;
    motion?: 'static' | 'moveToLeft' | 'moveToRight';
}

export interface Page {
    _id: string;
    slug: Slug;
    title: string;
    sections: Array<CardsSection | CtaSection | DomainSection | FormSection | HeroSection | LogosSection | TestimonialsSection>;
    metaTitle?: string;
    addTitleSuffix?: boolean;
    metaDescription?: string;
    socialImage?: CustomImage;
}

export interface Person {
    _id: string;
    name: string;
    title?: string;
    image?: CustomImage;
    company?: Company;
}

export interface Section {
    _type?: string;
    theme?: 'light' | 'dark' | 'lemonade' | 'cyberpunk';
    backgroundImage?: BackgroundImage;
    width?: 'full' | 'inset';
    /** Adds the same hairline divider used between stacked sections, but along this
     * section's own bottom edge — for a section that's the last one on the page, where
     * there's no following <section> for the normal section+section divider to attach to. */
    dividerAfter?: boolean;
}

export interface SiteConfig {
    _id?: string;
    favicon?: CustomImage;
    header?: Header;
    footer?: Footer;
    titleSuffix?: string;
}

export interface Slug {
    current: string;
}

export interface Testimonial {
    quote?: string;
    author?: Person;
    theme?: 'light' | 'dark' | 'transparent';
    hasBorder?: boolean;
}

export interface TestimonialsSection extends Section {
    heading?: string;
    body?: string;
    items?: Array<Testimonial>;
    columns?: 'one' | 'two';
}
