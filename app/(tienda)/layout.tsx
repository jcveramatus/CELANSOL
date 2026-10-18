import { StoreFooter } from "@/components/tienda/store-footer";
import { GoogleTagManager } from "@/components/tienda/google-tag-manager";
import { StoreHeader } from "@/components/tienda/store-header";
import { getStoreSettings } from "@/lib/store/settings";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const settings = await getStoreSettings();

  return (
    <>
      <GoogleTagManager containerId={settings.gtmContainerId} />
      <StoreHeader settings={settings} />
      <div className="flex flex-1 flex-col">{children}</div>
      <StoreFooter settings={settings} />
    </>
  );
}
