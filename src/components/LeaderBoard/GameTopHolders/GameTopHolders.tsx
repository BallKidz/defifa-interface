import { EthAddress } from "components/UI/EthAddress";
import Container from "components/layout/Container";
import { constants } from "ethers";
import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";
import moment from "moment";
import Image from "next/image";
import { useGameTopHolders } from "./useGameTopHolders";
import { twMerge } from "tailwind-merge";
import { min } from "lodash";

interface Contract {
  gameId: string;
  name: string;
  mintedTokens: MintedToken[];
}

interface MintedToken {
  id: string;
  owner: {
    id: string;
  };
}

interface ResponseData {
  contracts: Contract[];
}

export function GameTopHoldersContent(gameId: { gameId: string }) {
  console.log("GameTopHoldersContent gameId", gameId)
  const { data: ResponseData, isLoading } = useGameTopHolders(gameId.gameId);
  console.log("GameTopHoldersContent contracts", ResponseData)
  const contracts = ResponseData?.contracts;
  if (isLoading) {
    return <Container className="text-center">...</Container>;
  } else {
    const flatArray = contracts.flatMap((contract) =>
      contract.mintedTokens.flatMap((token) => ({
        tokenId: token.id,
        ownerId: token.owner.id,
        tier: token.id.split("-")[1],
      }))
    );
    console.log('flatArray', flatArray);

  }
  if (isLoading) {
    return <Container className="text-center">...</Container>;
  }

  if (!contracts) {
    return <Container className="text-center">No leaders yet.</Container>;
  }

  return (
    <div

    >
      <Container className="mb-4">
        <div className=" border-2 border-pink-500 rounded-lg shadow-md p-6">
          <h2 className="text-2xl mb-4 text-center">Game Top Holders</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th></th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => (
                <tr key={contract.gameId}>
                  <td className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="relative w-16 h-16">
                        {contract.mintedTokens.length > 0 && (
                          <div className="absolute inset-0">
                            {contract.mintedTokens.map((token, index) => (
                              <div key={token.id} className="ml-[-10px]">
                                <EthAddress
                                  address={token.owner.id}
                                  className="font-medium"
                                  withEnsAvatar
                                />
                                {Math.floor(parseInt(token.id.substring(token.id.indexOf("-") + 1)) / DEFAULT_NFT_MAX_SUPPLY)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <div className="relative w-16 h-16">
                        {contract.mintedTokens.length}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
