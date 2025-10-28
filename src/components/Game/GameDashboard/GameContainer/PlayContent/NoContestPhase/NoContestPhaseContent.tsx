import { useGameContext } from "contexts/GameContext";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";

export function NoContestPhaseContent() {
  const { currentPhase } = useGameContext();

  const isNoContestInevitable = currentPhase === DefifaGamePhase.NO_CONTEST_INEVITABLE;
  const isNoContest = currentPhase === DefifaGamePhase.NO_CONTEST;

  return (
    <div className="space-y-6">
      {/* No Contest Banner */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">!</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              {isNoContestInevitable ? "No Contest Inevitable. Refunds Open." : "No Contest. Refunds Open."}
            </h3>
            <div className="text-gray-300 space-y-2">
              {isNoContestInevitable ? (
                <>
                  <p>
                    The game conditions for proceeding to scoring have not been met. 
                    The system is opening refunds instead of advancing to the scoring phase.
                  </p>
                  <p className="text-sm text-gray-400">
                    This is the safety valve - when thresholds or criteria defined in the delegate 
                    aren't met, the game enters refund-only state.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This game has concluded with no contest. All participants can now claim 
                    full refunds for their NFTs through the cash-out flow.
                  </p>
                  <p className="text-sm text-gray-400">
                    No scoring or ratification will occur. The game's metadata now reflects 
                    the no contest status on marketplaces.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Interface */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Redeem Your NFTs</h2>
        <p className="text-gray-400 mb-6">
          Since this game is no contest, you can redeem your NFTs for the full amount you paid to mint them.
        </p>
        <RefundPicksContent />
      </div>

      {/* Additional Info */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-300 mb-2">What happens in a no contest?</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• All NFTs can be redeemed for their original mint price</li>
          <li>• No scorecard will be ratified</li>
          <li>• The game pot is distributed back to all participants</li>
          <li>• You can choose to keep your NFTs as collectibles or redeem them</li>
        </ul>
      </div>
    </div>
  );
}
