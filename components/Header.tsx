'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient, Session } from '@supabase/supabase-js';

type Profile = {
  user_id: string;
  user_type: 'expert' | 'client' | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function getInitial(profile?: Profile | null, fallbackEmail?: string | null) {
  const initial = profile?.first_name?.trim()?.charAt(0) || fallbackEmail?.charAt(0) || '?';
  return initial.toUpperCase();
}

function getFullName(profile?: Profile | null) {
  if (!profile) return '';
  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  return parts.join(' ').trim();
}

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const userType = profile?.user_type === 'expert' ? 'expert' : 'client';

  useEffect(() => {
    if (!supabase) return;

    const loadProfile = async (userId: string) => {
      const { data } = await supabase
        .from<Profile>('profiles')
        .select('user_id, user_type, first_name, last_name, email')
        .eq('user_id', userId)
        .single();
      setProfile(data ?? null);
    };

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setMenuOpen(false);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!supabase || !session) {
    return (
      <header className="topbar">
        <div className="container topbar-content">
          <a className="brand" href="/">
            <div className="logo">N</div>
            <div>
              <div className="eyebrow">Appel Minute</div>
              <span className="brand-name">Nexbuzzer</span>
            </div>
          </a>
          <nav className="nav-links" aria-label="Navigation principale">
            <a href="/experts">Trouver un expert</a>
            <a href="/comment-ca-marche">Comment ça marche</a>
            <a href="/devenir-expert">Devenir expert</a>
            <a href="/tarifs">Tarifs</a>
          </nav>
          <div className="actions">
            <a className="ghost" href="/login">
              Se connecter
            </a>
            <a className="primary" href="/signup">
              S'inscrire
            </a>
          </div>
        </div>
      </header>
    );
  }

  const fullName = getFullName(profile) || session.user.user_metadata?.full_name || '';
  const email = profile?.email || session.user.email;

  return (
    <header className="topbar">
      <div className="container topbar-content">
        <a className="brand" href="/">
          <div className="logo">N</div>
          <div>
            <div className="eyebrow">Appel Minute</div>
            <span className="brand-name">Nexbuzzer</span>
          </div>
        </a>
        <nav className="nav-links" aria-label="Navigation principale">
          <a href="/experts">Trouver un expert</a>
          <a href="/comment-ca-marche">Comment ça marche</a>
          <a href="/devenir-expert">Devenir expert</a>
          <a href="/tarifs">Tarifs</a>
        </nav>

        <div className="actions" ref={menuRef}>
          <button
            type="button"
            className="account-trigger"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#2563eb',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                fontWeight: 700,
              }}
            >
              {getInitial(profile, session.user.email)}
            </span>
            <span style={{ fontWeight: 700 }}>{fullName || profile?.first_name || email}</span>
          </button>

          {menuOpen && (
            <div className="account-dropdown" role="menu">
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 700 }}>{fullName || 'Profil'}</div>
                <div style={{ fontSize: 13, color: '#4b5563' }}>{email}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#111827' }}>
                  {userType === 'expert' ? '✨ Expert' : '👤 Client'}
                </div>
              </div>

              <a href={userType === 'expert' ? '/expert/dashboard' : '/dashboard'} role="menuitem">
                📊 Tableau de bord
              </a>
              {userType === 'expert' && (
                <a href="/expert/profile" role="menuitem">
                  ⚙️ Mon profil expert
                </a>
              )}
              <a href="/settings" role="menuitem">
                ⚙️ Paramètres
              </a>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setMenuOpen(false);
                }}
                style={{ color: '#dc2626', fontWeight: 700, textAlign: 'left', padding: '10px 12px' }}
              >
                🚪 Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
