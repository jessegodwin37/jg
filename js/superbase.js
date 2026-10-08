/* =========================================================
   JG SUPABASE CLIENT
   ========================================================= */

(function () {

  "use strict";


  if (!window.JG_CONFIG) {

    console.error(
      "JG_CONFIG is missing."
    );

    return;

  }


  function createClient() {

    if (
      typeof window.supabase ===
      "undefined"
    ) {

      console.error(
        "Supabase library has not loaded."
      );

      return null;

    }


    try {

      return window.supabase.createClient(

        window.JG_CONFIG.SUPABASE_URL,

        window.JG_CONFIG.SUPABASE_ANON_KEY,

        {
          auth: {

            persistSession: true,

            autoRefreshToken: true,

            detectSessionInUrl: true

          }
        }

      );

    } catch (error) {

      console.error(
        "Unable to create Supabase client:",
        error
      );

      return null;

    }

  }


  window.JG_SUPABASE =
    createClient();


})();
