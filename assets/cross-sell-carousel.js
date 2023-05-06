class CrossSellCarousel extends HTMLElement {
  constructor() {
    super();
    this.glideInstance = new Glide('[data-glide-cross-sell]', {
      type: 'carousel',
      startAt: 0,
      perView: 2,
      gap: 15,
      breakpoints: {
        1090: {
          perView: 1
        },
        990: {
          perView: 2
        },
        815: {
          perView: 1
        },
        749: {
          perView: 3
        },
        480: {
          perView: 2
        },
        345: {
          perView: 1
        }
      }
    })
    this.mountGlideInstance()
  }
  mountGlideInstance() {
    this.glideInstance.mount()
  }
}

customElements.define('cross-sell-carousel', CrossSellCarousel)
