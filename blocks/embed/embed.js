/**
 * Embed Block
 * Renders video embeds from MP4 URLs.
 * @param {Element} block The embed block element
 */
export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  // Use title attribute (original URL) as fallback since importer may rewrite href
  const url = link.title || link.href;

  // MP4 video
  if (url.includes('.mp4')) {
    const video = document.createElement('video');
    video.className = 'embed-video';
    video.controls = true;
    video.playsInline = true;
    video.muted = true;
    video.preload = 'metadata';

    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    video.append(source);

    block.textContent = '';
    block.append(video);
  }
}
