import { Suspense } from "react";
import MainMenuContainer from "@/features/main-menu/components/smart/MainMenuContainer";

export default function HomePage() {
  return (
    <Suspense>
      <MainMenuContainer />
    </Suspense>
  );
}
