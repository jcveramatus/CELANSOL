"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Status = "verificando" | "listo" | "error";

/**
 * La invitación de Supabase llega con los tokens en el hash (#access_token=…).
 * Se guarda la sesión y el usuario define su contraseña.
 */
export function AcceptInvite() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verificando");
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const hashError = params.get("error_description");

    // Limpia los tokens de la barra de direcciones.
    window.history.replaceState(null, "", window.location.pathname);

    async function init() {
      if (hashError) {
        setStatus("error");
        setMessage("El enlace venció o ya fue usado. Pide una nueva invitación.");
        return;
      }
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setStatus("error");
          setMessage("No pudimos validar la invitación. Pide una nueva.");
          return;
        }
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setStatus("error");
        setMessage("Abre este enlace desde el correo de invitación.");
        return;
      }
      setStatus("listo");
    }
    init();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < 10) {
      setMessage("Usa al menos 10 caracteres.");
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setMessage("No se pudo guardar la contraseña. Intenta con otra.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  if (status === "verificando") {
    return <p className="text-center text-tinta-suave">Validando tu invitación…</p>;
  }

  if (status === "error") {
    return (
      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-peligro">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Nueva contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="Mínimo 10 caracteres"
        required
      />
      <Input
        label="Repite la contraseña"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
      />
      {message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-peligro">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={saving}>
        {saving ? "Guardando…" : "Guardar y entrar al panel"}
      </Button>
    </form>
  );
}
