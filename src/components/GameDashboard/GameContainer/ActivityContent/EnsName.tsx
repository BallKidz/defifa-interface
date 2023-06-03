import { useEnsName } from 'hooks/useEnsName'
import { ensAvatarUrlForAddress } from 'utils/ens'

interface EthereumAddressProps {
  address: string | undefined
  ensDisabled?: boolean
}

export default function EthereumAddress({
  address,
  ensDisabled = false,
}: EthereumAddressProps) {
  const { data: ensName } = useEnsName(address, { enabled: !ensDisabled })
  return (
    <div>
      <span className="inline-flex items-center">
        {ensName && address && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ensAvatarUrlForAddress(address, { size: 72 })}
            className="mr-2 h-9 w-9 rounded-full"
            alt={`Avatar for ${ensName}`}
            loading="lazy"
          />
        )}
        {!ensName && address && (
          <div className="mr-2 h-9 w-9 rounded-full bg-lime-400"></div>
        )}
        <div>{ensName || address}</div>
      </span>
    </div>
  )
}