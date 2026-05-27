-- Gestor de Suscripciones — Esquema inicial
-- Ejecutar en: Supabase → SQL Editor

-- Tipos enumerados
CREATE TYPE estado_suscripcion AS ENUM ('activa', 'pausada', 'cancelada', 'vencida');
CREATE TYPE frecuencia_cobro AS ENUM ('mensual', 'anual', 'semestral', 'trimestral', 'semanal', 'unico');
CREATE TYPE nivel_uso AS ENUM ('alto', 'medio', 'bajo', 'sin_uso');
CREATE TYPE moneda AS ENUM ('ARS', 'USD', 'EUR', 'BRL', 'CLP', 'MXN', 'COP', 'PEN', 'UYU');
CREATE TYPE categoria_nombre AS ENUM (
  'streaming', 'musica', 'productividad', 'almacenamiento',
  'diseno', 'desarrollo', 'ia', 'comunicacion', 'seguridad',
  'educacion', 'negocios', 'gaming', 'finanzas', 'salud', 'otro'
);
CREATE TYPE metodo_pago_tipo AS ENUM (
  'tarjeta_credito', 'tarjeta_debito', 'transferencia',
  'paypal', 'mercadopago', 'crypto', 'efectivo', 'otro'
);

-- Tabla de suscripciones
CREATE TABLE suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria categoria_nombre NOT NULL DEFAULT 'otro',
  precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
  moneda moneda NOT NULL DEFAULT 'ARS',
  frecuencia frecuencia_cobro NOT NULL DEFAULT 'mensual',

  fecha_inicio DATE NOT NULL,
  fecha_renovacion DATE NOT NULL,
  estado estado_suscripcion NOT NULL DEFAULT 'activa',

  -- Método de pago como alias (NO datos financieros reales)
  metodo_pago_alias TEXT,
  metodo_pago_tipo metodo_pago_tipo,
  metodo_pago_ultimos_cuatro CHAR(4),

  nivel_uso nivel_uso NOT NULL DEFAULT 'medio',
  proyecto TEXT,
  notas TEXT,
  url_servicio TEXT,
  url_cancelacion TEXT,

  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de configuración de usuario
CREATE TABLE configuracion_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  cotizacion_usd_ars DECIMAL(10, 2) DEFAULT 1000,
  cotizacion_usd_eur DECIMAL(10, 4) DEFAULT 0.92,
  moneda_principal TEXT DEFAULT 'ARS',
  alertas_activadas BOOLEAN DEFAULT true,
  dias_alerta_anticipacion INTEGER[] DEFAULT ARRAY[7, 3, 1],
  tema TEXT DEFAULT 'oscuro',

  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de historial de alertas
CREATE TABLE alertas_enviadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suscripcion_id UUID NOT NULL REFERENCES suscripciones(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dias_antes INTEGER NOT NULL,
  enviada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  canal TEXT DEFAULT 'email'
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_suscripciones_updated_at
  BEFORE UPDATE ON suscripciones
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_configuracion_updated_at
  BEFORE UPDATE ON configuracion_usuario
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- Row Level Security (RLS)
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_enviadas ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuario solo ve sus propios datos
CREATE POLICY "usuarios_ven_sus_suscripciones"
  ON suscripciones FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "usuarios_ven_su_configuracion"
  ON configuracion_usuario FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "usuarios_ven_sus_alertas"
  ON alertas_enviadas FOR ALL
  USING (auth.uid() = usuario_id);

-- Índices para performance
CREATE INDEX idx_suscripciones_usuario ON suscripciones(usuario_id);
CREATE INDEX idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX idx_suscripciones_renovacion ON suscripciones(fecha_renovacion);
CREATE INDEX idx_suscripciones_categoria ON suscripciones(categoria);
CREATE INDEX idx_alertas_suscripcion ON alertas_enviadas(suscripcion_id);

-- Vista para próximas renovaciones (próximos 30 días)
CREATE OR REPLACE VIEW proximas_renovaciones AS
SELECT
  s.*,
  (s.fecha_renovacion - CURRENT_DATE) AS dias_restantes
FROM suscripciones s
WHERE
  s.estado = 'activa'
  AND s.fecha_renovacion >= CURRENT_DATE
  AND s.fecha_renovacion <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY s.fecha_renovacion ASC;
