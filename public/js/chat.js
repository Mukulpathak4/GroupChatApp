const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatBoxBody = document.getElementById("chatBoxBody");



function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
// Function to get messages from the database and store them in local storage
async function getMessagesFromDatabaseAndStore() {
  try {
    if(done==true){
    const res = await axios.get("http://localhost:3000/chat/getMessages");
    const messages = res.data.messages;
    localStorage.setItem("messages", JSON.stringify(messages)); // Store messages in local storage
    displayMessages(messages);
    done=false;
  }else{
    getMessagesFromLocalStorageAndAddNew();
  }} catch (error) {
    console.log(error);
  }
}

// Function to get messages from local storage and add the newly sent message
function getMessagesFromLocalStorageAndAddNew(newMessage) {
  let storedMessages = localStorage.getItem("messages");
  let messages = [];

  if (storedMessages) {
    messages = JSON.parse(storedMessages);
  }

  messages.push(newMessage); // Add the new message to the existing stored messages
  localStorage.setItem("messages", JSON.stringify(messages)); // Update the stored messages

  displayMessages(messages); // Display all messages including the new one
}



// Function to display messages in the chat box
function displayMessages(messages) {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  chatBoxBody.innerHTML = "";

  messages.forEach((message) => {
    const div = document.createElement("div");
    chatBoxBody.appendChild(div);

    const messageSendby = document.createElement("span");
    messageSendby.classList.add(
      "d-flex",
      message.userId === userId ? "justify-content-end" : "justify-content-start",
      "px-3",
      "mb-1",
      "text-uppercase",
      "small",
      "text-white"
    );
    messageSendby.appendChild(document.createTextNode(message.userId === userId ? "You" : message.name));
    div.appendChild(messageSendby);

    const messageBox = document.createElement("div");
    const messageText = document.createElement("div");

    messageBox.classList.add(
      "d-flex",
      message.userId === userId ? "justify-content-end" : "justify-content-start",
      "mb-4"
    );

    messageText.classList.add(
      message.userId === userId ? "msg_cotainer_send" : "msg_cotainer"
    );
    messageText.appendChild(document.createTextNode(message.message));

    messageBox.appendChild(messageText);
    div.appendChild(messageBox);
  });
}


// Function to send a message
async function messageSend() {
  try {
    const messageContent = messageTextArea.value; // Extract the message content
    const token = localStorage.getItem("token");
    messageTextArea.value = "";

    const res = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      {
        message: messageContent, // Pass the message content
      },
      { headers: { Authorization: token } }
    );

    if (res.status === 200) {
      // After sending a message, create a complete message object and then call the function
      const token = localStorage.getItem("token");
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;
      const newMessage = {
        userId: userId,
        name: "YourName", // Replace with the sender's name
        message: messageContent,
      };
      getMessagesFromLocalStorageAndAddNew(newMessage);
    } else {
      console.log("Failed to send message");
    }
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}


let done= true;

// Event listeners
messageSendBtn.addEventListener("click", messageSend);
document.addEventListener("DOMContentLoaded", getMessagesFromDatabaseAndStore
);
























