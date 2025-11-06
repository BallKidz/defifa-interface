import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://defifa.net'
  
  const accountAssociation = {
    header: "eyJmaWQiOjE0Mzk0NTEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzZTZEMDBGYjIzMDc2YzhjRjcyQUI5Y2VjNzQzNjk2ZGE1MzYzQ2Y1In0",
    payload: "eyJkb21haW4iOiJqdWljZS1kZWZpZmEtaW50ZXJmYWNlLWRlZmlmYS1iYWxsa2lkei52ZXJjZWwuYXBwIn0",
    signature: "XRnEC0SWIkT4/W4bSu+IQglCXnhToM0y4kqn4NxCB4Ij1BVRnwxF83YEGh/rcDkKD3aPobc2Le1jkn+pmPOY2Bw="
  }
  
  const manifest = {
    accountAssociation,
    miniapp: {
      version: "1",
      name: "Defifa",
      tagline: "Onchain money games",
      iconUrl: `${baseUrl}/assets/defifa-1024.png`, // 1024x1024 - perfect for app icon
      homeUrl: baseUrl,
      imageUrl: `${baseUrl}/assets/defifa-og.png`, // 1200x800 - perfect 3:2 ratio for social sharing
      buttonTitle: "🎮 Play",
      splashImageUrl: `${baseUrl}/assets/defifa-icon.png`, // 200x200 - perfect for splash screen
      heroImageUrl: `${baseUrl}/assets/defifa-promo.png`, // 1200x630 - perfect 1.91:1 ratio for promotional display
      splashBackgroundColor: "#000000",
      description: "Defifa is an onchain gaming and governance experiment. Join a team, load the pot, and win.",
      subtitle: "Money Games with Friends",
      ogTitle: "Play Defifa",
      ogDescription: "Join friends, load the pot, and compete in onchain money games.",
      ogImageUrl: `${baseUrl}/assets/defifa-og.png`,
      screenshotUrls: [
        `${baseUrl}/assets/defifa-promo.png`,
        `${baseUrl}/assets/defifa-og.png`
      ],
      primaryCategory: "entertainment",
      tags: ["gaming", "defifa", "governance", "onchain"],
      noindex: true,
      webhookUrl: "https://api.neynar.com/f/app/d3dd4dea-0be9-4445-acd8-007b927533a7/event",
      baseBuilder: {
        ownerAddress: "0xcc8dF7aB477EA26F7D4d4f2576c673F3E7BC5eD6"
      },
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
