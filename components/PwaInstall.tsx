"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function PwaInstall() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    setShowIosInstall(isIos());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setShowIosInstall(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
      return;
    }

    if (showIosInstall) {
      window.alert("On iPhone: open this page in Safari, tap Share, then Add to Home Screen.");
    }
  }

  if (installed || (!promptEvent && !showIosInstall)) return null;

  return <button type="button" onClick={install}>INSTALL ↗</button>;
}
