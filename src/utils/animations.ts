import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger once safely in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animate hero element sequence on page mount
 */
export function animateHeroElements(containerRef: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.hero-label-anim',
      { opacity: 0, y: -20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1 }
    )
      .fromTo(
        '.hero-title-anim',
        { opacity: 0, y: 35, skewY: 1 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.0 },
        '-=0.5'
      )
      .fromTo(
        '.hero-subtitle-anim',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        '.hero-btn-anim',
        { opacity: 0, y: 25, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 },
        '-=0.5'
      )
      .fromTo(
        '.hero-side-anim',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.7'
      );
  }, containerRef);

  return () => ctx.revert();
}

/**
 * Animate grid of product cards with staggered entry
 */
export function animateProductGrid(containerRef: HTMLElement | null, triggerRef?: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const cards = containerRef.querySelectorAll('.product-card-anim');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: {
          each: 0.06,
          grid: 'auto',
          from: 'start',
        },
        ease: 'power2.out',
        scrollTrigger: triggerRef
          ? {
              trigger: triggerRef,
              start: 'top 85%',
              once: true,
            }
          : undefined,
      }
    );
  }, containerRef);

  return () => ctx.revert();
}

/**
 * Animate "Envíos y etc" Trust strip
 */
export function animateTrustStrip(containerRef: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const items = containerRef.querySelectorAll('.trust-item-anim');
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 25, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }, containerRef);

  return () => ctx.revert();
}

/**
 * Animate boxes and category banners
 */
export function animateCategoryBoxes(containerRef: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const boxes = containerRef.querySelectorAll('.category-box-anim');
    if (boxes.length === 0) return;

    gsap.fromTo(
      boxes,
      { opacity: 0, y: 35, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, containerRef);

  return () => ctx.revert();
}

/**
 * Animate editorial feature split banner (Oportunidad exclusiva)
 */
export function animateExclusiveBanner(containerRef: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const img = containerRef.querySelector('.exclusive-img-anim');
    const text = containerRef.querySelector('.exclusive-text-anim');

    if (img && text) {
      gsap.fromTo(
        img,
        { opacity: 0, x: -40, scale: 1.05 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        text,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }
  }, containerRef);

  return () => ctx.revert();
}

/**
 * Animate footer sections on scroll
 */
export function animateFooterElements(containerRef: HTMLElement | null) {
  if (!containerRef) return;

  const ctx = gsap.context(() => {
    const cols = containerRef.querySelectorAll('.footer-col-anim');
    if (cols.length === 0) return;

    gsap.fromTo(
      cols,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, containerRef);

  return () => ctx.revert();
}

export { gsap, ScrollTrigger };
