/**
 * Lightweight wrapper around Strava's route embed helper.
 * It injects the official embed script once and reprocesses placeholders
 * whenever the component mounts.
 */
"use client";

import { useEffect, useId } from "react";

type StravaRouteEmbedProps = {
  embedId: string;
  mapHash?: string;
  clubId?: string;
  style?: "standard" | "minimal";
  fromEmbed?: boolean;
};

const SCRIPT_SRC = "https://strava-embeds.com/embed.js";
const SCRIPT_ID = "__strava_embed_script__";

const StravaRouteEmbed = ({
  embedId,
  mapHash,
  clubId,
  style = "standard",
  fromEmbed = false,
}: StravaRouteEmbedProps) => {
  const placeholderId = useId();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const win = window as typeof window & {
      StravaEmbed?: (selector?: string) => void;
      __stravaEmbedQueued?: boolean;
    };

    const processEmbeds = () => {
      if (typeof win.StravaEmbed === "function") {
        win.StravaEmbed(".strava-embed-placeholder");
        win.__stravaEmbedQueued = false;
      } else {
        win.__stravaEmbedQueued = true;
      }
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      processEmbeds();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = processEmbeds;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const win = window as typeof window & {
      StravaEmbed?: (selector?: string) => void;
    };
    if (typeof win.StravaEmbed === "function") {
      win.StravaEmbed(".strava-embed-placeholder");
    }
  }, [embedId, mapHash, clubId, style, fromEmbed]);

  return (
    <div className="flex flex-col gap-3">
      <div
        id={placeholderId}
        className="strava-embed-placeholder min-h-[420px] overflow-hidden rounded-2xl border border-subtle"
        data-embed-type="route"
        data-embed-id={embedId}
        data-style={style}
        data-from-embed={fromEmbed ? "true" : "false"}
        {...(mapHash ? { "data-map-hash": mapHash } : {})}
        {...(clubId ? { "data-club-id": clubId } : {})}
      />
    </div>
  );
};

export default StravaRouteEmbed;
