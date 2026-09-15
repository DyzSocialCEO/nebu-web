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
    let workerTimer = 0;

    const registerWorker = () => {
      if (!("serviceWorker" in navigator)) return;
      workerTimer = window.setTimeout(() => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      }, 350);
    };

    if (document.readyState === "complete") registerWorker();
    else window.addEventListener("load", registerWorker, { once: true });

    if (isStandalone()) {
      setInstalled(true);
      return () => {
        window.removeEventListener("load", registerWorker);
        window.clearTimeout(workerTimer);
      };
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
      window.removeEventListener("load", registerWorker);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(workerTimer);
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

  const available = !installed && Boolean(promptEvent || showIosInstall);

  return (
    <button
      type="button"
      className={`pwa-install ${available ? "is-ready" : "is-reserved"}`}
      onClick={install}
      disabled={!available}
      aria-hidden={!available}
      tabIndex={available ? 0 : -1}
    >
      INSTALL ↗
    </button>
  );
}
