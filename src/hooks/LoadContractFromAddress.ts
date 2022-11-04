import * as constants from "@ethersproject/constants";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

export const useLoadContractFromAddress = <ABI extends ContractInterface>({
  address,
  abi,
}: {
  address: string | undefined;
  abi: ABI | undefined;
}) => {
  const [contract, setContract] = useState<Contract>();
  const { data: signer, isError, isLoading } = useSigner();

  const isInputAddressValid = (
    address: string | undefined
  ): address is string => {
    if (address && isAddress(address) && address !== constants.AddressZero) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!abi || !isInputAddressValid(address) || !signer) {
      return setContract(undefined);
    }

    setContract(new Contract(address, abi, signer));
  }, [address, abi, signer]);

  return contract;
};
