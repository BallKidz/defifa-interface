# Farcaster Mini App Setup

## Environment Variables

Create a `.env.local` file in your project root with:

```bash
# For local development with ngrok
NEXT_PUBLIC_URL=https://your-ngrok-url.ngrok.io

# For production
# NEXT_PUBLIC_URL=https://your-domain.com
```

## Required Assets

You'll need to create these image assets in your `public/assets/` directory:

1. **`defifa-icon.png`** - 200x200px app icon for splash screen
2. **`defifa-og.png`** - 3:2 aspect ratio (600x400px minimum) for social sharing
3. **`game-{gameId}-og.png`** - Dynamic game-specific OG images (optional)

## Manifest Setup

1. **Deploy your app** to a domain (or use ngrok for testing)
2. **Visit the Farcaster Manifest Tool**: https://farcaster.xyz/~/developers/mini-apps/manifest
3. **Enter your domain** and app details
4. **Sign the manifest** with your Farcaster account
5. **Update the manifest** in `src/app/.well-known/farcaster.json/route.ts` with the signed `accountAssociation`

## Testing

1. **Start your dev server**: `npm run dev`
2. **Set up ngrok**: `ngrok http 3000`
3. **Update NEXT_PUBLIC_URL** in `.env.local` with your ngrok URL
4. **Test the manifest**: `curl https://your-ngrok-url.ngrok.io/.well-known/farcaster.json`
5. **Use the preview tool**: https://farcaster.xyz/~/developers/mini-apps/preview

## Features Implemented

### Core Mini App Integration
✅ **SDK Integration**: `sdk.actions.ready()` called early in app load
✅ **Dynamic Manifest**: Generated based on NEXT_PUBLIC_URL environment variable
✅ **Meta Tags**: Added `fc:miniapp` and `fc:frame` tags to layouts
✅ **Game-Specific Embeds**: Each game page has its own shareable embed
✅ **Environment-Based URLs**: Works with both ngrok and production domains

### Automatic Wallet Connection
✅ **Farcaster Mini App Wagmi Connector** - Automatically connects to user's wallet when in Mini App context
✅ **Environment Detection** - Detects if running in Farcaster Mini App vs regular web
✅ **Seamless UX** - No wallet selection dialogs needed in Mini App context
✅ **Fallback Support** - Regular RainbowKit wallet selection for web users

### Implementation Details

#### Wallet Integration
- **Mini App Context**: Automatically connects to Farcaster wallet using `@farcaster/miniapp-wagmi-connector`
- **Web Context**: Uses standard RainbowKit with MetaMask, WalletConnect, and Coinbase Wallet
- **Auto-Connection**: When `sdk.isInMiniApp()` returns `true`, wallet connects automatically
- **Context Detection**: `useIsInMiniApp()` hook detects Mini App environment

#### Key Components
- `src/hooks/useIsInMiniApp.ts` - Detects Mini App environment
- `src/hooks/useFarcasterContext.ts` - Provides Farcaster user context
- `src/components/layout/Navbar/Wallet/MiniAppWallet.tsx` - Mini App-specific wallet component
- `src/components/FarcasterProvider.tsx` - Enhanced with debugging and context logging

#### Wagmi Configuration
- Farcaster Mini App connector added as first connector (highest priority)
- Standard connectors (MetaMask, WalletConnect, Coinbase) available for web users
- Automatic connection logic when in Mini App context

### User Experience
- **In Farcaster**: Users are automatically connected to their wallet, no interaction needed
- **On Web**: Users see familiar wallet selection dialog with multiple options
- **Seamless**: Same app works perfectly in both contexts without code changes

## Next Steps

1. Create the required image assets
2. Set up your environment variables
3. Deploy and sign your manifest
4. Test with the Farcaster preview tool
