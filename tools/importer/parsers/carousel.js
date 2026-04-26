/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel
 * Source: https://www.merkle.com/en/home.html
 * Handles both hero carousel (.teasercarousel) and case study carousel (.listcards)
 *
 * Hero carousel structure: Each slide has pretitle, h2 heading, description, CTAs, and background image
 * Case study carousel structure: Each item has client name, h3 title, "Read case" link, and image
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which carousel type this is
  const isHeroCarousel = !!element.closest('.teasercarousel');
  const isCaseStudyCarousel = !!element.closest('.listcards');

  if (isHeroCarousel || element.classList.contains('cmp-carousel')) {
    // Hero carousel: extract each slide as a row
    const slides = element.querySelectorAll('.cmp-carousel__item');
    slides.forEach((slide) => {
      const img = slide.querySelector('.cmp-image__image, img');
      const pretitle = slide.querySelector('.cmp-teaser__pretitle');
      const heading = slide.querySelector('.cmp-teaser__title');
      const description = slide.querySelector('.cmp-teaser__description p');
      const ctas = slide.querySelectorAll('.cmp-teaser__action-link');

      const contentCell = document.createElement('div');
      if (pretitle) {
        const p = document.createElement('p');
        p.textContent = pretitle.textContent.trim();
        contentCell.appendChild(p);
      }
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        contentCell.appendChild(h2);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        contentCell.appendChild(p);
      }
      ctas.forEach((cta) => {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.querySelector('.cmp-button__text')?.textContent.trim() || cta.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.appendChild(p);
      });

      const imageCell = document.createElement('div');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.appendChild(newImg);
      }

      cells.push([imageCell, contentCell]);
    });
  } else if (isCaseStudyCarousel) {
    // Case study carousel: heading + card items
    const heading = element.querySelector('.mer-lc-headline, h2');
    const items = element.querySelectorAll('.cmp-list__item');

    items.forEach((item) => {
      const img = item.querySelector('.cmp-image__image, img');
      const client = item.querySelector('.cmp-teaser__pretitle');
      const title = item.querySelector('.cmp-teaser__title');
      const link = item.querySelector('.mer-clickabkle-wrapper, a');

      const contentCell = document.createElement('div');
      if (client) {
        const p = document.createElement('p');
        p.textContent = client.textContent.trim();
        contentCell.appendChild(p);
      }
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        contentCell.appendChild(h3);
      }
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = 'Read case';
        const p = document.createElement('p');
        p.appendChild(a);
        contentCell.appendChild(p);
      }

      const imageCell = document.createElement('div');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.appendChild(newImg);
      }

      cells.push([imageCell, contentCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel',
    cells,
  });

  element.replaceWith(block);
}
