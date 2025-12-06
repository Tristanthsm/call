// Utilitaire global pour créer une instance unique de Supabase
// Ce singleton garantit qu'une seule instance est créée, évitant les conflits "Multiple GoTrueClient instances"

(function() {
  let supabaseInstance = null;
  const INSTANCE_KEY = '__NEXBUZZER_SUPABASE_INSTANCE__';

  function getSupabaseClient() {
    // Si une instance existe déjà dans window, la réutiliser
    if (window[INSTANCE_KEY]) {
      return window[INSTANCE_KEY];
    }

    // Si une instance locale existe déjà, la réutiliser
    if (supabaseInstance) {
      window[INSTANCE_KEY] = supabaseInstance;
      return supabaseInstance;
    }

    // Vérifier que les dépendances sont disponibles
    if (!window.supabase) {
      console.error('Supabase SDK non chargé. Assurez-vous que le script Supabase est inclus avant ce fichier.');
      return null;
    }

    const SUPABASE_URL = window.SUPABASE_URL;
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('SUPABASE_URL et SUPABASE_ANON_KEY doivent être définis dans window.');
      return null;
    }

    // Créer une seule instance
    supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window[INSTANCE_KEY] = supabaseInstance;

    return supabaseInstance;
  }

  // Exposer la fonction globalement
  window.getSupabaseClient = getSupabaseClient;
})();

