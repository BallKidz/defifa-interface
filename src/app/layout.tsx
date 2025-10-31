import { Providers } from './providers'
import { FarcasterProvider } from '../components/FarcasterProvider'
import { Metadata } from 'next'

// Dynamic metadata based on environment
const baseUrl =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://defifa.net')
const imageUrl = `${baseUrl}/assets/defifa-og.png` // 1200x800 - perfect 3:2 ratio for social sharing
const iconUrl = `${baseUrl}/assets/defifa-icon.png` // 200x200 - splash screen

export const metadata: Metadata = {
  title: 'Defifa - Money Games with Friends',
  description: 'Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win.',
  openGraph: {
    title: 'Defifa - Money Games with Friends',
    description: 'Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win.',
    images: [imageUrl],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: imageUrl,
      button: {
        title: "🎮 Play",
        action: {
          type: "launch_frame",
          name: "Defifa",
          url: baseUrl,
          splashImageUrl: iconUrl,
          splashBackgroundColor: "#000000"
        }
      }
    }),
    // For backward compatibility
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: imageUrl,
      button: {
        title: "🎮 Play",
        action: {
          type: "launch_frame",
          name: "Defifa",
          url: baseUrl,
          splashImageUrl: iconUrl,
          splashBackgroundColor: "#000000"
        }
      }
    })
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black font-mono text-neutral-50">
        <Providers>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </Providers>
      </body>
    </html>
  )
}
