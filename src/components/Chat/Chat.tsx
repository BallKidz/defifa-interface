import { useCheckSigner, useToken, useSigner, useEncryptedSigner } from "@farsign/hooks";
import { makeCastAdd, getHubRpcClient, FarcasterNetwork, Message, NobleEd25519Signer, UserDataType, UserDataAddData, SignatureScheme, HubRpcClient, isUserDataAddMessage, getAuthMetadata } from "@farcaster/hub-web";
import QRCode from "react-qr-code";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { DefaultChannel, FarcasterAppName, FarcasterHub } from "constants/constants";
import { useFetchCastsUrl } from "hooks/read/useFetchCastsUrl";
import { useFetchUserDetails } from "hooks/read/useFetchUserDetails";
import { useGameContext } from "contexts/GameContext";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
//import Image from "next/image";

interface UpdatedCast extends Message {
  fname: string;
  pfp: string;
}
const targetThis = DefaultChannel;
const CLIENT_NAME = FarcasterAppName;

const SocialMediaFeed = () => {
  let scrollRef = useRef<HTMLDivElement>(null); // Initialize scrollRef with the correct type
  const [hubAddress] = useState(FarcasterHub);
  const { currentFundingCycle } = useGameContext();
  //const theChannel = "chain://eip155:1/erc721:" + currentFundingCycle?.metadata?.dataSource.toLowerCase();
  const [newPost, setNewPost] = useState("");
  const [targetUrl, setTargetUrl] = useState(targetThis);
  const { casts, loading } = useFetchCastsUrl(targetUrl, hubAddress);
  const [updatedCasts, setUpdatedCasts] = useState<UpdatedCast[]>([]);
  const [isWidgetVisible, setWidgetVisibility] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [remainingChars, setRemainingChars] = useState(140);
  const [isTextareaFocused, setTextareaFocused] = useState(false);
  const [isConnected, setIsConnected] = useCheckSigner(CLIENT_NAME);
  const [token] = useToken(CLIENT_NAME);
  const [signer] = useSigner(CLIENT_NAME, token);
  const [encryptedSigner] = useEncryptedSigner(CLIENT_NAME, token);

  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  scrollRef = useRef(null);
  const casterFID = signer?.signerRequest?.fid;
  const casterFname = useFetchUserDetails(casterFID, hubAddress);

  useEffect(() => {
    if (signer.isConnected === true) {
      (setIsConnected as Dispatch<SetStateAction<boolean>>)(true);
      //setIsConnected(true); // if Typescript is naughty with you, you can write this: (setIsConnected as Dispatch<SetStateAction<boolean>>)(true);
    }
  }, [setIsConnected, signer])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Mobi/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    }
  }, []);

  useEffect(() => {
    const castsContainer = scrollRef.current;
    if (!castsContainer) return;

    if (shouldScrollToBottom && !hasUserScrolled) {
      castsContainer.scrollTop = castsContainer.scrollHeight;
    }
  }, [updatedCasts, isWidgetVisible, shouldScrollToBottom, hasUserScrolled]);

  const handleScroll = () => {
    const castsContainer = scrollRef.current;
    if (!castsContainer) return;

    const isAtBottom = castsContainer.scrollHeight - castsContainer.scrollTop === castsContainer.clientHeight;
    setHasUserScrolled(!isAtBottom);

    if (isAtBottom) {
      setShouldScrollToBottom(true);
    }
  };

  useEffect(() => {
    fetchCastersDetails();
  }, [casts]);

  const handleTargetUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(event.target.value);
  };

  const getUserDataFromFid = async (
    fid: number,
    userDataType: UserDataType,
    client: HubRpcClient
  ): Promise<string> => {
    const result = await client.getUserData({ fid: fid, userDataType: userDataType });
    if (result.isOk()) {
      const userDataAddMessage = result.value as Message & {
        data: UserDataAddData;
        signatureScheme: SignatureScheme.ED25519;
      };
      //console.log('userDataAddMessage', userDataAddMessage);
      if (isUserDataAddMessage(userDataAddMessage)) {
        return userDataAddMessage.data.userDataBody.value;
      } else {
        return "";
      }
    } else {
      // Handle the error case here
      // throw new Error(result.error.toString());
      console.error("chat error", result.error.toString());
      return "";
    }
  };

  const sendCast = async (newPost: string, encryptedSigner: NobleEd25519Signer) => {
    // console.log('sendingCast', newPost);
    const castBody = newPost;
    const hub = getHubRpcClient(hubAddress); // works with open hub
    const request = JSON.parse(localStorage.getItem("farsign-signer-" + CLIENT_NAME)!).signerRequest;
    const cast = (await makeCastAdd({
      text: castBody,
      parentUrl: targetThis, //theChannel targetThis
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    }, { fid: request.fid, network: FarcasterNetwork.MAINNET }, (encryptedSigner as NobleEd25519Signer)))._unsafeUnwrap();
    // console.log('here we go', cast);
    hub.submitMessage(cast); // w open hub this works
    setShouldScrollToBottom(true);
    setHasUserScrolled(false);
    setNewPost("");
  }

  const fetchCastersDetails = async () => {
    // console.log('you are fetching caster details');
    const client = getHubRpcClient(hubAddress);
    const updatedData = casts
      .filter((cast) => cast.data !== undefined) // Remove rows where data is undefined
      .map(async (cast) => {
        if (cast.data?.castAddBody) {
          const { fid } = cast.data;
          const pfp = await getUserDataFromFid(fid, 1, client); // Assuming you have access to the `client` variable
          const fname = await getUserDataFromFid(fid, 2, client); // Assuming you have access to the `client` variable
          return {
            ...(cast as UpdatedCast),
            pfp: pfp ?? '',
            fname: fname ?? '', // add the fname field with the returned value from `getUserDataFromFid` or an empty string
          };
        } else {
          return null; // Skip this array row
        }
      });

    const extendedCasts = (await Promise.all(updatedData)).filter((cast) => cast !== null) as unknown as UpdatedCast[];
    setUpdatedCasts(extendedCasts);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleToggleWidget = () => {
    setWidgetVisibility((prevState) => !prevState);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of inserting a new line
      sendCast(newPost, encryptedSigner!); // Call the sendCast function directly instead of clicking the button
    }
  };

  const handleTextareaFocus = () => {
    setTextareaFocused(true);
  };

  const handleTextareaBlur = () => {
    if (newPost === "") {
      setTextareaFocused(false);
    }
  };

  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setNewPost(inputValue);
    const count = 140 - inputValue.length;
    setRemainingChars(count);
  };

  return isConnected ? (
    <div className="max-w-[375px] mx-auto z-5000">
      <div className="bg-black border border-pink-700 rounded-lg w-125">
        <div className="flex items-center justify-between px-4 py-2 bg-pink-700">
          <div className="text-md text-white font-medium">
            Chat (experimental)
            {/* Chat (experimental) - Connected as {casterFname.userResult[0]} */}
          </div>
          <div className="px-4 py-2 text-black">
            {/* <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="Enter the target URL"
              value={targetUrl}
              onChange={handleTargetUrlChange}
            /> */}
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleToggleWidget}
          >
            <div className="relative border-white">
              <input
                type="checkbox"
                className="sr-only border-white"
                checked={isWidgetVisible}
                onChange={() => { }}
              />
              <div className="w-10 h-4 bg-white rounded-full shadow-inner"></div>
              <div
                className={`${isWidgetVisible ? 'translate-x-6 bg-lime-500' : 'translate-x-0 bg-lime-500'
                  } absolute top-0 left-0 w-4 h-4 transform rounded-full transition-transform`}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-white">
              {isWidgetVisible ? '' : ''}
            </span>
          </div>
        </div>
        {isWidgetVisible && (
          <div className="max-h-80 overflow-y-auto" ref={scrollRef} onScroll={handleScroll}>

            {updatedCasts?.map((updatedCast, index) => {

              const textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
                /(https?:\/\/[^\s]+)|(chain:[^\s]+)/g,
                (url) => {
                  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('chain:')) {
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-pink-600">${'Warning LINK'}</a>`;
                  } else {
                    return url;
                  }
                }
              );

              return (
                <div key={index} className="flex bg-black p-1">
                  <span className="text-sm text-lime-500 font-bold">
                    {/* <Image
                      src={updatedCast.pfp.value || '/assets/defifa_spinner.gif'}
                      alt="Author Avatar"
                      className="rounded-full mr-1"
                      width={24}
                      height={24}
                    /> */}
                    {typeof updatedCast.fname === 'object' ? updatedCast.fname : updatedCast.fname}
                    {/* not sure about above line! WARNING */}
                    {" "}
                    <span
                      className="text-sm text-white font-normal"
                      dangerouslySetInnerHTML={{
                        __html: textWithLinks ?? '',
                      }}
                    ></span>

                  </span>
                </div>
              );
            })}
          </div>
        )}
        {isWidgetVisible && (
          <div className="p-4 text-black">
            <textarea
              className="w-full text-lime px-3 py-2 border border-gray-300 rounded-md resize-none h-16 overflow-hidden"
              rows={10}
              placeholder={isTextareaFocused ? "" : "Chats are public and viewable in other Farcaster apps."}
              value={newPost}
              onChange={handlePostChange}
              onKeyDown={handleKeyDown}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
            ></textarea>

            <p className="text-pink-500 text-sm">{remainingChars} characters remaining.</p>

            <button
              className="bg-pink-700 text-white font-medium py-2 px-4 rounded-md mt-2"
              onClick={() => sendCast(newPost, encryptedSigner!)}
            >
              Cast
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>
      <div className="max-w-[375px] mx-auto z-5000">
        <div className="bg-white border border-pink-700 rounded-lg w-125">
          <div className="flex items-center justify-between px-4 py-2 bg-pink-700">
            <Link href="https://www.farcaster.xyz/intro/use-farcaster.html">
              <a className="flex items-center gap-2 text-white text-sm">
                <div className="text-md mr-4 text-white font-medium">
                  Sign-in  with Farcaster
                  <QuestionMarkCircleIcon className="h-5 w-5 inline" />
                </div>
              </a>
            </Link>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleToggleWidget}
            >
              <div className="relative border-white">
                <input
                  type="checkbox"
                  className="sr-only border-white"
                  checked={isWidgetVisible}
                  onChange={() => { }}
                />
                <div className="w-10 h-4 bg-white rounded-full shadow-inner"></div>
                <div
                  className={`${isWidgetVisible ? 'translate-x-6 bg-lime-500' : 'translate-x-0 bg-lime-500'
                    } absolute top-0 left-0 w-4 h-4 transform rounded-full transition-transform`}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-white">
                {isWidgetVisible ? '' : ''}
              </span>
            </div>
          </div>
          {isWidgetVisible && (
            <div className="max-h-80 overflow-y-auto" ref={scrollRef}>
              {updatedCasts?.map((updatedCast, index) => {
                const textWithLinks = updatedCast?.data?.castAddBody?.text.replace(
                  /(https?:\/\/[^\s]+)/g,
                  (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${'LINK'}</a>`
                );
                return (
                  <div key={index} className="flex bg-black p-1">
                    <span className="text-sm text-lime-500 font-bold">
                      {/* <Image
                        src=
                        {typeof updatedCast.pfp === 'object' ? updatedCast.pfp : updatedCast.pfp}
                        alt="Author Avatar"
                        className="rounded-full mr-1"
                        width={24}
                        height={24} /> */}
                      {typeof updatedCast.fname === 'object' ? updatedCast.fname : updatedCast.fname}
                      {/* not sure about above line! WARNING */}
                      {/*  </a>
                      </Link> */}{" "}
                      <span
                        className="text-sm text-white font-normal"
                        dangerouslySetInnerHTML={{
                          __html: textWithLinks ?? '',
                        }}
                      ></span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {!isMobileDevice && (
            <div className="p-4 flex flex-col items-center justify-center">
              <a href={token.deepLink} target="_blank" rel="noopener noreferrer">
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={token.deepLink}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </a>
            </div>
          )}{isMobileDevice && (
            <div className="p-4">

              <Link href={token.deepLink}>
                <button
                  className="flex items-center gap-2 bg-pink-700 text-white font-medium py-2 px-4 rounded-md mt-2"
                >
                  Connect
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SocialMediaFeed