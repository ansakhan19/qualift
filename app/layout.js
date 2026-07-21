import './globals.css'

export const metadata = {
  title: 'Qualift — Fair Fares Application Readiness',
  description: 'Get step-by-step help applying for NYC Fair Fares — a 50% discount on subway and bus fares for income-eligible New Yorkers.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.2.0/tabler-icons.min.css" />
      </head>
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  )
}
