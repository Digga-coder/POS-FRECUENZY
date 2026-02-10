import React, { useState } from 'react';
import { User, UserCog, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';

interface LoginScreenProps {
  onWaiterLogin: (user: string, pass: string) => void;
  onAdminLogin: (password: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onWaiterLogin, onAdminLogin }) => {
  const [mode, setMode] = useState<'waiter' | 'admin'>('waiter');
  
  // Waiter State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin State
  const [adminPass, setAdminPass] = useState('');

  const handleWaiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onWaiterLogin(username, password);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminLogin(adminPass);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className={`p-4 rounded-full mb-4 ring-2 ring-zinc-700 ${mode === 'waiter' ? 'bg-zinc-900' : 'bg-purple-900/20 ring-purple-500/50'}`}>
             {mode === 'waiter' ? (
                <User size={48} className="text-emerald-500" />
             ) : (
                <UserCog size={48} className="text-purple-500" />
             )}
          </div>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-zinc-300">
            {mode === 'waiter' ? 'Nightclub POS' : 'ADMINISTRACIÓN'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {mode === 'waiter' ? 'Inicia sesión para comenzar' : 'Panel de Control'}
          </p>
        </div>

        {/* WAITER FORM */}
        {mode === 'waiter' && (
            <form onSubmit={handleWaiterSubmit} className="flex flex-col gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 ml-1">USUARIO</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-14 bg-zinc-900 border border-zinc-700 text-white px-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
                        placeholder="ej. juan"
                        autoCapitalize='none'
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 ml-1">CONTRASEÑA</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-14 bg-zinc-900 border border-zinc-700 text-white pl-4 pr-12 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-zinc-700"
                            placeholder="••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-2"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                
                <Button variant="primary" type="submit" className="h-16 text-xl mt-4 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-[0_4px_0_rgb(6,95,70)]">
                    ENTRAR
                </Button>
            </form>
        )}

        {/* ADMIN FORM */}
        {mode === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
                <div className="space-y-1">
                     <label className="text-xs font-bold text-zinc-500 ml-1">CLAVE DE ACCESO</label>
                    <input 
                        type="password" 
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="Contraseña Maestra"
                        className="w-full h-14 bg-zinc-900 border border-zinc-700 text-white px-4 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                        autoFocus
                    />
                </div>
                <Button variant="primary" type="submit" className="h-14 text-lg mt-2">
                    ACCEDER
                </Button>
            </form>
        )}

        {/* Footer Switch */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex justify-center">
            {mode === 'waiter' ? (
                <button onClick={() => setMode('admin')} className="text-zinc-600 text-sm flex items-center gap-2 hover:text-white transition-colors">
                    <KeyRound size={16}/> Acceso Admin
                </button>
            ) : (
                <button onClick={() => setMode('waiter')} className="text-zinc-500 flex items-center gap-2 hover:text-white transition-colors py-2">
                    <ArrowLeft size={16} /> Volver al Login
                </button>
            )}
        </div>

      </div>
    </div>
  );
};