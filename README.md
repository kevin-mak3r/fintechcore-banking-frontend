# FintechCore Banking Dashboard (React + TypeScript)

Panel bancario interactivo y moderno desarrollado con **React 18**, **TypeScript**, **Tailwind CSS 4** y **Vite**. Conectado en tiempo real con el microservicio **FintechCore Ledger API (Spring Boot 3)**.

---

## 🚀 Características Principales

* **Monitoreo Financiero en Vivo:**
  * Indicador de salud de conexión en tiempo real con el backend de Spring Boot (`http://localhost:8085`).
  * Resumen global de saldos en Soles (PEN) y Dólares (USD).
* **Gestión de Cuentas:**
  * Tarjetas interactivas con copia rápida del número de cuenta con un clic.
  * Indicadores de estado (`ACTIVE`, `BLOCKED`, `CLOSED`) y titular con documento de identidad.
* **Módulo de Transferencias con Idempotencia:**
  * Selector inteligente de cuentas origen y destino con validación de saldo.
  * Generador automático de claves de idempotencia (`Idempotency-Key` en headers HTTP) para evitar cobros dobles en reintentos.
* **Operaciones de Caja (Depósitos y Retiros):**
  * Modales para ingreso de efectivo en ventanilla y retiros por ATM.
* **Apertura de Cuentas:**
  * Formulario reactivo para registro de nuevas cuentas con moneda configurable (PEN / USD / EUR).
* **Libro Diario de Transacciones (Ledger):**
  * Historial auditable de movimientos en tiempo real con referencias únicas (`TX-...`), badges por tipo de operación y montos formateados.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 18, TypeScript, Vite.
* **Estilos:** Tailwind CSS v4, Lucide React (iconografía moderna).
* **Backend compatible:** [FintechCore-SpringBoot-BackEnd](https://github.com/kevin-mak3r/fintechcore-banking-backend).

---

## 💻 Cómo ejecutar localmente

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Iniciar el entorno de desarrollo:
```bash
npm run dev
```

El dashboard iniciará en: **`http://localhost:3000`**

---

## 🔗 Conexión con el Backend

Por defecto se conecta a la API de Spring Boot en:  
`http://localhost:8085/api/v1`
