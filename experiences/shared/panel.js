import * as THREE from 'three'

/**
 * A floating 3D panel drawn on a canvas. Holds text and buttons; buttons are hit-tested by UV so they work
 * with a VR controller ray, a hand pinch ray, or the mouse on a flat screen.
 */
const W = 1024
const H = 768
const FONT = '"Mina", "Trebuchet MS", system-ui, sans-serif'

export class Panel {
  constructor({ width = 1.3, name = 'panel' } = {}) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = W
    this.canvas.height = H
    this.ctx = this.canvas.getContext('2d')
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.colorSpace = THREE.SRGBColorSpace
    this.texture.anisotropy = 4
    const height = width * (H / W)
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, toneMapped: false, depthWrite: false }),
    )
    this.mesh.name = name
    this.mesh.renderOrder = 10
    this.buttons = []
    this.hover = null
    this.content = null
  }

  /** content: { title, body, buttons: [{ id, label, primary }], footer, accent } */
  show(content) {
    this.content = content
    this.hover = null
    this.mesh.visible = true
    this.draw()
  }

  hide() {
    this.mesh.visible = false
    this.buttons = []
  }

  setHover(id) {
    if (this.hover === id) return
    this.hover = id
    this.draw()
  }

  /** UV (0..1, origin bottom-left) -> button id or null */
  hit(uv) {
    const x = uv.x * W
    const y = (1 - uv.y) * H
    for (const b of this.buttons) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id
    }
    return null
  }

  draw() {
    const c = this.content
    const ctx = this.ctx
    ctx.clearRect(0, 0, W, H)
    if (!c) return
    const accent = c.accent || '#22d3ee'

    // card
    roundRect(ctx, 8, 8, W - 16, H - 16, 44)
    ctx.fillStyle = 'rgba(6, 12, 28, 0.9)'
    ctx.fill()
    ctx.lineWidth = 5
    ctx.strokeStyle = accent
    ctx.stroke()

    // title
    ctx.fillStyle = accent
    ctx.font = `bold 62px ${FONT}`
    ctx.textBaseline = 'top'
    let y = 52
    y = wrap(ctx, c.title || '', 56, y, W - 112, 70, 2)

    // body
    ctx.fillStyle = '#e8f1ff'
    ctx.font = `38px ${FONT}`
    const bodyLines = Array.isArray(c.body) ? c.body : [c.body || '']
    y += 14
    for (const line of bodyLines) {
      y = wrap(ctx, line, 56, y, W - 112, 50, 6) + 12
    }

    // footer note
    if (c.footer) {
      ctx.fillStyle = c.footerColor || '#8fa6c9'
      ctx.font = `${c.footerColor ? 'bold ' : ''}32px ${FONT}`
      wrap(ctx, c.footer, 56, H - 330, W - 112, 38, 3)
    }

    // buttons: laid out in a row (or column of up to 4 for quiz answers)
    this.buttons = []
    const list = c.buttons || []
    if (c.stack) {
      const bh = 92
      const gap = 16
      const startY = H - 40 - list.length * (bh + gap) + gap
      list.forEach((b, i) => this.drawButton(b, 56, startY + i * (bh + gap), W - 112, bh))
    } else if (list.length) {
      const bh = 120
      const gap = 28
      const bw = (W - 112 - gap * (list.length - 1)) / list.length
      list.forEach((b, i) => this.drawButton(b, 56 + i * (bw + gap), H - 40 - bh, bw, bh))
    }
    this.texture.needsUpdate = true
  }

  drawButton(b, x, y, w, h) {
    const ctx = this.ctx
    const hovered = this.hover === b.id
    roundRect(ctx, x, y, w, h, 30)
    if (b.state === 'right') ctx.fillStyle = '#16a34a'
    else if (b.state === 'wrong') ctx.fillStyle = '#dc2626'
    else if (b.primary) ctx.fillStyle = hovered ? '#67e8f9' : '#22d3ee'
    else ctx.fillStyle = hovered ? '#334a75' : '#1b2a4a'
    ctx.fill()
    ctx.lineWidth = hovered ? 6 : 3
    ctx.strokeStyle = hovered ? '#ffffff' : 'rgba(255,255,255,0.35)'
    ctx.stroke()
    ctx.fillStyle = b.primary && !b.state ? '#04121f' : '#ffffff'
    ctx.font = `bold 42px ${FONT}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(b.label, x + w / 2, y + h / 2 + 2, w - 24)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    this.buttons.push({ id: b.id, x, y, w, h })
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Draw wrapped text; returns the y below the last line. */
function wrap(ctx, text, x, y, maxW, lineH, maxLines) {
  const words = String(text).split(' ')
  let line = ''
  let n = 0
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y)
      y += lineH
      line = w
      n++
      if (n >= maxLines) break
    } else line = test
  }
  if (line && n < maxLines) {
    ctx.fillText(line, x, y)
    y += lineH
  }
  return y
}
