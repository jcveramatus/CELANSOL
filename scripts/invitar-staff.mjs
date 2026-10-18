// Invita a una persona al panel y le asigna un rol.
// Uso: node --env-file=.env.local scripts/invitar-staff.mjs <correo> "<Nombre>" [admin|operaciones|contenido|atencion]
import { createClient } from "@supabase/supabase-js";

const [email, fullName, role = "atencion"] = process.argv.slice(2);
const ROLES = ["admin", "operaciones", "contenido", "atencion"];

if (!email || !fullName || !ROLES.includes(role)) {
  console.error('Uso: node --env-file=.env.local scripts/invitar-staff.mjs <correo> "<Nombre>" [rol]');
  console.error(`Roles: ${ROLES.join(", ")}`);
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
  redirectTo: `${siteUrl}/auth/aceptar`,
  data: { full_name: fullName },
});

let userId = data?.user?.id;
if (error) {
  // Si ya existe, solo actualizamos su rol.
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  userId = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) {
    console.error("No se pudo invitar:", error.message);
    process.exit(1);
  }
  console.log("El usuario ya existía; se actualiza su rol.");
} else {
  console.log(`Invitación enviada a ${email}.`);
}

const { error: staffError } = await supabase
  .from("staff")
  .upsert({ user_id: userId, full_name: fullName, role }, { onConflict: "user_id" });

if (staffError) {
  console.error("No se pudo asignar el rol:", staffError.message);
  process.exit(1);
}
console.log(`Rol asignado: ${role}.`);
