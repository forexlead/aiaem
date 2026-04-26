/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed
 * Source: https://www.merkle.com/en/home.html
 * Video embed with MP4 source URL
 * Selector: .video.centered
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract video source URL
  const videoSource = element.querySelector('source.cmp-video-source, source[src], video source');
  const videoEl = element.querySelector('video');

  let videoUrl = '';
  if (videoSource && videoSource.src) {
    videoUrl = videoSource.src;
  } else if (videoSource && videoSource.getAttribute('src')) {
    videoUrl = videoSource.getAttribute('src');
  } else if (videoEl && videoEl.src) {
    videoUrl = videoEl.src;
  }

  if (videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cells.push([a]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'embed',
    cells,
  });

  element.replaceWith(block);
}
