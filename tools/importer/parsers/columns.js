/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns
 * Source: https://www.merkle.com/en/home.html
 * 4 capability items, each with icon image + h6 heading + description paragraph
 * Selector: .container.responsivegrid.text-left (4 instances)
 *
 * Since these are 4 sibling containers (not one parent), we collect all
 * and build one columns block with 4 columns.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each .text-left container is one column with icon + text
  const img = element.querySelector('.cmp-image__image, img');
  const heading = element.querySelector('h6, h5, h4');
  const description = element.querySelector('.cmp-text p, p');

  const cell = document.createElement('div');

  if (img) {
    const newImg = document.createElement('img');
    // Clean Scene7 URLs: replace {.width} template vars, strip unnecessary params
    let imgSrc = img.src;
    if (imgSrc.includes('%7B.width%7D') || imgSrc.includes('{.width}')) {
      const [base] = imgSrc.split('?');
      imgSrc = `${base}?wid=400&fmt=png-alpha`;
    }
    newImg.src = imgSrc;
    newImg.alt = img.alt || '';
    cell.appendChild(newImg);
  }
  if (heading) {
    const h = document.createElement('h6');
    h.textContent = heading.textContent.trim();
    cell.appendChild(h);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    cell.appendChild(p);
  }

  cells.push([cell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns',
    cells,
  });

  element.replaceWith(block);
}
