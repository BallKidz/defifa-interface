import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useState } from "react";
import { colors } from "../../../constants/colors";
import constants from "../../../constants/UI";
import Socials from "../../Navbar/Info/Socials";

import styles from "./Content.module.css";

const Content: React.FC<PropsWithChildren<any>> = (props) => {
  const [displayContent, setDisplayContent] = useState<boolean>(props.open);
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
            {" "}
            <h1
              className={styles.contentTitle}
              style={{ color: displayContent ? colors.gold : colors.purple }}
            >
              {props.title}{" "}
            </h1>
            <FontAwesomeIcon
              icon={faChevronDown}
              size="sm"
              color={constants.contentTitleColor}
              className={styles.chevronDown}
            />
            {props.socials ? (
              <div className={styles.socials}>
                <Socials />
              </div>
            ) : null}
          </div>
        </label>
        <div className={styles.content}>{props.children}</div>
      </div>
    </>
  );
};

export default Content;
