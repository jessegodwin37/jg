/* =========================================================
   JG API / DATA LAYER
   ========================================================= */

(function () {

  "use strict";


  const supabase =
    window.JG_SUPABASE;


  const API = {


    /* -----------------------------------------------------
       GENERIC QUERY
       ----------------------------------------------------- */

    async query(
      table,
      options = {}
    ) {

      if (!supabase) {

        return {
          data: null,
          error:
            new Error(
              "Supabase is unavailable."
            )
        };

      }


      try {

        let query =
          supabase
            .from(table)
            .select(
              options.select || "*"
            );


        if (
          typeof options.eq ===
          "object"
        ) {

          Object.entries(
            options.eq
          ).forEach(
            ([column, value]) => {

              query =
                query.eq(
                  column,
                  value
                );

            }
          );

        }


        if (options.order) {

          query =
            query.order(
              options.order.column,
              {
                ascending:
                  options.order.ascending !== false
              }
            );

        }


        if (
          Number.isInteger(
            options.limit
          )
        ) {

          query =
            query.limit(
              options.limit
            );

        }


        if (
          Number.isInteger(
            options.from
          ) &&
          Number.isInteger(
            options.to
          )
        ) {

          query =
            query.range(
              options.from,
              options.to
            );

        }


        return await query;

      } catch (error) {

        return {
          data: null,
          error
        };

      }

    },


    /* -----------------------------------------------------
       COURSES
       ----------------------------------------------------- */

    async getCourses() {

      return API.query(
        "courses",
        {
          select: "*",

          order: {
            column: "created_at",
            ascending: false
          }
        }
      );

    },


    async getCourse(id) {

      if (!id) {

        return {
          data: null,
          error:
            new Error(
              "Course ID is required."
            )
        };

      }


      return API.query(
        "courses",
        {
          select: "*",

          eq: {
            id
          },

          limit: 1
        }
      );

    },


    /* -----------------------------------------------------
       LESSONS
       ----------------------------------------------------- */

    async getLessons(courseId) {

      if (!courseId) {

        return {
          data: [],
          error: null
        };

      }


      return API.query(
        "lessons",
        {
          select: "*",

          eq: {
            course_id: courseId
          },

          order: {
            column: "lesson_number",
            ascending: true
          }
        }
      );

    },


    async getLesson(id) {

      return API.query(
        "lessons",
        {
          select: "*",

          eq: {
            id
          },

          limit: 1
        }
      );

    },


    /* -----------------------------------------------------
       SKILLS
       ----------------------------------------------------- */

    async getSkills() {

      return API.query(
        "skills",
        {
          select: "*",

          order: {
            column: "name",
            ascending: true
          }
        }
      );

    },


    /* -----------------------------------------------------
       OPPORTUNITIES
       ----------------------------------------------------- */

    async getOpportunities() {

      return API.query(
        "opportunities",
        {
          select: "*",

          order: {
            column: "created_at",
            ascending: false
          }
        }
      );

    },


    /* -----------------------------------------------------
       USER PROFILE
       ----------------------------------------------------- */

    async getProfile(userId) {

      if (!userId) {

        return {
          data: null,
          error:
            new Error(
              "User ID is required."
            )
        };

      }


      return API.query(
        "profiles",
        {
          select: "*",

          eq: {
            id: userId
          },

          limit: 1
        }
      );

    },


    /* -----------------------------------------------------
       LEARNING PROGRESS
       ----------------------------------------------------- */

    async getProgress(userId) {

      if (!userId) {

        return {
          data: [],
          error: null
        };

      }


      return API.query(
        "lesson_progress",
        {
          select: "*",

          eq: {
            user_id: userId
          },

          order: {
            column: "updated_at",
            ascending: false
          }
        }
      );

    },


    async saveProgress({
      userId,
      lessonId,
      courseId,
      completed = false,
      progress = 0
    }) {

      if (!supabase) {

        return {
          data: null,
          error:
            new Error(
              "Supabase is unavailable."
            )
        };

      }


      try {

        return await supabase
          .from("lesson_progress")
          .upsert(
            {
              user_id: userId,

              lesson_id: lessonId,

              course_id: courseId,

              completed,

              progress,

              updated_at:
                new Date().toISOString()
            },
            {
              onConflict:
                "user_id,lesson_id"
            }
          )
          .select()
          .single();

      } catch (error) {

        return {
          data: null,
          error
        };

      }

    },


    /* -----------------------------------------------------
       CERTIFICATE
       ----------------------------------------------------- */

    async verifyCertificate(
      certificateId
    ) {

      if (!supabase) {

        return {
          data: null,
          error:
            new Error(
              "Verification service unavailable."
            )
        };

      }


      try {

        return await supabase
          .from("certificates")
          .select("*")
          .eq(
            "certificate_id",
            certificateId
          )
          .maybeSingle();

      } catch (error) {

        return {
          data: null,
          error
        };

      }

    },


    /* -----------------------------------------------------
       PREMIUM STATUS
       ----------------------------------------------------- */

    async getPremiumStatus(
      userId
    ) {

      if (!supabase || !userId) {

        return {
          data: null,
          error: null
        };

      }


      try {

        return await supabase
          .from("subscriptions")
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .eq(
            "status",
            "active"
          )
          .maybeSingle();

      } catch (error) {

        return {
          data: null,
          error
        };

      }

    }


  };


  window.JG_API =
    API;


})();
