import React, { useState } from 'react';

const ArcadeDescription = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleCard}
      >
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isExpanded}
            onChange={() => {}}
          />
          <div className="w-10 h-4 bg-gray-300 rounded-full shadow-inner"></div>
          <div
            className={`${
              isExpanded ? 'translate-x-6 bg-pink-500' : 'translate-x-0 bg-pink-500'
            } absolute top-0 left-0 w-4 h-4 transform rounded-full transition-transform`}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium text-neutral-700">
          {isExpanded ? 'hide' : 'Learn how to play'}
        </span>
      </div>
      {isExpanded && (
        <div className="border border-pink-500 rounded-lg shadow p-4">
        <ol className="space-y-4 mt-4">
          <li>
            <h2 className="text-xl font-bold mb-2">Play:</h2>
            <p className="mb-4">
              Select a game, review its rules and pick the outcomes you think may happen.
              This fills the game pot. A portion may be reserved to support artists and creators.
            </p>
          </li>
          <li>
            <h2 className="text-xl font-bold mb-2">Score:</h2>
            <p className="mb-4">
              The first scorecard ratified determines how the pot is split. Scorecards are proposed by anyone. 
              50% of the picks made for an outcome are needed to allocate that outcome's 1 vote to a scorecard. 
              Once a scorecard has 50% of the outcomes attesting it, it may be ratified. Delegate your picks to a
              trusted referee.
            </p>
          </li>
          <li>
            <h2 className="text-xl font-bold mb-2">Earn:</h2>
            <p className="mb-4">
              The pot backs the value of the winning picks and may also fund the creators. Scorecard ratification 
              determines which players may redeem their picks for their share of the pot. Creators and players earn
              Defifa tokens.
            </p>
          </li>
          <li>
            <h2 className="text-xl font-bold mb-2">COMING SOON - Create:</h2>
            <p className="mb-4">
              Name your game and the outcomes, define the payout rules, set game times and prices to
              play, reserve some of the pot if you want, then invite your friends.
            </p>
          </li>
        </ol>
        </div>
      )}
    </div>
  );
};

export default ArcadeDescription;
