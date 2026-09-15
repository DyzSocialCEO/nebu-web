import PwaInstall from "@/components/PwaInstall";

type ActiveTab = "nebu" | "records" | "token" | "notice";

const tabs: Array<{ key: ActiveTab; label: string; href: string }> = [
  { key: "nebu", label: "NEBU", href: "/" },
  { key: "records", label: "RECORDS", href: "/records" },
  { key: "token", label: "$N3BU", href: "/token" },
  { key: "notice", label: "NOTICE", href: "/notice" },
];

export default function SiteNav({ active, hireEnabled = false }: { active: ActiveTab; hireEnabled?: boolean }) {
  return (
    <nav className="site-tabs" aria-label="NEBUCHADREKTZAR">
      <div className="site-tabs__links">
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
      </div>
      <div className="site-tabs__utilities">
        <PwaInstall />
        {hireEnabled && <a className="site-tabs__hire" href="/hire">HIRE ME ↗</a>}
      </div>
    </nav>
  );
}
