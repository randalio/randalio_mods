// import vanilla tilt
import 'vanilla-tilt';
//import LocomotiveScroll from 'locomotive-scroll';
import Lenis from 'lenis'

class RandalIO_Mods_Main_JS {

    constructor() {
        this.init();
    }
  
    init() {
        // wait until DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
          console.log('randalio mods JS initialized');

          this.initSwitcher();

            // ----------------------
            // OPTIMIZED LENIS with Hash Scrolling Integration
            // ----------------------

            // Prevent initial browser hash jump
            (function preventInitialHashJump() {
                if (window.location.hash) {
                    window.pendingHash = window.location.hash
                    history.replaceState(null, null, window.location.pathname + window.location.search)
                }
            })()

            // Throttle function to limit execution frequency
            function throttle(func, delay) {
                let lastCall = 0
                let scheduled = false
                
                return function(...args) {
                    const now = Date.now()
                    
                    if (now - lastCall >= delay) {
                        lastCall = now
                        func.apply(this, args)
                    } else if (!scheduled) {
                        scheduled = true
                        setTimeout(() => {
                            scheduled = false
                            lastCall = Date.now()
                            func.apply(this, args)
                        }, delay - (now - lastCall))
                    }
                }
            }

            // Use Intersection Observer for visibility detection instead of scroll calculations
            let observer = null
            function setupIntersectionObserver() {
                // Clean up existing observer
                if (observer) {
                    observer.disconnect()
                }

                const options = {
                    rootMargin: '50px 0px',
                    threshold: [0, 0.66]
                }

                observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const className = entry.target.dataset.scrollClass
                        if (className) {
                            if (entry.isIntersecting) {
                                entry.target.classList.add(className)
                            } else if (entry.target.hasAttribute('data-scroll-repeat')) {
                                entry.target.classList.remove(className)
                            }
                        }
                    })
                }, options)

                // Observe elements with scroll-class
                document.querySelectorAll('[data-scroll-class]').forEach(el => {
                    observer.observe(el)
                })
            }

            // Add animation to all dividers
            const dividers = document.querySelectorAll('.elementor-widget-divider')
            dividers.forEach(divider => {
                divider.setAttribute('data-scroll', '')
                divider.setAttribute('data-scroll-repeat', '')
                divider.setAttribute('data-scroll-class', 'loco-in-view')
            })

            // Add scroll tracking to elements with IDs
            document.querySelectorAll('[id]').forEach(element => {
                element.setAttribute('data-scroll', '')
                element.setAttribute('data-scroll-id', element.id)
            })

            // Initialize Lenis (no manual RAF loop needed with autoRaf)
            const lenis = new Lenis({
                autoRaf: true,
                lerp: 0.15,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false
            })

            // Setup Intersection Observer for class toggling
            setupIntersectionObserver()

            // Parallax handling with caching and throttling
            let parallaxCache = new Map()
            let rafId = null

            function cacheParallaxElements() {
                // Clear previous cache
                parallaxCache.clear()
                
                document.querySelectorAll('[data-scroll-speed]').forEach(el => {
                    const rect = el.getBoundingClientRect()
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const speed = parseFloat(el.dataset.scrollSpeed) || 0
                    
                    parallaxCache.set(el, {
                        initialOffset: rect.top + scrollTop,
                        height: rect.height,
                        speed: speed
                    })
                })
            }

            // Throttled parallax update (16ms = ~60fps)
            const updateParallax = throttle((scrollY) => {
                // Cancel any pending animation frame
                if (rafId) {
                    cancelAnimationFrame(rafId)
                }
                
                rafId = requestAnimationFrame(() => {
                    const windowHeight = window.innerHeight
                    const viewportCenter = windowHeight / 2 + scrollY

                    parallaxCache.forEach((data, el) => {
                        const elCenter = data.initialOffset + data.height / 2
                        const distanceFromCenter = elCenter - viewportCenter
                        
                        // Only update if element is near viewport
                        if (Math.abs(distanceFromCenter) < windowHeight * 1.5) {
                            let y = distanceFromCenter * data.speed / 10
                            y = Math.round(y * 100) / 100
                            
                            // Use will-change for better performance
                            if (!el.style.willChange) {
                                el.style.willChange = 'transform'
                            }
                            el.style.transform = `translate3d(0, ${y}px, 0)`
                        }
                    })
                    
                    rafId = null
                })
            }, 32)

            // Cache elements initially
            cacheParallaxElements()

            // Debounced resize handler
            let resizeTimeout
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout)
                resizeTimeout = setTimeout(() => {
                    cacheParallaxElements()
                    setupIntersectionObserver()
                }, 250)
            }, { passive: true })

            // Only attach scroll listener if parallax elements exist
            if (parallaxCache.size > 0) {
                lenis.on('scroll', (e) => {
                    updateParallax(e.scroll)
                })
            }

            // ----------------------
            // Hash Scrolling Integration
            // ----------------------

            // Handle anchor link clicks (delegated for performance)
            document.addEventListener('click', (e) => {
                const anchor = e.target.closest('a[href^="#"]')
                if (!anchor) return
                
                e.preventDefault()
                const targetId = anchor.getAttribute('href')
                if (targetId === '#') return
                
                const targetEl = document.querySelector(targetId)
                if (targetEl) {
                    lenis.scrollTo(targetEl, {
                        offset: -100,
                        duration: 1.2,
                        easing: (t) => 1 - Math.pow(1 - t, 3),
                        onComplete: () => {
                            history.replaceState(null, null, targetId)
                        }
                    })
                }
            }, { passive: false })

            // Handle pending hash after page loads
            function handlePendingHash() {
                if (window.pendingHash) {
                    const targetEl = document.querySelector(window.pendingHash)
                    if (targetEl) {
                        // Use requestIdleCallback for non-critical initial scroll
                        const scrollToHash = () => {
                            lenis.scrollTo(targetEl, {
                                offset: -100,
                                duration: 1.2,
                                easing: (t) => 1 - Math.pow(1 - t, 3),
                                onComplete: () => {
                                    history.replaceState(null, null, 
                                        window.location.pathname + 
                                        window.location.search + 
                                        window.pendingHash)
                                    delete window.pendingHash
                                }
                            })
                        }
                        
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(scrollToHash, { timeout: 500 })
                        } else {
                            setTimeout(scrollToHash, 200)
                        }
                    }
                }
            }

            // Initialize hash handling when everything is loaded
            window.addEventListener('load', handlePendingHash, { once: true })

            // Cleanup on page unload to prevent memory leaks
            window.addEventListener('beforeunload', () => {
                if (observer) {
                    observer.disconnect()
                }
                if (lenis) {
                    lenis.destroy()
                }
                parallaxCache.clear()
            })
        

        });
    }



    initSwitcher() {

      const switcherButtons = document.querySelectorAll(`[data-content]`);

      console.log(switcherButtons);

      switcherButtons.forEach((item) => {
          item.addEventListener('mouseenter', function() {
              // Select all content elements that could have 'active' class
              let allContents = document.querySelectorAll('[id]'); // Or more specific selector
              // Get the target content
              let activeItem = item.getAttribute('data-content');
              let activeContent = document.querySelector("#" + activeItem);
              
              // Remove 'active' class from all content elements
              allContents.forEach((content) => {
                  content.classList.remove('active');
              });
              
              // Add 'active' class to the target content
              if (activeContent) {
                  activeContent.classList.add('active');
              }
          });
      });

    } // initSwitcher

    





}

new RandalIO_Mods_Main_JS();