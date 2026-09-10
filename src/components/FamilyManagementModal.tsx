import React, { useState } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  RefreshCw,
  Shield,
  UserPlus,
  Key,
  Award,
  Sparkles
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { UserRole } from '../types';

interface FamilyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilyManagementModal: React.FC<FamilyManagementModalProps> = ({ isOpen, onClose }) => {
  const {
    family,
    user,
    setUser,
    joinFamilyWithCode,
    generateNewInviteCode,
    updateMemberRole
  } = useFinancial();

  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [newFamName, setNewFamName] = useState('');
  const [joinMsg, setJoinMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const ok = joinFamilyWithCode(inputCode.trim(), newFamName.trim() || undefined);
    if (ok) {
      setJoinMsg({ text: '¡Te has unido exitosamente a la familia!', type: 'success' });
      setInputCode('');
      setNewFamName('');
    } else {
      setJoinMsg({ text: 'Código de invitación no válido (mínimo 4 caracteres).', type: 'error' });
    }
  };

  // Switch active user simulator for testing family collaboration
  const switchUserSimulator = (memberName: string, memberRole: UserRole, memberEmail: string) => {
    setUser(prev => ({
      ...prev,
      name: memberName,
      email: memberEmail,
      role: memberRole,
      avatar: memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Gestión Familiar y Roles
              </h3>
              <p className="text-xs text-slate-400">
                Grupo: <span className="text-cyan-400 font-semibold">{family.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Private Invite Code Card */}
        <div className="rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Tu Código de Invitación Familiar
            </span>
            <button
              onClick={generateNewInviteCode}
              title="Regenerar código"
              className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Regenerar
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-lg">
            <div className="font-mono text-lg font-black tracking-widest text-cyan-300">
              {family.inviteCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase transition-colors shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
            </button>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-slate-300">
            <span className="text-cyan-400 font-bold block mb-0.5">¿Dónde pone el código la persona a quien se lo compartas?</span>
            La persona a la que le envíes este código debe abrir la app en su teléfono, pulsar en la parte superior el botón <strong className="text-cyan-300">"+ Crear Usuario"</strong> o <strong className="text-cyan-300">"Ingresar Código"</strong> y pegar este código ({family.inviteCode}). ¡Quedará conectada de inmediato!
          </div>
        </div>

        {/* Members List with Role Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Miembros Conectados ({family.members.length})
            </h4>
            <span className="text-[11px] text-slate-400">Haz clic en un miembro para cambiar de usuario</span>
          </div>

          <div className="space-y-2">
            {family.members.map(member => {
              const isCurrentUser = member.name === user.name;
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCurrentUser
                      ? 'bg-cyan-950/20 border-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => switchUserSimulator(member.name, member.role, member.email)}
                    title="Simular inicio de sesión con este usuario"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-400 font-extrabold px-1.5 py-0.2 rounded-full">
                            ACTUAL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{member.email}</div>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                      disabled={user.role !== 'admin' && !isCurrentUser}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      <option value="admin">Admin (Acceso Total)</option>
                      <option value="member">Miembro (Editar)</option>
                      <option value="contributor">Colaborador</option>
                      <option value="viewer">Observador (Solo Ver)</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join Another Family Card */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1">
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> ¿Te compartieron un código? Ingrésalo aquí
          </h4>
          <p className="text-[11px] text-slate-400 mb-2.5">
            Si tu cónyuge u otro familiar te dio su código privado (ej. FAM-8492-DR), pégalo aquí para unirte a su grupo y ver las finanzas en común.
          </p>
          <form onSubmit={handleJoin} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Pega aquí el código (ej: FAM-8492-DR)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 uppercase"
              />
              <input
                type="text"
                value={newFamName}
                onChange={(e) => setNewFamName(e.target.value)}
                placeholder="Nombre de la Familia (Opcional)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vincularme a esta Familia</span>
            </button>
          </form>

          {joinMsg && (
            <div
              className={`mt-2 text-xs p-2 rounded-md ${
                joinMsg.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-800'
              }`}
            >
              {joinMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
