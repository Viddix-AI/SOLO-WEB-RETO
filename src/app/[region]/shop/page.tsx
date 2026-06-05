import { notFound } from "next/navigation";
import { regionFromSlug } from "@/lib/regions";
import { isCheckoutEnabled } from "@/lib/amazon-pay";
import { ShopScreen } from "@/components/shop/shop-screen";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) notFound();
  return <ShopScreen region={region} checkoutEnabled={isCheckoutEnabled(region.id)} />;
}
