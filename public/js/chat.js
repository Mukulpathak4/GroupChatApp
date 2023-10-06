// Initialize a WebSocket connection to the server
const socket = io('http://localhost:3000');

// Get references to various HTML elements
const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');
const chatsCanStored = 1000;
const addGroup = document.getElementById('addGroup');
const searchUsers = document.getElementById('searchContacts');
const sendMedia = document.getElementById('send-media');
const message = document.getElementById('message-input');
const showGroups = document.getElementById('showMyGroups');
const addUsers = document.getElementById('addUsers');
const showGroupMembers = document.getElementById('showGroupMembers');

// Add a click event listener to the "Send Message" button
sendMessage.addEventListener('click', () => {
    if (message.value !== '') {
        postMessage();
    } else {
        const msg = `Can't send an empty message`;
        showErrorMsg(msg);
    }
});

// Function to send a text message
async function postMessage() {
    try {
        // Get the message text and group ID
        const textMessage = message.value;
        const groupdata = JSON.parse(localStorage.getItem('groupDetails')) || { id: null };
        const groupId = groupdata.id;

        // Create a message object
        const messageObj = {
            textMessage,
            groupId,
        };

        // Get the user's token from local storage
        const token = localStorage.getItem('token');

        // Send a POST request to the server to send the message
        const response = await axios.post('http://localhost:3000/chats/send', messageObj, {
            headers: { "Authorization": token },
        });

        // Display the sent message on the screen
        showUsersChatsOnScreen(response.data.textMessage);

        // Emit a socket.io event to inform others about the sent message
        socket.emit('send-message', response.data.textMessage);

        // Log the sent message object
        console.log('the message obj is ', response.data.textMessage);

        // Store the sent message in local storage
        let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
        usersChats.push(response.data.textMessage);
        let chats = usersChats.slice(usersChats.length - chatsCanStored);
        localStorage.setItem('usersChats', JSON.stringify(chats));

        // Clear the message input field
        if (response.status === 201) {
            message.value = '';
            sendMedia.value = '';
        }
    } catch (err) {
        console.log(err);
    }
}

// Add an event listener to handle file uploads
sendMedia.addEventListener('input', uploadFile);

// Function to upload a media file
async function uploadFile(e) {
    try {
        // Get the user's token and group ID from local storage
        const token = localStorage.getItem('token');
        const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
        const groupId = groupDetails.id;

        // Get the selected file from the input field
        const file = e.target.files[0];
        const form = new FormData();
        form.append('userFile', file);

        // Send a POST request to upload the file to the server
        const response = await axios.post(`http://localhost:3000/files/file/${groupId}`, form, {
            headers: { 'Authorization': token, 'Content-Type': 'multipart/form-data' },
        });

        // Display the uploaded media on the screen
        showUsersChatsOnScreen(response.data.files);

        // Emit a socket.io event to inform others about the uploaded media
        socket.emit('send-message', response.data.files);

        // Log the uploaded file object
        console.log('the file obj is ', response.data.files);

        // Store the media file URL in local storage
        let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
        usersChats.push(response.data.files);
        let chats = usersChats.slice(usersChats.length - chatsCanStored);
        localStorage.setItem('usersChats', JSON.stringify(chats));
    } catch (err) {
        console.log(err);
    }
}

// Add an event listener to execute code when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get user chat history and group details from local storage
        const usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
        const groupDetails = JSON.parse(localStorage.getItem('groupDetails')) || { id: null, name: 'Chat App' };
        const groupId = groupDetails.id;

        // Emit a socket.io event to join the group
        socket.emit('joined-group', groupId);

        // Disable message input and buttons if there is no active group
        if (groupDetails.id === null) {
            document.getElementById('message-input').disabled = true;
            document.getElementById('send-message').disabled = true;
            document.getElementById('showPreviousMsg').style.textAlign = 'center';
            const textNode = document.createTextNode(`Please Create a New Group to Start Conversation`);
            document.getElementById('showPreviousMsg').append(textNode);
            document.getElementById('send-media').disabled = true;
        }

        // Load user messages for the active group
        if (groupDetails.id != null) {
            getUserMsgs(groupDetails.id);
        }

        // Display stored user chats on the screen
        usersChats.forEach(chats => {
            if (groupDetails.id === chats.groupId) {
                showUsersChatsOnScreen(chats);
            }
        });

        // Listen for socket.io events to receive messages from others
        socket.on('received-message', messages => {
            console.log('socket message obj is', messages);
            showUsersChatsOnScreen(messages);

            // Store received messages in local storage
            usersChats.push(messages);
            let chats = usersChats.slice(usersChats.length - chatsCanStored);
            localStorage.setItem('usersChats', JSON.stringify(chats));
        });

        // Display the group name on the screen
        showGroupName(groupDetails.name);

        // Show user name and role (admin/user) on the screen
        showUserName();
    } catch (err) {
        console.log(err);
    }
});

// Function to get user messages for a group
const getUserMsgs = (groupId) => {
    try {
        const showPrevMsgs = document.getElementById('showPreviousMsg');
        showPrevMsgs.style.textAlign = 'center';
        const button = document.createElement('button');
        showPrevMsgs.append(button);
        button.innerHTML = `Show Previous messages`;
        button.className = 'button-18';
        button.onclick = async () => {
            // Get messages from the server using a GET request
            const response = await axios.get(`http://localhost:3000/chats/Messages/${groupId}`);
            let lastestChats = response.data.textMessages;
            // Store previous messages in local storage
            if (response.status === 202) {
                localStorage.setItem('usersChats', JSON.stringify(lastestChats));
                window.location.reload();
                showPrevMsgs.remove();
            }
            if (response.status === 201) {
                alert(response.data.message);
                showPrevMsgs.remove();
            }
        };
    } catch (err) {
        console.log(err);
        alert(err.response.data.err);
    }
};

// Function to display user messages on the screen
function showUsersChatsOnScreen(chats) {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    const ul = document.getElementById('userMessage');
    ul.style.textAlign = 'center';

    const li = document.createElement('li');
    li.className = 'sent';
    const p = document.createElement('p');
    li.append(p);

    if (isValidURL(chats.message)) {
        p.innerHTML = `${chats.sender} : <img src="${chats.message}" alt="${chats.sender}">`;
    } else {
        p.textContent = `${chats.sender} : ${chats.message}`;
    }

    if (chats.userId === decodeToken.userId) {
        if (isValidURL(chats.message)) {
            p.innerHTML = `you : <img src="${chats.message}" alt="${chats.sender}">`;
        } else {
            p.textContent = `you : ${chats.message}`;
        }
    }

    ul.append(li);
}

// Function to display a notification on the screen
const showNotificationOnScreen = (name) => {
    const ul = document.getElementById('newMessages');
    ul.style.textAlign = 'center';

    const p = document.createElement('p');
    p.style.fontFamily = 'bold';
    p.textContent = `${name} is connected`;

    ul.append(p);
};

// Add a click event listener to the "Add Group" button
addGroup.addEventListener('click', () => {
    window.location.href = '../html/group.html';
});



// Add a click event listener to the "Show My Groups" button
showGroups.addEventListener('click', async () => {
    // Get the user's token
    const token = localStorage.getItem('token');

    // Send a GET request to fetch user's groups from the server
    const res = await axios.get('http://localhost:3000/group/groups', { headers: { "Authorization": token } });
    const usersGroups = res.data.groupsList;
    const userGroup = res.data.userGroup;

    // Display the list of user's groups
    showGroupsListTitle();
    for (let i = 0, j = 0; i < usersGroups.length, j < userGroup.length; i++, j++) {
        showGroupsOnScreen(usersGroups[i], userGroup[j]);
    }
});

// Add a click event listener to the "Show Group Members" button
showGroupMembers.addEventListener('click', async () => {
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
    showGroupUserListTitle();

    // Send a GET request to fetch group members from the server
    const res = await axios.get(`http://localhost:3000/group/members/${groupDetails.id}`);
    const listOfGroupMembers = res.data.usersDetails;
    const userGroupDetails = res.data.userGroup;

    // Display the list of group members
    for (let i = 0, j = 0; i < listOfGroupMembers.length, j < userGroupDetails.length; i++, j++) {
        showGroupUsersOnScreen(listOfGroupMembers[i], userGroupDetails[j]);
    }
});

// Add a click event listener to the "Add Users" button
addUsers.addEventListener('click', async () => {
    // Send a GET request to fetch a list of users from the server
    const res = await axios.get('http://localhost:3000/users');
    const listUsers = res.data.listOfUsers;

    // Display the list of users
    showUserListTitle();
    listUsers.forEach(users => {
        showUsersOnScreen(users);
    });
});

// Function to display user groups on the screen
const showGroupsOnScreen = (groups, userGroup) => {
    const groupLists = document.getElementById('groupLists');

    const li = document.createElement('li');
    li.className = 'contact';

    li.addEventListener('click', async () => {
        // Set group details in local storage and reload the page
        localStorage.setItem('groupDetails', JSON.stringify(groups));
        window.location.reload();
        localStorage.setItem('isAdmin', JSON.stringify(userGroup.isAdmin));
    });

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    p.textContent = groups.name;
    p.id = groups.id;

    div.append(p);
    groupLists.append(li);
};

// Function to display user contacts on the screen
const showUsersOnScreen = (users) => {
    const token = localStorage.getItem('token');
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const decodeToken = parseJwt(token);

    if (users.id !== decodeToken.userId) {
        const userLists1 = document.getElementById('userLists');

        const li = document.createElement('li');
        li.className = 'contact';

        const div = document.createElement('div');
        div.className = 'wrap';
        li.append(div);

        const p = document.createElement('p');
        p.textContent = users.name;

        const groupData = JSON.parse(localStorage.getItem('groupDetails'));
        if (groupData) {
            if (isAdmin) {
                const button = document.createElement('input');
                button.value = 'Add to Your group';
                button.className = 'button-33';
                button.type = 'button';
                p.append(button);

                const groupId = groupData.id;
                const toUserId = users.id;
                if (groupData.id) {
                    button.addEventListener('click', async () => {
                        try {
                            const addUserToGroup = await axios.post(`http://localhost:3000/group/add/${toUserId}/${groupId}`);
                            const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
                            if (Number(addUserToGroup.data.userGroup.userId) === users.id) {
                                alert(`You successfully added ${users.name} to ${groupDetails.name}`);
                            }
                        } catch (err) {
                            console.log(err);
                            alert(`${users.name} is already in your Group`);
                        }
                    });
                }
            }
        }

        div.append(p);
        userLists1.append(li);
    }
};

// Function to display group members on the screen
const showGroupUsersOnScreen = (users, userGroup) => {
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    const userLists1 = document.getElementById('userLists');

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    p.textContent = users.name;

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const removeUser = document.createElement('button');
    removeUser.className = 'button-45';
    const makeAdmin = document.createElement('button');
    makeAdmin.className = 'button-29';
    const leaveGroup = document.createElement('button');
    leaveGroup.className = 'button-62';

    if (userGroup.isAdmin) {
        p.textContent = users.name + ' Group Admin';
        p.style.color = 'black';
    }

    if (users.id === decodeToken.userId) {
        leaveGroup.innerHTML = `Leave`;
        p.append(leaveGroup);
        const userGroupId = userGroup.id;
        leaveUserGroup(leaveGroup, userGroupId, li);
    }

    if (isAdmin) {
        removeUser.innerHTML = `remove`;
        makeAdmin.innerHTML = `Make Admin`;
        p.append(removeUser);
        p.append(makeAdmin);

        if (users.id === decodeToken.userId) {
            removeUser.remove();
            makeAdmin.remove();
        }

        if (userGroup.isAdmin) {
            removeUser.remove();
            makeAdmin.remove();
        }

        removeUser.addEventListener('click', async () => {
            const userGroupId = userGroup.id;
            const res = await axios.delete(`http://localhost:3000/group/remove/${userGroupId}`);
            if (res.status === 200) {
                li.remove();
                alert(`You Successfully removed ${users.name} from ${groupDetails.name}`);
            }
        });

        makeAdmin.addEventListener('click', async () => {
            const userGroupId = userGroup.id;
            const res = await axios.post(`http://localhost:3000/group/admin/${userGroupId}`);
            if (res.status === 202) {
                makeAdmin.remove();
                removeUser.remove();
                alert(`You Successfully Made ${users.name} Admin of ${groupDetails.name}`);
            }
        });
    }

    div.append(p);
    userLists1.append(li);
};

// Function to handle leaving a user group
const leaveUserGroup = (leaveGroup, userGroupId, li) => {
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
    leaveGroup.addEventListener('click', async () => {
        const res = await axios.delete(`http://localhost:3000/group/remove/${userGroupId}`);
        if (res.status === 200) {
            li.remove();
            alert(`You Successfully left ${groupDetails.name}`);
            localStorage.removeItem('groupDetails');
            window.location.reload();
        }
    });
};

// Function to display group title on the screen
const showGroupsListTitle = () => {
    const contacts = document.getElementById('contacts');
    const userLists = document.createElement('ul');
    userLists.id = 'groupLists';
    const userListsLi = document.createElement('li');
    userListsLi.className = 'contact';
    userLists.append(userListsLi);
    const userListsDiv = document.createElement('div');
    userListsDiv.className = 'wrap';
    userListsLi.append(userListsDiv);
    const userListH3 = document.createElement('h3');
    userListsDiv.append(userListH3);
    userListH3.style.fontWeight = 'bold';
    userListH3.textContent = `My Groups`;
    const closebtn = document.createElement('button');
    userListH3.append(closebtn);
    closebtn.innerHTML = 'close';
    closebtn.className = 'button-17';
    contacts.append(userLists);
    closebtn.addEventListener('click', () => {
        userLists.remove();
    });
};

// Function to display user list title on the screen
const showUserListTitle = () => {
    const contacts = document.getElementById('contacts');
    const userLists = document.createElement('ul');
    userLists.id = 'userLists';
    const userListsLi = document.createElement('li');
    userListsLi.className = 'contact';
    userLists.append(userListsLi);
    const userListsDiv = document.createElement('div');
    userListsDiv.className = 'wrap';
    userListsLi.append(userListsDiv);
    const userListH3 = document.createElement('h3');
    userListsDiv.append(userListH3);
    userListH3.style.fontWeight = 'bold';
    userListH3.textContent = `List of Contacts`;
    userListH3.id = 'userListTitle';
    const closebtn = document.createElement('button');
    userListH3.append(closebtn);
    closebtn.innerHTML = 'close';
    closebtn.className = 'button-17';
    contacts.append(userLists);
    closebtn.addEventListener('click', () => {
        userLists.remove();
    });
};

// Function to display group user list title on the screen
const showGroupUserListTitle = () => {
    const contacts = document.getElementById('contacts');
    const userLists = document.createElement('ul');
    userLists.id = 'userLists';
    const userListsLi = document.createElement('li');
    userListsLi.className = 'contact';
    userLists.append(userListsLi);
    const userListsDiv = document.createElement('div');
    userListsDiv.className = 'wrap';
    userListsLi.append(userListsDiv);
    const userListH3 = document.createElement('h3');
    userListsDiv.append(userListH3);
    userListH3.style.fontWeight = 'bold';
    userListH3.textContent = `Group Members`;
    userListH3.id = 'userListTitle';
    const closebtn = document.createElement('button');
    userListH3.append(closebtn);
    closebtn.innerHTML = 'close';
    closebtn.className = 'button-17';
    contacts.append(userLists);
    closebtn.onclick = () => {
        userLists.remove();
    };
};

// Function to display group name on the screen
const showGroupName = (groupName) => {
    const boxName = document.getElementById('boxName');
    boxName.textContent = `${groupName}`;
};

// Function to display user name and role (admin/user) on the screen
const showUserName = () => {
    const decodeToken = parseJwt(localStorage.getItem('token'));
    const userName = document.getElementById('userName');
    userName.textContent = `${decodeToken.name}`;
};

// Function to parse a JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

function isValidURL(str) {
    // Regular expression to check if a string is a valid URL
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+([/?#].*?)?)?$/;
    return pattern.test(str);
}

document.getElementById('logoutBtn').addEventListener('click',logout);

function logout() {
  try {
    // Clear local storage
    localStorage.clear();
    
    // Redirect the user to the root URL ("/")
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}