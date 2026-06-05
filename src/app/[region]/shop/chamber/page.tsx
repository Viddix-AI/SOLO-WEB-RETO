import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { ChamberScreen } from "@/components/shop/chamber-screen";

export const metadata: Metadata = { title: "Hyperbaric Chamber" };

export default async function ChamberPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  return <ChamberScreen region={region} />;
}
