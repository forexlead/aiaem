/**
 * Section Metadata Block
 * Reads section metadata key-value pairs and applies them to the parent section.
 * The block itself is hidden after processing.
 * @param {Element} block The section-metadata block element
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;

  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key === 'style') {
        value.split(',').forEach((style) => {
          section.classList.add(style.trim());
        });
      }
    }
  });

  // Hide the block after processing
  block.closest('.section-metadata-wrapper').style.display = 'none';
}
