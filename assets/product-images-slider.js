const numberOfThumbnailSlides = document.querySelector('[data-glide-thumbnail-slides]')?.dataset?.glideThumbnailSlides
const numberOfThumbnailSlidesPerView = numberOfThumbnailSlides > 5 ? 5 : numberOfThumbnailSlides
const evenOrOddThumbnailsPerView = numberOfThumbnailSlidesPerView % 2 === 0 ? (numberOfThumbnailSlidesPerView / 2) - 1 : 'center'

const glideOptions = {
  image: {
    type: 'carousel',
    startAt: 0,
    perView: 1,
    focusAt: 'center',
    gap: 0,
    dragThreshold: 10,
    peek: 40,
  },
  thumbnail: {
    type: 'carousel',
    startAt: 0,
    perView: numberOfThumbnailSlidesPerView,
    focusAt: evenOrOddThumbnailsPerView
  }
}

const createGlideInstance = (element, optionsObject) => new Glide(element, optionsObject)

const mountGlideInstance = (instance) => instance.mount()

const onSlideOfProductImage = (instance, staticInstance) =>
  instance.on(['mount.after', 'run'], () =>
    staticInstance.go(`=${instance.index}`))


class ProductImagesSlider extends HTMLElement {
  constructor() {
    super();

    this.onThumbnailClick = this.thumbnailClickHandler.bind(this)

    // Thumbnail Slider
    this.glideInstanceThumbnails = createGlideInstance('[data-glide-thumbnails]', glideOptions.thumbnail)
    this.addEventListener('click', this.thumbnailClickHandler)
    mountGlideInstance(this.glideInstanceThumbnails)

    // Product Image Slider
    this.glideInstance = createGlideInstance('[data-glide-product-images]', glideOptions.image)
    onSlideOfProductImage(this.glideInstance, this.glideInstanceThumbnails)
    onSlideOfProductImage(this.glideInstanceThumbnails, this.glideInstance)
    mountGlideInstance(this.glideInstance)
  }

  thumbnailClickHandler (e) {
    if(e.target.matches('[data-thumbnail-image]')) {
      const closestLiToImg = e.target.closest('[data-thumbnail-index]').dataset.thumbnailIndex
      this.glideInstanceThumbnails.go(`=${closestLiToImg}`)
    }
  }
}

customElements.define('product-images-slider', ProductImagesSlider)
