"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "./actions";

export function DeleteProductButton({ productId, title }: { productId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-peligro hover:bg-red-50"
      disabled={pending}
      onClick={() => {
        if (confirm(`¿Eliminar “${title}” y todas sus fotos? Esta acción no se puede deshacer.`)) {
          startTransition(() => deleteProduct(productId));
        }
      }}
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </Button>
  );
}
