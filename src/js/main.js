class RandalIO_Mods_Main_JS {

    constructor() {
        this.init();
    }
  
    init() {
        // wait until DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
          console.log('randalio mods JS initialized');
  
        });
    }


    initSwitcher(){

      const switcherButtons = document.querySelectorAll(`[data-content]`);

      switcherButtons.forEach((item) => {
        item.addEventListener('mouseenter', function() {
          // Select all content elements that could have 'active' class
          let allContents = document.querySelectorAll('[id]');  // Or more specific selector
          
          // Get the target content
          let activeItem = item.getAttribute('data-content');
          let activeContent = document.querySelector("#"+activeItem);
          
          // Remove 'active' class from all content elements
          allContents.forEach((content) => {
            content.classList.remove('active');
          });
          
          // Add 'active' class to the target content
          activeContent.classList.add('active');
        });
      });

    }


}

new RandalIO_Mods_Main_JS();