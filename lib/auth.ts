import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StaffRole = Database["public"]["Enums"]["staff_role"];

export type Staff = {
  userId: string;
  email: string;
  fullName: string;
  role: StaffRole;
};

/** Sesión actual: userId (si hay login) y su ficha de staff (si existe). Se deduplica por request. */
const getSession = cache(async (): Promise<{ userId: string | null; staff: Staff | null }> => {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims?.sub) return { userId: null, staff: null };

  const { data: row } = await supabase
    .from("staff")
    .select("full_name, role")
    .eq("user_id", claims.sub)
    .maybeSingle();

  return {
    userId: claims.sub,
    staff: row
      ? {
          userId: claims.sub,
          email: typeof claims.email === "string" ? claims.email : "",
          fullName: row.full_name,
          role: row.role,
        }
      : null,
  };
});

export async function getCurrentStaff() {
  return (await getSession()).staff;
}

/**
 * Exige un usuario del staff (y opcionalmente ciertos roles).
 * Usar en layouts del panel y al inicio de CADA Server Action.
 */
export async function requireStaff(roles?: StaffRole[]): Promise<Staff> {
  const { userId, staff } = await getSession();
  if (!userId) redirect("/admin/login");
  if (!staff) redirect("/admin/sin-acceso");
  if (roles && !roles.includes(staff.role)) {
    throw new Error("No tienes permiso para esta acción");
  }
  return staff;
}

export const CATALOG_EDITORS: StaffRole[] = ["admin", "contenido"];
