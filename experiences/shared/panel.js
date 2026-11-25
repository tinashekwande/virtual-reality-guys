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

  /**
   * content: { title, body, buttons: [{ id, label, primary, state, size }], footer, footerColor, accent,
   *            stack (answers in a column), rows (grid), rowsTop, logo (small badge text), hidden: [{ id, x, y, w, h }],
   *            buttonRows: [[...], [...]] (rows of buttons along the bottom),
   *            extra: { h, draw(ctx, box) } for a picture strip of height h just above the footer }
   */
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
    if (id && this.buttons.find((b) => b.id === id && b.hidden)) id = null
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

    // small hidden badge (e.g. hold it for teacher mode): drawn quietly in the top-right corner
    const titleW = c.logo ? W - 112 - 150 : W - 112
    if (c.logo) {
      ctx.font = `bold 26px ${FONT}`
      ctx.fillStyle = 'rgba(143,166,201,0.55)'
      ctx.textAlign = 'right'
      ctx.fillText(c.logo, W - 50, 44)
      ctx.textAlign = 'left'
    }

    // title
    ctx.fillStyle = accent
    ctx.font = `bold 62px ${FONT}`
    ctx.textBaseline = 'top'
    let y = 52
    y = wrap(ctx, c.title || '', 56, y, titleW, 70, 2)

    // body: shrinks the text a little if it would run into the footer or the buttons
    const list = c.buttons || []
    const bRows = c.buttonRows ? c.buttonRows.filter((r) => r.length) : null
    const btnTop = c.rows ? H : bRows ? H - 40 - bRows.length * 100 - (bRows.length - 1) * 18 : c.stack ? H - 40 - list.length * 108 + 16 : list.length ? H - 160 : H - 30
    const footerLines = c.footer ? 3 : 0
    let footerTop = btnTop - 20 - footerLines * 38
    const bodyLines = Array.isArray(c.body) ? c.body : c.body ? [c.body] : []
    const bodyTop = y + 14
    let fs = 38
    const measure = (size) => {
      ctx.font = `${size}px ${FONT}`
      let yy = bodyTop
      for (const line of bodyLines) yy = wrap(ctx, line, 56, yy, W - 112, size * 1.32, 7, true) + 12
      return yy
    }
    if (c.footer) {
      ctx.font = `32px ${FONT}`
      footerTop = btnTop - 22 - countLines(ctx, c.footer, W - 112, 3) * 38
    }
    const extraH = c.extra ? c.extra.h || 0 : 0
    const limit = footerTop - extraH - 4
    while (fs > 28 && measure(fs) > limit) fs -= 2
    this.overflow = measure(fs) > limit
    ctx.fillStyle = '#e8f1ff'
    ctx.font = `${fs}px ${FONT}`
    y = bodyTop
    for (const line of bodyLines) {
      y = wrap(ctx, line, 56, y, W - 112, fs * 1.32, 7) + 12
    }

    // custom drawing (pictures, counters) in the space under the text
    if (c.extra) {
      ctx.save()
      c.extra.draw(ctx, { x: 56, y: footerTop - extraH - 2, w: W - 112, h: extraH - 6 })
      ctx.restore()
    }

    // footer note
    if (c.footer) {
      ctx.fillStyle = c.footerColor || '#8fa6c9'
      ctx.font = `${c.footerColor ? 'bold ' : ''}32px ${FONT}`
      wrap(ctx, c.footer, 56, footerTop, W - 112, 38, 3)
    }

    // buttons: laid out in a row (or column of up to 4 for quiz answers)
    this.buttons = []
    if (c.rows) {
      // a grid: each row's buttons share the width (for pickers)
      const top = c.rowsTop ?? (c.title ? 150 : 40), gap = c.rowGap ?? 20
      const bh = Math.min(120, (H - top - 30 - gap * (c.rows.length - 1)) / c.rows.length)
      c.rows.forEach((row, r) => {
        const bw = (W - 80 - gap * (row.length - 1)) / row.length
        row.forEach((b, i) => this.drawButton(b, 40 + i * (bw + gap), top + r * (bh + gap), bw, bh))
      })
    } else if (bRows) {
      // several rows of buttons along the bottom (e.g. extra activities above, Back / Next below)
      bRows.forEach((row, r) => {
        const bh = 100, gap = 24
        const bw = (W - 112 - gap * (row.length - 1)) / row.length
        const yy = btnTop + r * (bh + 18)
        row.forEach((b, i) => this.drawButton(b, 56 + i * (bw + gap), yy, bw, bh))
      })
    } else if (c.stack) {
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
    // invisible hot spots (no highlight), e.g. the badge you hold down for teacher mode
    for (const h of c.hidden || []) this.buttons.push({ ...h, hidden: true })
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
    ctx.font = `bold ${b.size || (h < 90 ? 36 : 42)}px ${FONT}`
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

function countLines(ctx, text, maxW, maxLines) {
  return Math.max(1, Math.round((wrap(ctx, text, 0, 0, maxW, 1, maxLines, true))))
}

/** Draw wrapped text; returns the y below the last line. dry = measure only. */
function wrap(ctx, text, x, y, maxW, lineH, maxLines, dry = false) {
  const words = String(text).split(' ')
  let line = ''
  let n = 0
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxW && line) {
      if (!dry) ctx.fillText(line, x, y)
      y += lineH
      line = w
      n++
      if (n >= maxLines) break
    } else line = test
  }
  if (line && n < maxLines) {
    if (!dry) ctx.fillText(line, x, y)
    y += lineH
  }
  return y
}
