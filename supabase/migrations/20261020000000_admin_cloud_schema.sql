-- Migration: Admin Cloud Architecture & Security by Design
-- Tables: subscription_orders, system_settings, api_usage_logs, admin_audit_logs
-- Bucket: receipts (Storage)

-- 1. Table: subscription_orders (Transaksi & Bukti Pembayaran Guru)
CREATE TABLE IF NOT EXISTS public.subscription_orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(32),
    plan_id VARCHAR(64) NOT NULL,
    plan_name VARCHAR(128) NOT NULL,
    tier VARCHAR(32) NOT NULL DEFAULT 'free',
    amount NUMERIC(12, 2) NOT NULL,
    formatted_amount VARCHAR(64) NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    proof_image_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_subscription_orders_user ON public.subscription_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_status ON public.subscription_orders(status);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_date ON public.subscription_orders(created_at DESC);

-- RLS: subscription_orders
ALTER TABLE public.subscription_orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User can view own orders' AND tablename = 'subscription_orders') THEN
        CREATE POLICY "User can view own orders" ON public.subscription_orders
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User can insert own orders' AND tablename = 'subscription_orders') THEN
        CREATE POLICY "User can insert own orders" ON public.subscription_orders
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;


-- 2. Table: system_settings (Konfigurasi Global Platform & Nomor Rekening)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by VARCHAR(255)
);

-- RLS: system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view system settings' AND tablename = 'system_settings') THEN
        CREATE POLICY "Public can view system settings" ON public.system_settings
            FOR SELECT USING (true);
    END IF;
END $$;

-- Data Awal Saluran Pembayaran
INSERT INTO public.system_settings (key, value, updated_by)
VALUES (
    'payment_channels',
    '{
        "dana": {
            "name": "DANA",
            "accountNumber": "081234567890",
            "accountName": "ModulKu Official (Admin)",
            "notes": "Buka aplikasi DANA -> Kirim -> Masukkan nomor ponsel tujuan."
        },
        "shopeepay": {
            "name": "ShopeePay",
            "accountNumber": "081234567890",
            "accountName": "ModulKu Official (Admin)",
            "notes": "Buka aplikasi Shopee -> ShopeePay -> Transfer -> Masukkan nomor ponsel."
        },
        "bri": {
            "name": "Bank BRI",
            "bankName": "PT Bank Rakyat Indonesia (Persero) Tbk",
            "accountNumber": "012301000123501",
            "accountName": "ModulKu Official (Admin)",
            "notes": "Transfer antar-bank atau via BRImo, ATM, dan Internet Banking."
        },
        "whatsapp": {
            "number": "081234567890",
            "formattedNumber": "+62 812-3456-7890"
        }
    }'::jsonb,
    'system_init'
)
ON CONFLICT (key) DO NOTHING;


-- 3. Table: api_usage_logs (Telemetri Konsumsi Token & Biaya AI)
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    endpoint VARCHAR(128) NOT NULL,
    model_name VARCHAR(64) NOT NULL DEFAULT 'gemini-1.5-flash',
    input_tokens INT NOT NULL DEFAULT 0,
    output_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    estimated_cost_idr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status_code INT NOT NULL DEFAULT 200,
    duration_ms INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_logs_date ON public.api_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_user ON public.api_usage_logs(user_id);

-- RLS: api_usage_logs (Hanya Service Role yang dapat menulis/membaca secara langsung)
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;


-- 4. Table: admin_audit_logs (Rekam Jejak Aktivitas Administrator)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(128),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON public.admin_audit_logs(admin_email);

-- RLS: admin_audit_logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;


-- 5. Storage Bucket: receipts (Untuk Bukti Pembayaran)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Receipts' AND tablename = 'objects') THEN
        CREATE POLICY "Public Access for Receipts" ON storage.objects
            FOR SELECT USING (bucket_id = 'receipts');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Users can Upload Receipts' AND tablename = 'objects') THEN
        CREATE POLICY "Authenticated Users can Upload Receipts" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');
    END IF;
END $$;
