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
    const { gameId } = useGameContext();
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
        <><h2>Player Power Level {gameId}</h2>
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
                {...pivottableState} /></>
    );
}