import React, { useState } from "react";
import { Card } from "./Card";
import { useGameContext } from "contexts/GameContext";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";
import { useFarcasterContext } from "hooks/useFarcasterContext";

const FourItemsDisplay = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { triggerSelection } = useMiniAppHaptics();
    const { isInMiniApp } = useFarcasterContext();
    const {
        metadata,
        nfts: { tiers },
        loading: { metadataLoading },
    } = useGameContext();

    const handleNext = () => {
        void triggerSelection();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (tiers?.length || 1));
    };

    if (!tiers) {
        // Handle the case when tiers is null
        return (
            <div className="text-center text-neutral-400 py-8">
                {metadataLoading ? "Loading NFTs..." : "No NFTs available"}
            </div>
        );
    }

    if (tiers.length === 0) {
        return (
            <div className="text-center text-neutral-400 py-8">
                No NFTs available
            </div>
        );
    }

    // For mobile/miniapp: show 8 items (2 per row, 4 rows)
    // For desktop: show all items
    const mobileLimit = 8;
    // Always show all items - CSS will handle the responsive display
    // Mobile will naturally show 2 per row due to card width, desktop shows more
    const allItems = [...tiers]
        .slice(currentIndex)
        .concat(tiers.slice(0, currentIndex));
    
    // Separate items for mobile (first 8) and desktop (all)
    const mobileItems = allItems.slice(0, mobileLimit);
    const desktopItems = allItems;

    return (
        <div>
            {/* Mobile/miniapp view: show 8 items, 2 per row */}
            <div className={`flex gap-4 flex-wrap justify-center md:hidden ${isInMiniApp ? "" : ""}`}>
                {mobileItems.map((tier, index) => (
                    <Card
                        key={`mobile-${index}`}
                        title={tier?.teamName || `Team ${tier.id}`}
                        imageSrc={tier?.teamImage || ""}
                    />
                ))}
            </div>
            {/* Desktop view: show all items */}
            <div className="hidden md:flex gap-4 flex-wrap md:justify-start">
                {desktopItems.map((tier, index) => (
                    <Card
                        key={`desktop-${index}`}
                        title={tier?.teamName || `Team ${tier.id}`}
                        imageSrc={tier?.teamImage || ""}
                    />
                ))}
            </div>
            {/* Scroll button: only show on mobile/miniapp when there are more than 8 items */}
            {tiers && tiers.length > mobileLimit && (
                <div className="flex justify-center w-full mt-2 md:hidden">
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-700"
                        onClick={handleNext}
                    >
                        <ChevronRightIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
            )}
        </div>

    );
};

export default FourItemsDisplay;
