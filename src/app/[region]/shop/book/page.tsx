import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { BookScreen } from "@/components/shop/book-screen";

export const metadata: Metadata = { title: "Péptidos: La Nueva Era de la Longevidad" };

export default async function BookPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  return <BookScreen region={region} />;
}
