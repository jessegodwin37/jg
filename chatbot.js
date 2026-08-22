(function(){

const chatbotHTML = `

<button id="jgChatButton">
💬
</button>

<div id="jgChatBox">

<div class="jgChatHeader">

<div>
<strong>JG AI Assistant</strong>
<small>Online • Ready to help</small>
</div>

<button id="jgCloseChat">
×
</button>

</div>


<div id="jgMessages">

<div class="jgMessage jgBot">

<strong>JG AI:</strong>

<br><br>

👋 Welcome to JG!

I can help you with:

<br><br>

• Courses
<br>
• Prices
<br>
• Enrollment
<br>
• OPay
<br>
• Bank Transfer
<br>
• Choosing a skill

<br><br>

What would you like to know?

</div>

</div>


<div class="jgChatInput">

<input
id="jgChatInput"
type="text"
placeholder="Ask JG AI..."
>

<button id="jgSend">
➤
</button>

</div>

</div>

`;


const chatbotCSS = `

#jgChatButton{

position:fixed;

right:20px;

bottom:20px;

width:62px;

height:62px;

border:none;

border-radius:50%;

background:#2563eb;

color:white;

font-size:26px;

cursor:pointer;

box-shadow:0 10px 30px rgba(0,0,0,.25);

z-index:99999;

}


#jgChatBox{

position:fixed;

right:20px;

bottom:95px;

width:360px;

max-width:calc(100vw - 30px);

height:500px;

background:white;

border-radius:18px;

box-shadow:0 20px 60px rgba(0,0,0,.25);

display:none;

flex-direction:column;

overflow:hidden;

z-index:99998;

border:1px solid #e5e7eb;

font-family:Arial,sans-serif;

}


.jgChatHeader{

background:#07111f;

color:white;

padding:17px;

display:flex;

justify-content:space-between;

align-items:center;

}


.jgChatHeader small{

display:block;

color:#93c5fd;

font-size:11px;

margin-top:3px;

}


#jgCloseChat{

background:none;

border:none;

color:white;

font-size:28px;

cursor:pointer;

}


#jgMessages{

flex:1;

overflow-y:auto;

padding:15px;

background:#f8fafc;

}


.jgMessage{

max-width:88%;

padding:12px;

border-radius:13px;

margin-bottom:12px;

font-size:13px;

line-height:1.5;

}


.jgBot{

background:white;

border:1px solid #e5e7eb;

}


.jgUser{

background:#2563eb;

color:white;

margin-left:auto;

}


.jgChatInput{

display:flex;

gap:8px;

padding:10px;

border-top:1px solid #e5e7eb;

background:white;

}


#jgChatInput{

flex:1;

padding:11px;

border:1px solid #d1d5db;

border-radius:8px;

outline:none;

}


#jgSend{

width:45px;

border:none;

border-radius:8px;

background:#2563eb;

color:white;

cursor:pointer;

}


@media(max-width:600px){

#jgChatBox{

right:12px;

width:calc(100vw - 24px);

}

}

`;


const style =
document.createElement("style");

style.textContent =
chatbotCSS;

document.head.appendChild(style);


const wrapper =
document.createElement("div");

wrapper.innerHTML =
chatbotHTML;

document.body.appendChild(wrapper);


const chatButton =
document.getElementById(
"jgChatButton"
);


const chatBox =
document.getElementById(
"jgChatBox"
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
"jgSend"
);


const messages =
document.getElementById(
"jgMessages"
);


chatButton.onclick =
function(){

    chatBox.style.display =
    "flex";

    input.focus();

};


closeButton.onclick =
function(){

    chatBox.style.display =
    "none";

};


function addMessage(
    text,
    type
){

    const message =
    document.createElement(
        "div"
    );

    message.className =
    "jgMessage " +
    type;

    message.innerHTML =
    text;

    messages.appendChild(
        message
    );

    messages.scrollTop =
    messages.scrollHeight;

}


function getResponse(
    message
){

    const text =
    message.toLowerCase();


    if(
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        👋 Hello!

        Welcome to JG.

        <br><br>

        Ask me about courses,
        prices, enrollment or payment.

        `;

    }


    if(
        text.includes("course") ||
        text.includes("courses") ||
        text.includes("learn")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        JG currently offers:

        <br><br>

        💻 Web Development — ₦25,000

        <br>

        🎨 Graphic Design — ₦15,000

        <br>

        🎬 Video Editing — ₦15,000

        <br>

        🐍 Python Programming — ₦25,000

        <br>

        📈 Digital Marketing — ₦20,000

        <br>

        💼 Career Skills — ₦10,000

        <br><br>

        Visit the Learn page to enroll.

        `;

    }


    if(
        text.includes("price") ||
        text.includes("cost") ||
        text.includes("how much")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        Our courses currently range from
        ₦10,000 to ₦25,000.

        <br><br>

        You can see every course and price
        on the Learn page.

        `;

    }


    if(
        text.includes("enroll") ||
        text.includes("register")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        To enroll:

        <br><br>

        1. Choose a course.
        <br>
        2. Click Enroll Now.
        <br>
        3. Enter your details.
        <br>
        4. Select your payment method.
        <br>
        5. Make your payment.
        <br>
        6. Submit your enrollment.

        `;

    }


    if(
        text.includes("opay") ||
        text.includes("transfer") ||
        text.includes("payment")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        JG accepts OPay and Bank Transfer.

        <br><br>

        <strong>Bank:</strong>
        OPay

        <br>

        <strong>Account Name:</strong>
        JESSE EYITEMI ANOMUOGHARAN

        <br>

        <strong>Account Number:</strong>
        6493501689

        <br><br>

        Please check your enrollment page
        for the exact amount before paying.

        `;

    }


    if(
        text.includes("web") ||
        text.includes("coding")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        Web Development is ₦25,000.

        You can enroll from the Learn page.

        `;

    }


    if(
        text.includes("graphic") ||
        text.includes("design")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        Graphic Design is ₦15,000.

        `;

    }


    if(
        text.includes("video")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        Video Editing is ₦15,000.

        `;

    }


    if(
        text.includes("python") ||
        text.includes("programming")
    ){

        return `

        <strong>JG AI:</strong>

        <br><br>

        Python Programming is ₦25,000.

        `;

    }


    return `

    <strong>JG AI:</strong>

    <br><br>

    I can help with:

    <br><br>

    • Courses
    <br>
    • Prices
    <br>
    • Enrollment
    <br>
    • OPay
    <br>
    • Bank Transfer
    <br>
    • Skills

    <br><br>

    Try asking:
    <br>
    <strong>
    "How much is Web Development?"
    </strong>

    `;

}


function sendMessage(){

    const text =
    input.value.trim();


    if(!text){
        return;
    }


    addMessage(
        text,
        "jgUser"
    );


    input.value = "";


    setTimeout(
        function(){

            addMessage(
                getResponse(text),
                "jgBot"
            );

        },
        350
    );

}


sendButton.onclick =
sendMessage;


input.addEventListener(
"keydown",
function(event){

    if(
        event.key === "Enter"
    ){

        sendMessage();

    }

});

})();
