import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, useState, useCallback } from "react";
import { twJoin } from "tailwind-merge";
import { PlayContent } from "./PlayContent/PlayContent";
import { RulesContent } from "./RulesContent/RulesContent";
import { ActivityContent } from "./ActivityContent/ActivityContent";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

type GameTab = "play" | "rules" | "activity";

function TabButton({
  active,
  ...props
}: { active: boolean } & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { triggerSelection } = useMiniAppHaptics();
  const { onClick, ...restProps } = props;
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      void triggerSelection();
      onClick?.(event);
    },
    [onClick, triggerSelection]
  );

  return (
    <button
      {...restProps}
      className={twJoin(
        active ? "underline" : "text-neutral-400 hover:text-neutral-200",
        "rounded-md px-4 py-2 font-medium capitalize"
      )}
      onClick={handleClick}
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
