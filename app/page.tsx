import NebuExperience from "@/components/NebuExperience";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  return <NebuExperience initialData={data} />;
}
