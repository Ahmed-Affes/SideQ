import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { UserProfile } from '../../types';
import { WaxSeal } from '../common/WaxSeal';
import { User, Mail, Lock, AtSign, ArrowRight, AlertCircle, Database } from 'lucide-react';

interface AuthViewProps {
  onAuthenticated: (profile: UserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const hasCloud = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { profile, error } = await authService.signUp(email, password, name, handle);
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          onAuthenticated(profile);
        } else {
          setSuccessNotice('Induction registered! Please check your email to verify your collegiate credentials, or sign in.');
          setMode('signin');
        }
      } else {
        const { profile, error } = await authService.signIn(email, password);
        if (error) {
          setErrorMsg(error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          onAuthenticated(profile);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    const { profile } = await authService.signInDemo();
    if (profile) {
      onAuthenticated(profile);
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'var(--bg-abyss)',
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(22, 33, 62, 0.6) 0%, transparent 70%),
          radial-gradient(circle at 10% 90%, rgba(197, 160, 89, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 40%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        overflowY: 'auto',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'rgba(14, 20, 36, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--border-gilded)',
          borderRadius: '24px',
          padding: '28px 22px 24px',
          boxShadow: 'var(--shadow-gilded)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative'
        }}
      >
        {/* Heraldic Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <WaxSeal status="active" size="lg" label="INDUCTION GATE" />

          <h1
            style={{
              fontSize: '20px',
              margin: '10px 0 2px',
              color: 'var(--text-heading)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em'
            }}
          >
            Sidequest Society
          </h1>

          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--gold-primary)',
              letterSpacing: '0.08em'
            }}
          >
            CAMPUS CIPHER AUTHENTICATION
          </span>
        </div>

        {/* Database Connection Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: hasCloud ? 'rgba(16, 185, 129, 0.12)' : 'rgba(229, 192, 123, 0.1)',
            border: `1px solid ${hasCloud ? 'rgba(16, 185, 129, 0.35)' : 'rgba(197, 160, 89, 0.3)'}`,
            padding: '4px 10px',
            borderRadius: 14,
            fontSize: '10px',
            color: hasCloud ? '#34D399' : 'var(--gold-primary)',
            fontWeight: 700
          }}
        >
          <Database size={12} />
          <span>{hasCloud ? 'Supabase Database Connected' : 'Arcane Local Cache Mode'}</span>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: 3,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: mode === 'signup' ? 800 : 600,
              backgroundColor: mode === 'signup' ? 'rgba(229, 192, 123, 0.2)' : 'transparent',
              color: mode === 'signup' ? 'var(--gold-primary)' : 'var(--text-muted)',
              border: mode === 'signup' ? '1px solid var(--border-gilded)' : 'none',
              cursor: 'pointer'
            }}
          >
            Enlist (Sign Up)
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: mode === 'signin' ? 800 : 600,
              backgroundColor: mode === 'signin' ? 'rgba(229, 192, 123, 0.2)' : 'transparent',
              color: mode === 'signin' ? 'var(--gold-primary)' : 'var(--text-muted)',
              border: mode === 'signin' ? '1px solid var(--border-gilded)' : 'none',
              cursor: 'pointer'
            }}
          >
            Enter (Log In)
          </button>
        </div>

        {/* Error / Success Notices */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              backgroundColor: 'rgba(153, 27, 27, 0.25)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: '#FCA5A5'
            }}
          >
            <AlertCircle size={15} flex-shrink="0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: '#6EE7B7'
            }}
          >
            {successNotice}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <>
              <div>
                <label
                  htmlFor="auth-name"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    display: 'block',
                    marginBottom: 4
                  }}
                >
                  FULL SCHOLAR NAME
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-gilded)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0 12px'
                  }}
                >
                  <User size={15} color="var(--gold-secondary)" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    style={{
                      flex: 1,
                      height: 40,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-handle"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    display: 'block',
                    marginBottom: 4
                  }}
                >
                  CAMPUS HANDLE
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-gilded)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0 12px'
                  }}
                >
                  <AtSign size={15} color="var(--gold-secondary)" />
                  <input
                    id="auth-handle"
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="avance"
                    style={{
                      flex: 1,
                      height: 40,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="auth-email"
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: 4
              }}
            >
              COLLEGIATE EMAIL
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-gilded)',
                borderRadius: 'var(--radius-sm)',
                padding: '0 12px'
              }}
            >
              <Mail size={15} color="var(--gold-secondary)" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@university.edu"
                style={{
                  flex: 1,
                  height: 40,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: 4
              }}
            >
              CIPHER PASSPHRASE
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-gilded)',
                borderRadius: 'var(--radius-sm)',
                padding: '0 12px'
              }}
            >
              <Lock size={15} color="var(--gold-secondary)" />
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  flex: 1,
                  height: 40,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 6,
              height: 46,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #c5a059 0%, #e5c07b 50%, #8c6e30 100%)',
              border: 'none',
              color: '#070a10',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: '0 4px 16px rgba(229, 192, 123, 0.4)'
            }}
          >
            <span>{isLoading ? 'COMMUNING WITH REGISTRY…' : mode === 'signup' ? 'ENLIST IN SOCIETY' : 'VERIFY & ENTER'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Tap Field Scout Demo Bypass */}
        <div style={{ paddingTop: 6, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoSignIn}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-secondary)',
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ⚡ Enter as Field Scout Rowan (1-Tap Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
