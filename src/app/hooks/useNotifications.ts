"use client";

import { useCallback, useState } from "react";

type NotificationState = {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendLocalNotification: (
    title: string,
    options?: NotificationOptions,
  ) => void;
};

const isSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator;

export const useNotifications = (): NotificationState => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window === "undefined" ? "default" : Notification.permission,
  );

  const requestPermission = useCallback(async () => {
    if (!isSupported()) {
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const sendLocalNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported() || permission !== "granted") {
        return;
      }

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    },
    [permission],
  );

  return {
    permission,
    requestPermission,
    sendLocalNotification,
  };
};
