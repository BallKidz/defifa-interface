import axios from "axios";
// import { readNetwork } from "constants/networks";
import { Contract, PopulatedTransaction } from "ethers";

const API_KEY = process.env.NEXT_PUBLIC_TENDERLY_API_KEY;
const ACCOUNT = process.env.NEXT_PUBLIC_TENDERLY_ACCOUNT;
const PROJECT = process.env.NEXT_PUBLIC_TENDERLY_PROJECT_NAME;

export const simulateTransaction = async ({
  chainId,
  populatedTx,
  userAddress,
}: {
  chainId: any;
  populatedTx: PopulatedTransaction;
  userAddress: string | undefined;
}) => {
  if (!(API_KEY && PROJECT && ACCOUNT)) return;
  console.log(populatedTx.data);
  const body = {
    network_id: chainId,
    from: userAddress,
    to: populatedTx.to,
    input: populatedTx.data,
    value: 0,
    save_if_fails: true,
    save: true,
  };

  const headers = {
    headers: {
      "content-type": "application/JSON",
      "X-Access-Key": API_KEY,
    },
  };
  const resp = await axios.post(
    `https://api.tenderly.co/api/v1/account/${ACCOUNT}/project/${PROJECT}/simulate`,
    body,
    headers
  );

  const simulationUrl = `https://dashboard.tenderly.co/${ACCOUNT}/${PROJECT}/simulator/${resp.data.simulation.id}`;
  console.log(`View simulation on Tenderly: ${simulationUrl}`, resp.data);
  if (resp.data.simulation.status === false) {
    console.error(`View simulation on Tenderly: ${simulationUrl}`, resp.data);

    throw new Error("Transaction is going to fail");
  }
};
