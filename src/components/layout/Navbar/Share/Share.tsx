import React from "react";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

const CopyURLToClipboard = () => {
  const { triggerImpact, triggerNotification } = useMiniAppHaptics();

  const handleCopyURL = () => {
    void triggerImpact("light");
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        void triggerNotification("success");
        // You can show a success message or perform additional actions here
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
        // Handle the error if copying to clipboard fails
      });
  };

  return <button onClick={handleCopyURL}>Copy URL to Clipboard</button>;
};

export default CopyURLToClipboard;
