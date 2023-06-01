import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { twJoin } from "tailwind-merge";
import { PlayContent } from "./PlayContent/PlayContent";
import { RulesContent } from "./RulesContent/RulesContent";
import { ActivityContent } from "./ActivityContent/ActivityContent";

type GameTab = "play" | "rules" | "activity";

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
        active ? "underline" : "text-gray-400 hover:text-gray-200",
        "rounded-md px-4 py-2 font-medium capitalize"
      )}
      {...props}
    >
      {props.children}
    </button>
  );
}

const TABS: GameTab[] = ["play", "rules", "activity"];
const TAB_CONTENT: { [k in GameTab]?: () => JSX.Element } = {
  play: PlayContent,
  rules: RulesContent,
  activity: ActivityContent,
};

export function GameContainer() {
  const [activeTab, setActiveTab] = useState<GameTab>("play");
  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <div>
      <ul className="flex justify-center py-4">
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

      {ActiveContent && <ActiveContent />}
    </div>
  );
}
