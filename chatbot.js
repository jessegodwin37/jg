document.addEventListener("DOMContentLoaded", function () {

    const chatbotHTML = `
        <button id="jgChatButton" aria-label="Open JG AI Assistant">
            💬
        </button>

        <div id="jgChatBox">

            <div class="jg-chat-header">

                <div>
                    <strong>JG AI Assistant</strong>
                    <small>Online • Ready to help</small>
                </div>

                <button id="jgCloseChat">×</button>

            </div>

            <div id="jgMessages">

                <div class="jg-message bot">
                    <strong>JG AI:</strong>
                    👋 Hello! Welcome to JG.

                    <br><br>

                    I can help you with courses,
                    prices, enrollment, payments and
                    choosing a skill to learn.
                </div>

            </div>

            <div class="jg-quick-buttons">

                <button onclick="jgQuickQuestion('What courses do you offer?')">
                    Courses
                </button>

                <button onclick="jgQuickQuestion('How much are the courses?')">
                    Prices
                </button>

                <button onclick="jgQuickQuestion('How do I enroll?')">
                    Enrollment
                </button>

            </div>

            <div class="jg-chat-input">

                <input
                    type="text"
                    id="jgUserInput"
                    placeholder="Ask JG AI something..."
                    autocomplete="off">

                <button id="jgSendButton">
                    ➤
                </button>

            </div>

        </div>
    `;

    document.body.insertAdjacentHTML(
        "beforeend",
        chatbotHTML
    );


    const style = document.createElement("style");

    style.textContent = `

        #jgChatButton {

            position: fixed;
            right: 22px;
            bottom: 22px;

            width: 62px;
            height: 62px;

            border: none;
            border-radius: 50%;

            background: #2563eb;
            color: white;

            font-size: 27px;

            cursor: pointer;

            box-shadow:
                0 10px 30px rgba(0,0,0,0.25);

            z-index: 9999;

            transition: 0.25s;
        }


        #jgChatButton:hover {
            transform: scale(1.08);
        }


        #jgChatBox {

            position: fixed;

            right: 22px;
            bottom: 95px;

            width: 360px;
            max-width: calc(100vw - 30px);

            height: 520px;

            background: white;

            border-radius: 18px;

            box-shadow:
                0 20px 60px rgba(0,0,0,0.22);

            overflow: hidden;

            display: none;

            flex-direction: column;

            z-index: 9998;

            border: 1px solid #e5e7eb;
        }


        .jg-chat-header {

            background:
                linear-gradient(
                    135deg,
                    #07111f,
                    #172554
                );

            color: white;

            padding: 18px;

            display: flex;

            justify-content: space-between;

            align-items: center;
        }


        .jg-chat-header strong {

            display: block;

            font-size: 16px;
        }


        .jg-chat-header small {

            color: #93c5fd;

            font-size: 11px;
        }


        #jgCloseChat {

            background: transparent;

            border: none;

            color: white;

            font-size: 28px;

            cursor: pointer;
        }


        #jgMessages {

            flex: 1;

            overflow-y: auto;

            padding: 15px;

            background: #f8fafc;
        }


        .jg-message {

            max-width: 88%;

            padding: 12px 14px;

            border-radius: 13px;

            margin-bottom: 12px;

            font-size: 13px;

            line-height: 1.5;
        }


        .jg-message.bot {

            background: white;

            border: 1px solid #e5e7eb;

            color: #334155;

            border-bottom-left-radius: 4px;
        }


        .jg-message.user {

            background: #2563eb;

            color: white;

            margin-left: auto;

            border-bottom-right-radius: 4px;
        }


        .jg-quick-buttons {

            display: flex;

            gap: 7px;

            padding: 9px;

            overflow-x: auto;

            border-top: 1px solid #e5e7eb;

            background: white;
        }


        .jg-quick-buttons button {

            white-space: nowrap;

            border: 1px solid #bfdbfe;

            background: #eff6ff;

            color: #1d4ed8;

            padding: 7px 10px;

            border-radius: 20px;

            cursor: pointer;

            font-size: 11px;
        }


        .jg-chat-input {

            display: flex;

            padding: 10px;

            gap: 8px;

            border-top: 1px solid #e5e7eb;

            background: white;
        }


        #jgUserInput {

            flex: 1;

            border: 1px solid #d1d5db;

            border-radius: 9px;

            padding: 11px;

            outline: none;

            font-size: 13px;
        }


        #jgUserInput:focus {
            border-color: #2563eb;
        }


        #jgSendButton {

            width: 42px;

            border: none;

            border-radius: 9px;

            background: #2563eb;

            color: white;

            cursor: pointer;

            font-size: 17px;
        }


        @media (max-width: 500px) {

            #jgChatBox {

                right: 12px;
                bottom: 88px;

                width: calc(100vw - 24px);

                height: 500px;
            }

            #jgChatButton {

                right: 15px;
                bottom: 15px;
            }

        }

    `;

    document.head.appendChild(style);


    const chatButton =
        document.getElementById("jgChatButton");

    const chatBox =
        document.getElementById("jgChatBox");

    const closeButton =
        document.getElementById("jgCloseChat");

    const sendButton =
        document.getElementById("jgSendButton");

    const input =
        document.getElementById("jgUserInput");


    chatButton.addEventListener("click", function () {

        chatBox.style.display = "flex";

        input.focus();

    });


    closeButton.addEventListener("click", function () {

        chatBox.style.display = "none";

    });


    sendButton.addEventListener("click", sendMessage);


    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    });


    window.jgQuickQuestion = function (question) {

        input.value = question;

        sendMessage();

    };


    function sendMessage() {

        const text =
            input.value.trim();

        if (!text) {
            return;
        }


        addMessage(
            text,
            "user"
        );


        input.value = "";


        setTimeout(function () {

            const response =
                getJGResponse(text);

            addMessage(
                response,
                "bot"
            );

        }, 450);

    }


    function addMessage(text, type) {

        const messages =
            document.getElementById("jgMessages");


        const message =
            document.createElement("div");


        message.className =
            "jg-message " + type;


        if (type === "bot") {

            message.innerHTML =
                "<strong>JG AI:</strong> " +
                text;

        } else {

            message.textContent =
                text;

        }


        messages.appendChild(message);


        messages.scrollTop =
            messages.scrollHeight;

    }


    function getJGResponse(message) {

        const text =
            message.toLowerCase();


        if (
            text.includes("course") ||
            text.includes("courses") ||
            text.includes("learn")
        ) {

            return `
                JG currently offers courses including
                Web Development, Graphic Design,
                Video Editing, Python Programming,
                Digital Marketing and Career Skills.

                <br><br>

                You can see all available courses on
                the <a href="learn.html">Learn page</a>.
            `;

        }


        if (
            text.includes("price") ||
            text.includes("cost") ||
            text.includes("how much")
        ) {

            return `
                Current course prices include:

                <br><br>

                • Web Development — ₦25,000<br>
                • Graphic Design — ₦15,000<br>
                • Video Editing — ₦15,000<br>
                • Python Programming — ₦25,000<br>
                • Digital Marketing — ₦20,000<br>
                • Career Skills — ₦10,000

                <br><br>

                Prices may change as JG adds new courses.
            `;

        }


        if (
            text.includes("enroll") ||
            text.includes("registration") ||
            text.includes("register")
        ) {

            return `
                Enrolling is easy.

                <br><br>

                1. Choose a course.<br>
                2. Click "Enroll Now".<br>
                3. Enter your details.<br>
                4. Select your payment method.<br>
                5. Follow the payment instructions.

                <br><br>

                <a href="enroll.html">
                    Start Enrollment →
                </a>
            `;

        }


        if (
            text.includes("opay") ||
            text.includes("transfer") ||
            text.includes("payment")
        ) {

            return `
                JG currently accepts payment through
                OPay and bank transfer.

                <br><br>

                <strong>Bank:</strong> OPay<br>
                <strong>Account Name:</strong>
                JESSE EYITEMI ANOMUOGHARAN<br>
                <strong>Account Number:</strong>
                6493501689

                <br><br>

                Always check the enrollment page for
                the exact course amount before paying.
            `;

        }


        if (
            text.includes("web development") ||
            text.includes("website")
        ) {

            return `
                Web Development teaches you how to
                create websites using technologies such
                as HTML, CSS and JavaScript.

                <br><br>

                The current course price is ₦25,000.
            `;

        }


        if (
            text.includes("graphic design") ||
            text.includes("design")
        ) {

            return `
                Graphic Design teaches you how to create
                professional digital designs.

                <br><br>

                The current course price is ₦15,000.
            `;

        }


        if (
            text.includes("video editing") ||
            text.includes("video")
        ) {

            return `
                The Video Editing course teaches you
                practical video editing skills.

                <br><br>

                The current course price is ₦15,000.
            `;

        }


        if (
            text.includes("python") ||
            text.includes("programming") ||
            text.includes("coding")
        ) {

            return `
                Python Programming teaches programming
                fundamentals using Python.

                <br><br>

                The current course price is ₦25,000.
            `;

        }


        if (
            text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")
        ) {

            return `
                👋 Hello!

                Welcome to JG. I'm the JG AI Assistant.

                <br><br>

                Ask me about courses, prices,
                enrollment, payments or skills.
            `;

        }


        if (
            text.includes("skill") ||
            text.includes("which should")
        ) {

            return `
                The best skill depends on your goal.

                <br><br>

                💻 Interested in technology?
                Try Web Development or Python.

                <br><br>

                🎨 Interested in creativity?
                Try Graphic Design or Video Editing.

                <br><br>

                📈 Interested in business?
                Try Digital Marketing.

                <br><br>

                You can explore the available skills
                on the <a href="skills.html">Skills page</a>.
            `;

        }


        return `
            I'm the JG Assistant and I can help with:

            <br><br>

            • Courses<br>
            • Course prices<br>
            • Enrollment<br>
            • OPay payments<br>
            • Bank transfer<br>
            • Choosing a skill

            <br><br>

            Try asking:
            <strong>"How much is Web Development?"</strong>
        `;

    }

});
