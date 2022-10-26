import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import constants from "../../../constants/UI";

import utilStyles from "../../../styles/utils.module.css";
import styles from "./Content.module.css";

const Content: React.FC<PropsWithChildren<any>> = (props) => {
  const [isActive, setIsActive] = useState(true);
  const [height, setHeight] = useState(0);
  const contentEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentEl.current) {
      setHeight(contentEl.current.scrollHeight);
    }
  }, []);

  return (
    <>
      <hr className={styles.line} />
      <div className={styles.accordian}>
        <div
          className={styles.contentHeader}
          onClick={() => {
            setIsActive(!isActive);
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
          style={
            contentEl.current
              ? {
                  height: `${isActive ? height.toString() + "px" : "0px"}`,
                }
              : {}
          }
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Content;
