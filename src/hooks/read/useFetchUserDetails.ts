import { useEffect, useState } from 'react';
import { HubAsyncResult, HubRpcClient, UserDataType, getHubRpcClient, isUserDataAddMessage } from '@farcaster/hub-web';
import { FarcasterHub } from "../../constants/constants";

export function useFetchUserDetails(fid: any) {
  const [userResult, setUserResult] = useState([]);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const client = getHubRpcClient(FarcasterHub);
      const getFnameFromFid = async (fid: number, client: HubRpcClient): HubAsyncResult<string> => {
        const result = await client.getUserData({ fid: fid, userDataType: UserDataType.FNAME });
          return result.map((message) => {
            if (isUserDataAddMessage(message)) {
              setUserResult(result.value.data.userDataBody.value);
              setLoading1(false);
              return message.data.userDataBody.value;
            } else {
              return '';
            }
          });
        };
      await getFnameFromFid(fid, client); // Call the helper function
    };

    fetchUserDetails();
  }, [fid]);

  return {
    userResult: userResult || '', 
    loading1,
  };
}
