import React, { useEffect, useState } from "react";
import { LoadingScreen } from "./aa-shared/LoadingScreen";

type LoadingState = "loading" | "ready" | "failure";

export default function AppLoader({ children }: React.PropsWithChildren) {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  useEffect(() => {
    setLoadingState("ready");
  }, []);

  switch (loadingState) {
    case "loading": {
      return <LoadingScreen />;
    }
    case "ready": {
      return <>{children}</>;
    }
    default:
      return null;
  }
}
