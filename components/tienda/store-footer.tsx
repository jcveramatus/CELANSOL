import { Logo } from "@/components/marca/logo";
import type { StoreSettings } from "@/lib/store/settings-schema";

export function StoreFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-auto bg-verde-profundo px-4 pb-28 pt-10 text-white md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <Logo tone="blanco" className="text-2xl" />
        <p className="max-w-md text-sm text-white/85">{settings.footerText}</p>
        <p className="text-xs text-white/70">© {settings.storeName}</p>
      </div>
    </footer>
  );
}
