// @ts-check

/**
 * @template T
 * @param {T} value
 * @returns {NonNullable<T>}
 */
export function assert(value) {
  if (value == null) {
    throw new Error('Assertion failed, value expected to be defined!')
  }

  return value
}

/**
 * @param {string} message
 * @param {unknown[]} meta
 */
export function logger(message, ...meta) {
  console.log('[DOTS]', message, ...meta)
}

/**
 * @param {unknown} value
 */
export function toError(value) {
  if (value instanceof Error) {
    return value
  }

  if (typeof value === 'string') {
    return new Error(value)
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return new Error(value.message)
  }

  return new Error(String(value))
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
export function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2)
}

/**
 * @param {number} degrees
 */
export function rad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * @param {number} number
 * @param {number} range
 * @param {number} maxIter
 * @param {number | null | undefined} [defaultValue]
 */
export function valueToMaxRange(number, range, maxIter, defaultValue) {
  let iterCount = 0

  while (number > range) {
    number -= range
    iterCount++

    if (iterCount === maxIter) {
      return defaultValue ?? 0
    }
  }

  return number
}

/**
 * @param {number | null | undefined} [ms]
 */
export async function sleep(ms) {
  await /**
   * @type {Promise<void>}
   */ (
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms ?? undefined)
    })
  )
}

/**
 * @param {string} src
 */
export async function loadImage(src) {
  const image = new Image()
  image.src = src

  await /**
   * @type {Promise<void>}
   */ (
    new Promise((resolve, reject) => {
      image.onload = () => {
        resolve()
      }

      image.onerror = () => {
        reject()
      }
    })
  )

  return image
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 */
export function fixCanvasResolution(canvas, context) {
  const dpr = window.devicePixelRatio || 1

  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  context.scale(dpr, dpr)
}

/**
 * @param {number} value
 * @param {number} low1
 * @param {number} high1
 * @param {number} low2
 * @param {number} high2
 */
export function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

/**
 * @param {number} number
 * @param {number} lower
 * @param {number | null | undefined} [upper]
 */
export function clamp(number, lower, upper) {
  if (upper == null) {
    return number > lower ? lower : number
  } else {
    if (lower > upper) {
      ;[lower, upper] = [upper, lower]
    }
    return Math.min(Math.max(number, lower), upper)
  }
}

/**
 * @template T
 * @param {T} payload
 * @returns {T extends readonly any[] ? T : [T]}
 */
export function arrayify(payload) {
  // @ts-expect-error
  return Array.isArray(payload) ? payload : [payload]
}

export function noop() {}

export async function anoop() {}

/**
 * @param {number} min
 * @param {number | null | undefined} [max]
 */
export function randomInt(min, max) {
  if (max == null) {
    max = min
    min = 0
  }
  min = Math.ceil(min)
  max = Math.floor(max)
  return min + Math.floor(Math.random() * (max - min + 1))
}

/**
 * @param {{
 *       frequency?: number | null | undefined
 *       duration?: number | null | undefined
 *       volume?: number | null | undefined
 *       type?: OscillatorType | null | undefined
 *     }
 *   | null
 *   | undefined} [settings]
 */
export function beep(settings) {
  const context = new window.AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = settings?.type ?? 'sine'
  oscillator.frequency.value = settings?.frequency ?? 440
  gain.gain.value = settings?.volume ?? 1

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + (settings?.duration ?? 200) / 1000)
}

/**
 * @param {File} file
 */
export async function fileAsBase64(file) {
  /**
   * @type {string}
   */
  const string = await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('FileReader result is not a string!'))
        return
      }
      resolve(reader.result)
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsDataURL(file)
  })

  return string
}

/**
 * @type {HTMLCanvasElement}
 */
export const canvas = assert(document.querySelector('#canvas'))

export async function screenshot() {
  const resultBlob = assert(
    await new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob)
      }, 'image/png')
    })
  )

  const link = document.createElement('a')
  link.href = URL.createObjectURL(resultBlob)
  link.download = `screenshot-${Date.now()}.png`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(link.href)
}

export function getWidth() {
  return canvas.clientWidth
}

export function getHeight() {
  return canvas.clientHeight
}

export function getHalfWidth() {
  return getWidth() / 2
}

export function getHalfHeight() {
  return getHeight() / 2
}

export const context = assert(canvas.getContext('2d'))

/**
 * @type {number[]}
 */
export const dotsX = []

/**
 * @type {number[]}
 */
export const dotsY = []

/**
 * @type {number[]}
 */
export const effectDotsX = []

/**
 * @type {number[]}
 */
export const effectDotsY = []

let speed = 5

export function getSpeed() {
  return speed
}

/**
 * @param {number} newSpeed
 */
export function setSpeed(newSpeed) {
  speed = newSpeed
}

export function decreaseSpeed() {
  if (speed > 0) {
    speed--
  }
}

export function increaseSpeed() {
  speed++
}

let effect = 0

export function getEffect() {
  return effect
}

/**
 * @param {number} newEffect
 */
export function setEffect(newEffect) {
  effect = newEffect
}

export function previousEffect() {
  if (effect > 0) {
    effect--
  }
}

export function nextEffect() {
  if (effect < effects.length - 1) {
    effect++
  }
}

let background = {
  r: 0,
  g: 0,
  b: 0,
}

export function getBackground() {
  return background
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
export function setBackground(r, g, b) {
  background = {
    r,
    g,
    b,
  }
}

let color = {
  r: 255,
  g: 255,
  b: 255,
}

export function getColor() {
  return color
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
export function setColor(r, g, b) {
  color = {
    r,
    g,
    b,
  }
}

/**
 * @type {(() => void) | null | undefined}
 */
let onPreDrawCallback = null

/**
 * @param {(() => void) | null | undefined} [callback]
 */
export function onPreDraw(callback) {
  onPreDrawCallback = callback
}

/**
 * @type {(() => void) | null | undefined}
 */
let onPostDrawCallback = null

/**
 * @param {(() => void) | null | undefined} [callback]
 */
export function onPostDraw(callback) {
  onPostDrawCallback = callback
}

export function clearCallbacks() {
  onPreDraw(null)
  onPostDraw(null)
}

export function clearDots() {
  dotsX.length = 0
  dotsY.length = 0
}

export function clearEffectDots() {
  effectDotsX.length = 0
  effectDotsY.length = 0
}

/**
 * @param {number} x
 * @param {number} y
 */
export function addDot(x, y) {
  dotsX.push(x)
  dotsY.push(y)
}

/**
 * @param {number} x
 * @param {number} y
 */
export function addEffectDot(x, y) {
  effectDotsX.push(x)
  effectDotsY.push(y)
}

/**
 * @typedef {{
 *   image: HTMLImageElement
 *   imageData: ImageData
 *   alphabet: string
 *   letters: string[]
 *   width: number
 *   widthPlus: number
 *   height: number
 *   getPixel: (
 *     x: number,
 *     y: number
 *   ) => {
 *     r: number
 *     g: number
 *     b: number
 *     a: number
 *   }
 *   isPixelBlack: (x: number, y: number) => boolean
 *   letterIndex: (letter: string) => number
 * }} Font
 */

/**
 * @param {HTMLImageElement} image
 * @param {string} alphabet
 * @param {number} width
 * @param {number} height
 * @returns {Font}
 */
export function loadFont(image, alphabet, width, height) {
  const imageWidth = image.width
  const imageHeight = image.height

  const canvas = document.createElement('canvas')
  canvas.width = imageWidth
  canvas.height = imageHeight
  const context = assert(canvas.getContext('2d'))
  context.drawImage(image, 0, 0)

  const imageData = context.getImageData(0, 0, imageWidth, imageHeight)
  const { data } = imageData

  const letters = [...alphabet]

  /**
   * @param {number} x
   * @param {number} y
   */
  function getPixel(x, y) {
    const index = (y * imageWidth + x) * 4

    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3],
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function isPixelBlack(x, y) {
    const { r, g, b } = getPixel(x, y)

    return r === 0 && g === 0 && b === 0
  }

  /**
   * @param {string} letter
   */
  function letterIndex(letter) {
    const result = letters.indexOf(letter)
    return result === -1 ? letters.length : result
  }

  return {
    image,
    imageData,
    alphabet,
    letters,
    width,
    widthPlus: width + 1,
    height,
    getPixel,
    isPixelBlack,
    letterIndex,
  }
}

export const font = loadFont(
  await loadImage('../assets/font.png'),
  'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя 123456789!?()0:.',
  5,
  8
)

/**
 * @param {number} size
 * @param {number} x
 * @param {number} y
 * @param {number} step
 */
function addSquare(size, x, y, step) {
  const halfSize = size / 2
  const startX = x - halfSize
  const startY = y - halfSize

  for (let iy = 1; iy <= size; iy += step) {
    for (let ix = 1; ix <= size; ix += step) {
      addDot(startX + ix, startY + iy)
    }
  }
}

/**
 * @param {{
 *   letter: string
 *   font: Font
 *   x: number
 *   y: number
 *   size: number
 *   offset: number
 *   step: number
 * }} settings
 */
function addLetter(settings) {
  const baseIndex =
    settings.font.letterIndex(settings.letter) * settings.font.widthPlus
  const halfWidth = Math.floor(settings.font.width / 2)
  const halfHeight = Math.floor(settings.font.height / 2)
  const sizeOffset = settings.size + settings.offset

  for (let j = 0; j < settings.font.height; j++) {
    const y = settings.y + (j - halfHeight) * sizeOffset + settings.size / 2

    for (let i = -halfWidth; i <= halfWidth; i++) {
      if (settings.font.isPixelBlack(baseIndex + (i + halfWidth), j)) {
        addSquare(settings.size, settings.x + i * sizeOffset, y, settings.step)
      }
    }
  }
}

/**
 * @param {string} text
 * @param {{
 *       font?: Font | null | undefined
 *       x?: number | null | undefined
 *       y?: number | null | undefined
 *       size?: number | null | undefined
 *       offset?: number | null | undefined
 *       step?: number | null | undefined
 *     }
 *   | null
 *   | undefined} [settings]
 */
export function addText(text, settings) {
  const usedFont = settings?.font ?? font
  const x = settings?.x ?? 0
  const y = settings?.y ?? 0
  const size = settings?.size ?? 15
  const offset = settings?.offset ?? 0
  const step = settings?.step ?? 1

  const letterSpacing = (size + offset) * usedFont.widthPlus
  const letters = [...text]
  const count = letters.length
  const startX = x - letterSpacing * ((count - 1) / 2)

  for (let i = 0; i < count; i++) {
    addLetter({
      letter: letters[i],
      font: usedFont,
      x: startX + i * letterSpacing,
      y,
      size,
      offset,
      step,
    })
  }
}

export function drawDebugCrosshair() {
  context.save()

  context.strokeStyle = 'rgb(255, 0, 0)'
  context.lineWidth = 1

  const width = canvas.width / 2
  const height = canvas.height / 2

  context.translate(width, height)

  context.beginPath()
  context.moveTo(-width, 0)
  context.lineTo(width, 0)
  context.stroke()

  context.beginPath()
  context.moveTo(0, -height)
  context.lineTo(0, height)
  context.stroke()

  context.restore()
}

function fillBackground() {
  context.save()

  context.fillStyle = `rgb(${background.r}, ${background.g}, ${background.b})`
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.restore()
}

function updateDots() {
  if (effectDotsX.length === 0) {
    return
  }

  if (effectDotsX.length !== dotsX.length) {
    return
  }

  if (speed === 0) {
    return
  }

  for (let i = 0; i < dotsX.length; i++) {
    const c = dist(dotsX[i], dotsY[i], effectDotsX[i], effectDotsY[i])

    if (c < speed) {
      effectDotsX[i] = dotsX[i]
      effectDotsY[i] = dotsY[i]
    } else {
      const dx = (dotsX[i] - effectDotsX[i]) / c
      const dy = (dotsY[i] - effectDotsY[i]) / c
      effectDotsX[i] += dx * speed
      effectDotsY[i] += dy * speed
    }
  }
}

function drawDots() {
  const count = effectDotsX.length
  if (count === 0 || effectDotsY.length === 0) {
    return
  }

  const path = new Path2D()

  for (let i = 0; i < count; i++) {
    path.rect(effectDotsX[i], effectDotsY[i], 1, 1)
  }

  context.save()

  context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
  context.translate(canvas.width / 2, canvas.height / 2)
  context.fill(path)

  context.restore()
}

function render() {
  fixCanvasResolution(canvas, context)

  fillBackground()

  onPreDrawCallback?.()

  updateDots()

  drawDots()

  onPostDrawCallback?.()

  requestAnimationFrame(render)
}

requestAnimationFrame(render)

export function removeScript() {
  const script = assert(document.querySelector('#script-index'))
  script.remove()
}

/**
 * @param {string} text
 */
export function addScript(text) {
  const script = document.createElement('script')
  script.textContent = text.replaceAll('../api.js', './javascript/api.js')
  script.type = 'module'
  script.id = 'script-index'

  document.head.append(script)

  return script
}

/**
 * @param {number | null | undefined} [newEffect]
 */
export function applyEffect(newEffect) {
  clearEffectDots()
  effects.at(newEffect ?? effect)?.()
}

export function applyRandomEffect() {
  clearEffectDots()
  setEffect(randomInt(0, effects.length - 1))
  effects.at(effect)?.()
}

export function applyPreviousEffect() {
  clearEffectDots()
  previousEffect()
  effects.at(effect)?.()
}

export function applyNextEffect() {
  clearEffectDots()
  nextEffect()
  effects.at(effect)?.()
}

export const effects = [
  () => {
    const r = Math.min(getHalfWidth(), getHalfHeight())
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(Math.cos(i) * r, Math.sin(i) * r)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(Math.cos(i) * i, Math.sin(i) * i)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i] * 100, dotsY[i] * 100)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(Math.cos(dotsX[i]) * i, Math.sin(dotsY[i]) * i)
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(randomInt(-width, width), randomInt(-height, height))
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      if (randomInt(0, 1) === 1) {
        if (randomInt(0, 1) === 1) {
          addEffectDot(width, 0)
        } else {
          addEffectDot(-width, 0)
        }
      } else {
        if (randomInt(0, 1) === 1) {
          addEffectDot(0, -height)
        } else {
          addEffectDot(0, height)
        }
      }
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(width, height)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsY[i], dotsX[i])
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsY[i] * 2, dotsX[i] * 2)
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(Math.sin(rad(i)) * width, Math.cos(rad(i)) * height)
    }
  },
  () => {
    const count = dotsX.length
    const half = dotsX.length / 2

    for (let i = 0; i < count; i++) {
      const x = i - half
      addEffectDot(x, x)
    }
  },
  () => {
    const count = dotsX.length
    const half = dotsX.length / 2
    const height = getHalfHeight()

    for (let i = 0; i < count; i++) {
      const x = (i - half) / 50
      addEffectDot(x, Math.sin(rad(x)) * height)
    }
  },
  () => {
    const count = dotsX.length
    const half = dotsX.length / 2

    for (let i = 0; i < count; i++) {
      const x = (i - half) / 20
      addEffectDot(x, x)
    }
  },
  () => {
    const offset = Math.min(getHalfWidth(), getHalfHeight())

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i] - offset, dotsY[i] - offset)
    }
  },
  () => {
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(
        dotsX[i],
        dotsY[i] - Math.abs(Math.sin(rad(dotsY[i])) * height)
      )
    }
  },
  () => {
    const height = -getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(-dotsX[i], height)
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(
        width + Math.sin(rad(i)) * height,
        height + Math.cos(rad(i)) * height
      )
    }
  },
  () => {
    const width = getWidth()
    const height = getHeight()
    const halfWidth = width / 2
    const halfHeight = height / 2

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(
        halfWidth + Math.sin(rad(i)) * width,
        halfHeight + Math.cos(rad(i)) * height
      )
    }
  },
  () => {
    const size = Math.max(getHalfWidth(), getHalfHeight())

    for (let i = 0; i < dotsX.length; i++) {
      if (randomInt(0, 1) === 1) {
        if (randomInt(0, 1) === 1) {
          addEffectDot(dotsY[i] - size, dotsX[i] - size)
        } else {
          addEffectDot(dotsY[i] + size, dotsX[i] + size)
        }
      } else {
        if (randomInt(0, 1) === 1) {
          addEffectDot(dotsY[i] - size, dotsX[i] + size)
        } else {
          addEffectDot(dotsY[i] + size, dotsX[i] - size)
        }
      }
    }
  },
  () => {
    const size1 = Math.max(getHalfWidth(), getHalfHeight())
    const size2 = size1 / 2
    const size3 = size2 / 2
    const size4 = size3 / 2

    for (let i = 0; i < dotsX.length; i++) {
      if (randomInt(0, 1) === 1) {
        if (randomInt(0, 1) === 1) {
          addEffectDot(Math.cos(i) * size1, Math.sin(i) * size1)
        } else {
          addEffectDot(Math.cos(i) * size2, Math.sin(i) * size2)
        }
      } else {
        if (randomInt(0, 1) === 1) {
          addEffectDot(Math.cos(i) * size3, Math.sin(i) * size3)
        } else {
          addEffectDot(Math.cos(i) * size4, Math.sin(i) * size4)
        }
      }
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot((Math.cos(rad(i)) * i) / 20, (Math.sin(rad(i)) * i) / 20)
    }
  },
  () => {
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const r = dist(0, 0, dotsX[i], dotsY[i]) * 2
      const f = Math.sin(i) * count
      addEffectDot(r * Math.cos(rad(f)), r * Math.sin(rad(f)))
    }
  },
  () => {
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const f = Math.sin(i) * count
      const r = dist(f, f, dotsX[i], dotsY[i]) / 50
      addEffectDot(r * Math.cos(rad(f)), r * Math.sin(rad(f)))
    }
  },
  () => {
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const f = Math.sin(dotsX[i] + dotsY[i]) * count
      addEffectDot(dotsX[i] * Math.cos(rad(f)), dotsY[i] * Math.sin(rad(f)))
    }
  },
  () => {
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const f = Math.sin(dotsX[i] + dotsY[i]) * count
      addEffectDot(
        dotsX[i] * Math.cos(rad(f)) + dotsY[i],
        dotsY[i] * Math.sin(rad(f)) + dotsX[i]
      )
    }
  },
  () => {
    const width = getWidth()
    const height = getHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(
        ((dotsX[i] * height) / width) * 4,
        ((dotsY[i] * width) / height) * 4
      )
    }
  },
  () => {
    const width = getWidth()
    const height = getHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(
        (((dotsX[i] * height) / width) * dist(0, 0, dotsX[i], dotsY[i])) / 20,
        (((dotsY[i] * width) / height) * dist(0, 0, dotsX[i], dotsY[i])) / 20 -
          500
      )
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i], -dotsY[i])
    }
  },
  () => {
    const size = getHalfHeight()
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i], dotsY[i] + Math.abs(Math.sin(i)) * -size)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i], i / 50)
    }
  },
  () => {
    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(i / 50, i / 50)
    }
  },
  () => {
    const count = dotsX.length
    const doubledCount = count * 2

    const size = Math.min(getHalfWidth(), getHalfHeight())

    for (let i = 0; i < count; i++) {
      const d = valueToMaxRange(i, size, doubledCount, 1)
      addEffectDot(Math.cos(i) * d, Math.sin(i) * d)
    }
  },
  () => {
    const count = dotsX.length
    const half = dotsX.length / 2

    for (let i = 0; i < count; i++) {
      const x = (i - half) / 50
      addEffectDot(x, Math.cos(x) * x - Math.sin(x) * dotsX[i])
    }
  },
  () => {
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      addEffectDot(dotsX[count - i + 1], dotsY[count - i + 1])
    }
  },
  () => {
    const size = Math.min(getHalfWidth(), getHalfHeight())
    const r = 100
    const count = dotsX.length
    const mid = Math.floor(count / 2)

    for (let i = 0; i < mid; i++) {
      addEffectDot(size + Math.cos(i) * r, size + Math.sin(i) * r)
    }

    for (let i = mid; i < count; i++) {
      addEffectDot(-size + Math.cos(i) * r, -size + Math.sin(i) * r)
    }
  },
  () => {
    const r = Math.min(getHalfWidth(), getHalfHeight()) / 1.2

    for (let i = 0; i < dotsX.length; i++) {
      const t = rad(i)
      addEffectDot(
        Math.cos(t) * r,
        (Math.sin(t) + Math.abs(Math.cos(t)) * -0.5) * r
      )
    }
  },
  () => {
    const count = dotsX.length
    const size = getHalfHeight()
    const width = getWidth()
    const height = getHeight()

    for (let i = 0; i < count; i++) {
      const z = i - count

      let x = Math.tan(z) * size
      let y = Math.cos(z) * size

      if (x > width) {
        x = width
      }
      if (x < -width) {
        x = -width
      }
      if (y > height) {
        y = height
      }
      if (y < -height) {
        y = -height
      }

      addEffectDot(x, y)
    }
  },
  () => {
    const count = dotsX.length
    const size = Math.max(getHalfWidth(), getHalfHeight())

    for (let i = 0; i < count; i++) {
      const z = i - count
      const x = Math.sin(rad(z)) * size
      const y = x * Math.cos(rad(x))
      addEffectDot(x, y)
    }
  },
  () => {
    const count = dotsX.length
    const size = getHalfWidth()

    for (let i = 0; i < count; i++) {
      const z = i - count
      const x = Math.sin(z) * size
      const y = x * Math.cos(z)
      addEffectDot(x, y)
    }
  },
  () => {
    const count = dotsX.length
    const size = getHalfWidth()

    for (let i = 0; i < count; i++) {
      const z = i - count
      const x = Math.sin(rad(z)) * size
      const y = Math.sqrt(Math.abs(x))
      addEffectDot(x, y)
    }
  },
  () => {
    const size = 150

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i] + Math.cos(i) * size, dotsY[i] + Math.sin(i) * size)
    }
  },
  () => {
    /**
     * @type {number | null}
     */
    let minX = null

    /**
     * @type {number | null}
     */
    let maxX = null

    const width = getHalfWidth()

    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      if (minX === null || dotsX[i] < minX) {
        minX = dotsX[i]
      }
      if (maxX === null || dotsX[i] > maxX) {
        maxX = dotsX[i]
      }
    }

    for (let i = 0; i < count; i++) {
      addEffectDot(map(dotsX[i], minX ?? 0, maxX ?? 0, -width, width), dotsY[i])
    }
  },
  () => {
    /**
     * @type {number | null}
     */
    let minX = null

    /**
     * @type {number | null}
     */
    let maxX = null

    /**
     * @type {number | null}
     */
    let minY = null

    /**
     * @type {number | null}
     */
    let maxY = null

    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const x = dotsX[i]
      const y = dotsY[i]

      if (minX === null || x < minX) {
        minX = x
      }
      if (maxX === null || x > maxX) {
        maxX = x
      }
      if (minY === null || y < minY) {
        minY = y
      }
      if (maxY === null || y > maxY) {
        maxY = y
      }
    }

    const width = getHalfWidth()
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      const mappedX = map(dotsX[i], minX ?? 0, maxX ?? 0, -width, width)
      const mappedY = map(dotsY[i], minY ?? 0, maxY ?? 0, -height, height)
      addEffectDot(mappedX, mappedY)
    }
  },
  () => {
    const count = dotsX.length
    const mid = Math.floor(count / 2)

    const width = getHalfWidth()

    for (let i = 0; i < mid; i++) {
      addEffectDot(-width, dotsX[i])
    }

    for (let i = mid; i < count; i++) {
      addEffectDot(width, dotsX[i])
    }
  },
  () => {
    const width = getHalfWidth()
    const height = getHalfHeight()

    const r = Math.min(width, height)

    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const x = map(i, 1, count, -width, width)
      const y = map(i, 1, count, -height, height)
      addEffectDot(x + Math.cos(i) * r, y + Math.sin(i) * r)
    }
  },
  () => {
    const puzzlesCount = randomInt(3, 10)
    const puzzleSize = Math.round(dotsX.length / puzzlesCount)
    let aI = 0

    const width = getHalfWidth()
    const height = getHalfHeight()

    /**
     * @type {[number, number][]}
     */
    const offsets = []

    for (let i = 0; i < puzzlesCount; i++) {
      offsets.push([
        randomInt(-width, width) / 1.2,
        randomInt(-height, height) / 1.2,
      ])
    }

    for (let i = 0; i < puzzlesCount; i++) {
      for (let j = 0; j < puzzleSize; j++) {
        if (aI >= dotsX.length) {
          return
        }

        addEffectDot(dotsX[aI] + offsets[i][0], dotsY[aI] + offsets[i][1])

        aI++
      }
    }
  },
  () => {
    const height = -getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      addEffectDot(dotsX[i], dotsY[i] + Math.abs(Math.sin(rad(i))) * height)
    }
  },
  () => {
    const size = Math.min(getHalfWidth(), getHalfHeight())
    const offset = randomInt(0, 1) === 0 ? 180 : 0
    const count = dotsX.length

    for (let i = 0; i < count; i++) {
      const angle = rad(map(i, 1, count, 0 - offset, 360 - offset))
      addEffectDot(Math.cos(angle) * size, Math.sin(angle) * size)
    }
  },
  () => {
    const height = getHalfHeight()

    for (let i = 0; i < dotsX.length; i++) {
      const y = i % 2 === 0 ? height : -height
      addEffectDot(dotsX[i], y)
    }
  },
]
