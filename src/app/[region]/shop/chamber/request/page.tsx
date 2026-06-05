import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { RequestScreen } from "@/components/shop/request-screen";

export const metadata: Metadata = { title: "Request the Chamber" };

export default async function ChamberRequestPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  return <RequestScreen region={region} />;
}
