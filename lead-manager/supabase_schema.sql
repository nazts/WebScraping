-- Create clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  negocio TEXT,
  telefono TEXT,
  email TEXT,
  ciudad TEXT,
  pais TEXT,
  idioma TEXT DEFAULT 'es',
  website TEXT,
  estado TEXT NOT NULL DEFAULT 'potencial', -- potencial, proceso, cerrado, descartado
  descripcion TEXT,
  monto NUMERIC,
  fecha_cierre TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create archivos table
CREATE TABLE archivos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - For simplicity in this demo, we allow all access, but usually you'd verify JWT.
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON archivos FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON archivos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON archivos FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON archivos FOR DELETE USING (true);

-- Setup Storage Bucket
-- You need to create this manually in Supabase Dashboard (Storage -> Create a new bucket -> name: "archivos" -> check "Public bucket")
-- Or run this if your permissions allow:
INSERT INTO storage.buckets (id, name, public) VALUES ('archivos', 'archivos', true);

CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'archivos');

-- Migration: add new columns to an existing clients table
-- Run these if you already have the table created and need to add the new fields:
-- ALTER TABLE clients ADD COLUMN IF NOT EXISTS pais TEXT;
-- ALTER TABLE clients ADD COLUMN IF NOT EXISTS idioma TEXT DEFAULT 'es';
