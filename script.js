const BACKEND_URL =  "/api/chat";


// 2. Creating DOM elements
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// 3. Add a message bubble to the chat
function addMessage(text, sender = 'bot') {
    const div = document.createElement('div');
    div.classList.add("message", sender);
    div.textContent = text;
    chatWindow.appendChild(div);

    // always scroll to bottom when new message appears
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 4. Function to call your GPT API
//it will await for reply in background
async function askGPT(messageText) {

    //show temporary "Thinking..."
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "bot");
    loadingDiv.textContent = "Thinking...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({message: messageText }),
        });

        const data = await response.json();

        // Remove "Thinking..." bubble
        chatWindow.removeChild(loadingDiv);

        if (data.reply) {
            addMessage(data.reply, "bot"); //show bot reply
        }
        else{
            addMessage("Error: " + (data.error || "Unknown error"), "bot");
        }
   }
   catch (error) {
    console.error(error);
    chatWindow.removeChild(loadingDiv);
    addMessage("Network error. Is your backend running?", "bot");
   }
}

// 5. Handle user sending message
chatForm.addEventListener("submit", function (event) {
    event.preventDefault(); //stops page reload

    const text = userInput.value.trim();
    if(text == "") return;  //if empty, do nothing
    
    //Show user's message
    addMessage(text, "user");

    // Clear input box
    userInput.value = "";

    // call GPT through our wrapper
    askGPT(text);
})
