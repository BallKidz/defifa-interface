import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useRef, useState } from "react";
import constants from "../../../constants/UI";

import utilStyles from "../../../styles/utils.module.css";
import styles from "./Content.module.css";

const Content: React.FC<PropsWithChildren<any>> = (props) => {
  const [isActive, setIsActive] = useState(true);
  const contentEl = useRef<HTMLDivElement>(null);
  return (
    <>
      <hr className={styles.line} />
      <div className={styles.accordian}>
        <div
          className={styles.contentHeader}
          onClick={() => {
            setIsActive(!isActive);
            console.log(isActive);
          }}
        >
          {" "}
          <h1 className={utilStyles.contentTitle}>{props.title} </h1>
          <FontAwesomeIcon
            icon={faChevronDown}
            size="sm"
            color={constants.contentTitleColor}
            className={`${styles.chevronDown} ${
              isActive ? styles.rotated : ""
            }`}
          />
        </div>

        <div
          ref={contentEl}
          className={styles.content}
          style={{
            height: `${
              isActive
                ? contentEl.current?.scrollHeight.toString() + "px"
                : "0px"
            }`,
          }}
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Content;
