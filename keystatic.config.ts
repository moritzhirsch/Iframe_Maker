// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },

  collections: {
    // Existing example collection
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),

    // Locations (one entry per popup)
    locations: collection({
      label: 'Bijloke',
      slugField: 'slug',
      path: 'content/bijloke/*',
      schema: {
        id: fields.text({ label: 'Internal ID' }),

        // Tip to editors: derive from Dutch title (lowercase, hyphens)
        slug: fields.slug({ name: { label: 'Slug (derive from Title NL)' } }),

        title: fields.object(
          {
            nl: fields.text({ label: 'Title (NL)' }),
            en: fields.text({ label: 'Title (EN)' }),
          },
          { label: 'Title' }
        ),

        heroImage: fields.image({
          label: 'Hero image',
          directory: 'public/images/bijloke/',
          publicPath: '/images/bijloke',
        }),

        overviewText: fields.object(
          {
            nl: fields.markdoc({ label: 'Overview (NL)' }),
            en: fields.markdoc({ label: 'Overview (EN)' }),
          },
          { label: 'Overview text' }
        ),

        // Optional historical section (single block)
        historicalTitle: fields.object(
          {
            nl: fields.text({ label: 'Historical title (NL)' }),
            en: fields.text({ label: 'Historical title (EN)' }),
          },
          { label: 'Historical section title (optional)' }
        ),

        historicalImage: fields.image({
          label: 'Historical image (optional)',
          directory: 'public/images/bijloke',
          publicPath: '/images/bijloke',
        }),

        historicalText: fields.object(
          {
            nl: fields.markdoc({ label: 'Historical text (NL)' }),
            en: fields.markdoc({ label: 'Historical text (EN)' }),
          },
          { label: 'Historical text (optional)' }
        ),

        // Optional “read more” links to external/POI pages
        historicalLink: fields.object(
          {
            nl: fields.text({ label: 'Historical link (NL URL)' }),
            en: fields.text({ label: 'Historical link (EN URL)' }),
          },
          { label: 'Historical link (optional)' }
        ),
      },
    }),
  },
});
