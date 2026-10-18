"use client";

import { useEffect } from "react";
import { pushEcommerce } from "@/lib/tracking/data-layer";

/** Envía `view_item` una vez al abrir la landing de un producto. */
export function ViewItemEvent({
  id,
  name,
  price,
  category,
}: {
  id: string;
  name: string;
  price: number;
  category: string;
}) {
  useEffect(() => {
    pushEcommerce({
      event: "view_item",
      ecommerce: {
        currency: "PEN",
        value: price,
        items: [{ item_id: id, item_name: name, price, quantity: 1, item_category: category }],
      },
    });
  }, [id, name, price, category]);
  return null;
}
