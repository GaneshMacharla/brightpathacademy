/**
 * Bright Path Academy - Core Script
 * Static Website Navigation & Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initFAQ();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  if (!menuBtn || !mobileMenu || !closeBtn) return;

  const isOpen = () => mobileMenu.classList.contains('is-open');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    document.body.classList.add('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!isOpen()) return;
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuBtn.focus();
  }

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', () => closeMenu());

  mobileMenu.querySelectorAll('[data-menu-close]').forEach(el => {
    el.addEventListener('click', () => closeMenu());
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
  });

  // Esc closes the drawer; Tab stays inside it while it is open
  document.addEventListener('keydown', event => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      closeMenu();
    } else if (event.key === 'Tab') {
      const focusable = mobileMenu.querySelectorAll('a[href], button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // The drawer is hidden from 1024px up, so release the scroll lock there
  window.matchMedia('(min-width: 1024px)').addEventListener('change', event => {
    if (event.matches) closeMenu({ restoreFocus: false });
  });
}

/* Header shadow once the page has scrolled */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* FAQ Accordion */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all other FAQs
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent && otherContent !== content) {
            otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        if (isOpen) {
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

