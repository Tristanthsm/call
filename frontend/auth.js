(() => {
  const SUPABASE_URL = window.SUPABASE_URL;
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

  const hasValidConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('VOTRE_CLE_ANON'));
  const supabaseClient = window.supabase && hasValidConfig ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  if (!window.supabase) console.warn('Supabase SDK introuvable (cdn/jsdelivr).');
  if (!hasValidConfig) {
    console.warn('Configurez SUPABASE_URL et SUPABASE_ANON_KEY (via config.js ou directement dans la page).');
  }

  function showFeedback(id, message, tone = 'error') {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.setAttribute('data-tone', tone);
    el.style.display = message ? 'block' : 'none';
  }

  function setLoading(form, isLoading) {
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const label = btn.getAttribute('data-label') || btn.textContent;
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Un instant...' : label;
  }

  function wirePasswordToggles() {
    document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.password-wrapper')?.querySelector('input') || btn.closest('.relative')?.querySelector('input');
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.textContent = isText ? 'Afficher' : 'Masquer';
      });
    });
  }

  function handleLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!supabaseClient) {
        showFeedback('login-feedback', 'Configuration Supabase manquante. Ajoutez SUPABASE_URL et SUPABASE_ANON_KEY.', 'error');
        return;
      }

      const email = form.email.value.trim();
      const password = form.password.value;
      if (!email || !password) {
        showFeedback('login-feedback', 'Merci de renseigner vos identifiants.', 'error');
        return;
      }

      showFeedback('login-feedback', '', 'error');
      setLoading(form, true);
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      setLoading(form, false);

      if (error) {
        showFeedback('login-feedback', error.message, 'error');
        return;
      }

      showFeedback('login-feedback', 'Connexion réussie. Redirection en cours...', 'success');
      window.location.href = '/';
    });
  }

  function handleSignup() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!supabaseClient) {
        showFeedback('signup-feedback', 'Configuration Supabase manquante. Ajoutez SUPABASE_URL et SUPABASE_ANON_KEY.', 'error');
        return;
      }

      const firstName = form.firstName.value.trim();
      const lastName = form.lastName.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const termsAccepted = form.querySelector('#terms')?.checked;

      if (!termsAccepted) {
        showFeedback('signup-feedback', "Merci d'accepter les conditions d'utilisation.", 'error');
        return;
      }

      showFeedback('signup-feedback', '', 'error');
      setLoading(form, true);
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: `${firstName} ${lastName}`.trim() },
        },
      });
      setLoading(form, false);

      if (error) {
        showFeedback('signup-feedback', error.message, 'error');
        return;
      }

      showFeedback(
        'signup-feedback',
        'Compte créé ! Vérifiez vos emails pour confirmer puis choisissez votre rôle après connexion.',
        'success'
      );
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wirePasswordToggles();
    handleLogin();
    handleSignup();
  });
})();
