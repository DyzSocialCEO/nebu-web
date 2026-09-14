import type { Metadata } from "next";
import HireAdminPanel from "@/components/HireAdminPanel";

export const metadata: Metadata = {
  title: "NEBU Hire Desk",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function PrivateHireOpsPage() {
  return <HireAdminPanel />;
}
