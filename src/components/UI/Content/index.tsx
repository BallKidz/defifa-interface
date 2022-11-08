import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from "react";
import { ChainDoesNotSupportMulticallError } from "wagmi";
import { colors } from "../../../constants/colors";
import constants from "../../../constants/UI";
import Socials from "../../Navbar/Info/Socials";

import styles from "./Content.module.css";

const Content: React.FC<PropsWithChildren<any>> = (props) => {
  const [displayContent, setDisplayContent] = useState<boolean>(props.open);

  const contentTitle = useMemo<ReactElement>(() => {
    if (props.title === "Rules" && props.socials) {
      return (
        <div style={{ display: "flex" }}>
          <div className={styles.socials}>
            <Socials />
          </div>
          <h1
            className={styles.contentTitle}
            style={{
              color: "white",
              alignSelf: "center",
              textDecoration: "underline",
              fontSize: "16px",
            }}
          >
            {props.title}
          </h1>
        </div>
      );
    }

    return (
      <h1
        className={styles.contentTitle}
        style={{ color: displayContent ? colors.gold : colors.purple }}
      >
        {props.title}
      </h1>
    );
  }, [displayContent, props.socials, props.title]);

  return (
    <>
      <div className={styles.accordian}>
        <input
          type="checkbox"
          name="accordian"
          id={props.title}
          className={styles.accordianInput}
          checked={displayContent}
          onChange={(e) => setDisplayContent(e.target.checked)}
        />
        <label htmlFor={props.title} className={styles.accordianLabel}>
          <div className={styles.contentHeader}>
            {contentTitle}
            <FontAwesomeIcon
              icon={faChevronDown}
              size="sm"
              color={
                props.title === "Rules" ? "white" : constants.contentTitleColor
              }
              className={styles.chevronDown}
            />
          </div>
        </label>
        <div className={styles.content}>{props.children}</div>
      </div>
    </>
  );
};

export default Content;
