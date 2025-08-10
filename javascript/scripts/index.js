// @ts-check

import {
  addScript,
  addText,
  applyEffect,
  applyNextEffect,
  applyPreviousEffect,
  clearDots,
  decreaseSpeed,
  increaseSpeed,
  removeScript,
  screenshot,
} from '../api.js'

const ac = new AbortController()

document.addEventListener(
  'keydown',
  async event => {
    const { code, ctrlKey } = event

    switch (code) {
      case 'Space':
        applyEffect()
        break
      case 'ArrowUp':
        applyNextEffect()
        break
      case 'ArrowDown':
        applyPreviousEffect()
        break
      case 'ArrowRight':
        increaseSpeed()
        break
      case 'ArrowLeft':
        decreaseSpeed()
        break
      case 'KeyS':
        if (ctrlKey) {
          event.preventDefault()
          await screenshot()
        }
        break
      case 'KeyV':
        if (ctrlKey) {
          const text = await navigator.clipboard.readText()
          if (text === '') {
            break
          }
          clearDots()
          addText(text)
          applyEffect()
        }
        break
      default:
        break
    }
  },
  {
    signal: ac.signal,
  }
)

document.addEventListener(
  'wheel',
  event => {
    const { deltaY } = event

    if (deltaY < 0) {
      applyNextEffect()
    } else if (deltaY > 0) {
      applyPreviousEffect()
    }
  },
  {
    signal: ac.signal,
  }
)

document.addEventListener(
  'dragover',
  event => {
    event.preventDefault()
  },
  {
    signal: ac.signal,
  }
)

document.addEventListener(
  'drop',
  async event => {
    event.preventDefault()

    const [file] = Array.from(event.dataTransfer?.files ?? [])

    if (!file) {
      return
    }

    if (file.name.endsWith('.js') || file.type === 'text/javascript') {
      ac.abort()
      removeScript()
      const text = await file.text()
      addScript(text)
    }
  },
  {
    signal: ac.signal,
  }
)

addText('checking')

applyEffect()
