import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useProvider, useNetwork, useContractRead } from "wagmi";
import { getChainData } from "../../constants/addresses";
import { forEach } from "lodash";

export function useTiersImages(tiers: any, dataSource: string) {
  const provider = useProvider();
  const network = useNetwork();
  const chainData = getChainData(network?.chain?.id);

  const [tierImages, setTierImages] = useState<JBImagesForAllTiersData[]>([
    { fakeTokenId: "1000000001", imageInfo: "QmSxpqaAdCFXoYCHvJzcEAFJJ7epqp86oUFTwZXcFxNbCa" } // BK logo
  ]);

  useEffect(() => {
    fetchImagesForAllTiers(tiers, chainData, dataSource, provider).then((data) => {
      setTierImages(data);
    });
  }, [dataSource, provider]);

  return tierImages;
}

export interface JBImagesForAllTiersData {
  fakeTokenId: string;
  imageInfo: string;
}

async function fetchImagesForAllTiers(
  tiers: any,
  chainData: any,
  dataSourceAddress?: string,
  provider?: ethers.providers.Provider
): Promise<JBImagesForAllTiersData[]> {
  // Note for each tier, fetch the image info. Check if encodedIPFSUri is 0x000 if so 
  // return a default image using tokenURI(). If not, use the image from IPFS and 
  // return it using useFetchSvgs as it does all the ipfs parsing.
  let fakeTokenIds: any[] = [];
  forEach(tiers, async (tier: any, index: number) => {
     const tierNum = tier.id.toNumber().toString();
     if(index > 9) {
     fakeTokenIds[index] = tierNum + "1000000001".substring(2)
     } else {
      fakeTokenIds[index] = tierNum + "1000000001".substring(1);
      }
  });
  console.log("fakeTokenIds", fakeTokenIds);  
  //const fakeTokenIds = ["1000000001", "2000000001"];
  const imagesForAllTiers = await Promise.all(
    fakeTokenIds.map(async (fakeTokenId: any) => {
      try {
        const contractInterface = chainData.DefifaDelegateABI;
        const functionName = "tokenURI";
        const args = fakeTokenId ? [fakeTokenId] : null;
        const chainId = chainData.chainId;

        const contractData = await fetchContractData(
          provider,
          dataSourceAddress,
          contractInterface,
          functionName,
          args,
          chainId
        );
        // TODO: check if @nakedfool has a better way to do this
        const imageInfo: string = contractData[0];
        let result: any;
        if (imageInfo.startsWith("data")) {
          const encodedData = imageInfo.split(',')[1]; // Extract the Base64-encoded portion
          const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
          result = JSON.parse(decodedData).image;
        } else {
          result = imageInfo;
        } 
        return { fakeTokenId: fakeTokenId, imageInfo: result };
      } catch (error) {
        console.log("error", error);
        return { fakeTokenId: "1000000000", imageInfo: "QmSxpqaAdCFXoYCHvJzcEAFJJ7epqp86oUFTwZXcFxNbCa" }; //TODO: return default image 404
      }
    })
  );
  return imagesForAllTiers;
}

async function fetchContractData(
  provider: ethers.providers.Provider,
  addressOrName: string | Promise<string>,
  contractInterface: ethers.ContractInterface,
  functionName: string,
  args: any[],
  chainId: number
) {
  const contract = new ethers.Contract(addressOrName, contractInterface, provider);
  const contractFunction = contract.functions[functionName];
  const result = await contractFunction(...args);

  return result;
}
