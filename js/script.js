const LOOKING_FOR_INTERNSHIP = true;

function updateStatusNotification() {
    const notification = document.getElementById('status-notification');
    const textEl = document.getElementById('status-text');
    if (!notification || !textEl) return;

    if (LOOKING_FOR_INTERNSHIP) {
        notification.classList.remove('hero-availability--closed');
        notification.classList.add('hero-availability--open');
        textEl.textContent = 'Open for internship';
    } else {
        notification.classList.remove('hero-availability--open');
        notification.classList.add('hero-availability--closed');
        textEl.textContent = 'Not seeking internship';
    }
}

// ============================================
// PDF modal (About page)
// ============================================
function initPdfModal() {
    const dialog = document.getElementById('pdf-modal');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const iframe = dialog.querySelector('.pdf-modal__frame');
    const titleEl = document.getElementById('pdf-modal-title');
    const closeBtn = dialog.querySelector('.pdf-modal__close');

    let pdfModalScrollY = 0;

    function lockPdfModalScroll() {
        pdfModalScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.classList.add('pdf-modal-scroll-lock');
        document.documentElement.classList.add('pdf-modal-scroll-lock');
        document.body.style.top = `-${pdfModalScrollY}px`;
    }

    function unlockPdfModalScroll() {
        const y = pdfModalScrollY;
        document.body.classList.remove('pdf-modal-scroll-lock');
        document.documentElement.classList.remove('pdf-modal-scroll-lock');
        document.body.style.top = '';
        /* document.css sets html { scroll-behavior: smooth } — that would animate
           scrollTo from the top after releasing fixed body; force instant restore */
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, y);
        html.style.scrollBehavior = prevBehavior;
    }

    function clearIframe() {
        if (!iframe) return;
        iframe.removeAttribute('src');
        iframe.setAttribute('title', 'PDF document');
    }

    document.querySelectorAll('.js-open-pdf-modal').forEach((btn) => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-pdf-url');
            const label = btn.getAttribute('data-pdf-label') || 'PDF';
            if (!iframe || !url) return;
            iframe.src = url;
            iframe.setAttribute('title', `${label} (PDF)`);
            if (titleEl) titleEl.textContent = label;
            lockPdfModalScroll();
            dialog.showModal();
        });
    });

    closeBtn?.addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('close', () => {
        unlockPdfModalScroll();
        clearIframe();
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
}

// ============================================
// Navigation
// ============================================

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// Mobile menu toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// Smooth scroll for in-page anchors only (skip bare "#" and missing targets)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    });
});

// Header scroll effect
const header = document.getElementById('header');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.pageYOffset > 100);
    });
}

// Use GSAP only when the library loaded and the user has not asked for reduced motion.
// Otherwise we never hide [data-animate] - freezing the timeline with opacity:0 was a blank page.
const useGsapAnimations =
    typeof gsap !== 'undefined' &&
    typeof ScrollTrigger !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Hero / headers use load animation; project cards use ScrollTrigger only (avoid double fade). */
const loadAnimateSelector = '[data-animate]:not(.project-card)';

function revealAnimatedElements() {
    document.querySelectorAll(loadAnimateSelector).forEach((el) => {
        el.style.opacity = '1';
        el.style.removeProperty('transform');
    });
}

if (!useGsapAnimations) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealAnimatedElements);
    } else {
        revealAnimatedElements();
    }
}

// ============================================
// Initial Page Load Animations
// ============================================

if (useGsapAnimations) {
gsap.registerPlugin(ScrollTrigger);

gsap.set(loadAnimateSelector, {
    opacity: 0
});

function initPageAnimations() {
    const animatedElements = document.querySelectorAll(loadAnimateSelector);
    
    animatedElements.forEach((element, index) => {
        const animationType = element.getAttribute('data-animate');
        const delay = parseFloat(element.getAttribute('data-delay')) || 0;
        
        let animation;
        
        switch (animationType) {
            case 'fade-up':
                animation = gsap.fromTo(element,
                    {
                        opacity: 0,
                        y: 28
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        delay: delay,
                        ease: 'power3.out'
                    }
                );
                break;

            default:
                animation = gsap.to(element, {
                    opacity: 1,
                    duration: 0.8,
                    delay: delay,
                    ease: 'power2.out'
                });
        }
    });
}

// Run initial animations after page load (or immediately if load already fired)
function runPageAnimationsWhenReady() {
    if (document.readyState === 'complete') {
        initPageAnimations();
    } else {
        window.addEventListener('load', initPageAnimations);
    }
}
runPageAnimationsWhenReady();

// ============================================
// Scroll-Triggered Animations
// ============================================

// Animate sections on scroll
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    const sectionTitle = section.querySelector('.section-title');
    const sectionContent = section.querySelectorAll('.section-title ~ *');
    
    if (sectionTitle) {
        gsap.fromTo(sectionTitle,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionTitle,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Stagger animation for section content
    if (sectionContent.length > 0) {
        gsap.fromTo(sectionContent,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    end: 'bottom 25%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
});

// Project cards scroll animation
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    gsap.fromTo(card,
        {
            opacity: 0,
            y: 60,
            scale: 0.95
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// ============================================
// Hover Interactions
// ============================================

// Project card hover distortion effect
projectCards.forEach(card => {
    const cardImage = card.querySelector('.project-card__image');
    const cardContent = card.querySelector('.project-card__content');
    
    card.addEventListener('mouseenter', () => {
        gsap.to(cardImage, {
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        gsap.to(cardContent, {
            y: -4,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(cardImage, {
            scale: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        });
        
        gsap.to(cardContent, {
            y: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        });
    });
});

// ============================================
// Parallax Effects (Subtle)
// ============================================

const heroImage = document.querySelector('.hero__aside');
if (heroImage) {
    const offset = -40;
    gsap.to(heroImage, {
        y: offset,
        ease: 'none',
        scrollTrigger: {
            trigger: heroImage,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// About image parallax
const aboutImage = document.querySelector('.about__image-wrapper');
if (aboutImage) {
    gsap.to(aboutImage, {
        y: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: aboutImage,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

} // end useGsapAnimations

// ============================================
// Utility Functions
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Grid laser: 48px lanes; fixed layer and/or embed(s) in .magazine-cover; each layer runs its own H+V cycles.
 */
function initGridScanOnLayer(layer) {
    const readCell = () => {
        const v = parseFloat(window.getComputedStyle(layer).getPropertyValue('--grid-scan-cell'));
        return Number.isFinite(v) && v > 8 ? v : 48;
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    function lanePosition(px, cell) {
        const count = Math.floor(px / cell);
        if (count <= 2) return cell;
        const i = 1 + Math.floor(Math.random() * (count - 2));
        return i * cell;
    }

    let activeH = false;
    let activeV = false;
    let tickTimer = null;

    function scheduleNextCycle() {
        if (!activeH && !activeV && !document.hidden) {
            window.setTimeout(trySpawnPair, rand(120, 450));
        }
    }

    function trySpawnPair() {
        if (document.hidden || activeH || activeV) return;

        const cell = readCell();
        const embed = layer.classList.contains('grid-scan-layer--embed');
        const w = embed ? layer.clientWidth : window.innerWidth;
        const h = embed ? layer.clientHeight : window.innerHeight;
        if (w < cell * 3 || h < cell * 3) return;

        const duration = rand(2200, 3400);
        const easing = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)';

        function spawnHorizontal() {
            const line = document.createElement('div');
            line.className = 'grid-scan-line grid-scan-line--h';
            line.style.top = `${lanePosition(h, cell)}px`;
            layer.appendChild(line);
            activeH = true;
            const anim = line.animate(
                [
                    { opacity: 0, transform: 'translateX(-100%)' },
                    { opacity: 0.72, offset: 0.5, transform: 'translateX(0%)' },
                    { opacity: 0, transform: 'translateX(100%)' }
                ],
                { duration, easing, fill: 'forwards' }
            );
            anim.onfinish = () => {
                line.remove();
                activeH = false;
                scheduleNextCycle();
            };
        }

        function spawnVertical() {
            const line = document.createElement('div');
            line.className = 'grid-scan-line grid-scan-line--v';
            line.style.left = `${lanePosition(w, cell)}px`;
            layer.appendChild(line);
            activeV = true;
            const anim = line.animate(
                [
                    { opacity: 0, transform: 'translateY(-100%)' },
                    { opacity: 0.72, offset: 0.5, transform: 'translateY(0%)' },
                    { opacity: 0, transform: 'translateY(100%)' }
                ],
                { duration, easing, fill: 'forwards' }
            );
            anim.onfinish = () => {
                line.remove();
                activeV = false;
                scheduleNextCycle();
            };
        }

        spawnHorizontal();
        spawnVertical();
    }

    function tick() {
        clearTimeout(tickTimer);
        if (!document.hidden) trySpawnPair();
        tickTimer = window.setTimeout(tick, rand(650, 1400));
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearTimeout(tickTimer);
        else tick();
    });

    window.setTimeout(() => trySpawnPair(), 200);
    window.setTimeout(tick, rand(500, 1400));
}

function initGridScanBackground() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof Element === 'undefined' || !Element.prototype.animate) return;

    function ensureLayer(id) {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.className = 'grid-scan-layer';
            el.setAttribute('aria-hidden', 'true');
        }
        return el;
    }

    const heroCover = document.querySelector('body.page-home .magazine-cover:not(.magazine-cover--band)');
    const contactHero = document.querySelector('body.page-contact .contact-hero');

    const mainLayer = ensureLayer('grid-scan-layer');
    const heroInner = heroCover && heroCover.querySelector('.magazine-cover__inner');
    const contactInner = contactHero && contactHero.querySelector('.contact-hero__inner');

    if (heroCover && heroInner) {
        mainLayer.classList.add('grid-scan-layer--embed');
        heroCover.insertBefore(mainLayer, heroInner);
        initGridScanOnLayer(mainLayer);
    } else if (contactHero && contactInner) {
        mainLayer.classList.add('grid-scan-layer--embed');
        contactHero.insertBefore(mainLayer, contactInner);
        initGridScanOnLayer(mainLayer);
    } else {
        mainLayer.classList.remove('grid-scan-layer--embed');
        const needsPrepend =
            mainLayer.parentElement !== document.body || document.body.firstElementChild !== mainLayer;
        if (needsPrepend) document.body.prepend(mainLayer);
        initGridScanOnLayer(mainLayer);
    }

    document.querySelectorAll('.magazine-cover--band').forEach((bandCover, i) => {
        const inner = bandCover.querySelector('.magazine-cover__inner');
        if (!inner) return;
        const bandLayer = ensureLayer(`grid-scan-layer-band-${i}`);
        bandLayer.classList.add('grid-scan-layer--embed');
        bandCover.insertBefore(bandLayer, inner);
        initGridScanOnLayer(bandLayer);
    });
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    updateStatusNotification();
    initPdfModal();
    initGridScanBackground();

    if (!useGsapAnimations) return;

    let resizeTimer;
    window.addEventListener('resize', debounce(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    }, 250));

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });
});
