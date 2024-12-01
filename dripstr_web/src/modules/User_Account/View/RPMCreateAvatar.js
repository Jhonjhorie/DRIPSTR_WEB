import React, { useState } from "react";
import AvatarCreator from "../components/AvatarCreator";
import AvatarDisplay from "../components/AvatarDisplay";

const App = () => {
  const [avatarUrl, setAvatarUrl] = useState("");

  return (
    <div>
      {!avatarUrl ? (
        <AvatarCreator onAvatarGenerated={setAvatarUrl} />
      ) : (
        <AvatarDisplay avatarUrl={avatarUrl} />
      )}
    </div>
  );
};

export default App;
