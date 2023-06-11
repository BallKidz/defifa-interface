import React, { useState, useEffect } from 'react';
import { useCreateGame } from 'hooks/write/useCreateGame';
import { DefifaLaunchProjectData, DefifaTierParams } from 'types/defifa';
import { contractUri, projectMetadataUri } from 'uri/contractUri';
import { createDefaultLaunchProjectData, createDefaultTierData } from './defaultState';
import { constants } from 'ethers';

const MlbCreate = () => {
    const [project, setProject] = useState<DefifaLaunchProjectData>(
        createDefaultLaunchProjectData()
    );
    const [tier, setTier] = useState<DefifaTierParams>(createDefaultTierData());
    console.log('project', project);
    let updatedProject: DefifaLaunchProjectData = {
        ...project,
        name: 'asdf',
        rules: 'asdf',
        contractUri: "ipfs://QmVcEmsrtyKEvm2E4eY5csE2xhTbfiW8J49Hx8sNkmdLuN",
        projectMetadata: {
            content: "",
            domain: 0,
        },
        tiers: [
            {
                ...tier,
                name: 'asdf',
                price: '0.1',
                reservedRate: 10,
                reservedTokenBeneficiary: '0x8b80755c441d355405ca7571443bb9247b77ec16',
                encodedIPFSUri: '0x0000000000000000000000000000000000000000000000000000000000000000',
                shouldUseReservedTokenBeneficiaryAsDefault: false,
            },
        ],
    };

    const {
        write: createTournament,
        isLoading,
        isSuccess,
        transactionData,
    } = useCreateGame(updatedProject);

    useEffect(() => {
        if (isSuccess && transactionData) {
            console.log('Game creation successful:', transactionData);
        }
    }, [isSuccess, transactionData]);

    const handleClick = async () => {
        console.log('Button clicked!');
        console.log('project', project);
        console.log('tier', tier);



        setProject(updatedProject);
        console.log('updated project', updatedProject);

        try {
            createTournament();
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Click Me</button>
        </div>
    );
};

export default MlbCreate;
