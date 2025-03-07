import '../styles/global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Syncer Program - Level Up With Visual & Memorable Javascript',
  description: 'Learn JavaScript visually and memorably.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <script async src="https://cdn.paddle.com/paddle/paddle.js"></script>

      </head>
      <body>{children}</body>
    </html>
  )
}
      // window.Paddle.Environment.set('sandbox');
            // Sandbox product 54653