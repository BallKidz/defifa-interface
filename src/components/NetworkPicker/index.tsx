import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from "components/UI/Button";

interface Network {
  id: number;
  name: string;
  shortName: string;
  icon?: string;
  color: string;
}

const networks: Network[] = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    shortName: "Mainnet",
    color: "bg-blue-600",
  },
  {
    id: 11155111,
    name: "Sepolia Testnet",
    shortName: "Sepolia",
    color: "bg-purple-600",
  },
  // Add more networks here as they become available
  // {
  //   id: 42161,
  //   name: "Arbitrum One",
  //   shortName: "Arbitrum",
  //   color: "bg-cyan-600",
  // },
  // {
  //   id: 10,
  //   name: "Optimism",
  //   shortName: "Optimism",
  //   color: "bg-red-600",
  // },
  // {
  //   id: 137,
  //   name: "Polygon",
  //   shortName: "Polygon",
  //   color: "bg-purple-500",
  // },
  // {
  //   id: 56,
  //   name: "BSC",
  //   shortName: "BSC",
  //   color: "bg-yellow-600",
  // },
  // {
  //   id: 250,
  //   name: "Fantom",
  //   shortName: "Fantom",
  //   color: "bg-blue-500",
  // },
  // {
  //   id: 43114,
  //   name: "Avalanche",
  //   shortName: "Avalanche",
  //   color: "bg-red-500",
  // },
  // {
  //   id: 25,
  //   name: "Cronos",
  //   shortName: "Cronos",
  //   color: "bg-orange-600",
  // },
];

export function NetworkPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[1]); // Default to Sepolia

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
  };

  const getNetworkPath = (network: Network, type: 'arcade' | 'create') => {
    const networkPrefix = network.id === 1 ? "eth" : "sep"; // You can expand this logic
    return type === 'arcade' ? `/arcade/${networkPrefix}` : `/create/${networkPrefix}`;
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Button
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedNetwork.color}`} />
              <span>{selectedNetwork.shortName}</span>
            </div>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSelect(network)}
                  className={`w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3 ${
                    selectedNetwork.id === network.id ? 'bg-neutral-800' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${network.color}`} />
                  <div>
                    <div className="font-medium">{network.shortName}</div>
                    <div className="text-sm text-neutral-400">{network.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Link href={getNetworkPath(selectedNetwork, 'arcade')}>
            <Button size="lg" className="flex items-center gap-2">
              Enter arcade{" "}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={getNetworkPath(selectedNetwork, 'create')}>
            <Button size="lg" category="secondary" className="flex items-center gap-2">
              Create game{" "}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
