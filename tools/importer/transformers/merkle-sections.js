/* eslint-disable */
/* global WebImporter */

/**
 * Merkle section transformer
 * Adds section breaks and section-metadata blocks based on template sections
 * Runs in afterTransform only
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const { template } = payload;
  if (!template || !template.sections || template.sections.length < 2) return;

  const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
  const doc = element.ownerDocument || document;

  // Process sections in reverse order to avoid DOM position shifts
  const sections = [...template.sections].reverse();

  sections.forEach((section, reverseIndex) => {
    const isFirst = reverseIndex === sections.length - 1;

    // Find the first element matching the section selector
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

    // Add section-metadata block if section has a style
    if (section.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      // Insert section-metadata after the section's last content
      // Find the section boundary end (next section start or end of content)
      let insertPoint = sectionEl;

      // Walk up to find a good insertion point at the section level
      while (insertPoint.parentElement && insertPoint.parentElement !== element) {
        insertPoint = insertPoint.parentElement;
      }

      // Insert after the section container
      if (insertPoint.nextSibling) {
        insertPoint.parentElement.insertBefore(sectionMetadata, insertPoint.nextSibling);
      } else {
        insertPoint.parentElement.appendChild(sectionMetadata);
      }
    }

    // Add section break (hr) before this section, unless it's the first section
    if (!isFirst) {
      let breakPoint = sectionEl;
      while (breakPoint.parentElement && breakPoint.parentElement !== element) {
        breakPoint = breakPoint.parentElement;
      }

      // Only add hr if there's content before this section
      if (breakPoint.previousSibling) {
        const hr = doc.createElement('hr');
        breakPoint.parentElement.insertBefore(hr, breakPoint);
      }
    }
  });
}
