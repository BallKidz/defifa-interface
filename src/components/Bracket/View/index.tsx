// import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
// Had to use workaround for nextjs. see below
import styles from "./BracketView.module.css";
import { simpleSmallBracket, tournamentData } from '../SampleData';
import dynamic from "next/dynamic";
import { CurrentScore } from '../../../hooks/read/CurrentScore';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

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
const StyledSvgViewer = dynamic(
  () => {
    return import("@g-loot/react-tournament-brackets").then(
      mod => mod.StyledSvgViewer
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
  const {
    width,
    height,
  } = useWindowDimensions();
  console.log(width, height);
  const finalWidth = Math.max(width - 100, 500);
  const finalHeight = Math.max(height - 100, 500);
  
  let theCleanedData = simpleSmallBracket;
  // Sheet2 is NCAA
  // const data: any  = CurrentScore(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME2);
  // Sheet3 is American Football
  const data: any  = CurrentScore('Sheet3');
  const reformattedData = data.map(match => {
    const participants = [];
    for (let key in match) {
        if (key.startsWith('participants/')) {
            const participantIndex = key.split('/')[1];
            const participantKey = key.split('/')[2];
            if (!participants[participantIndex]) {
                participants[participantIndex] = {};
            }
            participants[participantIndex][participantKey] = match[key];
        }
    }
    return {
        ...match,
        participants
    };
    });
    reformattedData.map(match1 => {
      const participants = [];
      for (let key in match1) {
          if (key.startsWith('participants/')) {
            delete match1[key];
          }
      }
    });
    if (reformattedData[0].loading == "Table is loading") {
      theCleanedData = simpleSmallBracket; // TODO: Change this to a loading screen
    } else {
      theCleanedData = reformattedData;
      }  
    return (
      <>
          <SingleEliminationBracket
            matches={theCleanedData}
            //theme={WhiteTheme}
            matchComponent={Match}
            theme={{
              textColor: { main: '#c0b3f0', highlighted: '#F4F2FE', dark: '#707582', disabled: '#707582' },
              matchBackground: { wonColor: '#2D2D59', lostColor: '#1B1D2D' },
              score: {
                background: {
                  wonColor: `#10131C`,
                  lostColor: '#10131C',
                },
                text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
              },
              border: {
                color: '#292B43',
                highlightedColor: 'RGBA(152,82,242,0.4)',
              },
             // NOTE: Some of the Theme create/options stuff is not working due to import workaround for nextjs
             // roundHeader: { backgroundColor: '#3B3F73', fontColor: '#F4F2FE' },
             // connectorColor: '#3B3F73',
             // connectorColorHighlight: 'RGBA(152,82,242,0.4)',
             // svgBackground: '#ffffff',
            }}
            options={{
              style: {
                roundHeader: {
                  backgroundColor: 'rgb(254, 162, 130)',//'#17E4F1',
                  fontColor: '#000',
                  fontFamily: 'DM Mono',
                },
                columnWidth: 300,
                connectorColor: '#7BF59D',
                connectorColorHighlight: '#da96c6',
                spaceBetweenColumns: 30,
                spaceBetweenRows: 10,
                roundSeparatorWidth: 2,
                //roundSeparatorWidth: 2,            
               },
            }}
            svgWrapper={({ children, ...props }) => (
              <SVGViewer width={finalWidth} height={finalHeight} {...props}>
                {children}
              </SVGViewer>
            )}
            />
      </>
    )
  };

export default BracketView;