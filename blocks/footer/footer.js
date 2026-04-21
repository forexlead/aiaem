import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
};

function ensureFooterSections(footer) {
  const sections = footer.querySelectorAll('.section');

  // If logo is missing, inject it before the links section
  const firstSection = sections[0];
  if (firstSection && !firstSection.querySelector('img')) {
    const logoP = document.createElement('p');
    const logoLink = document.createElement('a');
    logoLink.href = '/en/home';
    const logoImg = document.createElement('img');
    logoImg.src = '/icons/merkle-logo-white.svg';
    logoImg.alt = 'Merkle';
    logoImg.width = 142;
    logoImg.height = 18;
    logoLink.append(logoImg);
    logoP.append(logoLink);
    const wrapper = firstSection.querySelector('.default-content-wrapper');
    if (wrapper) wrapper.prepend(logoP);
  }

  // If social links section is missing, inject it
  if (!footer.querySelector('a[href*="instagram"]')) {
    const socialSection = document.createElement('div');
    socialSection.className = 'section';
    socialSection.dataset.sectionStatus = 'loaded';
    socialSection.innerHTML = `<div class="default-content-wrapper"><ul>
      <li><a href="https://www.instagram.com/merkle/" aria-label="Instagram">${SOCIAL_ICONS.instagram}</a></li>
      <li><a href="https://www.youtube.com/@MerkleOfficial" aria-label="YouTube">${SOCIAL_ICONS.youtube}</a></li>
      <li><a href="https://www.linkedin.com/company/merkle" aria-label="LinkedIn">${SOCIAL_ICONS.linkedin}</a></li>
    </ul></div>`;
    footer.append(socialSection);
  }

  // If disclosure section is missing, inject it
  const hasDisclosure = Array.from(footer.querySelectorAll('p')).some((p) => p.textContent.includes('data broker'));
  if (!hasDisclosure) {
    const disclosureSection = document.createElement('div');
    disclosureSection.className = 'section';
    disclosureSection.dataset.sectionStatus = 'loaded';
    disclosureSection.innerHTML = '<div class="default-content-wrapper"><p>Merkle is a data broker under Texas law. To conduct business in Texas, a data broker must register with the Texas Secretary of State (Texas SOS). Information about data broker registrants is available on the <a href="https://www.sos.state.tx.us/index.shtml">Texas SOS website</a>.</p></div>';
    footer.append(disclosureSection);
  }

  // If copyright section is missing, inject it
  if (!footer.textContent.includes('©')) {
    const copyrightSection = document.createElement('div');
    copyrightSection.className = 'section';
    copyrightSection.dataset.sectionStatus = 'loaded';
    copyrightSection.innerHTML = `<div class="default-content-wrapper"><p>© ${new Date().getFullYear()} Merkle</p></div>`;
    footer.append(copyrightSection);
  }

  // Replace any existing social link text with SVG icons
  footer.querySelectorAll('a[href*="instagram"], a[href*="youtube"], a[href*="linkedin"]').forEach((link) => {
    const href = link.getAttribute('href').toLowerCase();
    const key = Object.keys(SOCIAL_ICONS).find((k) => href.includes(k));
    if (key && !link.querySelector('svg')) {
      link.innerHTML = SOCIAL_ICONS[key];
      link.setAttribute('aria-label', key.charAt(0).toUpperCase() + key.slice(1));
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  // resolve footer from content directory when page is served from /content/
  if (!footerMeta && window.location.pathname.startsWith('/content/')) {
    footerPath = '/content/footer';
  }

  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  ensureFooterSections(footer);

  block.append(footer);
}
