const colorSwatches = document.querySelectorAll('[data-color-swatch]')

const toggleVisibilityOfSwatchName = (element) =>
  element.querySelector('[data-color-swatch-name]').classList.toggle('visually-hidden')
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('mouseover', (event) =>
      toggleVisibilityOfSwatchName(event.target))
    swatch.addEventListener('mouseout', (event) =>
      toggleVisibilityOfSwatchName(event.target))
})
