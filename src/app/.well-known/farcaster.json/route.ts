import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://defifa.net'
  
  // Use different account associations based on the domain
  const isDefifaDomain = baseUrl.includes('defifa.net')
  
  const accountAssociation = isDefifaDomain ? {
    header: "eyJmaWQiOjQxNjMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhEZjA4N0I3MjQxNzRBM0U0ZUQyMzM4QzA3OTgxOTM5MzJFODUxRjFiIn0",
    payload: "eyJkb21haW4iOiIxMjdjNjcyOTIzMjQubmdyb2suYXBwIn0",
    signature: "vVvm8DkE+BYn2yBTQ4zz5FPu+uU90n3fT0YsfzdZ6VM2ESCrdKHfjhHipIObSXBeqXxezSEJFZiZKiFP/MDKzRs="
  } : {
    header: "eyJmaWQiOjQxNjMsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhEZjA4N0I3MjQxNzRBM0U0ZUQyMzM4QzA3OTgxOTM5MzJFODUxRjFiIn0",
    payload: "eyJkb21haW4iOiJqdWljZS1kZWZpZmEtaW50ZXJmYWNlLWRlZmlmYS1iYWxsa2lkei52ZXJjZWwuYXBwIn0",
    signature: "noVttL00j5LJkV2sIIDXRc35Houjf0OAnDC4+Zu/rSZvQSybmRyDOZ0WYnL12iGSdCPcLm3i8/eW198paSJJURs="
  }
  
  const manifest = {
    accountAssociation,
    miniapp: {
      version: "1",
      name: "Defifa",
      iconUrl: `${baseUrl}/assets/defifa-1024.png`, // 1024x1024 - perfect for app icon
      homeUrl: baseUrl,
      imageUrl: `${baseUrl}/assets/defifa-og.png`, // 1200x800 - perfect 3:2 ratio for social sharing
      buttonTitle: "🎮 Play",
      splashImageUrl: `${baseUrl}/assets/defifa-icon.png`, // 200x200 - perfect for splash screen
      heroImageUrl: `${baseUrl}/assets/defifa-promo.png`, // 1200x630 - perfect 1.91:1 ratio for promotional display
      splashBackgroundColor: "#000000",
      description: "Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win.",
      subtitle: "Money Games with Friends",
      primaryCategory: "entertainment",
      tags: ["gaming", "defifa", "governance", "onchain"],
      noindex: true,
      webhookUrl: "https://api.neynar.com/f/app/d3dd4dea-0be9-4445-acd8-007b927533a7/event",
      // requiredChains: ["eip155:8453"], // Uncomment if you require specific chains
      // requiredCapabilities: ["wallet.getEthereumProvider"] // Uncomment if you require specific capabilities
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
