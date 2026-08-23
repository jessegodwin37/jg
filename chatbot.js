/* =========================================================
   JG ASSISTANT
   Complete Website Chatbot
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const STORAGE_KEY = "jg_chat_history";

    const MAX_MESSAGES = 80;


    /* =====================================================
       WEBSITE LINKS
       ===================================================== */

    const pages = {

        home: "index.html",

        skills: "skills.html",

        learn: "learn.html",

        work: "work.html",

        enrollment: "enrollment.html",

        account: "account.html"

    };


    /* =====================================================
       CHATBOT KNOWLEDGE
       ===================================================== */

    const responses = [

        {
            keywords: [
                "hello",
                "hi",
                "hey",
                "good morning",
                "good afternoon",
                "good evening"
            ],

            response:
                "Hey! 👋 I'm JG Assistant. I can help you explore skills, learning paths, work opportunities and your JG journey."
        },


        {
            keywords: [
                "what is jg",
                "what's jg",
                "about jg",
                "tell me about jg"
            ],

            response:
                "JG is a platform built around a simple idea: Find Skills. Find Work. 🚀 You can explore digital skills, learn practical concepts, build projects and eventually use your skills to pursue opportunities."
        },


        {
            keywords: [
                "skills",
                "skill",
                "what can i learn",
                "courses",
                "course"
            ],

            response:
                "JG currently focuses on Web Development 💻, Graphic Design 🎨, Video Editing 🎬, Digital Marketing 📢, Social Media 📱 and Freelancing 💼."
        },


        {
            keywords: [
                "web development",
                "coding",
                "programming",
                "website",
                "web developer"
            ],

            response:
                "💻 Web Development is a great starting point if you want to learn how websites are created. JG's path introduces HTML, CSS and JavaScript before moving toward practical projects."
        },


        {
            keywords: [
                "graphic design",
                "design",
                "canva",
                "graphics"
            ],

            response:
                "🎨 Graphic Design is useful for creating flyers, social media graphics, branding and other visual content. Start by learning layout, typography, colour and visual hierarchy."
        },


        {
            keywords: [
                "video editing",
                "video",
                "editor",
                "capcut"
            ],

            response:
                "🎬 Video Editing teaches you how to turn raw clips into useful content. Start with cutting, arranging clips, audio, transitions and storytelling."
        },


        {
            keywords: [
                "digital marketing",
                "marketing",
                "advertising",
                "ads"
            ],

            response:
                "📢 Digital Marketing focuses on helping businesses reach the right audience through digital platforms, content and marketing strategy."
        },


        {
            keywords: [
                "social media",
                "instagram",
                "facebook",
                "tiktok",
                "content"
            ],

            response:
                "📱 Social Media teaches content planning, audience engagement, page management and digital growth."
        },


        {
            keywords: [
                "freelancing",
                "freelance",
                "clients",
                "client"
            ],

            response:
                "💼 Freelancing is about turning a useful skill into a service that solves a client's problem. Build your skill first, create examples of your work and then start looking for appropriate opportunities."
        },


        {
            keywords: [
                "learn",
                "learning",
                "lesson",
                "lessons",
                "study"
            ],

            response:
                "📚 You can visit the Learn page to explore JG's learning paths. A good strategy is to choose ONE skill, learn the fundamentals, practise and build projects."
        },


        {
            keywords: [
                "work",
                "job",
                "jobs",
                "opportunity",
                "opportunities"
            ],

            response:
                "💼 The Work page shows the kinds of opportunities you can pursue after developing useful skills. Remember: learning a skill doesn't automatically guarantee employment."
        },


        {
            keywords: [
                "enroll",
                "enrollment",
                "join",
                "register",
                "registration"
            ],

            response:
                "🎓 You can use the Enroll page to choose a skill and tell JG what you're working toward."
        },


        {
            keywords: [
                "account",
                "dashboard",
                "profile",
                "progress"
            ],

            response:
                "📊 Your JG Account page is designed to become your personal learning dashboard, where you can track your learning progress and continue your courses."
        },


        {
            keywords: [
                "how do i start",
                "where do i start",
                "start",
                "begin",
                "beginner"
            ],

            response:
                "🚀 Start simple: choose ONE skill → learn the basics → practise → build a project → improve → use the skill for opportunities."
        },


        {
            keywords: [
                "which skill",
                "best skill",
                "skill should i learn",
                "recommend a skill"
            ],

            response:
                "I can help you choose. 💡 If you enjoy technology, try Web Development. If you enjoy creativity, try Graphic Design or Video Editing. If you enjoy business and communication, try Digital Marketing or Social Media. If you want to turn an existing skill into a service, explore Freelancing."
        },


        {
            keywords: [
                "money",
                "earn",
                "make money",
                "income"
            ],

            response:
                "💰 A skill can create opportunities, but earning usually requires practice, useful work, communication and finding people who need the problem you can solve. JG focuses on building the skill first."
        },


        {
            keywords: [
                "free",
                "price",
                "cost",
                "payment",
                "pay"
            ],

            response:
                "For current JG pricing or payment information, use the official enrollment process rather than relying on information from the chatbot."
        },


        {
            keywords: [
                "help",
                "what can you do",
                "commands"
            ],

            response:
                "I can help with:\n\n📚 Learning paths\n💻 Web Development\n🎨 Graphic Design\n🎬 Video Editing\n📢 Digital Marketing\n📱 Social Media\n💼 Freelancing\n🎓 Enrollment\n📊 Account & progress\n🧭 Finding your way around JG"
        },


        {
            keywords: [
                "thank",
                "thanks",
                "thank you"
            ],

            response:
                "You're welcome! 😎 Keep building. One skill at a time."
        }

    ];


    /* =====================================================
       CREATE CHATBOT STYLES
       ===================================================== */

    function createStyles() {

        if (document.getElementById("jg-chatbot-styles")) {
            return;
        }


        const style = document.createElement("style");

        style.id = "jg-chatbot-styles";


        style.textContent = `

        /* ===============================================
           CHAT BUTTON
           =============================================== */

        .jg-chat-button {

            position: fixed;

            right: 20px;

            bottom: 20px;

            width: 62px;

            height: 62px;

            border: none;

            border-radius: 50%;

            background:
                linear-gradient(
                    135deg,
                    #38bdf8,
                    #2563eb
                );

            color: white;

            font-size: 27px;

            cursor: pointer;

            box-shadow:
                0 12px 35px rgba(0,0,0,.30);

            z-index: 99998;

            transition:
                transform .2s ease,
                box-shadow .2s ease;

        }


        .jg-chat-button:hover {

            transform: translateY(-4px);

            box-shadow:
                0 16px 40px rgba(0,0,0,.38);

        }


        .jg-chat-button:active {

            transform: scale(.94);

        }


        /* ===============================================
           CHAT WINDOW
           =============================================== */

        .jg-chat-window {

            position: fixed;

            right: 20px;

            bottom: 95px;

            width: min(
                390px,
                calc(100vw - 30px)
            );

            height: min(
                600px,
                calc(100vh - 125px)
            );

            display: none;

            flex-direction: column;

            overflow: hidden;

            background: #0b1220;

            border:
                1px solid rgba(255,255,255,.12);

            border-radius: 22px;

            box-shadow:
                0 25px 70px rgba(0,0,0,.50);

            z-index: 99999;

            color: #f8fafc;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;

        }


        .jg-chat-window.open {

            display: flex;

            animation:
                jgChatOpen .2s ease;

        }


        @keyframes jgChatOpen {

            from {

                opacity: 0;

                transform:
                    translateY(15px)
                    scale(.97);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        /* ===============================================
           HEADER
           =============================================== */

        .jg-chat-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 12px;

            padding: 17px;

            background:
                linear-gradient(
                    135deg,
                    #111c35,
                    #102a5c
                );

            border-bottom:
                1px solid rgba(255,255,255,.08);

        }


        .jg-chat-brand {

            display: flex;

            align-items: center;

            gap: 11px;

        }


        .jg-chat-avatar {

            width: 42px;

            height: 42px;

            display: grid;

            place-items: center;

            border-radius: 13px;

            background:
                linear-gradient(
                    135deg,
                    #38bdf8,
                    #2563eb
                );

            font-size: 21px;

        }


        .jg-chat-title {

            font-size: 15px;

            font-weight: 800;

        }


        .jg-chat-status {

            display: flex;

            align-items: center;

            gap: 5px;

            margin-top: 3px;

            color: #94a3b8;

            font-size: 11px;

        }


        .jg-online-dot {

            width: 7px;

            height: 7px;

            border-radius: 50%;

            background: #22c55e;

        }


        .jg-chat-actions {

            display: flex;

            gap: 5px;

        }


        .jg-chat-action {

            width: 34px;

            height: 34px;

            border: none;

            border-radius: 9px;

            background:
                rgba(255,255,255,.07);

            color: white;

            cursor: pointer;

            font-size: 15px;

        }


        /* ===============================================
           MESSAGES
           =============================================== */

        .jg-chat-messages {

            flex: 1;

            overflow-y: auto;

            padding: 17px;

            scroll-behavior: smooth;

        }


        .jg-message {

            display: flex;

            margin-bottom: 13px;

        }


        .jg-message.user {

            justify-content: flex-end;

        }


        .jg-message-content {

            max-width: 84%;

            padding: 11px 13px;

            border-radius: 15px;

            white-space: pre-line;

            font-size: 14px;

            line-height: 1.5;

        }


        .jg-message.bot
        .jg-message-content {

            background: #162238;

            border-bottom-left-radius: 5px;

            color: #e2e8f0;

        }


        .jg-message.user
        .jg-message-content {

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #38bdf8
                );

            color: white;

            border-bottom-right-radius: 5px;

        }


        .jg-message-time {

            display: block;

            margin-top: 5px;

            font-size: 9px;

            opacity: .55;

            text-align: right;

        }


        /* ===============================================
           QUICK QUESTIONS
           =============================================== */

        .jg-quick-area {

            display: flex;

            gap: 7px;

            overflow-x: auto;

            padding:
                0 14px 12px;

            scrollbar-width: none;

        }


        .jg-quick-area::-webkit-scrollbar {

            display: none;

        }


        .jg-quick-button {

            flex:
                0 0 auto;

            padding: 8px 11px;

            border:
                1px solid rgba(255,255,255,.13);

            border-radius: 20px;

            background: #111b2d;

            color: #cbd5e1;

            cursor: pointer;

            font-size: 11px;

        }


        .jg-quick-button:hover {

            border-color: #38bdf8;

            color: white;

        }


        /* ===============================================
           TYPING
           =============================================== */

        .jg-typing {

            display: none;

            align-items: center;

            gap: 4px;

            width: fit-content;

            margin-bottom: 12px;

            padding: 10px 13px;

            border-radius: 14px;

            background: #162238;

        }


        .jg-typing.show {

            display: flex;

        }


        .jg-typing span {

            width: 6px;

            height: 6px;

            border-radius: 50%;

            background: #94a3b8;

            animation:
                jgTyping 1s infinite;

        }


        .jg-typing span:nth-child(2) {

            animation-delay: .15s;

        }


        .jg-typing span:nth-child(3) {

            animation-delay: .30s;

        }


        @keyframes jgTyping {

            0%, 60%, 100% {

                transform: translateY(0);

                opacity: .45;

            }

            30% {

                transform: translateY(-4px);

                opacity: 1;

            }

        }


        /* ===============================================
           INPUT
           =============================================== */

        .jg-chat-input-area {

            display: flex;

            align-items: center;

            gap: 8px;

            padding: 12px;

            border-top:
                1px solid rgba(255,255,255,.08);

            background: #09111e;

        }


        .jg-chat-input {

            flex: 1;

            min-width: 0;

            height: 43px;

            padding:
                0 13px;

            border:
                1px solid rgba(255,255,255,.12);

            border-radius: 13px;

            outline: none;

            background: #111b2d;

            color: white;

            font-size: 14px;

        }


        .jg-chat-input::placeholder {

            color: #64748b;

        }


        .jg-chat-input:focus {

            border-color: #38bdf8;

        }


        .jg-chat-send {

            width: 43px;

            height: 43px;

            flex-shrink: 0;

            border: none;

            border-radius: 13px;

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #38bdf8
                );

            color: white;

            cursor: pointer;

            font-size: 18px;

        }


        /* ===============================================
           NAVIGATION BUTTONS IN CHAT
           =============================================== */

        .jg-chat-links {

            display: flex;

            flex-wrap: wrap;

            gap: 7px;

            margin-top: 9px;

        }


        .jg-chat-link {

            display: inline-block;

            padding: 7px 10px;

            border-radius: 9px;

            background:
                rgba(56,189,248,.10);

            border:
                1px solid rgba(56,189,248,.25);

            color: #7dd3fc;

            text-decoration: none;

            font-size: 11px;

        }


        /* ===============================================
           MOBILE
           =============================================== */

        @media (max-width: 600px) {

            .jg-chat-button {

                right: 15px;

                bottom: 15px;

                width: 57px;

                height: 57px;

            }


            .jg-chat-window {

                right: 10px;

                bottom: 82px;

                width:
                    calc(100vw - 20px);

                height:
                    min(
                        610px,
                        calc(100vh - 105px)
                    );

                border-radius: 18px;

            }

        }

        `;


        document.head.appendChild(style);

    }


    /* =====================================================
       CREATE CHATBOT HTML
       ===================================================== */

    function createChatbot() {

        if (document.getElementById("jgChatWindow")) {
            return;
        }


        const button = document.createElement("button");

        button.className = "jg-chat-button";

        button.id = "jgChatButton";

        button.setAttribute(
            "aria-label",
            "Open JG Assistant"
        );

        button.innerHTML = "🤖";


        const windowElement = document.createElement("div");

        windowElement.className = "jg-chat-window";

        windowElement.id = "jgChatWindow";


        windowElement.innerHTML = `

            <div class="jg-chat-header">

                <div class="jg-chat-brand">

                    <div class="jg-chat-avatar">
                        🤖
                    </div>

                    <div>

                        <div class="jg-chat-title">
                            JG Assistant
                        </div>

                        <div class="jg-chat-status">

                            <span class="jg-online-dot"></span>

                            Ready to help

                        </div>

                    </div>

                </div>


                <div class="jg-chat-actions">

                    <button
                        class="jg-chat-action"
                        id="jgClearChat"
                        title="Clear chat">

                        🗑️

                    </button>


                    <button
                        class="jg-chat-action"
                        id="jgCloseChat"
                        title="Close">

                        ✕

                    </button>

                </div>

            </div>


            <div
                class="jg-chat-messages"
                id="jgChatMessages">
            </div>


            <div
                class="jg-typing"
                id="jgTyping">

                <span></span>
                <span></span>
                <span></span>

            </div>


            <div
                class="jg-quick-area"
                id="jgQuickArea">

                <button
                    class="jg-quick-button"
                    data-question="What is JG?">

                    What is JG?

                </button>


                <button
                    class="jg-quick-button"
                    data-question="Which skill should I learn?">

                    Which skill?

                </button>


                <button
                    class="jg-quick-button"
                    data-question="How do I start learning?">

                    How do I start?

                </button>


                <button
                    class="jg-quick-button"
                    data-question="How can I find work?">

                    Find work

                </button>

            </div>


            <form
                class="jg-chat-input-area"
                id="jgChatForm">

                <input
                    class="jg-chat-input"
                    id="jgChatInput"
                    type="text"
                    autocomplete="off"
                    placeholder="Ask JG Assistant..."
                    aria-label="Chat message"
                >


                <button
                    class="jg-chat-send"
                    type="submit"
                    aria-label="Send">

                    ➤

                </button>

            </form>

        `;


        document.body.appendChild(button);

        document.body.appendChild(windowElement);


        setupEvents();

        loadHistory();

    }


    /* =====================================================
       TIME
       ===================================================== */

    function getTime() {

        return new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* =====================================================
       ADD MESSAGE
       ===================================================== */

    function addMessage(
        text,
        sender = "bot",
        save = true,
        links = []
    ) {

        const container =
            document.getElementById(
                "jgChatMessages"
            );


        if (!container) {
            return;
        }


        const message =
            document.createElement("div");


        message.className =
            `jg-message ${sender}`;


        const content =
            document.createElement("div");


        content.className =
            "jg-message-content";


        content.textContent = text;


        const time =
            document.createElement("span");


        time.className =
            "jg-message-time";


        time.textContent =
            getTime();


        content.appendChild(time);


        if (links.length > 0) {

            const linkContainer =
                document.createElement("div");


            linkContainer.className =
                "jg-chat-links";


            links.forEach(link => {

                const anchor =
                    document.createElement("a");


                anchor.className =
                    "jg-chat-link";


                anchor.href =
                    link.url;


                anchor.textContent =
                    link.label;


                linkContainer.appendChild(anchor);

            });


            content.appendChild(linkContainer);

        }


        message.appendChild(content);

        container.appendChild(message);


        container.scrollTop =
            container.scrollHeight;


        if (save) {

            saveMessage(
                text,
                sender
            );

        }

    }


    /* =====================================================
       SAVE CHAT
       ===================================================== */

    function saveMessage(text, sender) {

        try {

            let history =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    ) || "[]"
                );


            history.push({

                text: text,

                sender: sender,

                time: Date.now()

            });


            if (
                history.length >
                MAX_MESSAGES
            ) {

                history =
                    history.slice(
                        -MAX_MESSAGES
                    );

            }


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(history)
            );

        } catch (error) {

            console.warn(
                "JG chatbot storage error:",
                error
            );

        }

    }


    /* =====================================================
       LOAD HISTORY
       ===================================================== */

    function loadHistory() {

        try {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    ) || "[]"
                );


            if (history.length === 0) {

                showWelcome();

                return;

            }


            history.forEach(message => {

                addMessage(
                    message.text,
                    message.sender,
                    false
                );

            });

        } catch (error) {

            showWelcome();

        }

    }


    /* =====================================================
       WELCOME
       ===================================================== */

    function showWelcome() {

        addMessage(
            "Hey! 👋 I'm JG Assistant. Welcome to JG. Ask me about skills, learning, work, enrollment or how to get started."
        );

    }


    /* =====================================================
       CLEAR CHAT
       ===================================================== */

    function clearChat() {

        localStorage.removeItem(
            STORAGE_KEY
        );


        const messages =
            document.getElementById(
                "jgChatMessages"
            );


        messages.innerHTML = "";


        showWelcome();

    }


    /* =====================================================
       FIND RESPONSE
       ===================================================== */

    function findResponse(message) {

        const text =
            message
                .toLowerCase()
                .trim();


        for (
            const item of responses
        ) {

            for (
                const keyword of item.keywords
            ) {

                if (
                    text.includes(
                        keyword
                    )
                ) {

                    return item.response;

                }

            }

        }


        return null;

    }


    /* =====================================================
       LINKS BASED ON QUESTION
       ===================================================== */

    function getLinks(message) {

        const text =
            message.toLowerCase();


        if (
            text.includes("skill") ||
            text.includes("course")
        ) {

            return [

                {
                    label: "Explore Skills",
                    url: pages.skills
                },

                {
                    label: "Start Learning",
                    url: pages.learn
                }

            ];

        }


        if (
            text.includes("learn") ||
            text.includes("lesson")
        ) {

            return [

                {
                    label: "Open Learn",
                    url: pages.learn
                }

            ];

        }


        if (
            text.includes("work") ||
            text.includes("job") ||
            text.includes("opportunity")
        ) {

            return [

                {
                    label: "Explore Work",
                    url: pages.work
                }

            ];

        }


        if (
            text.includes("enroll") ||
            text.includes("join") ||
            text.includes("register")
        ) {

            return [

                {
                    label: "Enroll",
                    url: pages.enrollment
                }

            ];

        }


        if (
            text.includes("account") ||
            text.includes("progress")
        ) {

            return [

                {
                    label: "My Account",
                    url: pages.account
                }

            ];

        }


        return [];

    }


    /* =====================================================
       SMART FALLBACK
       ===================================================== */

    function getFallback(message) {

        const text =
            message.toLowerCase();


        if (
            text.includes("html") ||
            text.includes("css") ||
            text.includes("javascript")
        ) {

            return "💻 Those are core Web Development technologies. HTML handles structure, CSS handles presentation and JavaScript adds behaviour and interaction.";

        }


        if (
            text.includes("phone") ||
            text.includes("mobile")
        ) {

            return "📱 JG is designed to work across modern mobile and desktop browsers. You can explore the learning pages directly from your phone.";

        }


        if (
            text.includes("project") ||
            text.includes("portfolio")
        ) {

            return "🚀 Projects are important because they demonstrate what you can actually do. Try building small projects as you learn instead of only reading lessons.";

        }


        if (
            text.includes("how long") ||
            text.includes("time")
        ) {

            return "⏱️ Your learning speed depends on the skill and how consistently you practise. Focus on understanding and building rather than rushing through lessons.";

        }


        return "I'm still learning about that part of JG. 🤖 Try asking me about our skills, learning paths, work opportunities, enrollment or how to get started.";

    }


    /* =====================================================
       RESPONSE ENGINE
       ===================================================== */

    function answerQuestion(message) {

        const response =
            findResponse(message) ||
            getFallback(message);


        const links =
            getLinks(message);


        const typing =
            document.getElementById(
                "jgTyping"
            );


        typing.classList.add("show");


        setTimeout(() => {

            typing.classList.remove(
                "show"
            );


            addMessage(
                response,
                "bot",
                true,
                links
            );

        }, 650);

    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    function sendMessage(message) {

        const clean =
            message.trim();


        if (!clean) {
            return;
        }


        addMessage(
            clean,
            "user"
        );


        answerQuestion(
            clean
        );

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function setupEvents() {

        const button =
            document.getElementById(
                "jgChatButton"
            );


        const windowElement =
            document.getElementById(
                "jgChatWindow"
            );


        const close =
            document.getElementById(
                "jgCloseChat"
            );


        const clear =
            document.getElementById(
                "jgClearChat"
            );


        const form =
            document.getElementById(
                "jgChatForm"
            );


        const input =
            document.getElementById(
                "jgChatInput"
            );


        button.addEventListener(
            "click",
            () => {

                windowElement.classList.toggle(
                    "open"
                );


                if (
                    windowElement.classList.contains(
                        "open"
                    )
                ) {

                    setTimeout(
                        () => input.focus(),
                        100
                    );

                }

            }
        );


        close.addEventListener(
            "click",
            () => {

                windowElement.classList.remove(
                    "open"
                );

            }
        );


        clear.addEventListener(
            "click",
            clearChat
        );


        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                sendMessage(
                    input.value
                );


                input.value = "";

            }
        );


        document
            .querySelectorAll(
                ".jg-quick-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        sendMessage(
                            button.dataset.question
                        );

                    }
                );

            });


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    windowElement.classList.remove(
                        "open"
                    );

                }

            }
        );

    }


    /* =====================================================
       START
       ===================================================== */

    function init() {

        createStyles();

        createChatbot();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();
