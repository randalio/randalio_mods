class RandalIO_Mods_Editor_JS {

  constructor() {
      this.init();
  }

  init() {
      // wait until DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        console.log('randalio mods JS initialized');

      });
    }
}

new RandalIO_Mods_Editor_JS();