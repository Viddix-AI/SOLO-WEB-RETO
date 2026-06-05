import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { HomeScreen } from "@/components/home-screen";

/** Public landing for each region (/us /latam /eu). */
export default async function RegionHome({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();

  return <HomeScreen region={region} />;
}
