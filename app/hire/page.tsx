import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HireExperience from "@/components/HireExperience";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HIRE NEBU — THE RAPPER FOR THE TRENCHES",
  description: "Win, loss, rug, miracle, betrayal. Hire NEBU in $N3BU and turn the trenches into music.",
};

export default async function HirePage() {
  const data = await getSiteData();
  if (!data.hire.enabled) notFound();
  return <HireExperience initialData={data} />;
}
