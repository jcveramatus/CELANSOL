import { StoreFooter } from "@/components/tienda/store-footer";
import { StoreHeader } from "@/components/tienda/store-header";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <StoreHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <StoreFooter />
    </>
  );
}
