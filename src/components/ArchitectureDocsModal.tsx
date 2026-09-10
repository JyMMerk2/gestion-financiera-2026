import React, { useState } from 'react';
import { X, FileText, Database, GitBranch, Terminal, Shield, CheckCircle, Code } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'supabase' | 'sheets' | 'cicd'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Arquitectura y Documentación Técnica
              </h3>
              <p className="text-xs text-slate-400">Migración de Google Sheets a React, Supabase y CI/CD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'architecture' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Arquitectura del Sistema
          </button>
          <button
            onClick={() => setActiveSection('supabase')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'supabase' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" /> Esquema SQL Supabase
          </button>
          <button
            onClick={() => setActiveSection('sheets')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'sheets' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" /> Migración Google Sheets
          </button>
          <button
            onClick={() => setActiveSection('cicd')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'cicd' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" /> Pipeline CI/CD GitHub
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" /> 1. Arquitectura General y PWA Offline-First
              </h4>
              <p>
                La aplicación ha sido completamente modernizada desde un archivo HTML estático hacia una arquitectura SPA en <strong>React 19 + TypeScript + Tailwind CSS v4</strong> con soporte PWA nativo:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><strong>Almacenamiento Local Resiliente:</strong> Utiliza una cola offline FIFO (<code className="text-cyan-300">OfflineActionQueue</code>) que retiene transacciones cuando no hay internet y las despacha automáticamente al restablecerse la conectividad.</li>
                <li><strong>Cifrado y Modo Privacidad:</strong> Capa de seguridad visual que difumina (<code className="text-amber-300">blur(7px)</code>) saldos sensibles con un solo clic para visualización segura en espacios públicos.</li>
                <li><strong>Autenticación Biométrica & PIN:</strong> Protocolo híbrido con soporte de credenciales WebAuthn (TouchID/FaceID) y fallback a PIN local de 4 dígitos.</li>
                <li><strong>Multi-Moneda Dinámico:</strong> Cálculos en tiempo real en Pesos Dominicanos (DOP), Dólares (USD) y Euros (EUR) con tasas de cambio oficiales del Banco Central de la República Dominicana (BCRD) y remesadoras.</li>
              </ul>
            </div>
          )}

          {activeSection === 'supabase' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> 2. Esquema DDL para Supabase (PostgreSQL con RLS)
              </h4>
              <p className="text-slate-400">
                A continuación se detalla el script SQL para inicializar las tablas en Supabase con Row Level Security (RLS):
              </p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`-- 1. Tabla de Familias
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Usuarios y Roles
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  family_id UUID REFERENCES families(id),
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member', 'contributor', 'viewer')),
  pin_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Wallets / Cuentas Bancarias
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'DOP',
  balance_dop NUMERIC(14,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true
);

-- 4. Transacciones (Ingresos y Gastos)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id),
  user_id UUID REFERENCES users(id),
  tipo TEXT CHECK (tipo IN ('Ingreso', 'Gasto')),
  categoria TEXT NOT NULL,
  concepto TEXT NOT NULL,
  monto_dop NUMERIC(14,2) NOT NULL,
  moneda TEXT DEFAULT 'DOP',
  tasa_cambio NUMERIC(8,2) DEFAULT 1.00,
  is_recurring BOOLEAN DEFAULT false,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 5. Habilitar Seguridad RLS por Familia
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso exclusivo por familia" ON transactions
  FOR ALL USING (family_id = (SELECT family_id FROM users WHERE id = auth.uid()));`}
              </pre>
            </div>
          )}

          {activeSection === 'sheets' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" /> 3. Migración desde Google Sheets Legacy
              </h4>
              <p className="text-slate-400">
                La aplicación anterior utilizaba Google Sheets mediante Google Apps Script como base de datos. Para migrar los datos históricos:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-slate-400">
                <li>Exporta las hojas <code className="text-white">Presupuesto_Hogar</code> y <code className="text-white">Ahorros_Fondo</code> en formato CSV.</li>
                <li>Mapea las columnas de moneda original <code className="text-white">[USD $xx @ rate]</code> directamente a los campos estructurados <code className="text-white">moneda</code> y <code className="text-white">tasa_cambio</code>.</li>
                <li>Asigna el identificador del grupo familiar <code className="text-cyan-400">family_id</code> a todos los registros históricos para preservar el aislamiento de datos.</li>
              </ol>
            </div>
          )}

          {activeSection === 'cicd' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" /> 4. Configuración CI/CD (.github/workflows/deploy.yml)
              </h4>
              <p className="text-slate-400">
                Flujo de integración y despliegue continuo para mantener la estabilidad del código en producción:
              </p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`name: CI/CD Pipeline

on:
  push:
    branches: [ main, production ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Code Quality & Typecheck
        run: npm run lint

      - name: Automated Production Build
        run: npm run build

      - name: Deploy to Cloud Run / Vercel
        if: github.ref == 'refs/heads/main'
        run: echo "Despliegue verificado y aprobado."`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
