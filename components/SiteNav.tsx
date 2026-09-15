import PwaInstall from "@/components/PwaInstall";

type ActiveTab = "nebu" | "records" | "token" | "notice";

const tabs: Array<{ key: ActiveTab; label: string; href: string }> = [
  { key: "nebu", label: "NEBU", href: "/" },
  { key: "records", label: "RECORDS", href: "/records" },
  { key: "token", label: "$N3BU", href: "/token" },
  { key: "notice", label: "NOTICE", href: "/notice" },
];

type Props = {
  active: ActiveTab;
  hireEnabled?: boolean;
  buyUrl?: string;
};

export default function SiteNav({ active, hireEnabled = false, buyUrl = "" }: Props) {
  return (
    <>
      <header className="site-head">
        <a className="site-head__brand" href="/">
          <img src="/nebu-avatar.webp" alt="" width={160} height={160} loading="eager" decoding="async" />
          <span>
            <b>NEBUCHADREKTZAR</b>
            <small>SOLANA &middot; $N3BU</small>
          </span>
        </a>

        <nav className="site-head__nav" aria-label="Sections">
          {tabs.map(tab => (
            <a
              key={tab.key}
              className={active === tab.key ? "is-active" : ""}
              href={tab.href}
              aria-current={active === tab.key ? "page" : undefined}
            >
              {tab.label}
            </a>
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
          <a
            key={tab.key}
            className={active === tab.key ? "is-active" : ""}
            href={tab.href}
            aria-current={active === tab.key ? "page" : undefined}
          >
            <i aria-hidden="true" />
            {tab.label}
          </a>
        ))}
      </nav>
    </>
  );
}
