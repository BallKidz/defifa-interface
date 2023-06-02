import React from "react";

const CopyURLToClipboard = () => {
  const handleCopyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL)
      .then(() => {
        console.log("URL copied to clipboard:", currentURL);
        // You can show a success message or perform additional actions here
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
        // Handle the error if copying to clipboard fails
      });
  };

  return (
    <button onClick={handleCopyURL}>Copy URL to Clipboard</button>
  );
};

export default CopyURLToClipboard;
