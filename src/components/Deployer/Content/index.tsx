import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, {
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from "react";
import styles from "./Content.module.css";

const Content: React.FC<
  PropsWithChildren<{
    open?: boolean;
    title?: string;
    socials?: boolean;
    createIcon?: boolean;
    fontSize?: string;
    rightSection?: {
      enabled: boolean;
      title: string;
      onClick: () => void;
      loading: boolean;
    };
  }>
> = ({ ...props }) => {
  const [displayContent, setDisplayContent] = useState<boolean>(
    props?.open ?? false
  );

  const contentTitle = useMemo<ReactElement>(() => {
    return (
      <h1
        className={styles.contentTitle}
        style={{
          fontSize: `${props.fontSize}px`,
        }}
      >
        {props.title}
      </h1>
    );
  }, [props.fontSize, props.title]);

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
          <div
            className={
              props.createIcon
                ? styles.createContentHeader
                : styles.contentHeader
            }
          >
            <div> {contentTitle}</div>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </label>
        <div className={styles.content}>{props.children}</div>
      </div>
    </>
  );
};

export default Content;
