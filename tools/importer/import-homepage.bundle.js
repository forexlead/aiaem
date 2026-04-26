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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document }) {
    const cells = [];
    const isHeroCarousel = !!element.closest(".teasercarousel");
    const isCaseStudyCarousel = !!element.closest(".listcards");
    if (isHeroCarousel || element.classList.contains("cmp-carousel")) {
      const slides = element.querySelectorAll(".cmp-carousel__item");
      slides.forEach((slide) => {
        const img = slide.querySelector(".cmp-image__image, img");
        const pretitle = slide.querySelector(".cmp-teaser__pretitle");
        const heading = slide.querySelector(".cmp-teaser__title");
        const description = slide.querySelector(".cmp-teaser__description p");
        const ctas = slide.querySelectorAll(".cmp-teaser__action-link");
        const contentCell = document.createElement("div");
        if (pretitle) {
          const p = document.createElement("p");
          p.textContent = pretitle.textContent.trim();
          contentCell.appendChild(p);
        }
        if (heading) {
          const h2 = document.createElement("h2");
          h2.textContent = heading.textContent.trim();
          contentCell.appendChild(h2);
        }
        if (description) {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          contentCell.appendChild(p);
        }
        ctas.forEach((cta) => {
          var _a;
          const a = document.createElement("a");
          a.href = cta.href;
          a.textContent = ((_a = cta.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent.trim()) || cta.textContent.trim();
          const p = document.createElement("p");
          p.appendChild(a);
          contentCell.appendChild(p);
        });
        const imageCell = document.createElement("div");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.appendChild(newImg);
        }
        cells.push([imageCell, contentCell]);
      });
    } else if (isCaseStudyCarousel) {
      const heading = element.querySelector(".mer-lc-headline, h2");
      const items = element.querySelectorAll(".cmp-list__item");
      items.forEach((item) => {
        const img = item.querySelector(".cmp-image__image, img");
        const client = item.querySelector(".cmp-teaser__pretitle");
        const title = item.querySelector(".cmp-teaser__title");
        const link = item.querySelector(".mer-clickabkle-wrapper, a");
        const contentCell = document.createElement("div");
        if (client) {
          const p = document.createElement("p");
          p.textContent = client.textContent.trim();
          contentCell.appendChild(p);
        }
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          contentCell.appendChild(h3);
        }
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = "Read case";
          const p = document.createElement("p");
          p.appendChild(a);
          contentCell.appendChild(p);
        }
        const imageCell = document.createElement("div");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.appendChild(newImg);
        }
        cells.push([imageCell, contentCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/embed.js
  function parse4(element, { document }) {
    const cells = [];
    const videoSource = element.querySelector("source.cmp-video-source, source[src], video source");
    const videoEl = element.querySelector("video");
    let videoUrl = "";
    if (videoSource && videoSource.src) {
      videoUrl = videoSource.src;
    } else if (videoSource && videoSource.getAttribute("src")) {
      videoUrl = videoSource.getAttribute("src");
    } else if (videoEl && videoEl.src) {
      videoUrl = videoEl.src;
    }
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.textContent = videoUrl;
      cells.push([a]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "embed",
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel": parse,
    "cards": parse2,
    "columns": parse3,
    "embed": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Merkle homepage - rich marketing page with hero carousel, featured content cards, icon feature grid, video, case study carousel, and CTAs",
    urls: [
      "https://www.merkle.com/en/home.html"
    ],
    blocks: [
      {
        name: "carousel",
        instances: [".teasercarousel.carousel .cmp-carousel"]
      },
      {
        name: "cards",
        instances: [".teasergallerylist.mer-featured-tgl"]
      },
      {
        name: "columns",
        instances: [".container.responsivegrid.text-left"]
      },
      {
        name: "embed",
        instances: [".video.centered"]
      },
      {
        name: "carousel",
        instances: [".listcards.teasergallerylist"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".teasercarousel.carousel",
        style: "dark",
        blocks: ["carousel"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Content",
        selector: "#container-34049edaf9",
        style: "dark",
        blocks: ["cards"],
        defaultContent: [
          ".cmp-teaser-layout-large.content-center h2",
          ".cmp-teaser-layout-large.content-center .cmp-teaser__description",
          ".cmp-teaser-layout-large.content-center hr"
        ]
      },
      {
        id: "section-3",
        name: "Capabilities and Work",
        selector: "#container-1db8cd56b8",
        style: "dark",
        blocks: ["columns", "embed", "carousel"],
        defaultContent: [
          ".cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-s h2",
          ".cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-s .cmp-teaser__description",
          ".cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m h2",
          ".cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m .cmp-teaser__description",
          ".cmp-teaser-layout-large.cmp-teaser-blue-black.top-spacer-m .cmp-teaser__action-container"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
  return __toCommonJS(import_homepage_exports);
})();
