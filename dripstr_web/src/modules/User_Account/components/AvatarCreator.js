import React, { useEffect } from "react";

const AvatarCreator = ({ onAvatarGenerated }) => {
  useEffect(() => {
    // Set up message listener for Ready Player Me iframe
    const receiveMessage = (event) => {
      if (event.data && event.data.type === "avatar") {
        onAvatarGenerated(event.data.url); // Pass avatar URL to parent component
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => window.removeEventListener("message", receiveMessage);
  }, [onAvatarGenerated]);

  return (
    <iframe
      src="https://readyplayer.me/avatar"
      title="Ready Player Me Avatar Creator"
      style={{
        width: "100%",
        height: "600px",
        border: "none",
      }}
      allow="camera; microphone" // Allow permissions for user customization
    ></iframe>
  );
};

export default AvatarCreator;
