// constants for tab menu
const tabs = document.querySelectorAll('[data-tm-link]')
const tabpanels = document.querySelectorAll('[data-tm-content]')
const tabpanelsArray = [...tabpanels]

// constants for modal
const ingredientsModal = document.querySelector('[data-ingredients-modal]')
const ingredientsModalOpenButton = document.querySelector('[data-ingredients-modal-open-button]')
const ingredientsModalCloseButton = document.querySelector('[data-ingredients-modal-close-button]')
const overlayForOpenIngredientsModal = document.querySelector('[data-ingredients-modal-overlay]')
const focusableElements = ingredientsModal.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])')
const focusableElementsArray = [...focusableElements]

// helper functions for tab menu
const keyPressIs = (keyCode, event) => event.code === keyCode 
const arrowKeyPressIs = (keyCodeOne, keyCodeTwo, event) => 
(event.key || event.code) === keyCodeOne || 
(event.key || event.code) === keyCodeTwo
const removeClassFromAll = (elements, elementClass) => {
  elements.forEach(element => {
    element.classList.remove(elementClass)
  })
}
const addClass = classToAdd => el => el.classList.add(classToAdd)
const removeClass = classToRemove => el => el.classList.remove(classToRemove)
const hide = addClass('hidden')
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

// functions for tab menu
const focusOnFocusableElementsInTabpanel = () => {
  tabpanelsArray.forEach(tabpanel => {
    const focusableElements = tabpanel.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)'
    ).length
    focusableElements ? tabpanel.setAttribute("tabindex", "-1") : tabpanel.setAttribute("tabindex", "0")
  })
}

const contentRelatedToLink = (tab) => {
  const idOfPanel = `#${tab.dataset.tmLink}`
  const relatedPanel = document.querySelector(`${idOfPanel}`)
  return relatedPanel
}

const activateFirstPanel = (tabs, tabpanels) => {
  tabs[0].setAttribute('tabindex', '0')
  tabs[0].setAttribute('aria-selected', 'true')
  // addClass('visible')(tabpanels[0])
  tabpanels[0].classList.add('visible')
}

const setSelectedTab = (element, tabs) => {
  const selectedId = element.id
  tabs.forEach(tab => {
    const id = tab.getAttribute('id')
    if (id === selectedId) {
      tab.removeAttribute('tabindex')
      tab.setAttribute('aria-selected', 'true')
    } else {
      tab.setAttribute('tabindex', '-1')
      tab.setAttribute('aria-selected', 'false')
    }
  })
}



const handleArrowPressOfTab = (tabs, event) => {
  const firstTab = tabs[0]
  const lastTab = tabs[tabs.length - 1]
  if (arrowKeyPressIs('ArrowLeft', 'ArrowUp', event)) {
    const indexOfPrevious = tabs.indexOf(event.target) - 1
    event.target === firstTab ? tabs[tabs.length - 1].focus() : tabs[indexOfPrevious].focus()
  } else if (arrowKeyPressIs('ArrowRight', 'ArrowDown', event)) {
    const indexOfNext = tabs.indexOf(event.target) + 1
    event.target === lastTab ? tabs[0].focus() : tabs[indexOfNext].focus()
  } else {
    return
  }
}

const onSelectionOfTab = (tabs, tabpanels, event) => {
  removeClassFromAll(tabpanels, 'visible')
  const contentElement = contentRelatedToLink(event.target)
  addClass('visible')(contentElement)
  setSelectedTab(event.target, tabs)
}

// functions for modal

const openIngredientsModal = () => {
  showAll([ingredientsModal, overlayForOpenIngredientsModal])
  bodyMakeOverflowHidden()
  listenToKeydownForModal()
}

const closeIngredientsModal = () => {
  hideAll([ingredientsModal, overlayForOpenIngredientsModal])
  bodyRemoveOverflowStyle()
  removeKeydownEventListenersForModal()
}

const closeIngredientsModalOnEsc = (event) => {
  if ( keyPressIs('Escape', event) && !isHidden(ingredientsModal) ) closeIngredientsModal()
}

const closeIngredientsModalOnEnter = (event) => {
  if (keyPressIs('Enter', event) && event.target === ingredientsModalCloseButton) closeingredientsModal()
}

const listenToKeydownForModal = () => {
  document.addEventListener('keydown', closeIngredientsModalOnEsc)
  document.addEventListener('keydown', closeIngredientsModalOnEnter)
  ingredientsModal.addEventListener('keydown', trapFocusInModal)
}

const removeKeydownEventListenersForModal = () => {
  document.removeEventListener('keydown', closeIngredientsModalOnEsc)
  document.removeEventListener('keydown', closeIngredientsModalOnEnter)
  ingredientsModal.removeEventListener('keydown', trapFocusInModal)
}

const getTabDirection = event => {
  if (keyPressIs('Tab', event)) {
    if (event.shiftKey) return -1
    return 1
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

class TabMenu extends HTMLElement {
  constructor() {
    super();

    this.tabsArray = [...tabs]
    this.tabpanelsArray = [...tabpanels]

    activateFirstPanel(this.tabsArray, this.tabpanelsArray)

    this.addEventListener('click', this.tabClickHandler.bind(this))
    this.addEventListener('keydown', this.tabKeydownHandler.bind(this))
  }
  tabClickHandler (event) {
    console.log(event.target)
    if (event.target.hasAttribute('data-tm-link')) {
      onSelectionOfTab(this.tabsArray, this.tabpanelsArray, event)
    }
    if (event.target === ingredientsModalOpenButton) openIngredientsModal()
    if (event.target === ingredientsModalCloseButton || event.target === overlayForOpenIngredientsModal) closeIngredientsModal()
  }
  tabKeydownHandler (event) {
    if (event.target.hasAttribute('data-tm-link')) {
      event.preventDefault()
      if (keyPressIs('Enter', event) || keyPressIs('Space', event)) {
        onSelectionOfTab(this.tabsArray, this.tabpanelsArray, event)
      } else if (keyPressIs('Tab', event)) {
        contentRelatedToLink(event.target).focus()
      } else if (this.tabsArray.length > 1) {
        handleArrowPressOfTab(this.tabsArray, event)
      }
    }
  }
}

customElements.define('tab-menu', TabMenu)
