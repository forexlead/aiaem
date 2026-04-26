/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import embedParser from './parsers/embed.js';

// TRANSFORMER IMPORTS
import merkleCleanupTransformer from './transformers/merkle-cleanup.js';
import merkleSectionsTransformer from './transformers/merkle-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel': carouselParser,
  'cards': cardsParser,
  'columns': columnsParser,
  'embed': embedParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Merkle homepage - rich marketing page with hero carousel, featured content cards, icon feature grid, video, case study carousel, and CTAs',
  urls: [
    'https://www.merkle.com/en/home.html',
  ],
  blocks: [
    {
      name: 'carousel',
      instances: ['.teasercarousel.carousel .cmp-carousel'],
    },
    {
      name: 'cards',
      instances: ['.teasergallerylist.mer-featured-tgl'],
    },
    {
      name: 'columns',
      instances: ['.container.responsivegrid.text-left'],
    },
    {
      name: 'embed',
      instances: ['.video.centered'],
    },
    {
      name: 'carousel',
      instances: ['.listcards.teasergallerylist'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.teasercarousel.carousel',
      style: 'dark',
      blocks: ['carousel'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Content',
      selector: '#container-34049edaf9',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: [
        '.cmp-teaser-layout-large.content-center h2',
        '.cmp-teaser-layout-large.content-center .cmp-teaser__description',
        '.cmp-teaser-layout-large.content-center hr',
      ],
    },
    {
      id: 'section-3',
      name: 'Capabilities and Work',
      selector: '#container-1db8cd56b8',
      style: 'dark',
      blocks: ['columns', 'embed', 'carousel'],
      defaultContent: [
        '.cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-s h2',
        '.cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-s .cmp-teaser__description',
        '.cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m h2',
        '.cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m .cmp-teaser__description',
        '.cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m .cmp-teaser__action-container',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  merkleCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [merkleSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
