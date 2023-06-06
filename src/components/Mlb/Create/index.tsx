import { useCreateGame } from "hooks/write/useCreateGame";
import { useEffect, useState } from "react";
import { DefifaLaunchProjectData, DefifaTierParams } from "types/defifa";
import { contractUri, projectMetadataUri } from "uri/contractUri";
import {
  createDefaultLaunchProjectData,
  createDefaultTierData,
} from "./defaultState";

const DeployerCreate = () => {
  const [formValues, setFormValues] = useState<DefifaLaunchProjectData>(
    createDefaultLaunchProjectData()
  );

  const [tier, setTier] = useState<DefifaTierParams>(createDefaultTierData());
  const [editedTier, setEditedTier] = useState<DefifaTierParams | null>(null);
  const [tierGeneralValues, setTierGeneralValues] =
    useState<Partial<DefifaTierParams>>();

  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [addNftOpen, setAddNftOpen] = useState(true);

  const {
    write: createTournament,
    isLoading,
    isSuccess,
    transactionData,
  } = useCreateGame(formValues);


  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createTournament();
    }

  if (isLoading) {
    return <div className="text-center">Launching your game...</div>;
  }

  if (isSuccess && transactionData) {
    console.log(transactionData);
    const gameId = BigNumber.from(transactionData.logs[1].topics[3]).toNumber();

    return (
      <div className="text-center">
        <p className="text-4xl mb-4">Let the games begin!</p>
        <Link href={`/game/${gameId}`}>
          <div>
            <Button size="lg">Go to game</Button>
          </div>
        </Link>
        <div className="text-xs mt-3">Game #{gameId}</div>
      </div>
    );
  }

};

export default DeployerCreate;
