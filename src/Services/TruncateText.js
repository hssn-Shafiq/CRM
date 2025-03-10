// TruncateText.js
import React from "react";

const TruncateText = ({ text = "", maxLength = 60, color }) => {
  const shouldTruncate = text.length > maxLength;
  const displayedText = shouldTruncate
    ? text.slice(0, maxLength) + "..."
    : text;

  return (
    <span className={`truncate-text text-${color}`}>
      <span
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />

      {shouldTruncate && <span className={`more-text text-${color}`}> more</span>}
    </span>
  );
};

export default TruncateText;
