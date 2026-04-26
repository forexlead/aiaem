/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/merkle-cleanup.js';
import sectionsTransformer from './transformers/merkle-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'cards': cardsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'ai-expertise',
  urls: [
    'https://www.merkle.com/en/ai-expertise.html',
  ],
  description: 'AI expertise landing page with hero video, AI Innovation sections, case study cards, insights grid, partnerships, and leadership team',
  blocks: [
    {
      name: 'hero',
      instances: [
        '.cmp-teaser-layout-h.mer-smart-crop-video',
      ],
    },
    {
      name: 'columns',
      instances: [
        '#enter, #teaser-0c732d2bc9',
      ],
    },
    {
      name: 'cards',
      instances: [
        '#enterprise ~ .cmp-teaser-layout-h',
        '#customer ~ .cmp-teaser-layout-h',
        '#teasergallerylist-ded9a384c9',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.container.blue-background.full-bleed.bottom-spacer-m',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'AI Innovation Panels',
      selector: '.container.responsivegrid.blue-background.full-bleed:has(#enter)',
      style: 'navy',
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'AI for Enterprise',
      selector: '.cmp-teaser-layout-large.cmp-teaser-blue-black.content-center:has(.cmp-teaser__title)',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.cmp-teaser-layout-l:has(h2.cmp-teaser__title)'],
    },
    {
      id: 'section-4',
      name: 'AI for Customer Experience',
      selector: '.cmp-teaser-layout-large.grey-background.content-center',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.cmp-teaser-layout-l:has(h2.cmp-teaser__title)'],
    },
    {
      id: 'section-5',
      name: 'AI Essentials Insights',
      selector: '.cmp-teaser-layout-large.cmp-teaser-dark.content-center:has(h2)',
      style: 'dark',
      blocks: ['cards'],
      defaultContent: ['.cmp-teaser-layout-l h2', '.cmp-teaser__action-container'],
    },
    {
      id: 'section-6',
      name: 'Partnerships',
      selector: '.cmp-teaser-layout-large.cmp-teaser-dark.bottom-spacer-l',
      style: 'navy',
      blocks: [],
      defaultContent: ['.cmp-teaser-layout-l h2', '.cmp-teaser__description', '.cmp-teaser__action-container'],
    },
    {
      id: 'section-7',
      name: 'Leadership Team',
      selector: '.cmp-contentfragmentlist.bio-cf-list',
      style: 'dark',
      blocks: [],
      defaultContent: ['.cmp-teaser-layout-l h2', 'h3.cmp-contentfragment__title'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
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

    // 4. Execute afterTransform transformers
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
