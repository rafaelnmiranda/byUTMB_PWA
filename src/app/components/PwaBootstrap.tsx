"use client";

import { useEffect } from "react";

const ServiceWorkerBootstrap = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/service-worker.js");
      } catch (error) {
        console.error("Failed to register service worker", error);
      }
    };

    void register();
  }, []);

  return null;
};

export default ServiceWorkerBootstrap;
