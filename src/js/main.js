// import vanilla tilt
import 'vanilla-tilt';
import LocomotiveScroll from 'locomotive-scroll';

class RandalIO_Mods_Main_JS {

    constructor() {
        this.init();
    }
  
    init() {
        // wait until DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
          console.log('randalio mods JS initialized');

          this.initSwitcher();

            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.initLocoScroll();
                }, 500); // Delay to ensure all elements are loaded
                
            }
            );
        

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


    initLocoScroll(){
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'), // Target element for scrolling
            smooth: true, // Enable smooth scrolling
            lerp: 0.15, // Linear interpolation value - controls smoothness/responsiveness
            multiplier: 0.8, // Adjust scroll speed
            scrollFromAnywhere: true, // Allow scrolling to start from any point
            smartphone: {
                smooth: true, // Enable smooth scrolling on smartphones
                multiplier: 1 // Default scroll speed for smartphones
            },
            tablet: {
                smooth: true, // Enable smooth scrolling on tablets
                multiplier: 1 // Default scroll speed for tablets
            }
        });
    }





}

new RandalIO_Mods_Main_JS();