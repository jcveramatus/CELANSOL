"use client";

import { useEffect } from "react";

/**
 * Si Supabase redirige la invitación al Site URL (raíz) en vez de
 * /auth/aceptar, reenvía el hash con los tokens a la página correcta.
 */
export function InviteHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token") && hash.includes("type=invite")) {
      window.location.replace(`/auth/aceptar${hash}`);
    }
  }, []);
  return null;
}
