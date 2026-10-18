import Link from "next/link";
import { Logo } from "@/components/marca/logo";
import type { StoreSettings } from "@/lib/store/settings-schema";
import { whatsappLink } from "@/lib/whatsapp";
import { AnnouncementBar } from "./announcement-bar";
import { IconWhatsApp } from "./icons";

export function StoreHeader({ settings }: { settings: StoreSettings }) {
  const wa = whatsappLink(settings.whatsappNumber, `Hola ${settings.storeName}, tengo una consulta`);

  return (
    <header className="sticky top-0 z-30">
      <AnnouncementBar messages={settings.announcements} />
      <div className="border-b border-borde bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4">
          <span />
          <Link href="/" aria-label={`${settings.storeName}, ir al inicio`}>
            <Logo className="text-2xl" />
          </Link>
          <div className="flex justify-end">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escríbenos por WhatsApp"
                className="flex size-10 items-center justify-center rounded-full text-[#128c3e] hover:bg-fondo-suave"
              >
                <IconWhatsApp className="size-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
