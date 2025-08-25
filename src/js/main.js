// import vanilla tilt
import 'vanilla-tilt';
//import LocomotiveScroll from 'locomotive-scroll';

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
                // After all resources including images are loaded
               
            });
        

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