/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards
 * Source: https://www.merkle.com/en/home.html
 * Featured content cards with category label, heading, link, and image
 * Selector: .teasergallerylist.mer-featured-tgl
 */
export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('.cmp-list__item');

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image__image, img');
    const category = item.querySelector('.cmp-teaser__pretitle');
    const heading = item.querySelector('.cmp-teaser__title');
    const link = item.querySelector('.mer-clickabkle-wrapper, a[href]');

    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    const contentCell = document.createElement('div');
    if (category) {
      const p = document.createElement('p');
      p.textContent = category.textContent.trim();
      contentCell.appendChild(p);
    }
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.appendChild(h3);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = 'Learn more';
      const p = document.createElement('p');
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards',
    cells,
  });

  element.replaceWith(block);
}
