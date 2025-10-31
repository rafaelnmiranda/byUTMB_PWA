"use client";

import { useEffect } from "react";

const ServiceWorkerBootstrap = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // evita loop no dev
    if (!window.isSecureContext && window.location.hostname !== "localhost") return;

    const register = async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistration(
          "/service-worker.js",
        );
        if (!existing) {
          await navigator.serviceWorker.register("/service-worker.js");
        }
      } catch (error) {
        console.error("Failed to register service worker", error);
      }
    };

    void register();
  }, []);

  return null;
};

export default ServiceWorkerBootstrap;
