/* eslint-disable */
/* global WebImporter */

/**
 * Merkle site-wide cleanup transformer
 * Removes non-authorable content: header, footer, cookie banners, tracking, overlays
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove hidden skip-to-content and screenreader-only elements
    WebImporter.DOMUtils.remove(element, [
      '.screenreader-header',
      '.visually-hidden',
      'h1.visually-hidden',
    ]);

    // Remove tracking pixels and noscript tags
    WebImporter.DOMUtils.remove(element, [
      'noscript',
    ]);

    // Remove video player UI chrome (scrubber, share dialogs, controls)
    WebImporter.DOMUtils.remove(element, [
      '.s7playpausebutton',
      '.s7videoscrubber',
      '.s7closedcaptionbutton',
      '.s7mutablevolume',
      '.s7fullscreenbutton',
      '.s7socialshare',
      '.s7emaildialog',
      '.s7embeddialog',
      '.s7linkdialog',
      '.s7videoplayer',
      '[class*="s7sdk"]',
    ]);

    // Remove Scene7/Dynamic Media sprite images and player chrome
    element.querySelectorAll('img[src*="scene7.com/is/content"]').forEach((img) => {
      const p = img.closest('p') || img.parentElement;
      if (p && p.tagName === 'P') p.remove();
      else img.remove();
    });

    // Remove video timestamp paragraphs (e.g., "0:00", "0:01 / 0:18")
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (/^\d+:\d{2}(\s*\/\s*\d+:\d{2})?$/.test(text)) p.remove();
      if (text === 'AUDIO' || text === 'CancelSend Email' || text === 'CancelSelect All') p.remove();
      if (text.startsWith('Wrong email address')) p.remove();
      if (text.startsWith('To get embed code')) p.remove();
      if (text.startsWith('To share this link')) p.remove();
      if (text === 'Email Link' || text === 'Get Embed Code' || text === 'Share Link') p.remove();
    });

    // Remove lists with only "[Original]" content (audio track selector)
    element.querySelectorAll('ul').forEach((ul) => {
      if (ul.textContent.trim() === '[Original]') ul.remove();
    });

    // Remove resolution selector links (320x240, 640x480, etc.)
    element.querySelectorAll('p').forEach((p) => {
      const links = p.querySelectorAll('a');
      if (links.length >= 2) {
        const allResolution = [...links].every((a) => /^\d+x\d+$/.test(a.textContent.trim()) || a.textContent.trim() === 'Custom Size');
        if (allResolution) p.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header/navigation (auto-populated in EDS)
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
    ]);

    // Remove footer (auto-populated in EDS)
    WebImporter.DOMUtils.remove(element, [
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
    ]);

    // Remove empty spacer divs
    WebImporter.DOMUtils.remove(element, [
      '.mer-header-space',
    ]);

    // Remove iframes and link tags
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
    ]);

    // Clean up empty source elements inside picture/video
    const sources = element.querySelectorAll('source:not([src])');
    sources.forEach((source) => source.remove());
  }
}
