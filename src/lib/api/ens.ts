import axios from 'axios'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'

/**
 * Try to resolve an ENS name or address.
 *
 * If mainnet, first tries ENSIdeas API. Then, falls back to our API.
 * @param addressOrEnsName - ens name or address
 * @returns
 */

export function resolveAddress(addressOrEnsName: string) {
  try {
    const chainData = 1; // TODO: get chainId
  
    if (chainData !== 1) {
      throw new Error('Not mainnet, skipping to resolver fallback.')
    }

    return resolveAddressEnsIdeas(addressOrEnsName)
  } catch (e) {
    return axios
      .get<{ name: string; address: string }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/ens/resolve/${addressOrEnsName}`,
      )
      .then(data => data.data)
  }
}