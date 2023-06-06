import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import bs58 from "bs58";
import Content from "components/Deployer/Content";
import Button from "components/UI/Button";
import { EthSymbol } from "components/UI/EthSymbol/EthSymbol";
import { Input } from "components/UI/Input";
import { BigNumber, constants } from "ethers";
import { useCreateGame } from "hooks/write/useCreateGame";
import { uploadJsonToIpfs, uploadToIPFS } from "lib/uploadToIPFS";
import Link from "next/link";
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
import { JUICEBOX_PROJECT_METADATA_DOMAIN } from "constants/constants";

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
  const [iPFSNeedsHashing, setIPFSNeedsHashing] = useState(false);
  const [imageUri, setImageUri] = useState<any>();

  const {
    write: createTournament,
    isLoading,
    isSuccess,
    transactionData,
  } = useCreateGame(formValues);

  // TODO this is totally bugged, needs to be uploaded at deploy time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uploadJsons = async (formValuesIn: DefifaLaunchProjectData) => {
    // This is the 'collection' name in OS.
    contractUri.name = formValuesIn.name;
    // This is the 'collection' description in OS can be long. Use as rules.
    contractUri.description =
      formValuesIn.rules +
      " " +
      "For more info visit" +
      " " +
      contractUri.infoUri;
    const contractUriCid = await uploadJsonToIpfs(contractUri);
    projectMetadataUri.name = formValuesIn.name; // This should be a tier name on OS (??)
    projectMetadataUri.description =
      formValuesIn.rules +
      " " +
      "For more info visit" +
      " " +
      contractUri.infoUri;

    const projectMetadataCid = await uploadJsonToIpfs(projectMetadataUri);

    if (!contractUriCid || !projectMetadataCid) return;

    setFormValues((prevValues) => ({
      ...prevValues,
      contractUri: `ipfs://${contractUriCid}`,
      projectMetadata: {
        content: projectMetadataCid,
        domain: JUICEBOX_PROJECT_METADATA_DOMAIN,
      },
    }));
  };

  useEffect(() => {
    if (iPFSNeedsHashing) {
      uploadJsons(formValues);
    }
  }, [formValues, iPFSNeedsHashing]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const datetimeLocalFields: Array<keyof DefifaLaunchProjectData> = ["start"];

    let newValue: string | number;

    if (name === "mintDuration" || name === "refundDuration") {
      // Convert the input value (in hours) to seconds.
      newValue = parseFloat(value) * 60 * 60;
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

      let ipfsHash = (await handleFileUpload(e)) ?? "";
      ipfsHash = `0x${bs58.decode(ipfsHash).slice(2).toString("hex")}`;

      setTier((prevState) => ({
        ...prevState,
        [name]: ipfsHash ?? "",
      }));
      setIsUploading(false);
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
      setIPFSNeedsHashing(true); // TODO: handle failed create transaction?!
      createTournament();
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
              <Button onClick={() => onSubmitEditedTier(index)}>Submit</Button>
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

  return (
    <div className="mb-24">
      <h1 className="text-2xl mb-8 mt-8">Create your Game</h1>

      <h2 className="text-lg mb-3">
        {step === 1 ? "Game details" : "Game NFTs"}
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
                className="block w-full rounded-sm border-0 py-1.5 text-neutral-50 bg-slate-950 shadow-sm ring-1 ring-inset ring-gray-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                selected={new Date(formValues.start * 1000)}
                showTimeInput
                dateFormat="MM/dd/yyyy h:mm aa"
                onChange={(date) => {
                  if (!date) return;
                  setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    start: date.getTime() / 1000 ?? 0,
                  }));
                }}
                required
              />

              <span className="text-xs text-neutral-400 mt-1">
                Must be later than: now + mint duration + refund duration.
              </span>
            </div>
            <div className={styles.formGroup}>
              <label className="text-sm leading-6 mb-1" htmlFor="mintDuration">
                Mint duration
              </label>
              <Input
                type="number"
                id="mintDuration"
                name="mintDuration"
                value={formValues.mintDuration / 60 / 60} // convert seconds to hours for display
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
                htmlFor="refundDuration"
              >
                Refund duration (optional)
              </label>
              <Input
                type="number"
                id="refundDuration"
                name="refundDuration"
                value={formValues.refundDuration / 60 / 60} // convert seconds to hours for display: ;
                onChange={handleInputChange}
                min={0} // set the minimum value allowed
                step="0.01" // set the step size, e.g., 1 hour increments
                required
              />
              <span className="text-xs text-neutral-400 mt-1">
                Hours allowed for refunds. Takes place between minting and game
                time.
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
                value={tierGeneralValues?.price}
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
                value={tierGeneralValues?.reservedRate}
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
                value={tierGeneralValues?.reservedTokenBeneficiary}
                onChange={handleTierGeneralValues}
              />
              <span className="text-xs mt-1 text-neutral-400">
                ETH address that will receive the reserved NFTs
              </span>
            </div>
            <div className="border border-gray-800">
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
                  {/*                 <div className={styles.formGroup}>
                  <label className="text-sm leading-6 mb-1" htmlFor="encodedIPFSUri">
                    Upload file
                  </label>
                  <input
                    key={inputKey}
                    type="file"
                    onChange={handleTierChange}
                    name="encodedIPFSUri"
                    id="encodedIPFSUri"
                  />
                  <div
                    style={{ marginTop: "20px", display: "flex", gap: "30px" }}
                  >
                    {!isUploading && <img src={imageUri} width={200} />}
                    {!isUploading && imageUri && (
                      <FontAwesomeIcon
                        icon={faRemove}
                        color="var(--pink)"
                        style={{ cursor: "pointer", width: "1rem" }}
                        onClick={() => {
                          setTier((prevState) => ({
                            ...prevState,
                            encodedIPFSUri:
                              "0x0000000000000000000000000000000000000000000000000000000000000000",
                          }));
                          setImageUri("");
                          setInputKey((prevKey) => prevKey + 1); // Increment the inputKey
                        }}
                      />
                    )}
                  </div>
                </div> */}

                  <div style={{ marginTop: "20px" }}>
                    <Button onClick={onAddNFT} disabled={isUploading}>
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
                      <span role="button" onClick={() => editTier(tier, index)}>
                        <PencilSquareIcon className="h-5 w-5" />
                      </span>
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
