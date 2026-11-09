import { unsubscribeByToken } from '@/lib/marketing/service'

/**
 * Public unsubscribe endpoint linked from every marketing email.
 * GET shows a confirmation button (so link scanners can't unsubscribe people);
 * POST performs it (also used by one-click List-Unsubscribe in mail apps).
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function page(title: string, body: string) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — Virtual Reality Guys</title>
<style>body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0b0f19;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}main{max-width:440px;width:100%;background:#111827;border:1px solid #1f2937;border-radius:16px;padding:32px;text-align:center}h1{font-size:20px;margin:0 0 12px}p{color:#9ca3af;line-height:1.5;font-size:15px}button{background:#06b6d4;color:#04121a;border:0;border-radius:10px;padding:12px 20px;font-weight:600;font-size:15px;cursor:pointer}a{color:#22d3ee}</style></head>
<body><main>${body}</main></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  if (!UUID.test(token)) return page('Invalid link', '<h1>This link is not valid</h1><p>Please reply to any of our emails and we will remove you manually.</p>')
  return page(
    'Unsubscribe',
    `<h1>Unsubscribe from Virtual Reality Guys emails?</h1><p>You will no longer receive promotions and news from us. Emails about bookings you've made will still reach you.</p>
<form method="post"><input type="hidden" name="token" value="${token}"><button type="submit">Yes, unsubscribe me</button></form>`
  )
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  let token = url.searchParams.get('token') || ''
  if (!token) {
    const form = await request.formData().catch(() => null)
    token = String(form?.get('token') || '')
  }
  if (!UUID.test(token)) return page('Invalid link', '<h1>This link is not valid</h1>')
  await unsubscribeByToken(token).catch(() => null)
  return page(
    'Unsubscribed',
    `<h1>You've been unsubscribed</h1><p>Sorry to see you go! You won't receive marketing emails from us any more.</p><p><a href="/">Back to virtualrealityguyz.co.za</a></p>`
  )
}
