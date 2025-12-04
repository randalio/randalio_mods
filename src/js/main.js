// import vanilla tilt
import 'vanilla-tilt';
import Lenis from 'lenis';
import AOS from 'aos';
import Rellax from 'rellax';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import AOS styles
import 'aos/dist/aos.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

class RandalIO_Mods_Main_JS {

    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('randalio mods JS initialized');

            this.initSwitcher();
            this.initSmoothScroll();
            this.initAOS();

            if (document.readyState === 'complete') {
                this.initParallax();
                this.initScrollTrigger();
                this.initTextReveal();
            } else {
                window.addEventListener('load', () => {
                    this.initParallax();
                    this.initScrollTrigger();
                    this.initTextReveal();
                });
            }
        });
    }

    initSmoothScroll() {
        if (window.location.hash) {
            window.pendingHash = window.location.hash;
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }

        const lenis = new Lenis({
            autoRaf: true,
            lerp: 0.15,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false
        });

        window.lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        document.addEventListener('click', e => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                lenis.scrollTo(targetEl, {
                    offset: -100,
                    duration: 1.6,
                    easing: t => 1 - Math.pow(1 - t, 3),
                    onComplete: () => history.replaceState(null, null, targetId)
                });
            }
        }, { passive: false });

        const handlePendingHash = () => {
            if (window.pendingHash) {
                const targetEl = document.querySelector(window.pendingHash);
                if (targetEl) {
                    const scrollToHash = () => lenis.scrollTo(targetEl, {
                        offset: -100,
                        duration: 1.6,
                        easing: t => 1 - Math.pow(1 - t, 3),
                        onComplete: () => {
                            history.replaceState(null, null,
                                window.location.pathname + window.location.search + window.pendingHash
                            );
                            delete window.pendingHash;
                        }
                    });
                    if ('requestIdleCallback' in window) requestIdleCallback(scrollToHash, { timeout: 500 });
                    else setTimeout(scrollToHash, 200);
                }
            }
        };

        window.addEventListener('load', handlePendingHash, { once: true });
        window.addEventListener('beforeunload', () => lenis.destroy());
    }

    initAOS() {
        try {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: false,
                mirror: true,
                offset: 100,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });

            window.addEventListener('load', () => { try { AOS.refresh(); } catch(e) {} });
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => { try { AOS.refresh(); } catch(e) {} }, 250);
            });
        } catch (e) {
            console.error('AOS init failed', e);
        }
    }

    initParallax() {

        if (window.innerWidth < 768) return;

        console.log("Initializing Rellax parallax...");

        // Combine all elements that need Rellax
        const rellaxTargets = [
            ...document.querySelectorAll("[data-scroll-speed]:not(img), [data-parallax]:not(img), figure.wp-block-image.parallax-img")
        ];

        rellaxTargets.forEach(el => {
            const speed = parseFloat(el.dataset.scrollSpeed) || parseFloat(el.dataset.parallaxSpeed) || -2;
            el.classList.add("rellax");
            el.setAttribute("data-rellax-speed", speed);
        });

        if (rellaxTargets.length > 0) {
            this.rellaxInstance = new Rellax(".rellax", {
                center: false,
                vertical: true,
                horizontal: false,
                round: true
            });
            console.log(`Rellax initialized on ${rellaxTargets.length} element(s).`);
        }

        if (window.lenis) {
            let scrollTimeout;
            window.lenis.on("scroll", () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.rellaxInstance?.refresh();
                    console.log("Rellax refreshed on scroll.");
                }, 100); // refresh at most every 100ms
            });
        }
        

        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.rellaxInstance?.refresh();
            }, 250);
        });

        document.body.classList.add("parallax-ready");
    }

    initScrollTrigger() {
        console.log('Initializing ScrollTrigger...');

        const pinnedElements = document.querySelectorAll('[data-pin]');
        pinnedElements.forEach(element => {
            ScrollTrigger.create({
                trigger: element,
                start: element.dataset.pinStart || 'top top',
                end: `+=${element.dataset.pinDuration || '100%'}`,
                pin: true,
                pinSpacing: element.dataset.pinSpacing !== 'false',
                onEnter: () => element.classList.add('is-pinned'),
                onLeave: () => element.classList.remove('is-pinned'),
                onEnterBack: () => element.classList.add('is-pinned'),
                onLeaveBack: () => element.classList.remove('is-pinned'),
            });
        });

        const horizontalSections = document.querySelectorAll('[data-horizontal-scroll]');
        horizontalSections.forEach(section => {
            const wrapper = section.querySelector('.horizontal-wrapper') || section;
            const slides = wrapper.children;
            if (slides.length > 1) {
                gsap.to(slides, {
                    xPercent: -100 * (slides.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        scrub: 1,
                        snap: 1 / (slides.length - 1),
                        end: () => "+=" + wrapper.offsetWidth
                    }
                });
            }
        });

        const staggerElements = document.querySelectorAll('[data-gsap-stagger]');
        staggerElements.forEach(container => {
            const items = container.children;
            gsap.from(items, {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
        });

        console.log('ScrollTrigger initialized successfully');
    }

    initTextReveal() {
        console.log('Initializing Text Reveal...');

        const revealElements = document.querySelectorAll('[data-text-reveal]');
        if (revealElements.length === 0) return;

        revealElements.forEach(element => {
            // Skip if already processed
            if (element.dataset.textRevealProcessed) return;
            element.dataset.textRevealProcessed = 'true';
            
            // Split text into lines ONCE
            const lines = this.splitIntoLines(element);
            
            // Animate each line with stagger
            lines.forEach((line, index) => {
                // Set initial gradient state
                line.style.setProperty('--reveal-progress', '0');

                // Create scroll-triggered animation with stagger
                const staggerDelay = index * 0.15;
                
                ScrollTrigger.create({
                    trigger: element,
                    start: 'top 70%',
                    end: 'top 30%',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Calculate staggered progress
                        const totalStagger = (lines.length - 1) * 0.15;
                        const adjustedProgress = (self.progress * (1 + totalStagger)) - staggerDelay;
                        const clampedProgress = Math.max(0, Math.min(1, adjustedProgress));
                        
                        // Round to reduce sub-pixel flickering
                        const roundedProgress = Math.round(clampedProgress * 1000) / 1000;
                        line.style.setProperty('--reveal-progress', roundedProgress);
                    }
                });
            });
        });

        console.log(`Text Reveal initialized on ${revealElements.length} element(s)`);
    }

    splitIntoLines(element) {
        const text = element.textContent;
        const words = text.split(/\s+/);
        element.innerHTML = '';
        
        // Create container that preserves original spacing
        const container = document.createElement('div');
        element.appendChild(container);
        
        // Temporarily add all words as inline spans to detect natural line breaks
        const wordSpans = [];
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline';
            span.style.whiteSpace = 'nowrap';
            container.appendChild(span);
            
            if (i < words.length - 1) {
                container.appendChild(document.createTextNode(' '));
            }
            wordSpans.push(span);
        });
        
        // Detect which words are on which lines
        const lineGroups = [];
        let currentLineWords = [];
        let currentY = null;
        
        wordSpans.forEach((span, i) => {
            const rect = span.getBoundingClientRect();
            const y = Math.round(rect.top);
            
            if (currentY === null) {
                currentY = y;
            }
            
            if (y !== currentY) {
                // New line detected
                lineGroups.push(currentLineWords);
                currentLineWords = [words[i]];
                currentY = y;
            } else {
                currentLineWords.push(words[i]);
            }
        });
        
        // Don't forget the last line
        if (currentLineWords.length > 0) {
            lineGroups.push(currentLineWords);
        }
        
        // Clear and rebuild with proper line spans
        container.innerHTML = '';
        const lines = [];
        
        lineGroups.forEach((lineWords, lineIndex) => {
            const lineSpan = document.createElement('span');
            lineSpan.className = 'reveal-line';
            lineSpan.textContent = lineWords.join(' ');
            container.appendChild(lineSpan);
            
            // Add line break after each line except the last
            if (lineIndex < lineGroups.length - 1) {
                container.appendChild(document.createElement('br'));
            }
            
            lines.push(lineSpan);
        });
        
        return lines;
    }

    initSwitcher() {
        const switcherButtons = document.querySelectorAll("[data-content]");
        switcherButtons.forEach(button => {
            const targetId = button.getAttribute("data-content");
            const container = button.closest(".content-switcher");
            if (!container) return;

            const panels = container.querySelectorAll(".switch-panel");
            button.addEventListener("mouseenter", () => {
                panels.forEach(p => p.classList.remove("active"));
                const target = container.querySelector(`#${targetId}`);
                if (target) target.classList.add("active");
            });
        });
    }
}

new RandalIO_Mods_Main_JS();