import { findJBTiered721DelegateStoreAddress } from "../nftRewards";

export const loadJBTiered721DelegateStoreContract = async () => {
  const JBTiered721DelegateStoreContractAddress =
    await findJBTiered721DelegateStoreAddress();
  if (!JBTiered721DelegateStoreContractAddress) return;

  const nftDeployerContractJson = {
    address: JBTiered721DelegateStoreContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json`
      )
    ).abi,
  };

  return nftDeployerContractJson;
};
