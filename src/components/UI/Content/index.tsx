import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren } from "react";
import constants from "../../../constants/UI";

import styles from "./Content.module.css";

const Content: React.FC<PropsWithChildren<any>> = (props) => {
  return (
    <>
      <div className={styles.accordian}>
        <input
          type="checkbox"
          name="accordian"
          id={props.title}
          className={styles.accordianInput}
          checked={props.open}
        />
        <label htmlFor={props.title} className={styles.accordianLabel}>
          <div className={styles.contentHeader}>
            {" "}
            <h1 className={styles.contentTitle}>{props.title} </h1>
            <FontAwesomeIcon
              icon={faChevronDown}
              size="sm"
              color={constants.contentTitleColor}
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
