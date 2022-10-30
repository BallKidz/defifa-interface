import { useMemo } from "react";
import { colors } from "../../../constants/colors";
import styles from "./Button.module.css";

const Button = ({
  children,
  color = colors.turquoise,
  size,
  onClick,
}: {
  children: any;
  color?: string;
  size?: "small" | "medium" | "big";
  onClick?: VoidFunction;
}) => {
  const buttonSize = useMemo<string>(() => {
    switch (size) {
      case "small":
        return styles.small;
      case "medium":
        return styles.medium;
      case "big":
        return styles.big;
      default:
        return styles.medium;
    }
  }, [size]);

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${buttonSize}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </button>
  );
};

export default Button;
