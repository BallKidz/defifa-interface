import React, { useState } from "react";
import { Card } from "./Card";
import { useGameContext } from "contexts/GameContext";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const FourItemsDisplay = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const {
        metadata,
        nfts: { tiers },
        loading: { metadataLoading },
    } = useGameContext();

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (tiers?.length || 1));
    };

    console.log("FourItemsDisplay - tiers:", tiers);

    if (!tiers) {
        console.log("FourItemsDisplay - No tiers available");
        // Handle the case when tiers is null
        return (
            <div className="text-center text-neutral-400 py-8">
                {metadataLoading ? "Loading NFTs..." : "No NFTs available"}
            </div>
        );
    }

    const displayedItems = [...tiers]
        .slice(currentIndex)
        .concat(tiers.slice(0, currentIndex))
        .slice(0, 4)
        .map((tier, index) => ({
            ...tier,
            key: index,
        }));

    console.log("FourItemsDisplay - displayedItems:", displayedItems.map(t => ({
        id: t.id,
        teamName: t.teamName,
        hasImage: !!t.teamImage
    })));

    return (
        <div>
            <div className="flex gap-4 flex-wrap">
                {displayedItems?.map((tier) => (
                    <Card
                        key={tier.key}
                        title={tier?.teamName || `Team ${tier.id}`}
                        imageSrc={tier?.teamImage || ""}
                    />
                ))}
                <div className="flex justify-end mt-2">
                    {tiers && tiers.length > 4 && (
                        <div className="flex items-center">
                            <div className="flex-1"></div>
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-700"
                                onClick={handleNext}
                            >
                                <ChevronRightIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default FourItemsDisplay;
