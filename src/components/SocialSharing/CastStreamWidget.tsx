import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFetchCastsUrl } from 'hooks/read/useFetchCastsUrl';
import { NobleEd25519Signer, getHubRpcClient, makeCastAdd } from "@farcaster/hub-web";
import { useCheckSigner, useToken, useSigner, useEncryptedSigner } from "@farsign/hooks";
import { FarcasterAppName, FarcasterHub } from "../../constants/constants";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useFetchUserDetails } from "hooks/read/useFetchUserDetails";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface SocialMediaFeedProps {
    channel?: string; // Make the channel prop optional by using `?`
}
;

const SocialMediaFeed = ({ channel }: SocialMediaFeedProps) => {
    let parentUrl: string;
    console.log("channel", channel);
    if (channel) {
        parentUrl = `chain://eip155:1/erc721:${channel}`;
        console.log("parentUrl", parentUrl);
    } else {
        parentUrl = "https://defifa.net/";
        console.log("parentUrl", parentUrl);
    }
    const [isConnected, setIsConnected] = useCheckSigner(FarcasterAppName);
    const [token] = useToken(FarcasterAppName);
    const [signer] = useSigner(FarcasterAppName, token);
    const [encryptedSigner] = useEncryptedSigner(FarcasterAppName, token);
    const [newPost, setNewPost] = useState("");
    console.log('about to call useFetchCastsUrl ', parentUrl);
    const { casts, loading } = useFetchCastsUrl(parentUrl);
    const [updatedCasts, setUpdatedCasts] = useState(casts);
    const [isWidgetVisible, setWidgetVisibility] = useState(true);

    const scrollRef = useRef(null);
    const FID = signer.signerRequest.fid;
    const fname = useFetchUserDetails(FID);
    useEffect(() => {
        const fetchUserDetails = async () => {
            const client = getHubRpcClient(FarcasterHub);
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
            network: 1, // TODO make network dynamic based on the network the user is connected to
        };
        const castResults = []; // Might cast to more than one channel in future
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
                            {isWidgetVisible ? '' : ''}
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
                        <Link href="https://www.farcaster.xyz/intro/use-farcaster.html">
                            <a className="flex items-center gap-2 text-white text-sm">
                                <div className="text-md mr-4 text-white font-medium">
                                    Farcaster sign-in
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
                                                        height={24} />
                                                    {updatedCast.fname}
                                                </a>
                                            </Link>{" "}
                                            <span
                                                className="text-sm text-black font-normal"
                                                dangerouslySetInnerHTML={{ __html: textWithLinks }}
                                            ></span>
                                        </span>
                                        <div className="p-4">
                                            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                                                <QRCode
                                                    size={256}
                                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                    value={token.deepLink}
                                                    viewBox={`0 0 256 256`}
                                                />
                                            </div>

                                            <Link href={token.deepLink}>
                                                <p className="flex items-center gap-2 text-black text-sm">On mobile?</p>
                                            </Link>
                                        </div>
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


/*
useEffect(() => {
        const delay = 3000; // 3 seconds

        const delayedFunction = () => {
            // Function to be executed after the delay
            console.log('Delayed function called!');
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { casts, loading } = useFetchCastsUrl(parentUrl);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [updatedCasts, setUpdatedCasts] = useState(casts);
        };

        // Start the timer
        const timeoutId = setTimeout(delayedFunction, delay);

        // Clean up the timer when the component unmounts or the effect re-runs
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
*/