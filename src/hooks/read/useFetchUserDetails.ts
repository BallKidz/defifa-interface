import { useEffect, useState } from 'react';
import { HubRpcClient, Message, UserDataAddData, UserDataType, getHubRpcClient, isUserDataAddMessage } from '@farcaster/hub-web';
//import { FarcasterHub } from '../constants/constants';

export function useFetchUserDetails(fid: number, FarcasterHub: string) {
  const [userResult, setUserResult] = useState<string[]>([]);
  const [loading1, setLoading1] = useState(true);
  

    useEffect(() => {
      const fetchUserDetails = async () => {
        const client = getHubRpcClient(FarcasterHub);
        const getFnameFromFid = async (fid: number, client: HubRpcClient): Promise<string[]> => {
          const result = await client.getUserData({ fid: fid, userDataType: UserDataType.FNAME });
          if (result.isOk()) {
            const message = result.value as Message & { data: UserDataAddData };
            if (isUserDataAddMessage(message)) {
              const updatedUserResult = [...userResult, message.data.userDataBody.value];
              setUserResult(updatedUserResult);
              setLoading1(false);
              return updatedUserResult;
            }
          }
          return userResult;
        };
        
        await getFnameFromFid(fid, client); // Call the helper function
      };

      fetchUserDetails();
    }, [fid]); // Include userResult in the dependency array??

  return {
    userResult: userResult || '', 
    loading1,
  };
}
