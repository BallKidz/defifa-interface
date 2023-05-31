import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { twJoin } from "tailwind-merge";
import { PlayContent } from "./PlayContent/PlayContent";

type GameTab = "play" | "rules" | "teams" | "leaderboard";

function TabButton({
  active,
  ...props
}: { active: boolean } & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={twJoin(
        active
          ? "bg-gray-800 text-gray-50"
          : "text-gray-300 hover:text-gray-50",
        "rounded-md px-4 py-2 text-sm font-medium capitalize"
      )}
      {...props}
    >
      {props.children}
    </button>
  );
}

const TABS: GameTab[] = ["play", "rules", "teams", "leaderboard"];
const TAB_CONTENT = {
  play: PlayContent,
  rules: () => <span>Rules</span>,
  teams: () => <span>teams</span>,
  leaderboard: () => <span>leaderboard</span>,
};

export function GameContainer() {
  const [activeTab, setActiveTab] = useState<GameTab>("play");
  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <div>
      <ul className="flex justify-center gap-6 mt-8">
        {TABS.map((tab) => {
          return (
            <li key={tab}>
              <TabButton
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabButton>
            </li>
          );
        })}
      </ul>

      {<ActiveContent />}
    </div>
  );
}
