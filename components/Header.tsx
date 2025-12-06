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

// Utilisation d'un singleton pour éviter les multiples instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

const supabase = getSupabaseClient();

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
          <div className={`account-menu ${menuOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="account-trigger"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="account-avatar">{getInitial(profile, session.user.email)}</span>
              <div className="account-meta">
                <span className="account-name">{fullName || profile?.first_name || email}</span>
                <span className="account-email">{email}</span>
              </div>
              <span className="account-caret" aria-hidden="true">
                ▾
              </span>
            </button>

            {menuOpen && (
              <div className="account-dropdown" role="menu">
                <div className="account-info">
                  <div className="account-info__identity">
                    <span className="account-avatar account-avatar--lg">{getInitial(profile, session.user.email)}</span>
                    <div>
                      <div className="account-info__name">{fullName || 'Profil'}</div>
                      <div className="account-info__email">{email}</div>
                    </div>
                  </div>
                  <span className={`account-badge ${userType === 'expert' ? 'is-expert' : 'is-client'}`}>
                    {userType === 'expert' ? 'Expert' : 'Client'}
                  </span>
                </div>

                <a
                  className="account-link"
                  href={userType === 'expert' ? '/expert/dashboard' : '/dashboard'}
                  role="menuitem"
                >
                  <span className="account-link__icon" aria-hidden="true">
                    📊
                  </span>
                  <span>Tableau de bord</span>
                </a>
                {userType === 'expert' && (
                  <a className="account-link" href="/expert/profile" role="menuitem">
                    <span className="account-link__icon" aria-hidden="true">
                      🧑‍💻
                    </span>
                    <span>Mon profil expert</span>
                  </a>
                )}
                <a className="account-link" href="/settings" role="menuitem">
                  <span className="account-link__icon" aria-hidden="true">
                    ⚙️
                  </span>
                  <span>Paramètres</span>
                </a>
                <button
                  type="button"
                  className="account-link signout-btn"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  <span className="account-link__icon" aria-hidden="true">
                    🚪
                  </span>
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
