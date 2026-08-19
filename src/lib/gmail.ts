interface GmailComposeParams {
  to?: string
  subject: string
  body: string
}

const GMAIL_COMPOSE_URL = 'https://mail.google.com/mail/'

export function buildGmailComposeLink({ to, subject, body }: GmailComposeParams): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    su: subject,
    body,
  })

  if (to) params.set('to', to)

  return `${GMAIL_COMPOSE_URL}?${params.toString()}`
}
