/* =====================================================
   JG AI CHATBOT
   Professional JG-style chatbot
===================================================== */

(function () {

    /* =========================
       CHATBOT HTML
    ========================= */

    const chatbotHTML = `

    <button id="jgChatButton" aria-label="Open JG Assistant">

        <div class="jg-chat-icon">
            💬
        </div>

        <span>JG Assistant</span>

    </button>


    <div id="jgChatWindow">

        <!-- HEADER -->

        <div class="jg-chat-header">

            <div class="jg-bot-profile">

                <div class="jg-bot-avatar">
                    JG
                </div>

                <div>

                    <strong>JG Assistant</strong>

                    <small>
                        ● Online
                    </small>

                </div>

            </div>


            <button
                id="jgCloseChat"
                aria-label="Close chatbot">

                ×

            </button>

        </div>


        <!-- WELCOME -->

        <div id="jgMessages"
             class="jg-messages">

            <div class="jg-message bot">

                <div class="jg-message-avatar">
                    JG
                </div>

                <div class="jg-message-content">

                    <div class="jg-message-bubble">

                        👋 Hey! Welcome to <strong>JG</strong>.

                        <br><br>

                        I'm your JG Assistant. I can help you
                        choose a skill, understand our courses,
                        learn how enrollment works, and answer
                        questions about JG.

                    </div>

                    <span class="jg-time">
                        Just now
                    </span>

                </div>

            </div>


            <!-- QUICK QUESTIONS -->

            <div class="jg-quick-title">
                What would you like to know?
            </div>


            <div class="jg-quick-buttons">

                <button
                    data-question="What skills can I learn?">

                    🎓
                    <span>Skills I can learn</span>

                </button>


                <button
                    data-question="How much are the courses?">

                    💰
                    <span>Course prices</span>

                </button>


                <button
                    data-question="How do I enroll?">

                    📝
                    <span>How to enroll</span>

                </button>


                <button
                    data-question="How can I pay?">

                    💳
                    <span>Payment methods</span>

                </button>

            </div>

        </div>


        <!-- TYPING -->

        <div
            id="jgTyping"
            class="jg-typing">

            <span></span>
            <span></span>
            <span></span>

            JG Assistant is typing...

        </div>


        <!-- INPUT -->

        <div class="jg-chat-input-area">

            <input
                type="text"
                id="jgChatInput"
                placeholder="Ask JG Assistant..."
                autocomplete="off"
            >

            <button
                id="jgSendButton"
                aria-label="Send message">

                ➤

            </button>

        </div>


        <div class="jg-chat-footer">

            Powered by <strong>JG</strong>

        </div>

    </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        chatbotHTML
    );


    /* =========================
       CHATBOT CSS
    ========================= */

    const chatbotCSS = `

    #jgChatButton,
    #jgChatWindow,
    #jgChatWindow * {
        box-sizing: border-box;
    }


    /* FLOATING BUTTON */

    #jgChatButton {

        position: fixed;

        right: 22px;

        bottom: 22px;

        z-index: 9999;

        display: flex;

        align-items: center;

        gap: 10px;

        border: none;

        padding: 9px 16px 9px 9px;

        border-radius: 50px;

        background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

        color: white;

        font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

        font-size: 13px;

        font-weight: 800;

        cursor: pointer;

        box-shadow:
        0 12px 35px
        rgba(37,99,235,.28);

        transition:
        transform .2s ease,
        box-shadow .2s ease;

    }


    #jgChatButton:hover {

        transform:
        translateY(-3px);

        box-shadow:
        0 17px 40px
        rgba(37,99,235,.35);

    }


    .jg-chat-icon {

        width: 39px;

        height: 39px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 50%;

        background: white;

        color: #2563eb;

        font-size: 18px;

    }


    /* CHAT WINDOW */

    #jgChatWindow {

        position: fixed;

        right: 22px;

        bottom: 88px;

        z-index: 9998;

        width: 375px;

        max-width:
        calc(100vw - 28px);

        height: 600px;

        max-height:
        calc(100vh - 110px);

        display: none;

        flex-direction: column;

        overflow: hidden;

        background: #ffffff;

        border:
        1px solid #e2e8f0;

        border-radius: 22px;

        box-shadow:
        0 30px 80px
        rgba(15,23,42,.20);

        font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

        animation:
        jgChatOpen .22s ease;

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


    /* HEADER */

    .jg-chat-header {

        display: flex;

        align-items: center;

        justify-content: space-between;

        padding: 16px 17px;

        background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

        color: white;

    }


    .jg-bot-profile {

        display: flex;

        align-items: center;

        gap: 11px;

    }


    .jg-bot-avatar {

        width: 43px;

        height: 43px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 13px;

        background: white;

        color: #2563eb;

        font-size: 13px;

        font-weight: 1000;

        box-shadow:
        0 5px 15px
        rgba(0,0,0,.12);

    }


    .jg-bot-profile strong {

        display: block;

        font-size: 14px;

    }


    .jg-bot-profile small {

        display: block;

        margin-top: 2px;

        font-size: 11px;

        opacity: .9;

    }


    .jg-chat-header button {

        width: 35px;

        height: 35px;

        border: none;

        border-radius: 9px;

        background:
        rgba(255,255,255,.14);

        color: white;

        font-size: 24px;

        line-height: 1;

        cursor: pointer;

    }


    /* MESSAGES */

    .jg-messages {

        flex: 1;

        overflow-y: auto;

        padding: 20px 15px;

        background:
        linear-gradient(
            180deg,
            #f8fafc,
            #ffffff
        );

        scroll-behavior: smooth;

    }


    .jg-message {

        display: flex;

        align-items: flex-start;

        gap: 8px;

        margin-bottom: 17px;

    }


    .jg-message-avatar {

        width: 29px;

        height: 29px;

        flex-shrink: 0;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 9px;

        background: #dbeafe;

        color: #2563eb;

        font-size: 9px;

        font-weight: 1000;

    }


    .jg-message-content {

        max-width: 84%;

    }


    .jg-message-bubble {

        padding: 11px 13px;

        border-radius:
        5px 15px 15px 15px;

        background: white;

        border:
        1px solid #e2e8f0;

        color: #334155;

        font-size: 13px;

        line-height: 1.55;

        box-shadow:
        0 3px 12px
        rgba(15,23,42,.04);

    }


    .jg-time {

        display: block;

        margin-top: 4px;

        color: #94a3b8;

        font-size: 9px;

    }


    /* USER MESSAGE */

    .jg-message.user {

        justify-content: flex-end;

    }


    .jg-message.user
    .jg-message-content {

        max-width: 82%;

    }


    .jg-message.user
    .jg-message-bubble {

        border: none;

        border-radius:
        15px 5px 15px 15px;

        background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

        color: white;

    }


    .jg-message.user
    .jg-time {

        text-align: right;

    }


    /* QUICK QUESTIONS */

    .jg-quick-title {

        margin:
        10px 0 10px 37px;

        color: #64748b;

        font-size: 11px;

        font-weight: 800;

    }


    .jg-quick-buttons {

        display: grid;

        grid-template-columns:
        1fr 1fr;

        gap: 8px;

        margin-left: 37px;

    }


    .jg-quick-buttons button {

        display: flex;

        align-items: center;

        gap: 7px;

        min-height: 47px;

        padding: 8px 9px;

        border:
        1px solid #e2e8f0;

        border-radius: 10px;

        background: white;

        color: #334155;

        font-size: 10px;

        font-weight: 700;

        text-align: left;

        cursor: pointer;

        transition: .18s;

    }


    .jg-quick-buttons button:hover {

        border-color: #93c5fd;

        background: #eff6ff;

        color: #1d4ed8;

    }


    .jg-quick-buttons button:first-letter {

        font-size: 16px;

    }


    /* TYPING */

    .jg-typing {

        display: none;

        align-items: center;

        gap: 4px;

        padding:
        7px 17px;

        background: #ffffff;

        color: #94a3b8;

        font-size: 9px;

    }


    .jg-typing span {

        width: 5px;

        height: 5px;

        border-radius: 50%;

        background: #2563eb;

        animation:
        jgTyping 1s infinite;

    }


    .jg-typing span:nth-child(2) {

        animation-delay:
        .15s;

    }


    .jg-typing span:nth-child(3) {

        animation-delay:
        .3s;

    }


    @keyframes jgTyping {

        0%, 60%, 100% {

            transform:translateY(0);

            opacity:.35;

        }

        30% {

            transform:
            translateY(-3px);

            opacity:1;

        }

    }


    /* INPUT */

    .jg-chat-input-area {

        display: flex;

        align-items: center;

        gap: 8px;

        padding:
        11px 12px;

        border-top:
        1px solid #e5e7eb;

        background: white;

    }


    #jgChatInput {

        flex: 1;

        min-width: 0;

        height: 43px;

        padding:
        0 13px;

        border:
        1px solid #e2e8f0;

        border-radius: 11px;

        outline: none;

        background: #f8fafc;

        color: #111827;

        font-size: 13px;

        font-family: inherit;

    }


    #jgChatInput:focus {

        border-color:
        #93c5fd;

        background: white;

        box-shadow:
        0 0 0 3px
        rgba(37,99,235,.08);

    }


    #jgSendButton {

        width: 43px;

        height: 43px;

        flex-shrink: 0;

        border: none;

        border-radius: 11px;

        background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

        color: white;

        font-size: 17px;

        cursor: pointer;

        transition: .18s;

    }


    #jgSendButton:hover {

        transform:
        translateY(-1px);

    }


    /* FOOTER */

    .jg-chat-footer {

        padding:
        7px;

        text-align: center;

        background: #f8fafc;

        color: #94a3b8;

        font-size: 9px;

        border-top:
        1px solid #f1f5f9;

    }


    /* MOBILE */

    @media(max-width:500px) {

        #jgChatButton {

            right: 15px;

            bottom: 15px;

        }


        #jgChatButton span {

            display: none;

        }


        #jgChatButton {

            width: 55px;

            height: 55px;

            padding: 7px;

            justify-content: center;

        }


        .jg-chat-icon {

            width: 41px;

            height: 41px;

        }


        #jgChatWindow {

            right: 10px;

            bottom: 80px;

            width:
            calc(100vw - 20px);

            height:
            min(620px, calc(100vh - 100px));

            border-radius: 20px;

        }

    }

    `;


    const style =
    document.createElement("style");

    style.textContent =
    chatbotCSS;

    document.head.appendChild(style);


    /* =========================
       ELEMENTS
    ========================= */

    const chatButton =
    document.getElementById(
        "jgChatButton"
    );

    const chatWindow =
    document.getElementById(
        "jgChatWindow"
    );

    const closeButton =
    document.getElementById(
        "jgCloseChat"
    );

    const input =
    document.getElementById(
        "jgChatInput"
    );

    const sendButton =
    document.getElementById(
        "jgSendButton"
    );

    const messages =
    document.getElementById(
        "jgMessages"
    );

    const typing =
    document.getElementById(
        "jgTyping"
    );


    /* =========================
       OPEN / CLOSE
    ========================= */

    chatButton.addEventListener(
        "click",
        function () {

            chatWindow.style.display =
                "flex";

            chatButton.style.display =
                "none";

            setTimeout(
                () => input.focus(),
                200
            );

        }
    );


    closeButton.addEventListener(
        "click",
        function () {

            chatWindow.style.display =
                "none";

            chatButton.style.display =
                "flex";

        }
    );


    /* =========================
       ADD MESSAGE
    ========================= */

    function addMessage(
        text,
        type = "bot"
    ) {

        const message =
        document.createElement("div");

        message.className =
            "jg-message " + type;


        if(type === "bot") {

            message.innerHTML = `

                <div class="jg-message-avatar">
                    JG
                </div>

                <div class="jg-message-content">

                    <div class="jg-message-bubble">
                        ${text}
                    </div>

                    <span class="jg-time">
                        Just now
                    </span>

                </div>

            `;

        } else {

            message.innerHTML = `

                <div class="jg-message-content">

                    <div class="jg-message-bubble">
                        ${text}
                    </div>

                    <span class="jg-time">
                        Just now
                    </span>

                </div>

            `;

        }


        messages.appendChild(message);

        messages.scrollTop =
            messages.scrollHeight;

    }


    /* =========================
       BOT RESPONSE
    ========================= */

    function getBotResponse(message) {

        const text =
            message.toLowerCase();


        if(
            text.includes("skill") ||
            text.includes("learn")
        ) {

            return `
                JG currently offers practical
                learning paths such as
                <strong>Web Development</strong>,
                <strong>Graphic Design</strong>,
                <strong>Video Editing</strong>,
                <strong>Python Programming</strong>
                and more.
                <br><br>
                Visit the <strong>Learn</strong>
                page to see the available courses.
            `;

        }


        if(
            text.includes("price") ||
            text.includes("cost") ||
            text.includes("how much")
        ) {

            return `
                Course prices depend on the
                skill you choose.
                <br><br>
                You can view the exact price
                for each course on the
                <strong>Learn</strong> page.
            `;

        }


        if(
            text.includes("enroll") ||
            text.includes("register")
        ) {

            return `
                Enrolling is simple.
                <br><br>
                1️⃣ Choose your course.<br>
                2️⃣ Enter your details.<br>
                3️⃣ Select your payment method.<br>
                4️⃣ Complete your payment.<br>
                5️⃣ Submit your enrollment.
                <br><br>
                You can start from the
                <strong>Enroll</strong> page.
            `;

        }


        if(
            text.includes("pay") ||
            text.includes("payment") ||
            text.includes("transfer") ||
            text.includes("opay")
        ) {

            return `
                JG currently accepts
                <strong>OPay / bank transfer</strong>.
                <br><br>
                Your enrollment page will show
                the payment details and the
                amount for your selected course.
            `;

        }


        if(
            text.includes("contact") ||
            text.includes("help")
        ) {

            return `
                I'm here to help you with
                JG courses, enrollment,
                payment and learning.
                <br><br>
                Tell me what you need help with
                and I'll guide you.
            `;

        }


        if(
            text.includes("web") ||
            text.includes("coding")
        ) {

            return `
                Web Development is a great
                skill if you want to build
                websites and web applications.
                <br><br>
                You can learn HTML, CSS,
                JavaScript and more through
                the JG learning platform.
            `;

        }


        if(
            text.includes("graphic") ||
            text.includes("design")
        ) {

            return `
                Graphic Design is perfect if
                you want to create professional
                social media designs, flyers,
                logos and other visual content.
                <br><br>
                Check the JG learning page
                for the available course.
            `;

        }


        if(
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {

            return `
                Hey 👋
                <br><br>
                Welcome to <strong>JG</strong>.
                How can I help you today?
            `;

        }


        return `
            That's a good question.
            <br><br>
            I can help with <strong>JG courses,
            skills, prices, enrollment,
            payment and learning.</strong>
            <br><br>
            Try asking:
            <br>
            • What skills can I learn?<br>
            • How much are the courses?<br>
            • How do I enroll?<br>
            • How can I pay?
        `;

    }


    /* =========================
       SEND MESSAGE
    ========================= */

    function sendMessage() {

        const text =
            input.value.trim();


        if(!text) return;


        addMessage(
            escapeHTML(text),
            "user"
        );


        input.value = "";


        typing.style.display =
            "flex";


        messages.scrollTop =
            messages.scrollHeight;


        setTimeout(
            function () {

                typing.style.display =
                    "none";

                addMessage(
                    getBotResponse(text),
                    "bot"
                );

            },
            700
        );

    }


    /* =========================
       SEND BUTTON
    ========================= */

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        function(event) {

            if(
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =========================
       QUICK QUESTIONS
    ========================= */

    document
    .querySelectorAll(
        ".jg-quick-buttons button"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const question =
                        this.dataset.question;

                    input.value =
                        question;

                    sendMessage();

                }
            );

        }
    );


    /* =========================
       SECURITY
    ========================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }

})();
