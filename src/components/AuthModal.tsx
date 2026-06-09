'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const validateGmail = (emailStr: string) => {
    return emailStr.toLowerCase().endsWith('@gmail.com');
  };

  const getFriendlyErrorMessage = (code: string, defaultMessage: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.';
      case 'auth/weak-password':
        return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
      case 'auth/invalid-email':
        return 'Format alamat email tidak valid.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email atau kata sandi salah. Silakan periksa kembali.';
      default:
        return defaultMessage;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Form validations
    if (!email || !password) {
      setErrorMsg('Semua kolom wajib diisi.');
      setLoading(false);
      return;
    }

    if (!validateGmail(email)) {
      setErrorMsg('Registrasi/Login harus menggunakan akun Gmail (@gmail.com).');
      setLoading(false);
      return;
    }

    if (isRegister && !nickname.trim()) {
      setErrorMsg('Nickname wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        // Sign up with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile display name (nickname)
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: nickname.trim(),
          });
        }

        setSuccessMsg('Registrasi berhasil! Akun Anda siap digunakan.');
        
        // Reset form
        setEmail('');
        setNickname('');
        setPassword('');
        setTimeout(() => {
          setIsRegister(false);
          setSuccessMsg('');
        }, 2000);
      } else {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        setSuccessMsg('Berhasil masuk!');
        if (onSuccess && userCredential.user) {
          onSuccess(userCredential.user);
        }
        setTimeout(() => {
          onClose();
          // Reload to update navbar state
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err.code, err.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#161619] border border-white/[0.08] rounded-xl shadow-depth-lg p-8 z-10 overflow-hidden shimmer">
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 rounded-full filter blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-800/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            {isRegister ? 'Register Akun (Firebase)' : 'Masuk Ke OXYX (Firebase)'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-1"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400 font-semibold leading-relaxed">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">
              Alamat Gmail
            </label>
            <input
              type="email"
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-field px-4 py-3 text-sm focus:border-red-600"
              required
            />
            {email && !validateGmail(email) && (
              <p className="mt-1 text-[10px] text-red-500">Email harus diakhiri dengan @gmail.com</p>
            )}
          </div>

          {isRegister && (
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">
                Nickname
              </label>
              <input
                type="text"
                placeholder="Nickname Anda"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full input-field px-4 py-3 text-sm focus:border-red-600"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-field px-4 py-3 text-sm focus:border-red-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-accent py-3.5 text-xs font-bold transition-all disabled:opacity-50 mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="spinner w-4 h-4 border-t-white" />
                <span>Memproses...</span>
              </div>
            ) : (
              <span>{isRegister ? 'Daftar Sekarang' : 'Masuk'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 relative z-10">
          {isRegister ? (
            <p>
              Sudah memiliki akun?{' '}
              <button 
                onClick={() => { setIsRegister(false); setErrorMsg(''); }} 
                className="text-red-500 hover:text-red-400 font-bold transition-colors ml-1"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum memiliki akun?{' '}
              <button 
                onClick={() => { setIsRegister(true); setErrorMsg(''); }} 
                className="text-red-500 hover:text-red-400 font-bold transition-colors ml-1"
              >
                Daftar sekarang
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
