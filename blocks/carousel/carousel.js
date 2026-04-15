/**
 * Carousel Block
 * Displays slides with image + content, navigable with prev/next buttons and tab indicators.
 * @param {Element} block The carousel block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Build slide structure
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'carousel-slides';

  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';

  rows.forEach((row, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    if (index === 0) slide.classList.add('active');

    const cells = [...row.children];
    if (cells.length >= 2) {
      const imageCell = cells[0];
      const contentCell = cells[1];

      const slideImage = document.createElement('div');
      slideImage.className = 'carousel-slide-image';
      slideImage.append(...imageCell.childNodes);

      const slideContent = document.createElement('div');
      slideContent.className = 'carousel-slide-content';
      slideContent.append(...contentCell.childNodes);

      slide.append(slideImage, slideContent);
    } else {
      slide.append(...row.childNodes);
    }

    slidesWrapper.append(slide);

    // Create indicator
    const indicator = document.createElement('button');
    indicator.className = 'carousel-indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    indicators.append(indicator);
  });

  // Navigation buttons
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#8250;';

  nav.append(prevBtn, nextBtn);

  // Replace block content
  block.textContent = '';
  block.append(slidesWrapper, nav, indicators);

  // Navigation logic
  let currentSlide = 0;
  const slides = slidesWrapper.querySelectorAll('.carousel-slide');
  const dots = indicators.querySelectorAll('.carousel-indicator');

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function navigate(direction) {
    goToSlide(currentSlide + direction);
  }

  // Bind events after functions are defined
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  // Auto-advance every 6 seconds
  let autoPlay = setInterval(() => navigate(1), 6000);
  block.addEventListener('mouseenter', () => clearInterval(autoPlay));
  block.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => navigate(1), 6000);
  });
}
