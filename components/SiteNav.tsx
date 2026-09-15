"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PwaInstall from "@/components/PwaInstall";

const tabs = [
  { key: "nebu", label: "NEBU", href: "/" },
  { key: "records", label: "RECORDS", href: "/records" },
  { key: "token", label: "$N3BU", href: "/token" },
  { key: "notice", label: "NOTICE", href: "/notice" },
] as const;

export default function SiteNav({ hireEnabled = false, buyUrl = "" }: { hireEnabled?: boolean; buyUrl?: string }) {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/n4x33-ops-18763")) return null;

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="site-head">
        <Link className="site-head__brand" href="/" prefetch>
          <img src="/nebu-avatar.webp" alt="" width={160} height={160} loading="eager" decoding="async" />
          <span>
            <b>NEBUCHADREKTZAR</b>
            <small>SOLANA &middot; $N3BU</small>
          </span>
        </Link>

        <nav className="site-head__nav" aria-label="Sections">
          {tabs.map(tab => (
            <Link
              key={tab.key}
              href={tab.href}
              prefetch
              className={isActive(tab.href) ? "is-active" : ""}
              aria-current={isActive(tab.href) ? "page" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="site-head__actions">
          <PwaInstall />
          {hireEnabled && <a className="site-head__hire" href="/hire">HIRE ME &#8599;</a>}
          {buyUrl && (
            <a className="site-head__buy" href={buyUrl} target="_blank" rel="noopener noreferrer">
              BUY $N3BU
              <span className="site-head__shine" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      <nav className="site-dock" aria-label="Sections">
        {tabs.map(tab => (
          <Link
            key={tab.key}
            href={tab.href}
            prefetch
            className={isActive(tab.href) ? "is-active" : ""}
            aria-current={isActive(tab.href) ? "page" : undefined}
          >
            <i aria-hidden="true" />
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
