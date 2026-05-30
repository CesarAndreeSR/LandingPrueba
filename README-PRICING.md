# 💰 Estrategia de Precios e Infraestructura - INTIHAWUA

Este documento define las tarifas oficiales de nuestros servicios, la justificación comercial de cada cobro, la arquitectura técnica que los soporta y la estrategia de escalabilidad para el equipo.

---

## 📦 SISTEMA · 01 | Inventario
**Enfoque:** Control logístico y administrativo para empresas que mueven stock pero no atienden en mostrador rápido.

### 💰 Esquema de Cobro
* **Instalación (Pago único):** Desde S/ 180
* **Mensualidad:** S/ 120 / mes

### 🛠️ Desglose Técnico e Infraestructura
* **Base de Datos (DB):** PostgreSQL / MySQL alojada en servicios con capa gratuita robusta o costos mínimos escalables (ej. Supabase, Render, o Railway). Cada cliente maneja un esquema aislado o una base de datos independiente para garantizar la seguridad de sus movimientos.
* **Mantenimiento y Soporte:** Incluido en la mensualidad. Cubre el monitoreo del servidor, la disponibilidad del sistema 24/7 y los respaldos automáticos diarios de la data del cliente.

### 🎯 Justificación Comercial (Por qué ese precio)
S/ 180 cubre el despliegue inicial de la base de datos y la configuración en los equipos del cliente. Los S/ 120 mensuales aseguran un ingreso pasivo constante para el equipo, justificando el almacenamiento en la nube y el soporte técnico remoto ante cualquier caída.

---

## 🚀 SISTEMA · 02 | POS + Inventario
**Enfoque:** Diseñado para el sector retail de alto flujo (bodegas, minimarkets, ferreterías, etc.) que opera con atención directa en caja.

### 💰 Esquema de Cobro
* **Instalación (Pago único):** Desde S/ 250
* **Mensualidad:** S/ 180 / mes

### 🛠️ Desglose Técnico y Módulos Extra (Add-ons)
* **Plan Base (S/ 250 + S/ 180/mes):** Incluye la instalación para **1 local y 1 caja**, cajeros ilimitados con auditoría de turnos (Cierre Z) e inventario automatizado por venta. Emite únicamente tickets de control interno (notas de venta).
* **Add-on: Facturación Electrónica SUNAT:** No viene incluida en el precio base. Si el cliente la solicita, se cotiza una instalación adicional (Sugerido: +S/ 150 a S/ 200 pago único) para cubrir la integración de la firma digital, certificados y la conexión con la OSE/SUNAT.
* **Add-on: Multi-caja / Multi-local:** Si el cliente tiene sucursales, la sincronización de bases de datos en tiempo real consume más recursos en la nube. Se cobra un extra mensual por cada local adicional conectado.

### 🎯 Justificación Comercial (Por qué ese precio)
El mostrador es crítico; si el sistema falla, el negocio se detiene. Por eso la mensualidad sube a S/ 180. Este monto cubre la alta disponibilidad de la base de datos, las alertas de stock crítico en tiempo real y la tranquilidad del cliente de que su caja cuadrará al centavo todos los días. El "Desde 250" es nuestro piso obligatorio de ingeniería por configurar periféricos (lector de barras, ticketera) y capacitar al personal.

---

## 🌐 WEB · 03 | Páginas Web
**Enfoque:** Presencia digital premium y desarrollo a medida utilizando arquitectura moderna (Frontend limpio, sin plantillas pesadas de WordPress).

### 💰 Esquema de Cobro
* **Costo de Entrada:** Desde S/ 500 (Pago único)
* **Incluye:** Dominio `.com` y Hosting gestionado gratis por 1 año.

### 📊 Desglose de Niveles (Estrategia de Escalabilidad)

El precio de la web en la plataforma arranca en **S/ 500 (Nivel 1)** para enganchar al cliente. Durante la reunión de cotización, el equipo escala el precio según las necesidades técnicas:

| Nivel de Desarrollo | Alcance Técnico | Infraestructura y Costos | Precio Sugerido de Cierre |
| :--- | :--- | :--- | :--- |
| **Nivel 1: Landing Page** | Una sola sección estructurada para captación. Código Frontend puro (HTML/CSS/JS o React). | **Dominio:** ~S/ 50 (Porkbun/Namecheap).<br>**Hosting:** S/ 0 (Cloudflare Pages / Netlify). | **S/ 500** *(Margen limpio: S/ 450)* |
| **Nivel 2: Catálogo Web** | Interfaz de productos + Panel de Administración (CMS a medida o Strapi) para que el cliente edite stock y fotos. | **Dominio:** ~S/ 50.<br>**Hosting/DB:** Capa gratuita o compartida. | **S/ 700 a S/ 900** |
| **Nivel 3: E-commerce** | Tienda virtual completa con pasarela de pagos integrada (Culqi, Niubiz, Izipay) y carrito de compras. | **Dominio:** ~S/ 50.<br>**Infraestructura:** Servidores con alta seguridad SSL y webhooks de pago. | **S/ 1200 a más** |

### 🎯 Justificación Comercial e Ingreso Pasivo (Año 2)
Al incluir dominio y hosting por un año dentro de los S/ 500, eliminamos la fricción de compra del cliente (estrategia "Todo Incluido"). Como nuestro hosting en Cloudflare/Netlify nos cuesta S/ 0 gracias al despliegue estático, retenemos S/ 450 de ganancia inmediata en el Nivel 1.

**El verdadero negocio (Renovaciones):** A partir del año 2, se le cobra al cliente una tasa de renovación anual (Sugerido: S/ 150 a S/ 200) por mantenimiento y renovación del dominio. Nuestro costo real seguirá siendo únicamente los S/ 50 del dominio, generando un flujo pasivo anual neto para el equipo por cada web entregada.

---

## ⚖️ Política de Negociación y Cierre (Anclaje Psicológico)

1.  **La regla del "Desde":** El cliente no conoce los costos técnicos. Si un cliente llega atraído por el precio de S/ 500 (Páginas Web) pero solicita funciones de un Nivel 2 o 3, el equipo justificará técnicamente el incremento del presupuesto basándose en la complejidad del panel editable o las pasarelas de pago.
2.  **El escudo de presupuesto:** Si el cliente exige rebajas en los sistemas web, nuestra tarifa base de S/ 500 nos permite cerrar el trato ofreciéndole estrictamente el Nivel 1 (Landing informativa) sin perder margen de ganancia, ya que el costo de inversión de hardware/software para nosotros es mínimo.

---

## 📈 Proyecciones de Ingreso Recurrente

### Con 10 clientes

| Producto | # clientes | Ingreso mensual |
|---|---|---|
| **Inventario** | 5 | S/ 600 |
| **POS + Inventario** | 5 | S/ 900 |
| **Total** | 10 | **S/ 1,500/mes** |

### Con 20 clientes

| Producto | # clientes | Ingreso mensual |
|---|---|---|
| **Inventario** | 10 | S/ 1,200 |
| **POS + Inventario** | 10 | S/ 1,800 |
| **Total** | 20 | **S/ 3,000/mes** |

### Con 30 clientes

| Producto | # clientes | Ingreso mensual |
|---|---|---|
| **Inventario** | 15 | S/ 1,800 |
| **POS + Inventario** | 15 | S/ 2,700 |
| **Total** | 30 | **S/ 4,500/mes** |

---

## 🚀 Estrategia de Escalabilidad

### Fase 1 (0–12 meses)
- **Infraestructura:** Supabase/Neon (free tier)
- **Objetivo:** Capturar 20–30 clientes
- **Ingreso objetivo:** S/ 1,500–3,000/mes
- **Costo infraestructura:** ~S/ 0/mes (free tier)

### Fase 2 (12–24 meses)
- **Infraestructura:** Migrar clientes grandes a AWS RDS
- **Objetivo:** 50+ clientes
- **Ingreso objetivo:** S/ 4,500–7,500/mes
- **Costo infraestructura:** S/ 100–200/mes (solo para clientes grandes)

### Fase 3 (24+ meses)
- **Infraestructura:** Híbrida (Supabase para chicos, AWS para grandes)
- **Objetivo:** 100+ clientes
- **Ingreso objetivo:** S/ 7,500+/mes
- **Costo infraestructura:** S/ 300–500/mes
