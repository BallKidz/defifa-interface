import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFetchCastsUrl } from 'hooks/read/useFetchCastsUrl';
import { NobleEd25519Signer, getHubRpcClient, makeCastAdd } from "@farcaster/hub-web";
import { useCheckSigner, useToken, useSigner, useEncryptedSigner } from "@farsign/hooks";
import { FarcasterHub } from "../../constants/constants";

import Link from "next/link";
import { useFetchUserDetails } from "hooks/read/useFetchUserDetails";

interface SocialMediaFeedProps {
    channel?: string; // Make the channel prop optional by using `?`
}
const FarcasterAppName = "Defifa";
const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({ channel }) => {
    let parentUrl: string;
    if (channel) {
        parentUrl = `chain://eip155:1/erc721:${channel}`;
    } else {
        parentUrl = "https://defifa.net/";
    }
    const [token] = useToken(FarcasterAppName);
    const [signer] = useSigner(FarcasterAppName, token);
    const [encryptedSigner] = useEncryptedSigner(FarcasterAppName, token);

    const [newPost, setNewPost] = useState("");
    const { casts, loading } = useFetchCastsUrl(parentUrl);
    const [updatedCasts, setUpdatedCasts] = useState(casts);
    const [isWidgetVisible, setWidgetVisibility] = useState(true);

    const [isConnected, setIsConnected] = useCheckSigner("Defifa");

    const scrollRef = useRef(null);
    const FID = signer.signerRequest.fid;
    const fname = useFetchUserDetails(FID);
    useEffect(() => {
        const fetchUserDetails = async () => {
            const client = getHubRpcClient(FarcasterHub);
            //const client = getHubRpcClient("https://nemes.farcaster.eth");
            try {
                const fids = casts.map((msg) => msg.data.fid);
                const userPromises = fids.map((fid) => client.getUserDataByFid({ fid }));
                const userResults = await Promise.all(userPromises);
                const filteredUserResults = userResults.map((result) => {
                    const type1Message = result.value.messages.find(
                        (message) => message.data.userDataBody.type === 1
                    );
                    const type6Message = result.value.messages.find(
                        (message) => message.data.userDataBody.type === 6
                    );
                    return {
                        pfp: type1Message?.data.userDataBody.value,
                        fname: type6Message?.data.userDataBody.value
                    };
                });

                // Add the pfp and fname fields to the casts object
                const updatedCasts = casts.map((cast, index) => {
                    return {
                        ...cast,
                        pfp: filteredUserResults[index]?.pfp,
                        fname: filteredUserResults[index]?.fname
                    };
                });
                setUpdatedCasts(updatedCasts);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        fetchUserDetails();
    }, [casts]);

    useEffect(() => {
        if (signer.isConnected === true) {
            setIsConnected(true); // if Typescript is naughty with you, you can write this: (setIsConnected as Dispatch<SetStateAction<boolean>>)(true);
        }
    }, [signer])

    const handlePostChange = (event) => {
        setNewPost(event.target.value);
    };

    //TODO make network dynamic
    const handleAddPost = async () => {
        const client = getHubRpcClient(FarcasterHub);
        const dataOptions = {
            fid: FID,
            network: 1,
        };
        const castResults = [];
        // if (newPost && signerRequestLocal.token) {

        const castReplyingToAUrl = await makeCastAdd(
            {
                parentUrl: parentUrl,
                text: newPost,
                embeds: [],
                embedsDeprecated: [],
                mentions: [],
                mentionsPositions: [],
            },
            dataOptions,
            (encryptedSigner as NobleEd25519Signer),
        );
        castResults.push(castReplyingToAUrl);
        castResults.map((castAddResult) => castAddResult.map((castAdd) => client.submitMessage(castAdd)));
        setNewPost("");
    };

    useEffect(() => {
        // Scroll to the bottom when casts change or new post is added
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [updatedCasts, isWidgetVisible]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleToggleWidget = () => {
        setWidgetVisibility((prevState) => !prevState);
    };

    return isConnected ? (
        <div className="max-w-[375px] mx-auto z-5000">
            <div className="bg-white border border-pink-500 rounded-lg w-125">
                <div className="flex items-center justify-between px-4 py-2 bg-pink-500">
                    <div className="text-md text-white font-medium">
                        Fan Reactions - Connected as {fname.userResult}
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
                            {isWidgetVisible ? 'hide' : 'show'}
                        </span>
                    </div>
                </div>
                {isWidgetVisible && (
                    <div className="max-h-80 overflow-y-auto" ref={scrollRef}>
                        {updatedCasts?.map((updatedCast, index) => {
                            const textWithLinks = updatedCast.data.castAddBody.text.replace(
                                /(https?:\/\/[^\s]+)/g,
                                (url: any) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-pink-500">${'Warning LINK'}</a>`
                            );
                            return (
                                <div key={index} className="flex bg-white p-1">
                                    <span className="text-sm text-lime-500 font-bold">
                                        <Link href={`https://warpcast.com/${updatedCast.fname}`}>
                                            <a>
                                                <Image
                                                    src={updatedCast.pfp}
                                                    alt="Author Avatar"
                                                    className="rounded-full mr-1"
                                                    width={24}
                                                    height={24}
                                                />
                                                {updatedCast.fname}
                                            </a>
                                        </Link>{" "}
                                        <span
                                            className="text-sm text-black font-normal"
                                            dangerouslySetInnerHTML={{ __html: textWithLinks }}
                                        ></span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
                {isWidgetVisible && (
                    <div className="p-4">
                        <textarea
                            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md resize-none"
                            rows={3}
                            placeholder="Trash talk..."
                            value={newPost}
                            onChange={handlePostChange}
                        ></textarea>
                        <button
                            className="bg-pink-500 text-white font-medium py-2 px-4 rounded-md mt-2"
                            onClick={handleAddPost}
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
                <div className="bg-white border border-pink-500 rounded-lg w-125">
                    <div className="flex items-center justify-between px-4 py-2 bg-pink-500">
                        <div className="text-md text-white font-medium">Fan Reactions - Sign In</div>
                        <button className="text-white font-medium" onClick={handleToggleWidget}>
                            {isWidgetVisible ? "Hide Widget" : "Show Widget"}
                        </button>
                    </div>
                    {isWidgetVisible && (
                        <div className="max-h-80 overflow-y-auto" ref={scrollRef}>
                            {updatedCasts?.map((updatedCast, index) => {
                                const textWithLinks = updatedCast.data.castAddBody.text.replace(
                                    /(https?:\/\/[^\s]+)/g,
                                    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${'LINK'}</a>`
                                );
                                return (
                                    <div key={index} className="flex bg-white p-1">
                                        <span className="text-sm text-lime-500 font-bold">
                                            <Link href={`https://warpcast.com/${updatedCast.fname}`}>
                                                <a>
                                                    <Image
                                                        src={updatedCast.pfp}
                                                        alt="Author Avatar"
                                                        className="rounded-full mr-1"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    {updatedCast.fname}
                                                </a>
                                            </Link>{" "}
                                            <span
                                                className="text-sm text-black font-normal"
                                                dangerouslySetInnerHTML={{ __html: textWithLinks }}
                                            ></span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}
export default SocialMediaFeed;
