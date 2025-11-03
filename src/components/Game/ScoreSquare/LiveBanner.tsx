"use client";

import { LiveScore } from "types/scoresquare";

interface LiveBannerProps {
  score?: LiveScore;
}

export function LiveBanner({ score }: LiveBannerProps) {
  if (!score) return null;

  return (
    <div className="bg-green-100 border border-green-500 rounded-lg p-3 mb-4 text-center">
      <div className="text-sm font-medium text-green-900">
        LIVE: {score.home} – {score.away}
      </div>
      <div className="text-xs text-green-700">{score.minute}'</div>
    </div>
  );
}

