"use client";

import { usePathname, useRouter } from "next/navigation";
import { STEP_ROUTES } from "@/lib/constants";

export function useStepNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = Math.max(
    STEP_ROUTES.findIndex((route) => route === pathname),
    0,
  );

  return {
    currentStep: currentIndex + 1,
    canGoBack: currentIndex > 0,
    canGoNext: currentIndex < STEP_ROUTES.length - 1,
    goBack: () => {
      if (currentIndex > 0) router.push(STEP_ROUTES[currentIndex - 1]);
    },
    goNext: () => {
      if (currentIndex < STEP_ROUTES.length - 1) {
        router.push(STEP_ROUTES[currentIndex + 1]);
      }
    },
    goToStep: (step: number) => {
      const route = STEP_ROUTES[step - 1];
      if (route) router.push(route);
    },
  };
}
