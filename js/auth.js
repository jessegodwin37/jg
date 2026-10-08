/* =========================================================
   JG AUTHENTICATION
   ========================================================= */

(function () {

  "use strict";


  const supabase =
    window.JG_SUPABASE;


  const UI =
    window.JG_UI;


  const Auth = {


    /* -----------------------------------------------------
       CURRENT USER
       ----------------------------------------------------- */

    async getUser() {

      if (!supabase) {
        return null;
      }


      try {

        const {
          data,
          error
        } =
          await supabase.auth.getUser();


        if (error) {

          console.warn(
            "JG auth user error:",
            error
          );

          return null;

        }


        return data?.user || null;

      } catch (error) {

        console.error(
          "JG getUser failed:",
          error
        );

        return null;

      }

    },


    /* -----------------------------------------------------
       CURRENT SESSION
       ----------------------------------------------------- */

    async getSession() {

      if (!supabase) {
        return null;
      }


      try {

        const {
          data,
          error
        } =
          await supabase.auth.getSession();


        if (error) {
          return null;
        }


        return data?.session || null;

      } catch {

        return null;

      }

    },


    /* -----------------------------------------------------
       SIGN UP
       ----------------------------------------------------- */

    async signUp({
      email,
      password,
      displayName = ""
    }) {

      if (!supabase) {

        return {
          success: false,
          error: "Authentication is unavailable."
        };

      }


      if (!email || !password) {

        return {
          success: false,
          error:
            "Email and password are required."
        };

      }


      try {

        const {
          data,
          error
        } =
          await supabase.auth.signUp({

            email: email.trim(),

            password,

            options: {

              data: {
                display_name:
                  displayName.trim()
              }

            }

          });


        if (error) {

          return {
            success: false,
            error: error.message
          };

        }


        return {
          success: true,
          data
        };

      } catch (error) {

        return {
          success: false,
          error:
            error.message ||
            "Unable to create account."
        };

      }

    },


    /* -----------------------------------------------------
       SIGN IN
       ----------------------------------------------------- */

    async signIn({
      email,
      password
    }) {

      if (!supabase) {

        return {
          success: false,
          error: "Authentication is unavailable."
        };

      }


      try {

        const {
          data,
          error
        } =
          await supabase.auth.signInWithPassword({

            email: email.trim(),

            password

          });


        if (error) {

          return {
            success: false,
            error: error.message
          };

        }


        return {
          success: true,
          data
        };

      } catch (error) {

        return {
          success: false,
          error:
            error.message ||
            "Unable to sign in."
        };

      }

    },


    /* -----------------------------------------------------
       SIGN OUT
       ----------------------------------------------------- */

    async signOut() {

      if (!supabase) {
        return false;
      }


      try {

        const {
          error
        } =
          await supabase.auth.signOut();


        if (error) {

          UI?.toast(
            error.message,
            "error"
          );

          return false;

        }


        return true;

      } catch (error) {

        UI?.toast(
          "Unable to sign out.",
          "error"
        );

        return false;

      }

    },


    /* -----------------------------------------------------
       REQUIRE AUTH
       ----------------------------------------------------- */

    async requireAuth() {

      const user =
        await Auth.getUser();


      if (!user) {

        const current =
          window.location.pathname
            .split("/")
            .pop();


        const next =
          encodeURIComponent(
            current || "account.html"
          );


        window.location.href =
          `login.html?next=${next}`;


        return null;

      }


      return user;

    },


    /* -----------------------------------------------------
       AUTH STATE
       ----------------------------------------------------- */

    onAuthStateChange(
      callback
    ) {

      if (!supabase) {
        return null;
      }


      return supabase.auth.onAuthStateChange(
        (event, session) => {

          if (
            typeof callback ===
            "function"
          ) {

            callback(
              event,
              session
            );

          }

        }
      );

    },


    /* -----------------------------------------------------
       USER DISPLAY NAME
       ----------------------------------------------------- */

    getDisplayName(user) {

      if (!user) {
        return "Guest";
      }


      return (
        user.user_metadata
          ?.display_name ||
        user.user_metadata
          ?.full_name ||
        user.email?.split("@")[0] ||
        "JG Member"
      );

    },


    /* -----------------------------------------------------
       AUTH PAGE GUARD
       ----------------------------------------------------- */

    async redirectIfAuthenticated() {

      const user =
        await Auth.getUser();


      if (!user) {
        return false;
      }


      const page =
        window.location.pathname
          .split("/")
          .pop();


      if (
        page === "login.html" ||
        page === "signup.html"
      ) {

        window.location.href =
          "account.html";

        return true;

      }


      return false;

    }


  };


  window.JG_AUTH =
    Auth;


})();
