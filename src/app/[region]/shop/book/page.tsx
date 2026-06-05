import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { isCheckoutEnabled } from "@/lib/amazon-pay";
import { BookScreen } from "@/components/shop/book-screen";

export const metadata: Metadata = { title: "The RETO Method" };

export default async function BookPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  return <BookScreen region={region} checkoutEnabled={isCheckoutEnabled(region.id)} />;
}
