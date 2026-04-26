/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero
 * Full-width hero with background image/video, heading, description, and CTA
 * Selector: .cmp-teaser-layout-h.mer-smart-crop-video
 */
export default function parse(element, { document }) {
  const cells = [];

  const img = element.querySelector('.cmp-teaser__image img, .cmp-teaser-hero-carousel-area img, picture img');
  const heading = element.querySelector('.cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link');

  const imageCell = document.createElement('div');
  if (img) {
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageCell.appendChild(newImg);
  }

  const contentCell = document.createElement('div');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.appendChild(p);
  }
  if (cta) {
    const a = document.createElement('a');
    a.href = cta.href;
    a.textContent = cta.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero',
    cells,
  });

  element.replaceWith(block);
}
