# Substrack — Gestor de Suscripciones

Aplicación web moderna para administrar y controlar suscripciones personales y laborales.

## Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS v4
- **Backend/DB**: Supabase (PostgreSQL + Auth + RLS)
- **Gráficos**: Recharts
- **Deploy**: Vercel

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Copiar las credenciales desde **Settings → API**
3. Copiar `.env.example` como `.env` y completar:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 3. Ejecutar el esquema SQL

En **Supabase → SQL Editor**, ejecutar el contenido de:

```
supabase/migrations/001_schema_inicial.sql
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

### 5. Build para producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── tipos/              # Tipos TypeScript
├── configuracion/      # Supabase, categorías, constantes
├── servicios/          # Llamadas a Supabase (CRUD)
├── hooks/              # React hooks (useSuscripciones, useAuth)
├── utilidades/         # Cálculos, fechas, seguridad, formato
├── componentes/
│   ├── diseno/         # Layout, sidebar, header
│   ├── comunes/        # Tarjetas, badges, esqueletos
│   └── suscripciones/ # Formulario
└── paginas/            # Dashboard, Suscripciones, Calendario, etc.
```

## Módulos incluidos

- **Dashboard** — métricas de gasto, próximas renovaciones, gráfico por categoría, oportunidades de ahorro
- **Suscripciones** — CRUD completo, vista lista/grilla, filtros por categoría
- **Calendario** — vista mensual con renovaciones marcadas por categoría
- **Alertas** — agrupadas por urgencia y nivel de uso
- **Reportes** — gráficos de barras y torta por categoría y moneda
- **Configuración** — cotizaciones, alertas, privacidad, exportación

## Seguridad

- No almacena contraseñas ni credenciales
- No guarda números completos de tarjetas
- Detecta y advierte si se ingresa información sensible
- Row Level Security (RLS) activo en Supabase

## Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Agregar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Deploy automático en cada push a `main`
