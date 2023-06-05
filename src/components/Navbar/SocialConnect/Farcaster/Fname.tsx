import {
    CastAddMessage,
    HubAsyncResult,
    HubRpcClient,
    FarcasterNetwork,
    getHubRpcClient,
    isCastAddMessage,
    isUserDataAddMessage,
    UserDataType,
    makeCastAdd,
  } from '@farcaster/hub-web';
  import { err, ok, Result } from 'neverthrow';

  
  /**
   * Populate the following constants with your own values
   */
  
  const HUB_URL = 'https://galaxy.ditti.xyz:2285'; // URL of the Hub
  // const FIDS = [4163]; // User IDs to fetch casts for
  
  export const getFnameFromFid = async (fid: number, client: HubRpcClient): HubAsyncResult<string> => {
    const result = await client.getUserData({ fid: fid, userDataType: UserDataType.FNAME });
    return result.map((message) => {
      if (isUserDataAddMessage(message)) {
        return message.data.userDataBody.value;
      } else {
        return '';
      }
    });
  };

  /**
   * Example 1: A cast with no mentions
   *
   * "This is a cast with no mentions"
   */

  
  export const createCast = async (client: HubRpcClient) => {
    const castResults = [];
    const signedMsgStored = localStorage.getItem('signedMsgStored');
    const fnameStored = localStorage.getItem('fnameStored');
    const fidStored = localStorage.getItem('fidStored');
    console.log('signedMsgStored in createCast',signedMsgStored);
    const NETWORK = "testnet1.farcaster.xyz:2283"; // Network of the Hub

    const dataOptions = {
        fid: 4163,
        network: FarcasterNetwork.MAINNET,
      };
    console.log('dataOptions in createCast',dataOptions);
    const cast = await makeCastAdd(
        {
        text: 'If at first you succeed, try, not to look too surprised.',
        embeds: [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
        },
        dataOptions,
        signedMsgStored
        );
    console.log('cast in createCast',cast);
    //const castResults = await client.submitMessage(cast);
    console.log('castResults in createCast',castResults);
    castResults.map((castAddResult) => castAddResult.map((castAdd) => client.submitMessage(castAdd)));
    console.log('castResults in createCast',castResults);
    return castResults;
  }

    /**
     * Get a HubRpcClient instance
     */
  /* const Fname = async (fids: any[]) => {
    const client = getHubRpcClient(HUB_URL, false);
    console.log("Fids:", fids);
    // 1. Create a mapping of fids to fnames, which we'll need later to display messages
    const fidToFname = new Map<number, string>();

    const fnameResultPromises = fids.map((fid) => client.getUserData({ fid, userDataType: UserDataType.FNAME }));
    const fnameResults = Result.combine(await Promise.all(fnameResultPromises));

    if (fnameResults.isErr()) {
        console.error(fnameResults.error);
        return;
    }

    fnameResults.map((result: any[]) =>
        result.map((uData) => {
        if (isUserDataAddMessage(uData)) {
            const fid = uData.data.fid;
            const fname = uData.data.userDataBody.value;
            fidToFname.set(fid, fname);
        }
        })
    );
    return fidToFname;
  };

  export default Fname; */
