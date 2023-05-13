/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { faPen, faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import bs58 from "bs58";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useNetwork } from "wagmi";
import { ETH_TOKEN_ADDRESS, getChainData } from "../../../constants/addresses";
import { colors } from "../../../constants/colors";
import { useCreateTournament } from "../../../hooks/write/useCreateTournament";
import { uploadJsonToIpfs, uploadToIPFS } from "../../../lib/uploadToIPFS";
import {
  DefifaLaunchProjectData,
  DefifaTier,
  FarcasterSignerRequest,
} from "../../../types/interfaces";
import { contractUri, projectMetadataUri } from "../../../uri/contractUri";
import { truncateAddress } from "../../../utils/truncate";
import Button from "../../UI/Button";
import Content from "../../UI/Content";
import styles from "./DeployerCreate.module.css";

const unixToDatetimeLocal = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes() + 5}`.padStart(2, "0"); //now + 5 minutes
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const datetimeLocalToUnix = (value: string): number => {
  return Math.floor(new Date(value).getTime() / 1000);
};

const DeployerCreate = ({ fcr }: { fcr?: FarcasterSignerRequest }) => {
  const [step, setStep] = useState(1);
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);
  const { ethPaymentTerminal, JBTiered721DelegateStore } = chainData;
  const [addNftOpen, setAddNftOpen] = useState(false);

  const [tier, setTier] = useState<DefifaTier>({
    name: "",
    price: 0.01,
    reservedRate: 0,
    reservedTokenBeneficiary: "0x0000000000000000000000000000000000000000",
    royaltyRate: 0,
    royaltyBeneficiary: "0x0000000000000000000000000000000000000000",
    encodedIPFSUri:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    shouldUseReservedTokenBeneficiaryAsDefault: false,
  });
  const currentUnixTimestamp = Math.floor(Date.now() / 1000);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUri, setImageUri] = useState<any>();
  const [formValues, setFormValues] = useState<DefifaLaunchProjectData>({
    name: "",
    mintDuration: 1 * 60 * 60,
    refundPeriodDuration: 60 * 60,
    start: currentUnixTimestamp + 1 * 60 * 60 + 1 * 60 * 60,
    end: currentUnixTimestamp + 1 * 60 * 60 + 2 * 60 * 60,
    votingPeriod: 0,
    tiers: [],
    splits: [],
    token: ETH_TOKEN_ADDRESS,
    ballkidzFeeProjectTokenAccount:
      "0x11834239698c7336EF232C00a2A9926d3375DF9D",
    terminal: ethPaymentTerminal.address,
    defaultTokenUriResolver: "0x0000000000000000000000000000000000000000",
    contractUri: "",
    baseUri: "ipfs://",
    distributionLimit: 0,
    projectMetadata: {
      content: "",
      domain: 0,
    },
    store: JBTiered721DelegateStore.address,
  });
  const [editedTier, setEditedTier] = useState<DefifaTier | null>(null);
  const minDate = unixToDatetimeLocal(currentUnixTimestamp);
  const [inputKey, setInputKey] = useState(0);

  const [tierGeneralValues, setTierGeneralValues] =
    useState<Partial<DefifaTier>>();

  const { data, write } = useCreateTournament(formValues);

  useEffect(() => {
    const uploadJsons = async () => {
      const contractUriCid = await uploadJsonToIpfs(contractUri);
      const projectMetadataCid = await uploadJsonToIpfs(projectMetadataUri);

      if (!contractUriCid || !projectMetadataCid) return;

      setFormValues((prevValues) => ({
        ...prevValues,
        contractUri: `ipfs://${contractUriCid}`,
        projectMetadata: {
          content: projectMetadataCid,
          domain: 0,
        },
      }));
    };

    uploadJsons();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const datetimeLocalFields: Array<keyof DefifaLaunchProjectData> = [
      "start",
      "end",
    ];

    let newValue: string | number;

    if (name === "mintDuration" || name === "refundPeriodDuration") {
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
      write?.();
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
                reservedTokenBeneficiary:
                  "0x0000000000000000000000000000000000000000",
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
      mergedTier.reservedTokenBeneficiary =
        "0x0000000000000000000000000000000000000000";
      mergedTier.shouldUseReservedTokenBeneficiaryAsDefault = true;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      tiers: mergedTier ? [...prevValues.tiers, mergedTier] : prevValues.tiers,
    }));

    setTier({
      name: "",
      price: 0.01, // default price if nothing entered
      reservedRate: 0,
      reservedTokenBeneficiary: "0x0000000000000000000000000000000000000000",
      royaltyRate: 0,
      royaltyBeneficiary: "0x0000000000000000000000000000000000000000",
      encodedIPFSUri:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      shouldUseReservedTokenBeneficiaryAsDefault: false,
    });

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

  const editTier = (t: DefifaTier, index: number) => {
    setEditedTier(t);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={styles.addNftContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="string"
                id="tierName"
                className={styles.input}
                value={t?.name}
                name="name"
                onChange={(e) => setEditedTier({ ...t, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="file" className={styles.label}>
                Upload NFT
              </label>
              <input
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

  return (
    <div className={styles.container}>
      <h3 className={styles.stepTitle}>
        Step {step}: {step === 1 ? "Tournament Setup" : "NFT Setup"}
      </h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.input}
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="mintDuration" className={styles.label}>
                Mint Duration (hours prior to kickoff)
              </label>
              <input
                type="number"
                id="mintDuration"
                name="mintDuration"
                className={styles.input}
                value={formValues.mintDuration / 60 / 60} // convert seconds to hours for display
                onChange={handleInputChange}
                min={0} // set the minimum value allowed
                step={1} // set the step size, e.g., 1 hour increments
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="refundPeriodDuration" className={styles.label}>
                Refund duration (final hours before kickoff, optional)
              </label>
              <input
                type="number"
                id="refundPeriodDuration"
                name="refundPeriodDuration"
                className={styles.input}
                value={formValues.refundPeriodDuration / 60 / 60} // convert seconds to hours for display: ;
                onChange={handleInputChange}
                min={0} // set the minimum value allowed
                step={1} // set the step size, e.g., 1 hour increments
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="start" className={styles.label}>
                Start Date (kickoff time &gt; now + mint duration + refund
                duration)
              </label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                className={styles.input}
                value={unixToDatetimeLocal(formValues.start)}
                onChange={handleInputChange}
                min={minDate}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="end" className={styles.label}>
                End Date (final whistle)
              </label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                className={styles.input}
                value={unixToDatetimeLocal(formValues.end)}
                onChange={handleInputChange}
                min={minDate}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="defaultTokenUriResolver" className={styles.label}>
                Token URI
              </label>
              <input
                type="string"
                id="defaultTokenUriResolver"
                name="defaultTokenUriResolver"
                className={styles.input}
                value={formValues.defaultTokenUriResolver}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price for each NFT (ETH)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={styles.input}
                value={tierGeneralValues?.price}
                onChange={handleTierGeneralValues}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reservedRate" className={styles.label}>
                Reserved rate (Reserve 1 NFT for every X minted NFTs)
              </label>
              <input
                type="number"
                id="reservedRate"
                name="reservedRate"
                className={styles.input}
                value={tierGeneralValues?.reservedRate}
                onChange={handleTierGeneralValues}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reservedRate" className={styles.label}>
                Reserved rate beneficiary address (ETH address that will receive
                the reserved rate allocation)
              </label>
              <input
                type="string"
                id="reservedTokenBeneficiary"
                name="reservedTokenBeneficiary"
                className={styles.input}
                value={tierGeneralValues?.reservedTokenBeneficiary}
                onChange={handleTierGeneralValues}
              />
            </div>
            <Content title="Upload NFT" createIcon open={addNftOpen}>
              <div className={styles.addNftContainer}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name
                  </label>
                  <input
                    type="string"
                    id="tierName"
                    className={styles.input}
                    value={tier?.name}
                    name="name"
                    onChange={handleTierChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="file" className={styles.label}>
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
                        style={{ cursor: "pointer" }}
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
                </div>

                <div style={{ marginTop: "20px" }}>
                  <Button onClick={onAddNFT} disabled={isUploading}>
                    Add
                  </Button>
                </div>
              </div>
            </Content>

            {formValues.tiers.length > 0 && (
              <div className={styles.tiersListContainer}>
                <p>List of your NFTs</p>
                {formValues.tiers.map((tier, index) => (
                  <div key={index} className={styles.tier}>
                    <div className={styles.tierDetails}>
                      <p>Name: {tier.name}</p>
                      <p>Price: Ξ{tier.price}</p>
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
                      <span>
                        <FontAwesomeIcon
                          onClick={() => editTier(tier, index)}
                          icon={faPen}
                          color="var(--gold)"
                        />
                      </span>
                      <span onClick={() => onRemoveTier(index)}>
                        <FontAwesomeIcon icon={faTrash} color="var(--gold)" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            size={step === 2 ? "big" : "medium"}
            color={step === 2 ? "var(--gold)" : colors.turquoise}
          >
            {step === 1 ? "Next" : "Create tournament"}
          </Button>
          {step === 2 && <Button onClick={() => setStep(1)}>Back</Button>}
        </div>
      </form>
    </div>
  );
};

export default DeployerCreate;
