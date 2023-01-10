/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

interface FeelingLuckyProps {
  length: number;
}

const FeelingLucky: React.FC<FeelingLuckyProps> = ({ length }) => {
  const start = Math.floor(Math.random() * (14 - length + 1)) + 1;
  const [numbers] = useState(Array.from({ length }, (_, i) => start + i));
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeoutId: null | NodeJS.Timeout = null;
    if (isAnimating) {
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setSelectedNumber(numbers[Math.floor(Math.random() * numbers.length)]);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAnimating]);

  const shuffle = () => {
    setIsAnimating(true);
  };

  return (
    <div id="image-container" onClick={shuffle} style={{ width: "200px" }}>
      {numbers.map((number, index) => {
        return (
          <img
            alt="Lucky"
            key={index}
            src={`/nfl-assets/${number}.png`}
            style={{
              opacity: isAnimating || selectedNumber !== number ? 0.3 : 1,
              transition: "opacity 2s",
            }}
          />
        );
      })}
    </div>
  );
};

export default FeelingLucky;

//rgb(255,187,0)
//rgb(2,2,2)
