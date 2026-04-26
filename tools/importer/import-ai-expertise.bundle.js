var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-ai-expertise.js
  var import_ai_expertise_exports = {};
  __export(import_ai_expertise_exports, {
    default: () => import_ai_expertise_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const cells = [];
    const img = element.querySelector(".cmp-teaser__image img, .cmp-teaser-hero-carousel-area img, picture img");
    const heading = element.querySelector(".cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description");
    const cta = element.querySelector(".cmp-teaser__action-link");
    const imageCell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageCell.appendChild(newImg);
    }
    const contentCell = document.createElement("div");
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.appendChild(h1);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }
    if (cta) {
      const a = document.createElement("a");
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(a);
      contentCell.appendChild(p);
    }
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const cells = [];
    const img = element.querySelector(".cmp-image__image, img");
    const heading = element.querySelector("h6, h5, h4");
    const description = element.querySelector(".cmp-text p, p");
    const cell = document.createElement("div");
    if (img) {
      const newImg = document.createElement("img");
      let imgSrc = img.src;
      if (imgSrc.includes("%7B.width%7D") || imgSrc.includes("{.width}")) {
        const [base] = imgSrc.split("?");
        imgSrc = `${base}?wid=400&fmt=png-alpha`;
      }
      newImg.src = imgSrc;
      newImg.alt = img.alt || "";
      cell.appendChild(newImg);
    }
    if (heading) {
      const h = document.createElement("h6");
      h.textContent = heading.textContent.trim();
      cell.appendChild(h);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      cell.appendChild(p);
    }
    cells.push([cell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-list__item");
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image__image, img");
      const category = item.querySelector(".cmp-teaser__pretitle");
      const heading = item.querySelector(".cmp-teaser__title");
      const link = item.querySelector(".mer-clickabkle-wrapper, a[href]");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
      }
      const contentCell = document.createElement("div");
      if (category) {
        const p = document.createElement("p");
        p.textContent = category.textContent.trim();
        contentCell.appendChild(p);
      }
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.appendChild(h3);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = "Learn more";
        const p = document.createElement("p");
        p.appendChild(a);
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/merkle-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".screenreader-header",
        ".visually-hidden",
        "h1.visually-hidden"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".s7playpausebutton",
        ".s7videoscrubber",
        ".s7closedcaptionbutton",
        ".s7mutablevolume",
        ".s7fullscreenbutton",
        ".s7socialshare",
        ".s7emaildialog",
        ".s7embeddialog",
        ".s7linkdialog",
        ".s7videoplayer",
        '[class*="s7sdk"]'
      ]);
      element.querySelectorAll('img[src*="scene7.com/is/content"]').forEach((img) => {
        const p = img.closest("p") || img.parentElement;
        if (p && p.tagName === "P") p.remove();
        else img.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (/^\d+:\d{2}(\s*\/\s*\d+:\d{2})?$/.test(text)) p.remove();
        if (text === "AUDIO" || text === "CancelSend Email" || text === "CancelSelect All") p.remove();
        if (text.startsWith("Wrong email address")) p.remove();
        if (text.startsWith("To get embed code")) p.remove();
        if (text.startsWith("To share this link")) p.remove();
        if (text === "Email Link" || text === "Get Embed Code" || text === "Share Link") p.remove();
      });
      element.querySelectorAll("ul").forEach((ul) => {
        if (ul.textContent.trim() === "[Original]") ul.remove();
      });
      element.querySelectorAll("p").forEach((p) => {
        const links = p.querySelectorAll("a");
        if (links.length >= 2) {
          const allResolution = [...links].every((a) => /^\d+x\d+$/.test(a.textContent.trim()) || a.textContent.trim() === "Custom Size");
          if (allResolution) p.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        ".cmp-experiencefragment--header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.experiencefragment",
        ".cmp-experiencefragment--footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".mer-header-space"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link"
      ]);
      const sources = element.querySelectorAll("source:not([src])");
      sources.forEach((source) => source.remove());
    }
  }

  // tools/importer/transformers/merkle-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = element.ownerDocument || document;
    const sections = [...template.sections].reverse();
    sections.forEach((section, reverseIndex) => {
      const isFirst = reverseIndex === sections.length - 1;
      let sectionEl = null;
      if (Array.isArray(section.selector)) {
        for (const sel of section.selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(section.selector);
      }
      if (!sectionEl) return;
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        let insertPoint = sectionEl;
        while (insertPoint.parentElement && insertPoint.parentElement !== element) {
          insertPoint = insertPoint.parentElement;
        }
        if (insertPoint.nextSibling) {
          insertPoint.parentElement.insertBefore(sectionMetadata, insertPoint.nextSibling);
        } else {
          insertPoint.parentElement.appendChild(sectionMetadata);
        }
      }
      if (!isFirst) {
        let breakPoint = sectionEl;
        while (breakPoint.parentElement && breakPoint.parentElement !== element) {
          breakPoint = breakPoint.parentElement;
        }
        if (breakPoint.previousSibling) {
          const hr = doc.createElement("hr");
          breakPoint.parentElement.insertBefore(hr, breakPoint);
        }
      }
    });
  }

  // tools/importer/import-ai-expertise.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "cards": parse3
  };
  var PAGE_TEMPLATE = {
    name: "ai-expertise",
    urls: [
      "https://www.merkle.com/en/ai-expertise.html"
    ],
    description: "AI expertise landing page with hero video, AI Innovation sections, case study cards, insights grid, partnerships, and leadership team",
    blocks: [
      {
        name: "hero",
        instances: [
          ".cmp-teaser-layout-h.mer-smart-crop-video"
        ]
      },
      {
        name: "columns",
        instances: [
          "#enter, #teaser-0c732d2bc9"
        ]
      },
      {
        name: "cards",
        instances: [
          "#enterprise ~ .cmp-teaser-layout-h",
          "#customer ~ .cmp-teaser-layout-h",
          "#teasergallerylist-ded9a384c9"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".container.blue-background.full-bleed.bottom-spacer-m",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "AI Innovation Panels",
        selector: ".container.responsivegrid.blue-background.full-bleed:has(#enter)",
        style: "navy",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "AI for Enterprise",
        selector: ".cmp-teaser-layout-large.cmp-teaser-blue-black.content-center:has(.cmp-teaser__title)",
        style: null,
        blocks: ["cards"],
        defaultContent: [".cmp-teaser-layout-l:has(h2.cmp-teaser__title)"]
      },
      {
        id: "section-4",
        name: "AI for Customer Experience",
        selector: ".cmp-teaser-layout-large.grey-background.content-center",
        style: null,
        blocks: ["cards"],
        defaultContent: [".cmp-teaser-layout-l:has(h2.cmp-teaser__title)"]
      },
      {
        id: "section-5",
        name: "AI Essentials Insights",
        selector: ".cmp-teaser-layout-large.cmp-teaser-dark.content-center:has(h2)",
        style: "dark",
        blocks: ["cards"],
        defaultContent: [".cmp-teaser-layout-l h2", ".cmp-teaser__action-container"]
      },
      {
        id: "section-6",
        name: "Partnerships",
        selector: ".cmp-teaser-layout-large.cmp-teaser-dark.bottom-spacer-l",
        style: "navy",
        blocks: [],
        defaultContent: [".cmp-teaser-layout-l h2", ".cmp-teaser__description", ".cmp-teaser__action-container"]
      },
      {
        id: "section-7",
        name: "Leadership Team",
        selector: ".cmp-contentfragmentlist.bio-cf-list",
        style: "dark",
        blocks: [],
        defaultContent: [".cmp-teaser-layout-l h2", "h3.cmp-contentfragment__title"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_ai_expertise_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_ai_expertise_exports);
})();
