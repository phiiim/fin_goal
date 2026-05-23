import crypto from 'node:crypto'
import express from 'express'

const app = express()

const PORT = Number(process.env.PORT || 3001)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'change-me'

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf
  },
}))

function isValidGitHubSignature(req) {
  const signature = req.get('x-hub-signature-256') || ''
  if (!signature.startsWith('sha256=')) return false

  const expected = `sha256=${crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.rawBody || Buffer.from(''))
    .digest('hex')}`

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (signatureBuffer.length !== expectedBuffer.length) return false

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
}

app.get('/webhook/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.post('/webhook', (req, res) => {
  if (!isValidGitHubSignature(req)) {
    return res.status(401).json({ ok: false, message: 'Invalid signature' })
  }

  const event = req.get('x-github-event') || 'unknown'
  const deliveryId = req.get('x-github-delivery') || 'unknown'

  console.log(`[webhook] event=${event} delivery=${deliveryId}`)

  if (event === 'ping') {
    return res.status(200).json({ ok: true, message: 'pong' })
  }

  if (event === 'push') {
    const ref = req.body?.ref
    const pusher = req.body?.pusher?.name
    console.log(`[webhook] push ref=${ref} by=${pusher}`)
  }

  return res.status(200).json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`[webhook] listening on http://localhost:${PORT}/webhook`)
  if (WEBHOOK_SECRET === 'change-me') {
    console.log('[webhook] warning: using default WEBHOOK_SECRET; set a secure secret in env')
  }
})
