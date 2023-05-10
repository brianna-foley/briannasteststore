const tabs = document.querySelectorAll('[data-tm-link]')
const tabpanels = document.querySelectorAll('[data-tm-content]')
const tabpanelsArray = [...tabpanels]

const keyPressIs = (keyCode, event) => event.code === keyCode 

const arrowKeyPressIs = (keyCodeOne, keyCodeTwo, event) => 
(event.key || event.code) === keyCodeOne || 
(event.key || event.code) === keyCodeTwo

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

const removeClassFromAll = (elements, elementClass) => {
  elements.forEach(element => {
    element.classList.remove(elementClass)
  })
}
const addClass = (element, classToAdd) => element.classList.add(classToAdd)

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
  addClass(contentElement, 'visible')
  setSelectedTab(event.target, tabs)
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
    if (event.target.hasAttribute('data-tm-link')) {
      onSelectionOfTab(this.tabsArray, this.tabpanelsArray, event)
    }
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
