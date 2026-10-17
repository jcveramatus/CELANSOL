# Plan de E-commerce · Celansol

**Modelo:** dropshipping con **Dropi Perú** (sin inventario propio)
**Nichos:** artículos para el hogar **con tecnología** + **mascotas**
**Cobro:** pago contra entrega (COD) vía Dropi + pago online en la web
**Presupuesto de ads inicial:** ~S/1,000 al mes para testear productos
**Desarrollo:** plataforma propia, construida por ti con Claude Code, por versiones
**Fecha del plan:** 17-10-2026 (v2: ajustado a Dropi)

---

## 0. Contexto y decisiones

| Tema | Decisión |
|---|---|
| Plataforma | Propia (Next.js + Supabase + Vercel), con admin tipo Shopify |
| Logística y cobro COD | **Dropi**: proveedor, guía, transportadora, cobro y liquidación a tu wallet |
| Cobertura | Lima y provincias (según la cobertura de las transportadoras de Dropi) |
| Ritmo | Poco a poco: versiones chicas, medir y mejorar |
| Historia | Tienda Shopify en 2023 que no escaló. Se aprende de eso (ver abajo) |

### Lección de 2023 aplicada a este plan
Una tienda rara vez se estanca por la plataforma. Normalmente es porque **el margen no aguanta ads + rechazos COD**, el **ticket promedio es bajo**, **no se testean suficientes productos** o **no se mide lo que se entrega de verdad**. Este plan ataca las cuatro: números primero, testeo sistemático, formulario con ofertas y dashboard de entregados.

### ⚠️ Riesgo n.º 1 a validar ANTES de programar: conexión con Dropi
Dropi tiene conexiones oficiales listas para **Shopify, WooCommerce, Tiendanube, VTEX** y herramientas como Chatea. Para una **tienda propia** hay que usar la **API de integraciones de Dropi**, que existe (crear orden, consultar orden, login con token), pero **no tiene documentación pública abierta**.

**Acción en la semana 1:** escribir a soporte o a tu ejecutivo de Dropi Perú y pedir:
1. Acceso y documentación de la API de integraciones para tienda propia (token, endpoints para crear orden, consultar estados, catálogo y stock).
2. Si hay webhooks de cambio de estado (o si toca consultar cada cierto tiempo).
3. Tarifas de flete en Perú por zona, comisión de recaudo, qué pasa con el flete si el pedido se devuelve y cuándo se liquida a la wallet.

**Plan B si no hay API:** la tienda propia guarda el pedido y tú lo cargas en Dropi (manual o por importación masiva, si Dropi la tiene). Sirve para los primeros 5–15 pedidos diarios. Si no escala, la salida es WooCommerce + Dropify solo como "puente" de pedidos. **Esto se decide con la respuesta de Dropi, no antes.**

---

## 1. Lo que hace Enkasa (referencia analizada)

Enkasa.pe corre en **Shopify** con el tema **Minimog OS 2.0** y apps de upsell (CandyRack, FoxKit), fecha de entrega (Order Delivery Date), Klaviyo, GA4, GTM, Meta Pixel y Clarity. Ojo: Enkasa **tiene stock propio** y tienda de catálogo. Tú vas a hacer dropshipping, así que conviene copiar sus **tácticas de venta**, no su modelo de catálogo enorme.

**Tácticas que sí copiamos**
1. Precio tachado + % de descuento.
2. **Descuento por volumen dentro del producto** (2 u -5%, 3 u -10% "Más vendido", 5 u -15%). Sube el ticket.
3. Ofertas con contador y escasez ("Quedan pocos").
4. Productos baratos para completar el carrito ("menos de S/15").
5. Navegación por ambiente (Cocina, Baño, Dormitorio, Lavandería) + mega-menú.
6. Reseñas con estrellas, botón de WhatsApp y barra inferior fija en el móvil.
7. Políticas de envío y cambios claras (Ley 29571).

**Dónde Celansol gana**
- **Formulario COD de un clic** estilo Releasit (Enkasa usa el checkout largo de Shopify).
- **Landing por producto** pensada para tráfico de ads (el formato que más vende en dropshipping COD).
- **Upsell post-compra + downsell** (Enkasa no lo usa).
- **Dashboard de dinero real:** pedidos creados → confirmados → entregados → utilidad Dropi.

### Referencia 2: Flowers & Saints (flowersandsaints.com.au) — referencia de **diseño**
Tienda de ropa australiana en Shopify (tema *Concept*). No vende contra entrega ni hace dropshipping. Se toma como referencia de **estética y experiencia de marca**, no de táctica de venta.

**Qué tomamos para Celansol**
| Lo que hace F&S | Cómo lo adaptamos |
|---|---|
| Estética minimalista: mucho blanco, fotos grandes sobre fondo gris claro, tarjetas con esquinas redondeadas, Inter como tipografía | Mismo aire limpio y "premium" (da confianza para cobrar S/80–150), con el verde de Celansol solo en botones y acentos |
| Header limpio con el logo al centro, búsqueda y carrito como íconos, y barra de anuncio rotativa arriba | Igual. Barra rotativa: "Pagas al recibir · Envíos a todo el Perú · Alta demanda: stock limitado" |
| Chips de subcolecciones arriba de la grilla | "Cocina · Limpieza · Iluminación · Gatos · Perros" |
| Filtros laterales: en stock, rango de precio, color, categoría | Filtros: en stock, precio, línea (Hogar/Mascotas), tipo |
| Botón **"Show on model"**: cambia todas las fotos a la versión puesta en un modelo | Botón **"Ver en uso"**: cambia a fotos del producto en una casa real o con la mascota. Muy potente para este nicho |
| Selector de color con muestras visuales y tallas en botones | Variantes con muestra de color o foto |
| **"Complete the Look"**: productos complementarios con check para agregarlos junto con el principal | **"Completa tu kit"**: cross-sell con check en la página de producto (Fase 5) |
| Indicador "In stock, ready to ship" con punto verde | "Disponible · Llega en 24–72 h" (solo si Dropi lo cumple) |
| Descripción con storytelling + especificaciones con íconos | Problema → solución + ficha técnica con íconos (clave en tecnología) |
| "Recently viewed", popup de newsletter y dock fijo en el móvil | Vistos recientemente, popup de cupón a cambio de WhatsApp y barra inferior móvil |

**Ojo:** F&S es muy minimalista porque vende marca, no urgencia. Para dropshipping COD en Perú se mezcla: **estética de F&S** en la tienda y las colecciones, y **elementos de conversión de Enkasa** (precio tachado, % OFF, descuento por volumen, escasez real, botón grande de contra entrega) en las landings de producto.

---

## 2. Cómo funciona el dinero en Dropi (unit economics)

Tú pones el precio de venta. Dropi cobra al cliente y te deposita la diferencia:

```
Utilidad por pedido ENTREGADO = Precio de venta − Precio proveedor − Flete − Comisión de recaudo
Costo por pedido DEVUELTO     = Flete (y lo que Dropi Perú cobre por devolución, a confirmar)
```

### Ejemplo ilustrativo (reemplazar con números reales de tu panel Dropi)
| Concepto | S/ |
|---|---|
| Precio de venta | 89.90 |
| Precio proveedor | 32.00 |
| Flete | 12.00 |
| Comisión de recaudo (~3%) | 2.70 |
| **Utilidad si se entrega** | **43.20** |
| Pérdida si se devuelve (flete) | −12.00 |

Con **85% de confirmación** y **75% de entrega**:
- Por pedido despachado: 0.75 × 43.20 − 0.25 × 12.00 = **S/29.40**
- Por pedido creado: 0.85 × 29.40 ≈ **S/25.00**

➡️ **CPA de equilibrio ≈ S/25 por pedido creado.** Para ganar dinero, apunta a un **CPA ≤ S/15**.
Esa cifra (el CPA máximo) se calcula **por producto** y decide si un producto sigue o se mata. El admin la calculará solo (Fase 2).

### Reglas de precio para dropshipping COD
- Precio de venta de **al menos 2.5–3× el precio del proveedor**. Si no, los ads + devoluciones se comen el margen.
- Ticket ideal para COD en Perú: **S/59–S/149**. Más bajo no paga el ads; más alto sube el rechazo.
- Usa bundles (2×, 3×) para subir el ticket **sin** subir el flete (un solo envío).

---

## 3. Nicho y catálogo: hogar con tecnología + mascotas

### Posicionamiento
**Celansol = "soluciones inteligentes para tu casa y tus mascotas".** Una sola marca y una sola tienda con dos líneas. Las mascotas viven en el hogar, así que encaja. Con S/1,000/mes **no conviene** abrir dos marcas, dos pixels y dos tiendas.

**Colecciones**
- **Hogar inteligente:** cocina, limpieza, baño, iluminación, organización, seguridad
- **Mascotas:** alimentación, higiene y aseo, juego, paseo, descanso
- **Especiales:** Más vendidos, Ofertas, Menos de S/30, Combos

### Tipos de producto a buscar en Dropi (validar disponibilidad y precio)
| Hogar con tecnología | Mascotas |
|---|---|
| Lámparas LED con sensor de movimiento | Fuente/bebedero automático para gatos |
| Mini aspiradora inalámbrica / para auto | Comedero automático programable |
| Dispensador automático de jabón o pasta dental | Cepillo de vapor para gatos/perros |
| Cepillo eléctrico de limpieza multiuso | Rodillo quita pelos reutilizable |
| Selladora de bolsas / mini procesador eléctrico | Juguetes interactivos (pelota automática, láser) |
| Humidificador / difusor | Cortaúñas con luz LED |
| Mop o trapeador giratorio / con spray | Cama o manta térmica |
| Cámara WiFi para casa (sirve también para vigilar mascotas) | Bebedero portátil para paseo |

> La **cámara WiFi** y el **comedero automático** unen los dos nichos: "vigila y alimenta a tu mascota desde el celular".

### Filtro para elegir un producto a testear (debe cumplir 6 de 8)
1. Resuelve un problema **visible** en 3 segundos de video (efecto "wow").
2. Se puede demostrar en video (antes y después).
3. Precio de venta posible ≥ 2.5× el precio del proveedor.
4. Ticket entre S/59 y S/149 (o combo que llegue ahí).
5. Liviano, pequeño y no frágil (flete bajo y menos reclamos).
6. No está barato en Saga, Promart o Mercado Libre con la misma foto.
7. El proveedor en Dropi tiene **stock** y buenas calificaciones.
8. Hay anuncios de ese producto corriendo hace semanas en Meta Ads Library o TikTok (señal de que vende).

---

## 4. Estrategia de testeo con S/1,000 al mes

**Presupuesto ≈ S/33/día.** La meta del primer mes no es ganar mucho: es **encontrar 1 producto ganador**.

### Ritmo de testeo
| Semana | Acción | Inversión aprox. |
|---|---|---|
| 1 | Testear producto A y B (S/15–20/día c/u, 3–4 días) | S/120–160 |
| 2 | Matar al que no cumple y testear C y D | S/120–160 |
| 3 | Testear E y F + subir presupuesto al mejor | S/250 |
| 4 | Escalar el ganador; nuevos creativos del ganador | S/350–450 |

≈ **6 productos testeados al mes**, cada uno con 2–3 creativos (video corto vertical).

### Reglas de decisión (por producto, con su CPA máximo)
- **Matar:** gastó **1× el CPA máximo** sin ventas, o 2× con CPA por encima del máximo.
- **Mantener:** CPA entre el objetivo y el máximo → probar nuevos ganchos y creativos.
- **Escalar:** CPA ≤ objetivo y confirmación ≥ 80% → subir presupuesto 20–30% cada 2–3 días.
- **Ojo:** un producto con CPA bajo pero **tasa de entrega < 65%** no es ganador. Por eso el dashboard mide entregados.

### Dónde va el tráfico
- **Landing de producto + formulario COD** (Pixel/CAPI optimizando a `Purchase`): el formato principal.
- Mientras se construye la web: anuncios a **WhatsApp** y pedidos cargados en Dropi a mano. Así testeas desde la semana 1.

> Para armar las campañas, ángulos y guiones de cada producto, se pueden usar los agentes RUFUS (ángulos y guiones de anuncios) y MARK (estructura y lectura de campañas en Meta).

---

## 5. Identidad de marca aplicada a la tienda

| Token | Uso | Color aprox. |
|---|---|---|
| `verde-brillo` | Inicio del degradado, resaltados | `#36C61E` |
| `verde-celansol` | Color principal, botones | `#2E9E2A` |
| `verde-profundo` | Hover, header, footer | `#2A7A35` |
| `blanco` | Fondos y texto sobre verde | `#FFFFFF` |
| `gris-texto` | Texto de cuerpo | `#1F2A24` |
| `gris-fondo` | Secciones alternas | `#F4F7F4` |
| `acento-oferta` | Badges de descuento y contadores | `#F59E0B` (ámbar) |

- Botón de compra verde sólido con texto blanco, grande y fijo abajo en el móvil.
- Tipografía sans redondeada parecida al logo (*Poppins*/*Outfit* en títulos, *Inter* en el cuerpo).
- Usar los tres trazos del "sol" del logo en badges e íconos ("Nuevo", "Top ventas").
- Pedir los HEX exactos y el logo en SVG al diseñador. El texto blanco sobre `#36C61E` probablemente no tiene contraste suficiente: poner textos sobre `#2E9E2A` o más oscuro.

---

## 6. Fases del plan

### FASE 0 · Fundamentos (semanas 1–2)
**Dropi**
- Crear la cuenta de Dropi Perú como dropshipper y configurar la wallet y la cuenta de cobro.
- **Pedir la API de integraciones** (ver el riesgo n.º 1).
- Revisar en el panel: tarifas de flete por destino, comisión de recaudo, política de devoluciones y novedades, tiempos de entrega Lima vs provincia y días de liquidación.
- Explorar el catálogo: preseleccionar 15–20 productos con el filtro de la sección 3.
- Revisar si conviene **Chatea Pro / la confirmación con IA de Dropi** para confirmar pedidos al inicio (te ahorra construir eso).

**Legal (Perú)**
- RUC (consulta con tu contador el régimen adecuado y quién emite la boleta: en dropshipping **tú** le vendes al cliente).
- Libro de Reclamaciones virtual (obligatorio), términos, envíos, cambios y devoluciones (Ley 29571) y privacidad (Ley 29733).
- Las políticas de cambios deben coincidir con lo que el **proveedor de Dropi** realmente acepta.

**Marketing**
- Meta Business Manager, cuenta publicitaria, Pixel, dominio verificado y número de WhatsApp Business.
- Cuenta de TikTok (orgánico + ads más adelante).
- Dominio (`celansol.pe` o `.com.pe`).

**Entregables:** Excel de productos preseleccionados con los unit economics y el CPA máximo de cada uno, respuesta de Dropi sobre la API y cuentas creadas.

---

### FASE 1 · UX/UI (semanas 2–3)
**Prioridad: la landing de producto**, no el home. En dropshipping el ~90% del tráfico de ads cae directo en el producto.

**Landing / página de producto (mobile-first)**
1. Galería con **video primero** (GIF o video del producto funcionando).
2. Título orientado al beneficio + estrellas + "+1,200 clientes" (solo si es verdad).
3. Precio tachado + % + "Pagas al recibir" + "Envío a todo el Perú".
4. **Selector de cantidad con descuento por volumen.**
5. Botón **"PEDIR AHORA · Pago contra entrega"**, fijo abajo en el móvil.
6. Bloques de venta: problema → solución → 3–4 beneficios con GIF → cómo funciona → comparación vs alternativas → contenido de la caja → especificaciones → reseñas con fotos → garantía → FAQ (envío, pago, cambios).
7. "Frecuentemente comprados juntos" (cross-sell).

**Otras pantallas:** formulario COD (modal), página de gracias con upsell, home simple, colección, seguimiento de pedido, políticas y admin.

**Entregables:** wireframes y diseño en Figma de la landing, el formulario COD, la página de gracias y el dashboard.

---

### FASE 2 · Panel admin tipo Shopify + conexión Dropi (semanas 3–6)
**Productos**
- Título, descripción enriquecida, fotos y videos (compresión automática a WebP), precio, precio tachado, variantes, SEO y estado (borrador, activo, archivado).
- **Vínculo con Dropi:** ID del producto y de la variación en Dropi, precio proveedor, stock (sincronizado si la API lo permite) y proveedor.
- **Calculadora integrada:** al poner precio, costo Dropi y flete, el admin muestra la utilidad por entrega, el CPA de equilibrio y el CPA objetivo.
- **Bloques de landing por producto:** cada producto tiene su landing editable con bloques (beneficios, comparación, FAQ, etc.).
- Badges: "Top ventas", "Nuevo", "Últimas unidades".
- Estado de testeo: *En test / Ganador / Pausado / Muerto* (para llevar el control de testeos dentro del sistema).

**Colecciones:** manuales y automáticas por reglas (etiqueta, precio, línea hogar/mascotas).

**Clientes:** historial, total comprado, **% de rechazos** y lista negra COD.

**Descuentos:** cupones, envío gratis desde un monto y descuento por volumen.

**Roles:** Admin, Operaciones (pedidos) y Contenido.

**Modelo de datos base**
`products · product_variants · product_media · product_blocks · dropi_links · collections · customers · addresses · orders · order_items · order_events · dropi_orders · payments · shipping_rates · discounts · offers · offer_events · reviews · page_sections · abandoned_checkouts · ad_spend · admin_users · audit_log`

---

### FASE 3 · Tienda y constructor de secciones (semanas 5–8)
- **Landings de producto** (prioridad) con bloques reordenables desde el admin.
- **Home y colecciones** con constructor de secciones tipo Shopify OS 2.0: hero/slider, barra de anuncio, carrusel de productos, ofertas con contador, compra por ambiente, sección Mascotas, reseñas, beneficios, FAQ y texto SEO.
- Vista previa y publicar.
- Menús editables, buscador, filtros, carrito en drawer con barra de "envío gratis" y botón de WhatsApp.
- Velocidad: LCP < 2.5 s en 4G (la velocidad de la landing impacta directo en el CPA).
- SEO técnico y datos estructurados (Product, Offer, Review).

---

### FASE 4 · Formulario COD tipo Releasit + pago online (semanas 4–7)
**Formulario (modal)**
1. Nombre y apellido
2. Celular (9 dígitos, empieza con 9)
3. Departamento → Provincia → Distrito (Ubigeo, **solo destinos que cubre Dropi**)
4. Dirección + referencia
5. (Opcional) DNI y email

**Dentro del formulario**
- Selector de oferta por cantidad (1 u / 2 u / 3 u "Más elegido").
- **Upsell con check** ("Agrega el repuesto por S/14.90"), solo con productos del **mismo proveedor** de Dropi cuando se pueda (un solo envío).
- Resumen en vivo: subtotal, descuento, envío y total.
- Botón: **"Completar pedido · S/ 89.90"**.
- Confianza: "Pagas al recibir", "Envío a todo el Perú", "Cambios por fallas".

**Reglas COD**
- Destinos sin cobertura → solo pago online o mensaje de "aún no llegamos".
- Antifraude: límite de pedidos por celular al día, lista negra, detección de duplicados y nombres o direcciones basura.
- **Captura de abandono:** si escribió su celular y no terminó, queda guardado para recuperarlo por WhatsApp.

**Pago online** (versión posterior): tarjeta o Yape vía pasarela (Culqi, Izipay o Mercado Pago), con incentivo (por ejemplo, 5% OFF). Ojo: en dropshipping con Dropi, un pedido **prepagado** también se carga en Dropi, pero **sin recaudo**. Confirma con Dropi cómo se registra.

**Configurable desde el admin:** campos, textos, colores y en qué productos aparece.

---

### FASE 5 · Motor de ofertas (semanas 7–9)
| Tipo | Dónde | Ejemplo |
|---|---|---|
| Descuento por volumen | Landing y formulario | 2 u -10%, 3 u -15% |
| Combo | Landing | "Kit mascota feliz: fuente + filtros extra" |
| Cross-sell | Landing y carrito | Fuente para gatos → filtros de repuesto |
| Upsell en el formulario | Check dentro del formulario | "+ Rodillo quita pelos por S/19.90" |
| Upsell post-compra (1 clic) | Página de gracias, contador de 5 min | "Agrega otro con 40% OFF a tu mismo pedido" |
| Downsell | Si rechaza el post-compra | Producto más barato o menor descuento |

- Configuración: disparador (producto, colección, monto), producto ofrecido, descuento, ubicación, prioridad, fechas, cadena upsell → downsell y A/B.
- **Restricción Dropi:** el upsell post-compra debe agregarse **antes** de enviar el pedido a Dropi. Solución: el pedido espera 10–15 min (o hasta que el cliente cierre la página de gracias) antes de sincronizarse.
- Medición: mostrada, aceptada, tasa de aceptación e ingreso extra.

---

### FASE 6 · Operación de pedidos con Dropi (semanas 6–9)
**Flujo**
```
Pedido creado en Celansol
  → Confirmación (WhatsApp: tuyo o Chatea Pro / IA de Dropi)
  → Confirmado → se envía a Dropi (API o carga manual)
  → Dropi: Guía generada → En tránsito → En reparto
        ├→ Entregado → recaudo en tu wallet
        ├→ Novedad (no contesta, dirección errada) → gestionar en 24 h
        └→ Devuelto
  (Cancelado en cualquier punto antes del despacho)
```

- **Sincronización de estados:** traer el estado de cada pedido desde Dropi (webhook o consulta cada X minutos), guardando el número de guía y el tracking.
- **Gestión de novedades:** bandeja de pedidos "con novedad" para escribir al cliente ese mismo día. Es donde más entregas se salvan.
- **Mensajes automáticos:** confirmación, "tu pedido salió", "llega hoy, ten S/89.90 listo" y post-entrega (pedir reseña).
- **Conciliación:** utilidad esperada vs lo que llegó a la wallet de Dropi.
- Comprobantes electrónicos según lo que defina tu contador.

---

### FASE 7 · Dashboard de ventas tipo Shopify, adaptado a dropshipping COD (semanas 8–10)
**Filtros:** Hoy · Ayer · 7 d · 30 d · Mes · Rango · comparar con el periodo anterior (% en verde o rojo).

| KPI | Definición |
|---|---|
| Ventas brutas | Pedidos creados (S/) |
| Ventas confirmadas | Confirmados (S/) |
| **Ventas entregadas** | Entregadas y cobradas (S/) |
| **Utilidad Dropi real** | Lo que llegó o llegará a la wallet |
| Gasto en ads | Manual o por API de Meta |
| **Utilidad neta** | Utilidad Dropi − ads − pérdidas por devolución |
| Tasa de confirmación / entrega | Por día, producto y departamento |
| CPA por pedido creado y **por pedido entregado** | Gasto ÷ pedidos |
| **ROAS real** | Ventas entregadas ÷ gasto |
| AOV | Ticket promedio |
| Ingreso por ofertas | Upsells, combos y cross-sells |

**Gráficos:** ventas por día y hora, embudo (visitas → formulario → pedido → confirmado → entregado), **tabla de productos en test** con CPA, entrega y estado (ganador/muerto), entregas por departamento, motivos de devolución y rendimiento de cada oferta.

**Extras:** reporte diario automático a las 8:00 a.m. por WhatsApp o email, y exportar a Excel.

---

### FASE 8 · Tracking, QA y lanzamiento (semanas 9–10)
- **Meta Pixel + Conversions API** con `event_id` deduplicado. `Purchase` al crear el pedido (volumen para el algoritmo) + evento personalizado `PedidoEntregado` para optimizar por calidad más adelante.
- GA4 + GTM, TikTok Pixel + Events API y Microsoft Clarity.
- UTMs en todos los anuncios (para cruzar ventas y gasto por campaña en el dashboard).
- QA en Android e iPhone con red lenta: pedido de punta a punta hasta que aparezca en Dropi, ofertas, antifraude y abandono.
- Lanzamiento suave con 1–2 productos y S/20–30 al día.

---

### FASE 9 · Crecimiento (después de tener ganadores)
- Más creativos del ganador (UGC, testimonios reales).
- Recompra: consumibles de mascotas (filtros, arena, snacks) con recordatorio a los 30 días.
- Flujos de WhatsApp y email: abandono, post-entrega, reseñas y referidos.
- Expandir el catálogo alrededor del ganador (cross-sell natural).
- Cuando un producto vende estable: **negociar precio** con el proveedor en Dropi o importar y usar el fulfillment de Dropi (más margen).
- TikTok Ads, Google Shopping y SEO con blog (cuidado del hogar y mascotas).

---

## 7. Versiones de lanzamiento ("poco a poco")

| Versión | Qué incluye | Para qué | Semanas |
|---|---|---|---|
| **v0.0 · Testear ya** | Anuncios a WhatsApp + pedidos cargados a mano en Dropi + Excel de control | Vender y testear productos **mientras** se construye la web | Semana 1–2 |
| **v0.1 · Landing que vende** | Admin de productos + landing por producto + **formulario COD con descuento por volumen** + pedidos en el admin + envío a Dropi (API o manual) + Pixel/CAPI | Primer embudo propio | 3–5 |
| **v0.2 · Medir** | Sincronización de estados con Dropi + dashboard (creados/confirmados/entregados/utilidad/CPA) + gasto de ads + antifraude + abandono | Saber qué producto deja plata | +2 |
| **v0.3 · Subir el ticket** | Motor de ofertas: upsell en el formulario, post-compra, downsell, combos y cross-sell | Más utilidad por cada clic pagado | +2 |
| **v0.4 · Tienda** | Home, colecciones (Hogar/Mascotas), constructor de secciones, buscador y reseñas | Marca y recompra | +3 |
| **v0.5 · Automatizar** | WhatsApp automático, bandeja de novedades, reporte diario y pago online | Operar con menos manos | +2–3 |

**Regla:** no pasar de versión sin 1–2 semanas mirando los números de la anterior.

---

## 8. Cómo construirlo con Claude Code

### Estructura del repositorio
```
celansol/
├─ app/
│  ├─ (tienda)/          → home, colecciones, producto/landing, gracias, seguimiento
│  ├─ admin/             → pedidos, productos, ofertas, testeos, analítica, ajustes
│  └─ api/               → pedidos, dropi (crear orden y sincronizar), capi, webhooks, cron
├─ components/
│  ├─ tienda/            → CodForm, VolumeOffer, LandingBlocks, OfferModal, Countdown…
│  ├─ admin/             → DataTable, ProductEditor, MarginCalculator, KpiCard, Charts…
│  └─ ui/                → design system Celansol
├─ lib/
│  ├─ dropi/             → cliente de la API (aislado: si cambia la API se toca solo aquí)
│  ├─ pricing.ts         → precios, descuentos y ofertas (siempre en el servidor)
│  ├─ shipping.ts        → cobertura y flete por ubigeo
│  └─ tracking.ts        → Pixel/CAPI con event_id
├─ supabase/migrations/  → esquema SQL + RLS
├─ data/ubigeo.json
└─ CLAUDE.md             → reglas del proyecto
```

### Reglas de trabajo
1. `CLAUDE.md` con stack, colores, estados de pedido y la regla: **"todo precio se calcula en el servidor"**.
2. Una tarea chica por sesión: Claude Code primero propone un plan y después lo ejecuta.
3. Git + Vercel con preview por rama, y dos entornos (staging y producción).
4. La integración con Dropi va **aislada en `lib/dropi/`**, con un modo "manual" (cola de pedidos para cargar a mano) y un modo "API". Se cambia con un ajuste.
5. Pruebas en precios, ofertas, flete y creación de órdenes.

### Primeras tareas de v0.1
1. Proyecto Next.js + Supabase + Vercel + design system + `CLAUDE.md`.
2. Tablas: `products`, `product_variants`, `product_media`, `product_blocks`, `dropi_links`, `customers`, `orders`, `order_items`, `order_events`.
3. Login del admin + CRUD de productos con imágenes, vínculo Dropi y calculadora de margen.
4. Landing de producto con bloques.
5. `CodForm` con ubigeo, descuento por volumen y creación del pedido en el servidor.
6. Página de gracias + `Purchase` vía Pixel y CAPI.
7. Panel de pedidos: lista, detalle, estados y botón "Confirmar por WhatsApp".
8. `lib/dropi`: modo manual (cola + exportar) y, si hay API, crear la orden en Dropi.
9. QA en el celular → dominio → primeros anuncios.

---

## 9. Metas de los primeros 90 días

| Métrica | Meta |
|---|---|
| Productos testeados | 15–18 |
| Productos ganadores | 1–2 |
| Conversión del formulario (abre → pide) | ≥ 35% |
| Conversión de la landing | ≥ 2.5% |
| Confirmación COD | ≥ 80% |
| Entrega COD | ≥ 70–75% |
| CPA por pedido creado | ≤ CPA objetivo de cada producto |
| Aceptación del upsell post-compra | 10–20% |

---

## 10. Próximos pasos inmediatos
1. Crear la cuenta de Dropi Perú y **pedir la API de integraciones + tarifas** (flete, recaudo, devoluciones, liquidación).
2. Preseleccionar 15–20 productos (hogar con tecnología + mascotas) con el filtro de la sección 3 y pasarlos al Excel de unit economics.
3. Elegir los 2 primeros productos y arrancar **v0.0** (anuncios a WhatsApp) con S/15–20 al día cada uno.
4. Meta Business, Pixel, dominio y WhatsApp Business.
5. Colores exactos y logo en SVG.
6. Tarea 1 de v0.1 en Claude Code.
