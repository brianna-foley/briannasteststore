// Constants
const sizeGuideModal = document.querySelector('[data-size-guide-modal]')
const sizeGuideModalOpenButton = document.querySelector('[data-size-guide-modal-open-button]')
const sizeGuideModalCloseButton = document.querySelector('[data-size-guide-modal-close-button]')
const overlayForOpenSizeGuideModal = document.querySelector('[data-size-guide-modal-overlay]')
const focusableElements = sizeGuideModal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])')
const focusableElementsArray = [...focusableElements]

// Utility Functions
const addClass = string => el => el.classList.add(string)
const removeClass = string => el => el.classList.remove(string)
const hide = addClass('hidden')
const makeBlue = addClass()
const show = removeClass('hidden')
const map = fn => arr => arr.map(fn)
const showAll = map(show)
const hideAll = map(hide)
const contains = string => el => el.classList.contains(string)
const isHidden = contains('hidden')
const bodyMakeOverflowHidden = () => {
  document.body.style.overflow = 'hidden'
}
const bodyRemoveOverflowStyle = () => {
  document.body.style.removeProperty('overflow')
}
const modulo = (x,y) => ((y % x) + x)  % x
const combine = (a, b) => a + b

// Functions
const keyPressIs = (nameOfKey, event) => event.code === nameOfKey 

const openSizeGuideModal = () => {
  showAll([sizeGuideModal, overlayForOpenSizeGuideModal])
  bodyMakeOverflowHidden()
  listenToKeydownForModal()
}

const closeSizeGuideModal = () => {
  hideAll([sizeGuideModal, overlayForOpenSizeGuideModal])
  bodyRemoveOverflowStyle()
  removeKeydownEventListenersForModal()
}

const closeSizeGuideModalOnEsc = (event) => {
  if ( keyPressIs('Escape', event) && !isHidden(sizeGuideModal) ) closeSizeGuideModal()
}

const closeSizeGuideModalOnEnter = (event) => {
  if (keyPressIs('Enter', event) && event.target === sizeGuideModalCloseButton) closeSizeGuideModal()
}

const listenToKeydownForModal = () => {
  document.addEventListener('keydown', closeSizeGuideModalOnEsc)
  document.addEventListener('keydown', closeSizeGuideModalOnEnter)
  sizeGuideModal.addEventListener('keydown', trapFocusInModal)
}

const removeKeydownEventListenersForModal = () => {
  document.removeEventListener('keydown', closeSizeGuideModalOnEsc)
  document.removeEventListener('keydown', closeSizeGuideModalOnEnter)
  sizeGuideModal.removeEventListener('keydown', trapFocusInModal)
}

const getTabDirection = event => {
  if (keyPressIs('Tab', event)) {
    if (event.shiftKey) {
      return -1
    } else return 1
  }
}

const getValidDirection = (length, desiredIndex) => modulo(length, desiredIndex)

const trapFocusInModal = (event) => {
  event.preventDefault()
  if (keyPressIs('Tab', event)) {
    const length = focusableElementsArray.length
    const activeElement = document.activeElement
    const indexOfFocusedElement = focusableElementsArray.indexOf(activeElement)
    const desiredIndex = combine(indexOfFocusedElement, getTabDirection(event))
    const index = getValidDirection(length, desiredIndex)
    focusableElementsArray[index].focus()
  }
}

// Event Listeners
const initSizeGuideListeners = (openButton, closeButton, overlay) => {
  openButton && openButton.addEventListener('click', openSizeGuideModal)
  closeButton && closeButton.addEventListener('click', closeSizeGuideModal)
  overlay && overlay.addEventListener('click', closeSizeGuideModal)
}

// API
const initSizeGuide = () => 
  initSizeGuideListeners(sizeGuideModalOpenButton, sizeGuideModalCloseButton, overlayForOpenSizeGuideModal)

initSizeGuide()
