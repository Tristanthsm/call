(() => {
  // Utiliser l'instance unique de Supabase via le singleton global
  const supabaseClient = window.getSupabaseClient ? window.getSupabaseClient() : null;
  
  if (!supabaseClient) {
    console.warn('Impossible de créer le client Supabase. Vérifiez que supabase-client.js est chargé avant auth.js.');
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
        showFeedback('login-feedback', 'Configuration Supabase manquante. Veuillez recharger la page.', 'error');
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
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      
      if (error) {
        setLoading(form, false);
        showFeedback('login-feedback', error.message, 'error');
        return;
      }

      // Vérifier que la session est bien créée après la connexion
      if (!data.session) {
        // Si la session n'est pas dans la réponse, attendre un peu et vérifier
        await new Promise((resolve) => setTimeout(resolve, 100));
        const { data: sessionData } = await supabaseClient.auth.getSession();
        if (!sessionData.session) {
          setLoading(form, false);
          showFeedback('login-feedback', 'Erreur lors de la création de la session. Veuillez réessayer.', 'error');
          return;
        }
      }

      // Vérifier que la session est bien persistée avant de rediriger
      // La session devrait être dans data.session après signInWithPassword
      const sessionToVerify = data.session;
      
      if (!sessionToVerify) {
        setLoading(form, false);
        showFeedback('login-feedback', 'Erreur : la session n\'a pas été créée. Veuillez réessayer.', 'error');
        return;
      }

      showFeedback('login-feedback', 'Connexion réussie. Redirection en cours...', 'success');
      
      // Forcer la persistance de la session en faisant une vérification
      // Attendre que la session soit bien sauvegardée dans le localStorage
      let sessionPersisted = false;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const { data: sessionCheck } = await supabaseClient.auth.getSession();
        if (sessionCheck.session && sessionCheck.session.access_token === sessionToVerify.access_token) {
          sessionPersisted = true;
          break;
        }
      }
      
      if (!sessionPersisted) {
        setLoading(form, false);
        showFeedback('login-feedback', 'La session n\'a pas pu être sauvegardée. Veuillez réessayer.', 'error');
        return;
      }

      // Rediriger vers la page d'accueil
      setLoading(form, false);
      // Utiliser replace avec un paramètre pour forcer la détection de la session
      window.location.replace('/?login=success');
    });
  }

  function handleSignup() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!supabaseClient) {
        showFeedback('signup-feedback', 'Configuration Supabase manquante. Veuillez recharger la page.', 'error');
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
