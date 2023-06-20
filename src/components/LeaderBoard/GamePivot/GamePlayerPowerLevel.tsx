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

export function GamePlayerPowerLevel() {
    const [pivottableState, setPivottableState] = useState({});
    const { gameId } = useGameContext();
    const { data: ResponseData, isLoading } = useGameTopHolders(gameId.toString());
    let flatArray = [];
    console.log("GameTopHoldersContent contracts", ResponseData)
    if (isLoading) {
        return <Container className="text-center">...</Container>;
    } else {
        flatArray = ResponseData.contracts.flatMap((contract) =>
            contract.mintedTokens.flatMap((token) => ({
                Players: `${token.owner.id.slice(0, 4)}...${token.owner.id.slice(-3)}`,
                /*  <EthAddress
                     address={token.owner.id}
                     className="font-medium"
                     withEnsAvatar
                 />, */
                Mints: token.id.split("-")[1],
                Picks: Math.floor(token.id.split("-")[1] / DEFAULT_NFT_MAX_SUPPLY),
                Balance: token.owner.balance,
            }))
        );
        console.log('game pivot', flatArray);
    }
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