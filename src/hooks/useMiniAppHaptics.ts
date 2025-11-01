import { useCallback, useEffect, useMemo, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useFarcasterContext } from "./useFarcasterContext";

type ImpactIntensity = "light" | "medium" | "heavy" | "soft" | "rigid";
type NotificationType = "success" | "warning" | "error";

type HapticCapabilities = {
  impact?: boolean;
  notification?: boolean;
  selection?: boolean;
};

export function useMiniAppHaptics() {
  const { isInMiniApp } = useFarcasterContext();
  const [capabilities, setCapabilities] = useState<HapticCapabilities>({});

  useEffect(() => {
    let cancelled = false;

    if (!isInMiniApp) {
      setCapabilities({});
      return;
    }

    async function loadCapabilities() {
      try {
        const caps = await sdk.getCapabilities();
        if (cancelled) return;

        const capabilitySet = new Set(caps);
        setCapabilities({
          impact: capabilitySet.has("haptics.impactOccurred"),
          notification: capabilitySet.has("haptics.notificationOccurred"),
          selection: capabilitySet.has("haptics.selectionChanged"),
        });
      } catch (error) {
        console.warn("Failed to fetch Farcaster miniapp capabilities:", error);
      }
    }

    loadCapabilities();

    return () => {
      cancelled = true;
    };
  }, [isInMiniApp]);

  const triggerImpact = useCallback(
    async (type: ImpactIntensity = "light") => {
      if (!isInMiniApp || capabilities.impact === false) return;
      try {
        await sdk.haptics.impactOccurred(type);
      } catch (error) {
        console.warn("Failed to trigger haptic impact:", error);
      }
    },
    [capabilities.impact, isInMiniApp]
  );

  const triggerSelection = useCallback(async () => {
    if (!isInMiniApp || capabilities.selection === false) return;
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.warn("Failed to trigger haptic selection:", error);
    }
  }, [capabilities.selection, isInMiniApp]);

  const triggerNotification = useCallback(
    async (type: NotificationType = "success") => {
      if (!isInMiniApp || capabilities.notification === false) return;
      try {
        await sdk.haptics.notificationOccurred(type);
      } catch (error) {
        console.warn("Failed to trigger haptic notification:", error);
      }
    },
    [capabilities.notification, isInMiniApp]
  );

  return useMemo(
    () => ({
      isInMiniApp: !!isInMiniApp,
      capabilities,
      triggerImpact,
      triggerSelection,
      triggerNotification,
    }),
    [capabilities, isInMiniApp, triggerImpact, triggerSelection, triggerNotification]
  );
}
