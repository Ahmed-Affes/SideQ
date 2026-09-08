import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';
import type { UserProfile } from '../../types';
import { WaxSeal } from '../common/WaxSeal';
import { User, Mail, Lock, AtSign, ArrowRight, AlertCircle, Database, CheckCircle2, Key } from 'lucide-react';

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

  // In-app Supabase credentials input
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { url: initialUrl, key: initialKey } = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialUrl);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialKey);

  const hasCloud = isSupabaseConfigured();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      setErrorMsg('Please enter both Supabase Project URL and Anon Key.');
      return;
    }

    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (!hasCloud) {
        setErrorMsg('Supabase is not configured yet! Please click "Connect Supabase" below and enter your Project URL and Anon Key.');
        setIsLoading(false);
        setShowConfigModal(true);
        return;
      }

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
          setSuccessNotice('Account registered in Supabase! If you have email confirmation enabled, please check your inbox, or sign in below.');
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
      setErrorMsg(err.message || 'Authentication failed with Supabase.');
    } finally {
      setIsLoading(false);
    }
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
          maxWidth: '390px',
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
            REAL DATABASE AUTHENTICATION
          </span>
        </div>

        {/* Database Connection Status Bar */}
        <div
          onClick={() => setShowConfigModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: hasCloud ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${hasCloud ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.4)'}`,
            padding: '6px 12px',
            borderRadius: 14,
            fontSize: '11px',
            color: hasCloud ? '#34D399' : '#F87171',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Database size={13} />
            <span>{hasCloud ? 'Connected to Supabase Cloud' : 'Supabase Not Connected Yet'}</span>
          </div>

          <span style={{ fontSize: '10px', textDecoration: 'underline', color: 'var(--gold-primary)' }}>
            {hasCloud ? 'Edit Keys' : 'Connect Now'}
          </span>
        </div>

        {/* In-App Supabase Config Drawer if needed */}
        {(!hasCloud || showConfigModal) && (
          <div
            style={{
              backgroundColor: 'rgba(7, 10, 18, 0.95)',
              border: '1px solid var(--border-gold-bright)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-primary)' }}>
                <Key size={14} />
                <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  CONNECT YOUR SUPABASE PROJECT
                </span>
              </div>
              {hasCloud && (
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              )}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.4 }}>
              Paste your Supabase API credentials below (from your Supabase Dashboard &gt; Project Settings &gt; API) to save real accounts and real database progress:
            </p>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: '9px', fontWeight: 700, color: 'var(--gold-secondary)' }}>
                  PROJECT URL
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  style={{
                    width: '100%',
                    height: 36,
                    padding: '0 10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '9px', fontWeight: 700, color: 'var(--gold-secondary)' }}>
                  ANON PUBLIC API KEY
                </label>
                <input
                  type="text"
                  required
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  style={{
                    width: '100%',
                    height: 36,
                    padding: '0 10px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 4,
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  height: 38,
                  backgroundColor: 'var(--cipher-emerald)',
                  color: '#042718',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <CheckCircle2 size={14} />
                <span>SAVE & CONNECT TO SUPABASE</span>
              </button>
            </form>
          </div>
        )}

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
            <AlertCircle size={15} />
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
            <span>{isLoading ? 'COMMUNING WITH SUPABASE…' : mode === 'signup' ? 'ENLIST IN SUPABASE' : 'VERIFY & ENTER'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
