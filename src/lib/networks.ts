/**
 * Network abbreviations and utilities for multi-chain support
 */

export type NetworkAbbreviation = 'eth' | 'opt' | 'arb' | 'base' | 'sep' | 'optsep' | 'arbsep' | 'basesep';

export interface NetworkInfo {
  chainId: number;
  abbreviation: NetworkAbbreviation;
  name: string;
  isTestnet: boolean;
  priority: number; // Higher number = higher priority for display
}

export const NETWORKS: Record<NetworkAbbreviation, NetworkInfo> = {
  eth: {
    chainId: 1,
    abbreviation: 'eth',
    name: 'Ethereum Mainnet',
    isTestnet: false,
    priority: 100,
  },
  opt: {
    chainId: 10,
    abbreviation: 'opt',
    name: 'Optimism',
    isTestnet: false,
    priority: 90,
  },
  arb: {
    chainId: 42161,
    abbreviation: 'arb',
    name: 'Arbitrum',
    isTestnet: false,
    priority: 80,
  },
  base: {
    chainId: 8453,
    abbreviation: 'base',
    name: 'Base',
    isTestnet: false,
    priority: 70,
  },
  sep: {
    chainId: 11155111,
    abbreviation: 'sep',
    name: 'Sepolia Testnet',
    isTestnet: true,
    priority: 60,
  },
  optsep: {
    chainId: 11155420,
    abbreviation: 'optsep',
    name: 'Optimism Sepolia',
    isTestnet: true,
    priority: 50,
  },
  arbsep: {
    chainId: 421614,
    abbreviation: 'arbsep',
    name: 'Arbitrum Sepolia',
    isTestnet: true,
    priority: 40,
  },
  basesep: {
    chainId: 84532,
    abbreviation: 'basesep',
    name: 'Base Sepolia',
    isTestnet: true,
    priority: 30,
  },
};

/**
 * Get network info by chain ID
 */
export function getNetworkByChainId(chainId: number): NetworkInfo | undefined {
  return Object.values(NETWORKS).find(n => n.chainId === chainId);
}

/**
 * Get network name by chain ID
 * @param chainId - The chain ID
 * @returns Human-readable network name
 */
export function getNetworkName(chainId: number): string {
  const network = getNetworkByChainId(chainId);
  return network?.name || `Chain ${chainId}`;
}

// Get all mainnet networks (for production arcade)
export function getMainnetNetworks(): NetworkInfo[] {
  return Object.values(NETWORKS)
    .filter(network => !network.isTestnet)
    .sort((a, b) => b.priority - a.priority);
}

// Get all testnet networks (for development)
export function getTestnetNetworks(): NetworkInfo[] {
  return Object.values(NETWORKS)
    .filter(network => network.isTestnet)
    .sort((a, b) => b.priority - a.priority);
}

// Get all networks with mainnets first
export function getAllNetworks(): NetworkInfo[] {
  return [...getMainnetNetworks(), ...getTestnetNetworks()];
}

/**
 * Get network info by abbreviation
 */
export function getNetworkByAbbreviation(abbr: string): NetworkInfo | undefined {
  return NETWORKS[abbr as NetworkAbbreviation];
}

/**
 * Get the abbreviation for a chain ID
 * Defaults to 'sep' if chain ID is not found
 */
export function getNetworkAbbreviation(chainId: number): NetworkAbbreviation {
  const network = getNetworkByChainId(chainId);
  return network?.abbreviation || 'sep';
}

/**
 * Parse a network-prefixed game ID like "sep:32" or "eth:15"
 * @returns { network, gameId } or null if invalid format
 */
export function parseNetworkGameId(networkGameId: string): {
  network: NetworkInfo;
  gameId: number;
} | null {
  const parts = networkGameId.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [networkAbbr, gameIdStr] = parts;
  const network = getNetworkByAbbreviation(networkAbbr);
  const gameId = parseInt(gameIdStr, 10);

  if (!network || isNaN(gameId)) {
    return null;
  }

  return { network, gameId };
}

/**
 * Format a game ID with its network prefix
 * @param chainId - The chain ID
 * @param gameId - The game ID
 * @returns "network:gameId" format (e.g., "sep:32")
 */
export function formatNetworkGameId(chainId: number, gameId: number): string {
  const abbr = getNetworkAbbreviation(chainId);
  return `${abbr}:${gameId}`;
}

/**
 * Build a game URL path
 * @param chainId - The chain ID
 * @param gameId - The game ID
 * @param subpath - Optional subpath like "play"
 * @returns URL path like "/game/sep:32" or "/game/sep:32/play"
 */
export function buildGamePath(chainId: number, gameId: number, subpath?: string): string {
  const networkGameId = formatNetworkGameId(chainId, gameId);
  const base = `/game/${networkGameId}`;
  return subpath ? `${base}/${subpath}` : base;
}

