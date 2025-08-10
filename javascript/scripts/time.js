// @ts-check

import { addText, applyRandomEffect, clearDots } from '../api.js'

function getTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * @type {string | null}
 */
let time = null

function loop() {
  if (time !== getTime()) {
    time = getTime()
    clearDots()
    addText(time)
    applyRandomEffect()
  }

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
