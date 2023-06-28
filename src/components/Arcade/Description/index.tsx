import Link from "next/link";
import React, { useState, useEffect } from "react";

const ArcadeDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    // Check if toggle state exists in local storage on page load
    const storedToggleState = localStorage.getItem("toggleState");
    if (storedToggleState) {
      setIsExpanded(JSON.parse(storedToggleState));
    }
  }, []);

  const toggleCard = () => {
    // Update the toggle state
    const newToggleState = !isExpanded;
    setIsExpanded(!isExpanded);

    // Store the toggle state in local storage
    localStorage.setItem("toggleState", JSON.stringify(newToggleState));
  };

  return (
    <div>
      <div className="flex items-center cursor-pointer" onClick={toggleCard}>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isExpanded}
            onChange={() => {}}
          />
          <div className="w-10 h-4 bg-neutral-300 rounded-full shadow-inner"></div>
          <div
            className={`${
              isExpanded
                ? "translate-x-6 bg-pink-500"
                : "translate-x-0 bg-pink-500"
            } absolute top-0 left-0 w-4 h-4 transform rounded-full transition-transform`}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">
          {isExpanded ? "hide" : "Learn how to play"}
        </span>
      </div>
      {isExpanded && (
        <div className="border border-pink-500 rounded-lg shadow p-4">
          <p className="text-center max-w-3xl mx-auto text-lg mb-4">
            Select a game, review its rules, and join a team to fill the game
            pot. The winning teams get more of the pot when the game ends.
          </p>
          <p className="mb-4">
            Defifa allows anyone to create an onchain prediction game for
            sports, elections, world events, or anything else. A game's creator
            sets up teams (representing the sports teams, political candidates,
            or world event outcomes) which anyone can join by minting a team's
            NFTs. Minting NFTs loads a shared reward pot, and the winning teams
            get more of that pot when the game ends.
          </p>
          <p className="mb-4">
            Which teams "win" is determined by onchain voting. Once NFT minting
            closes, anyone can score the contest to determine how much of the
            pot goes to each team. At least 50% of teams need to approve a set
            of scores by majority vote – otherwise, the ETH stays in the pot.
          </p>
          <p className="mb-4">
            Everything runs onchain, making Defifa games decentralized,
            uncensorable, and unstoppable. No third parties needed.
          </p>
          <p className="text-center text-lg">
            <em>
              <Link href="/about">Learn more &gt;</Link>
            </em>
          </p>
        </div>
      )}
    </div>
  );
};

export default ArcadeDescription;
