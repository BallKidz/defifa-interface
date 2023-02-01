//import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import styles from "./BracketView.module.css";
import {simpleSmallBracket} from '../SampleData';
import dynamic from "next/dynamic";
import React from "react";
import { CurrentScore } from '../../../hooks/read/CurrentScore';

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  import("@g-loot/react-tournament-brackets");
}
const SingleEliminationBracket = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(
      mod => mod.SingleEliminationBracket
    );
  },
  { ssr: false }
);

const Match = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(mod => mod.Match);
  },
  { ssr: false }
);
const MATCH_STATES = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(
      mod => mod.MATCH_STATES
    );
  },
  { ssr: false }
);
const SVGViewer = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(
      mod => mod.SVGViewer
    );
  },
  { ssr: false }
);

const createTheme = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(
      mod => mod.createTheme
    );
  },
  { ssr: false }
);
const BracketView = () => {
  const data: any  = CurrentScore(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME2);
  console.log('here it is ', data);
  
  const onCreate = () => {
  };
  
    return (
      <>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            Interim results:
          </label>
          <SingleEliminationBracket
            matches={simpleSmallBracket}
            matchComponent={Match}
            svgWrapper={({ children, ...props }) => (
              <SVGViewer width={1500} height={700} {...props}>
                {children}
              </SVGViewer>
            )}
          />
        </div>  
      </>
    )
  };

export default BracketView;