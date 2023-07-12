import { DEFAULT_NFT_MAX_SUPPLY } from "hooks/useDefifaTiers";

import {
    PivotTableUI,
    createPlotlyRenderers,
    TableRenderers,
} from "@imc-trading/react-pivottable";

import { SetStateAction, useState } from "react";
import { useGameTopHolders } from "../GameTopHolders/useGameTopHolders";
import Container from "components/layout/Container";
import { useGameContext } from "contexts/GameContext";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const PlotlyRenderers = createPlotlyRenderers(createPlotlyRenderers);
interface Contract {
    gameId: string;
    name: string;
    mintedTokens: MintedToken[];
}

interface MintedToken {
    id: string;
    owner: {
        id: string;
        balance: string;
    };
}

interface ResponseData {
    contracts: Contract[];
}

export function GamePlayerPowerLevel() {
    const [pivottableState, setPivottableState] = useState({});
    const { gameId, metadata } = useGameContext();
    const { data, isLoading } = useGameTopHolders(gameId.toString()) as {
        data: ResponseData;
        isLoading: boolean;
    }; let flatArray = [];
    //let flatArray = ResponseData as ResponseData[]; // Replace 'YourDataType' with the actual type of ResponseData

    console.log("GameTopHoldersContent contracts", data)
    if (isLoading) {
        return <Container className="text-center">...</Container>;
    } else {
        flatArray = (data.contracts as Contract[]).flatMap((contract: Contract) =>
            contract.mintedTokens.flatMap((token: MintedToken) => ({
                Players: `${token.owner.id.slice(0, 4)}...${token.owner.id.slice(-3)}`,
                /*  <EthAddress
                     address={token.owner.id}
                     className="font-medium"
                     withEnsAvatar
                 />, */
                Mints: parseInt(token.id.split("-")[1]),
                Picks: Math.floor(parseInt(token.id.split("-")[1]) / DEFAULT_NFT_MAX_SUPPLY),
                Balance: token.owner.balance,
            }))
        );
    }

    console.log('game pivot', flatArray);

    return (
        <div className="border-2 border-pink-700 rounded-lg">
            <div className="bg-pink-700 text-white text-md font-medium px-4 py-2 flex flex-col">
                <span className="order-1">Player Power</span>
                <span className="order-2">Rules</span>
            </div>
            <div className="min-height overflow-y-auto p-4">
                <p className="text-sm mb-4">{metadata?.description}</p>
                <PivotTableUI
                    data={flatArray}
                    controlsHidden={true}
                    aggregatorName="Sum as Fraction of Columns"
                    rows={["Players"]}
                    cols={["Picks"]}
                    vals={["Mints"]}
                    rendererName={"Table"}
                    onChange={(s: SetStateAction<{}>) => setPivottableState(s)}
                    renderers={{ ...TableRenderers, ...PlotlyRenderers }}
                    {...pivottableState} />
                <p className="text-lime-300 px-4 py-2 text-sm mt-4">
                    <Link href="/about">
                        <a className="flex items-start">
                            <ExclamationCircleIcon className="h-8 w-8 inline mt-1 mr-4" />
                            This game is self-reported. You are relying on the honesty
                            of the other players to abide by the rules. The table above
                            depicts which players have the most power in the game.
                            Ask yourself, "Who is the most powerful player and should I trust them?".
                        </a>
                    </Link>
                </p>

            </div>
        </div >
    );
}