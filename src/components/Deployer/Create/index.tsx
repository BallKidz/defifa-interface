import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import bs58 from "bs58";
import Content from "components/Deployer/Content";
import Button from "components/UI/Button";
import { EthSymbol } from "components/UI/EthSymbol/EthSymbol";
import { Input } from "components/UI/Input";
import { BigNumber, constants } from "ethers";
import { useCreateGame } from "hooks/write/useCreateGame";
import { useChainData } from "hooks/useChainData";
import { useSwitchChain } from "wagmi";
import { buildGamePath, formatNetworkGameId } from "lib/networks";
import { uploadJsonToIpfs, uploadToIPFS } from "lib/uploadToIPFS";
import { createTierMetadata } from "utils/tierMetadata";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DefifaLaunchProjectData, DefifaTierParams } from "types/defifa";
import { contractUri, projectMetadataUri } from "uri/contractUri";
import { truncateAddress } from "utils/truncate";
import styles from "./DeployerCreate.module.css";
import {
  createDefaultLaunchProjectData,
  createDefaultTierData,
} from "./defaultState";
import { datetimeLocalToUnix } from "./utils";

// Helper function to get network name from chain ID
const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1: return 'Ethereum Mainnet';
    case 10: return 'Optimism';
    case 42161: return 'Arbitrum';
    case 8453: return 'Base';
    case 11155111: return 'Sepolia Testnet';
    case 11155420: return 'Optimism Sepolia';
    case 421614: return 'Arbitrum Sepolia';
    case 84532: return 'Base Sepolia';
    default: return `Chain ${chainId}`;
  }
};

// Helper function to get block explorer URL for a transaction
const getBlockExplorerUrl = (chainId: number, txHash: string): string => {
  switch (chainId) {
    case 1: return `https://etherscan.io/tx/${txHash}`;
    case 10: return `https://optimistic.etherscan.io/tx/${txHash}`;
    case 42161: return `https://arbiscan.io/tx/${txHash}`;
    case 8453: return `https://basescan.org/tx/${txHash}`;
    case 11155111: return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 11155420: return `https://sepolia-optimism.etherscan.io/tx/${txHash}`;
    case 421614: return `https://sepolia.arbiscan.io/tx/${txHash}`;
    case 84532: return `https://sepolia.basescan.org/tx/${txHash}`;
    default: return `https://etherscan.io/tx/${txHash}`;
  }
};

const DeployerCreate = () => {
  const [formValues, setFormValues] = useState<DefifaLaunchProjectData>(
    createDefaultLaunchProjectData()
  );

  const [tier, setTier] = useState<DefifaTierParams>(createDefaultTierData());
  const [editedTier, setEditedTier] = useState<DefifaTierParams | null>(null);
  const [tierGeneralValues, setTierGeneralValues] =
    useState<Partial<DefifaTierParams>>({});

  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [addNftOpen, setAddNftOpen] = useState(true);
  const [iPFSNeedsHashing, setIPFSNeedsHashing] = useState(false);
  const [imageUri, setImageUri] = useState<any>();
  const [inputKey, setInputKey] = useState(0);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<number>(11155111); // Default to Sepolia

  const {
    write: createTournament,
    isLoading,
    isSuccess,
    transactionData,
  } = useCreateGame(formValues, selectedNetwork);
  
  const { chainData } = useChainData();
  const { switchChain } = useSwitchChain();

  // Handle network switching
  const handleNetworkChange = async (newChainId: number) => {
    setSelectedNetwork(newChainId);
    
    // Only switch if the wallet is connected and on a different network
    if (chainData.chainId !== newChainId) {
      try {
        await switchChain({ chainId: newChainId });
      } catch (error) {
        console.error('Failed to switch network:', error);
        // Optionally show a toast/notification to the user
      }
    }
  };

  // Sync selectedNetwork with current wallet network
  useEffect(() => {
    if (chainData.chainId) {
      setSelectedNetwork(chainData.chainId);
    }
  }, [chainData.chainId]);

  // Expose test data function to window for dev console testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).fillTestData = (testAddress?: string) => {
        const now = Math.floor(Date.now() / 1000);
        const mintDuration = 60 * 2; // 2 minutes minting
        const refundDuration = 0; // No refund
        const gameStartBuffer = 60 * 1; // 1 minute buffer = 3 min total from now
        const gameStartTime = now + mintDuration + refundDuration + gameStartBuffer;
        const testData: DefifaLaunchProjectData = {
          ...createDefaultLaunchProjectData(),
          defaultAttestationDelegate: (testAddress as `0x${string}`) || constants.AddressZero,
          name: "v5 testing",
          rules: "Winner takes almost all. Most goals wins. Ties split pot evenly.",
          mintPeriodDuration: mintDuration,
          refundPeriodDuration: refundDuration,
          start: gameStartTime, // Game starts in 3 min from now
          attestationStartTime: gameStartTime, // Start attestation when scoring phase begins
          attestationGracePeriod: 0, // No grace period - fast attestation is part of the game
          tiers: [
            {
              ...createDefaultTierData(),
              name: "0-0",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "0-1",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "0-2",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "0-3",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "0-4+",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "1-0",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "1-1",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "1-2",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "1-3",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "1-4+",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "2-0",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "2-1",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "2-2",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "2-3",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "2-4+",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "3-0",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "3-1",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "3-2",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "3-3",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "3-4+",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "+4-0",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "+4-1",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "+4-2",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "+4-3",
              price: "0.00001",
            },
            {
              ...createDefaultTierData(),
              name: "+4-4+",
              price: "0.00001",
            },
          ],
        };
        setFormValues(testData);
        setTierGeneralValues({ price: "0.00001" });
        setStep(2);
        console.log("✅ Test data loaded!", testData);
        console.log("💡 Tip: Call fillTestData('0xYourAddress') to use your own attestation delegate");
      };
    }
  }, []);

  // TODO this is totally bugged, needs to be uploaded at deploy time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uploadJsons = async (formValuesIn: DefifaLaunchProjectData) => {
    // This is the 'collection' name in OS.
    contractUri.name = formValuesIn.name;
    // This is the 'collection' description in OS can be long. Use as rules.
    contractUri.description =
      formValuesIn.rules +
      " " +
      "(find redemption value on" +
      " " +
      contractUri.infoUri + ")";
    const contractUriCid = await uploadJsonToIpfs(contractUri);
    projectMetadataUri.name = formValuesIn.name; // This should be a tier name on OS (??)
    projectMetadataUri.description = formValuesIn.rules;

    const projectMetadataCid = await uploadJsonToIpfs(projectMetadataUri);

    if (!contractUriCid || !projectMetadataCid) {
      console.error("Failed to upload metadata to IPFS");
      return;
    }

    console.log("IPFS upload complete!", { contractUriCid, projectMetadataCid });

    // Update formValues with IPFS URIs
    setFormValues((prevValues) => ({
      ...prevValues,
      contractUri: `ipfs://${contractUriCid}`,
      projectUri: `ipfs://${projectMetadataCid}`,
    }));
    
    // Set flag to trigger deployment after state updates
    setReadyToDeploy(true);
  };

  // Deploy contract after IPFS upload completes and URIs are set
  useEffect(() => {
    if (readyToDeploy && formValues.contractUri && formValues.projectUri) {
      console.log("Deploying game with IPFS URIs...", { 
        contractUri: formValues.contractUri, 
        projectUri: formValues.projectUri 
      });
      setReadyToDeploy(false); // Reset flag
      createTournament();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToDeploy, formValues.contractUri, formValues.projectUri]); // Removed createTournament from deps to prevent multiple deployments

  useEffect(() => {
    if (iPFSNeedsHashing) {
      setIPFSNeedsHashing(false); // Reset flag immediately to prevent loop
      uploadJsons(formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iPFSNeedsHashing]); // Only depend on the flag, not formValues

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const datetimeLocalFields: Array<keyof DefifaLaunchProjectData> = ["start"];

    let newValue: string | number;

    if (name === "mintPeriodDuration" || name === "refundPeriodDuration") {
      // Convert the input value (in hours) to seconds, rounding to avoid floating-point precision issues.
      newValue = Math.round(parseFloat(value) * 60 * 60);
    } else if (
      datetimeLocalFields.includes(name as keyof DefifaLaunchProjectData)
    ) {
      newValue = datetimeLocalToUnix(value);
    } else {
      newValue = value;
    }

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: newValue,
    }));
  };

  const handleTierChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "encodedIPFSUri") {
      setIsUploading(true);

      try {
        // Upload the image file to IPFS
        const imageIpfsHash = (await handleFileUpload(e)) ?? "";
        if (!imageIpfsHash) {
          throw new Error("Failed to upload image to IPFS");
        }

        // Create IPFS URI for the image
        const imageIpfsUri = `ipfs://${imageIpfsHash}`;

        // Create NFT metadata JSON and upload it to IPFS
        const metadataIpfsUri = await createTierMetadata(
          tier.name || `Tier ${formValues.tiers.length + 1}`, // Use tier name or fallback
          imageIpfsUri,
          formValues.name || "Defifa Game", // Use game name or fallback
          formValues.tiers.length + 1, // Use tier index as game ID (temporary)
          chainData.chainId
        );

        // Convert metadata IPFS URI to the format expected by the contract
        const metadataIpfsHash = metadataIpfsUri.replace("ipfs://", "");
        const encodedMetadataHash = `0x${bs58.decode(metadataIpfsHash).slice(2).toString("hex")}`;

        setTier((prevState) => ({
          ...prevState,
          [name]: encodedMetadataHash,
        }));

        console.log("✅ Tier metadata created:", {
          tierName: tier.name,
          imageIpfsUri,
          metadataIpfsUri,
          encodedMetadataHash
        });
      } catch (error) {
        console.error("❌ Failed to create tier metadata:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setTier((prevState) => ({
        ...prevState,
        [name]:
          name === "price" || name === "reservedRate" || name === "royaltyRate"
            ? parseFloat(value)
            : value,
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUri = URL.createObjectURL(file);
      setImageUri(imageUri);
      try {
        const ipfsHash = await uploadToIPFS(file);
        return ipfsHash;
      } catch (error) {
        console.error("Failed to upload file to IPFS:", error);
      }
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      console.log("handleSubmit");
      setIPFSNeedsHashing(true); 
    }
  };

  const handleTierGeneralValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    setTierGeneralValues((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    // Update all tiers in the tiers array if it exists
    if (formValues.tiers && formValues.tiers.length > 0) {
      setFormValues((prevState) => {
        const shouldUpdatePreviousTiers =
          name === "reservedRate" || name === "reservedTokenBeneficiary";

        const updatedTiers = prevState.tiers.map((tier, index) => {
          if (shouldUpdatePreviousTiers) {
            if (index === 0) {
              return {
                ...tier,
                [name]: newValue,
                shouldUseReservedTokenBeneficiaryAsDefault: false,
              };
            } else {
              return {
                ...tier,
                reservedRate: 0,
                reservedTokenBeneficiary: constants.AddressZero,
                shouldUseReservedTokenBeneficiaryAsDefault: true,
              };
            }
          } else {
            return {
              ...tier,
              [name]: newValue,
            };
          }
        });

        return {
          ...prevState,
          tiers: updatedTiers,
        };
      });
    }
  };

  const onAddNFT = () => {
    const mergedTier = {
      ...tier,
      ...tierGeneralValues,
    };

    // Check if there's at least one tier with reservedRate and reservedTokenBeneficiary set
    const hasReservedRateTier = formValues.tiers.some(
      (t) => t.reservedRate && t.reservedTokenBeneficiary
    );

    if (hasReservedRateTier) {
      mergedTier.reservedRate = 0;
      mergedTier.reservedTokenBeneficiary = constants.AddressZero;
      mergedTier.shouldUseReservedTokenBeneficiaryAsDefault = true;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      tiers: mergedTier ? [...prevValues.tiers, mergedTier] : prevValues.tiers,
    }));

    setTier(createDefaultTierData());

    setImageUri("");

    setAddNftOpen(false);
  };

  const onRemoveTier = (index: number) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      tiers: prevValues.tiers.filter((_, i) => i !== index),
    }));
  };

  const onSubmitEditedTier = (index: number) => {
    if (editedTier) {
      setFormValues((prevValues) => {
        const updatedTiers = prevValues.tiers.map((tier, i) =>
          i === index ? editedTier : tier
        );

        return {
          ...prevValues,
          tiers: updatedTiers,
        };
      });
    }

    setEditedTier(null);
  };

  const editTier = (t: DefifaTierParams, index: number) => {
    setEditedTier(t);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={styles.addNftContainer}>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="name">
                Name
              </label>
              <Input
                type="text"
                id="tierName"
                value={t?.name}
                name="name"
                onChange={(e) => setEditedTier({ ...t, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="file">
                Upload NFT
              </label>
              <Input
                type="file"
                onChange={handleTierChange}
                name="encodedIPFSUri"
                id="encodedIPFSUri"
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <Button type="button" onClick={() => onSubmitEditedTier(index)}>Submit</Button>
            </div>
          </div>
        );
      },
      overlayClassName: styles.overlayModal,
    });
  };

  if (isLoading) {
    return <div className="text-center">Launching your game...</div>;
  }

  if (isSuccess && transactionData) {
    console.log("Transaction data:", transactionData);
    
    // Find the LaunchGame event from the DefifaDeployer contract
    // LaunchGame(uint256 indexed gameId, address indexed delegate, address indexed governor, address tokenUriResolver, address caller)
    const LAUNCH_GAME_EVENT_SIGNATURE = "0x3082991f3dda023098e5849ea3903c6fbfd657dc6f9232f5eb81ad8a7ba161d6";
    
    const launchGameLog = transactionData.logs.find(
      (log: any) => log.topics[0] === LAUNCH_GAME_EVENT_SIGNATURE
    );

    if (!launchGameLog) {
      console.error("LaunchGame event not found in transaction logs");
      return (
        <div className="text-center text-red-500">
          <p>Error: Could not find game ID in transaction. Please check the transaction on block explorer.</p>
          <a 
            href={getBlockExplorerUrl(selectedNetwork, transactionData.transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View transaction
          </a>
        </div>
      );
    }

    // Extract gameId from topics[1] (first indexed parameter)
    // v5: topics are hex strings, convert directly to bigint then number
    const gameId = Number(BigInt(launchGameLog.topics[1] || "0x0"));
    const networkGameId = formatNetworkGameId(selectedNetwork, gameId);
    const localGamePath = buildGamePath(selectedNetwork, gameId);
    const intentText = `Let's play a money game! ${formValues.name}. ${formValues.rules} `;

    console.log("✅ Game created successfully!", {
      gameId,
      networkGameId,
      localGamePath,
      delegate: launchGameLog.topics[2], // For debugging
      governor: launchGameLog.topics[3],  // For debugging
    });

    return (
      <div className="text-center">
        <p className="text-4xl mb-4">Let the games begin!</p>
        <Link href={localGamePath}>
          <div>
            <Button size="lg">Go to game</Button>
          </div>
        </Link>
        <div className="text-xs mt-3">Game #{networkGameId}</div>
        
      </div>
    );
  }

  return (
    <div className="mb-24">
      <h1 className="text-2xl mb-8 mt-8">Create your Game</h1>

      {/* Network Selector */}
      <div className="mb-8">
        <div className={styles.formGroup}>
          <label className="text-sm leading-6 mb-1" htmlFor="network">
            Deploy to Network
          </label>
          <select
            id="network"
            value={selectedNetwork}
            onChange={(e) => handleNetworkChange(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md bg-neutral-800 text-white border-neutral-700"
          >
            <option value={11155111}>Sepolia Testnet</option>
            <option value={421614}>Arbitrum Sepolia</option>
            <option value={84532}>Base Sepolia</option>
            <option value={11155420}>Optimism Sepolia</option>
            <option value={1}>Ethereum Mainnet</option>
            <option value={42161}>Arbitrum</option>
            <option value={8453}>Base</option>
            <option value={10}>Optimism</option>
          </select>
        </div>
        
        {/* Network Mismatch Warning */}
        {chainData.chainId !== selectedNetwork && (
          <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-200">
                  <strong>Network Mismatch:</strong> Your wallet is connected to {getNetworkName(chainData.chainId)} 
                  but you're deploying to {getNetworkName(selectedNetwork)}. 
                  The wallet will be switched automatically when you deploy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg mb-3">
        {step === 1 ? "Game details" : "Team NFTs"}
      </h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="mb-12">
              <div className={styles.formGroup}>
                <label className="text-sm leading-6 mb-1" htmlFor="name">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className="text-sm leading-6 mb-1" htmlFor="rules">
                  Rules
                </label>
                <Input
                  type="text"
                  id="rules"
                  name="rules"
                  value={formValues.rules}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the rules of the game in plain English."
                />
              </div>
            </div>

            <h3 className="text-lg mb-3">Game schedule</h3>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="start">
                Game start time
              </label>
              <DatePicker
                id="start"
                name="start"
                className="block w-full rounded-sm border-0 py-1.5 text-neutral-50 bg-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                selected={new Date(formValues.start * 1000)}
                showTimeInput
                dateFormat="MM/dd/yyyy h:mm aa"
                onChange={(date) => {
                  if (!date) return;
                  setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    start: date.getTime() / 1000,
                  }));
                }}
                required
              />

              <span className="text-xs text-neutral-400 mt-1">
                Must be later than: now + minting duration + refund duration.
              </span>
            </div>
            <div className={styles.formGroup}>
              <label
                className="text-sm leading-6 mb-1"
                htmlFor="mintPeriodDuration"
              >
                Minting duration
              </label>
              <Input
                type="number"
                id="mintPeriodDuration"
                name="mintPeriodDuration"
                value={Math.round(formValues.mintPeriodDuration / 60 / 60 * 100) / 100} // convert seconds to hours for display, rounded to 2 decimal places
                onChange={handleInputChange}
                min={0} // set the minimum value allowed
                step="0.01" // set the step size, e.g., 1 hour increments
                required
              />
              <span className="text-xs text-neutral-400 mt-1">
                Hours prior to the start of the game.
              </span>
            </div>
            <div className={styles.formGroup}>
              <label
                className="text-sm leading-6 mb-1"
                htmlFor="refundPeriodDuration"
              >
                Refund duration (optional)
              </label>
              <Input
                type="number"
                id="refundPeriodDuration"
                name="refundPeriodDuration"
                value={Math.round(formValues.refundPeriodDuration / 60 / 60 * 100) / 100} // convert seconds to hours for display, rounded to 2 decimal places
                onChange={handleInputChange}
                min={0} // set the minimum value allowed
                step="0.01" // set the step size, e.g., 1 hour increments
                required
              />
              <span className="text-xs text-neutral-400 mt-1">
                Hours allowed for refunds. Takes place between minting and scoring.
              </span>
            </div>

            {/* <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="defaultTokenUriResolver">
                Token URI
              </label>
              <input
                type="text"
                id="defaultTokenUriResolver"
                name="defaultTokenUriResolver"
                value={formValues.defaultTokenUriResolver}
                onChange={handleInputChange}
              />
            </div> */}
          </>
        )}
        {step === 2 && (
          <>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="price">
                NFT price (ETH)
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={tierGeneralValues?.price || ""}
                onChange={handleTierGeneralValues}
              />
            </div>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="reservedRate">
                Reserved rate (optional)
              </label>
              <Input
                type="number"
                id="reservedRate"
                name="reservedRate"
                value={tierGeneralValues?.reservedRate || ""}
                onChange={handleTierGeneralValues}
              />
              <span className="text-xs mt-1 text-neutral-400">
                For example: reserve 1 NFT for every X minted NFTs
              </span>
            </div>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="reservedRate">
                Reserved rate beneficiary address allocation
              </label>
              <Input
                type="text"
                id="reservedTokenBeneficiary"
                name="reservedTokenBeneficiary"
                value={tierGeneralValues?.reservedTokenBeneficiary || ""}
                onChange={handleTierGeneralValues}
              />
              <span className="text-xs mt-1 text-neutral-400">
                ETH address that will receive the reserved NFTs
              </span>
            </div>
            <div className="border border-neutral-800">
              <Content title="Add NFT" createIcon open={addNftOpen}>
                <div className="p-5">
                  <div className={styles.formGroup}>
                    <label className="text-sm leading-6 mb-1" htmlFor="name">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="tierName"
                      value={tier?.name}
                      name="name"
                      onChange={handleTierChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="text-sm leading-6 mb-1" htmlFor="encodedIPFSUri">
                      Upload NFT Image
                    </label>
                    <input
                      key={inputKey}
                      type="file"
                      accept="image/*"
                      onChange={handleTierChange}
                      name="encodedIPFSUri"
                      id="encodedIPFSUri"
                      className="block w-full text-sm text-neutral-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-pink-700 file:text-white
                        hover:file:bg-pink-600
                        file:cursor-pointer"
                    />
                    {isUploading && (
                      <div className="text-sm text-neutral-400 mt-2">
                        Uploading to IPFS...
                      </div>
                    )}
                    {!isUploading && imageUri && (
                      <div
                        style={{ marginTop: "20px", display: "flex", gap: "30px", alignItems: "center" }}
                      >
                        <Image 
                          src={imageUri} 
                          width={200} 
                          height={200}
                          alt="Tier preview" 
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setTier((prevState) => ({
                              ...prevState,
                              encodedIPFSUri:
                                "0x0000000000000000000000000000000000000000000000000000000000000000",
                            }));
                            setImageUri("");
                            setInputKey((prevKey: number) => prevKey + 1);
                          }}
                          className="text-pink-400 hover:text-pink-300"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    )}
                    <span className="text-xs mt-1 text-neutral-400">
                      Upload an image for this tier. If provided, this image will be used instead of the on-chain SVG generator.
                    </span>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <Button type="button" onClick={onAddNFT} disabled={isUploading}>
                      Add NFT
                    </Button>
                  </div>
                </div>
              </Content>
            </div>

            {formValues.tiers.length > 0 && (
              <div className={styles.tiersListContainer}>
                <p>Your NFTs</p>
                {formValues.tiers.map((tier, index) => (
                  <div key={index} className={styles.tier}>
                    <div className={styles.tierDetails}>
                      <p>Name: {tier.name}</p>
                      <p>
                        Price: <EthSymbol />
                        {tier.price}
                      </p>
                      {formValues.tiers.some(
                        (tier) => tier.reservedRate > 0
                      ) && (
                        <p>
                          For every{" "}
                          {
                            formValues.tiers.find((t) => t.reservedRate)
                              ?.reservedRate
                          }{" "}
                          NFTs minted, 1 goes to{" "}
                          {tier.reservedTokenBeneficiary
                            ? truncateAddress(
                                formValues.tiers[0].reservedTokenBeneficiary,
                                3,
                                3
                              )
                            : "not you"}
                          !
                        </p>
                      )}
                    </div>

                    <div className={styles.tierIcons}>
                      {/* <span role="button" onClick={() => editTier(tier, index)}>
                        <PencilSquareIcon className="h-5 w-5" />
                      </span> */}
                      <span role="button" onClick={() => onRemoveTier(index)}>
                        <TrashIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className={styles.buttonContainer}>
          <Button type="submit">
            {step === 1 ? "Next: NFTs" : "Create game"}
          </Button>
          {step === 2 && (
            <span
              role="button"
              onClick={() => setStep(1)}
              style={{ cursor: "pointer" }}
            >
              Back
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default DeployerCreate;
