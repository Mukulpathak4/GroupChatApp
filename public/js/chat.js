window.addEventListener("DOMContentLoaded", loadChat);


async function loadChat() {
    try {
        await DOMloadChat(1);
        await DOMloadGroups();
    } catch (err) {
        console.log(err);

        if (err.response && err.response.status === 401) {
            // Unauthorized error, handle as needed (e.g., redirect to login)
            window.location.href = "/"; // Redirect to login page
        }
    }
}


async function DOMloadChat(grpid) {
    const token = localStorage.getItem("token");
    const localChats = localStorage.getItem(`localChats${grpid}`);
    let lastMsgId;
    document.getElementById("chats").innerHTML = "";
    // if(grpid!=0){

    // }
    if (localChats == undefined) {
        const getAllChats = await axios.get("http://localhost:3000/chat/getAllChats",
            { headers: { "Authorization": token } });
        const arrLen = getAllChats.data.allChat.length;

        if (arrLen < 1) {
            return
        }
        getAllChats.data.allChat.forEach((item) => {
            lastMsgId = item.id;
            appendChatToPage(item.message, item.user.name);
        })
        localStorage.setItem(`lastMsgId${grpid}`, lastMsgId);

        if (arrLen > 10) {
            localStorage.setItem(`localChats${grpid}`, JSON.stringify(getAllChats.data.allChat.slice(arrLen - 10, arrLen)));
        }
        else {
            localStorage.setItem(`localChats${grpid}`, JSON.stringify(getAllChats.data.allChat));
        }
    }

    else {

        const parsedChats = JSON.parse(localChats);

        parsedChats.forEach((item) => {
            lastMsgId = item.id;
            appendChatToPage(item.message, item.user.name);
        })
        localStorage.setItem(`lastMsgId${grpid}`, lastMsgId);

    }
    await getUpdatedChats(grpid);
}

async function getUpdatedChats(grpid) {
    let lastMsgId = localStorage.getItem(`lastMsgId${grpid}`) || 0;
    let token = localStorage.getItem("token")

    if (grpid == 1) {
        const result = await axios.get(`http://localhost:3000/token/getGroupToken/${grpid}`,
            { headers: { "Authorization": token } });
        token = result.data.token;
    }

    localStorage.setItem("token", token);

    const updatedMsg = await axios.get(`http://localhost:3000/chat/getUpdate/${lastMsgId}`,
        { headers: { "Authorization": token } });

    if (updatedMsg.data.updatedChat.length > 0) {
        let UpdatedMsgId;
        let arrlocalChats;
        if (!localStorage.getItem(`localChats${grpid}`)) {
            arrlocalChats = [];
        }
        else {
            arrlocalChats = JSON.parse(localStorage.getItem(`localChats${grpid}`));
        }

        updatedMsg.data.updatedChat.forEach((item) => {
            arrlocalChats.push(item);
            UpdatedMsgId = item.id;
            appendChatToPage(item.message, item.user.name);
        })

        localStorage.setItem(`lastMsgId${grpid}`, UpdatedMsgId);

        const arrLen = arrlocalChats.length;
        if (arrLen > 10) {
            const stringifiedArr = JSON.stringify(arrlocalChats.slice(arrLen - 10, arrLen));
            localStorage.setItem(`localChats${grpid}`, stringifiedArr);
        }
        else {
            localStorage.setItem(`localChats${grpid}`, JSON.stringify(arrlocalChats));
        }
    }
}

async function DOMloadGroups() {
    const token = localStorage.getItem("token");
    const getGroups = await axios.get("http://localhost:3000/chat/getAllGroups",
        { headers: { "Authorization": token } });

    document.getElementById("groups").innerHTML = "";

    if (getGroups.data.allGroups.length > 0) {
        getGroups.data.allGroups.forEach((item) => {
            const isAdmin = item.isAdmin; // Replace 'isAdmin' with the actual property name from your backend
            appendGroupToPage(item.groupname, item.groupid, isAdmin);
        });
        document.getElementById("groups").addEventListener("click", onGroupClick);
    } else {
        document.getElementById("groups").innerHTML = "<p>No groups found</p>";
    }
}


async function onGroupClick(e) {

    if (e.target.classList.contains("open")) {
        document.getElementById("chatapp").innerHTML = "";
        document.getElementById("chatapp").innerHTML = e.target.parentNode.name;
        document.getElementById("addmemberDiv").hidden = false;
        document.getElementById("publicgroup").hidden = false;

        try {
            const groupId = e.target.parentNode.id;
            const token = localStorage.getItem("token")

            const result = await axios.get(`http://localhost:3000/token/getGroupToken/${groupId}`,
                { headers: { "Authorization": token } });
            localStorage.setItem("token", result.data.token);


            DOMloadChat(groupId);
        }
        catch (err) {
            console.log(err);
        }

    }
}

function appendGroupToPage(groupname, groupid, isAdmin) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(groupname));
    li.name = groupname;
    li.id = groupid;
    li.className = "float-left";

    const btnOpen = document.createElement("button");
    btnOpen.className = "btn btn-sm btn-info float-right open";
    btnOpen.appendChild(document.createTextNode("OpenChat"));

    li.appendChild(btnOpen);

    if (isAdmin) {
        // If the user is an admin, show the "Delete Group" button
        const deleteButton = document.createElement("button");
        deleteButton.appendChild(document.createTextNode("Delete Group"));
        deleteButton.onclick = () => deleteGroup(groupid); // Call deleteGroup with the group ID
        deleteButton.className = "btn btn-sm btn-danger delete";
        li.appendChild(deleteButton);
    }

    document.getElementById("groups").appendChild(li);
}


function appendChatToPage(message, name) {
    const p = document.createElement("p");
    p.className = "border "
    p.appendChild(document.createTextNode(`${name}: ${message}`));
    document.getElementById("chats").appendChild(p);
}

async function sendMsg() {

    const msg = document.getElementById("msg").value;
    const token = localStorage.getItem("token")

    if (!msg) {
        return
    }
    try {

        await axios.post("http://localhost:3000/chat/send-msg", {
            msg: msg
        }, { headers: { "Authorization": token } })

        document.getElementById("msg").value = "";
        window.location.href = "/home";
    }

    catch (err) {
        console.log(err);
    }

}

async function createGroup() {
    try {
        const groupName = document.getElementById("groupName").value;
        const token = localStorage.getItem("token");
        if (!groupName) {
            throw new Error("Enter Group Name");
        } else {
            const result = await axios.post("http://localhost:3000/chat/createGroup", { groupName: groupName }, { headers: { "Authorization": token } });

            console.log(result);
            const { groupid, groupname } = result.data.result;

            // Append the new group to the page
            appendGroupToPage(groupname, groupid);
        }
    } catch (err) {
        console.log(err);
    }
}


async function addmember() {
    const member = document.getElementById("addmember").value;
    const token = localStorage.getItem("token");
    if (member) {
        console.log(member);
        try {
            const result = await axios.post("http://localhost:3000/chat/addmember", {
                member: member
            }, { headers: { "Authorization": token } });

            window.alert("User Added");

        }
        catch (err) {
            console.log(err);
            if (err.response.status == 400 || err.response.status == 404) {
                window.alert(err.response.data.message);
            }
        }

    }
}

async function publicGroup() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get("http://localhost:3000/token/getPublicToken",
            { headers: { "Authorization": token } });
        localStorage.setItem("token", result.data.token);
        window.location.href = "/home"
    }
    catch (err) {
        console.log(err);
    }
}

async function showpopup() {
    document.getElementById("viewmembers").innerHTML = "";
    try {
        const token = localStorage.getItem("token");
        const allMembers = await axios.get("http://localhost:3000/chat/viewAllMembers",
            { headers: { "Authorization": token } });

        const admins = allMembers.data.members[1];
        const myId = allMembers.data.myId;

        const adminSet = new Set();
        admins.forEach((admin) => {
            adminSet.add(admin.userId)
        })

        allMembers.data.members[0][0].users.forEach((item) => {
            appendMembersToPopup(item, adminSet, myId);
        })


        document.getElementById("popup").style.display = 'block';
    }
    catch (err) {
        console.log(err);
    }
}

function appendMembersToPopup(member, adminSet, myId) {
    const li = document.createElement("li");
    li.id = member.id;

    const memberName = document.createElement("span");
    memberName.style.color = "black"; // Set the text color to black
    memberName.appendChild(document.createTextNode(`${member.name} :`));

    li.appendChild(memberName);

    const btnAdmin = document.createElement("button");
    btnAdmin.className = "btn btn-sm btn-link admin";
    btnAdmin.disabled = true;
    if (adminSet.has(member.id)) {
        btnAdmin.appendChild(document.createTextNode("Admin"));
    } else {
        btnAdmin.appendChild(document.createTextNode("Make Admin"));
        if (adminSet.has(myId)) {
            btnAdmin.disabled = false;
        }
    }

    const btnRemove = document.createElement("button");
    btnRemove.className = "btn btn-sm btn-link remove";
    btnRemove.disabled = true;
    btnRemove.appendChild(document.createTextNode("Remove Member"));

    if (adminSet.has(myId) || member.id == myId) {
        btnRemove.disabled = false;
    }

    li.appendChild(btnAdmin);
    li.appendChild(btnRemove);
    document.getElementById("viewmembers").appendChild(li);
}


document.getElementById("viewmembers").addEventListener("click", memberClick);

async function memberClick(e) {
    const userid = e.target.parentNode.id;
    const token = localStorage.getItem("token");

    if (e.target.classList.contains("admin")) {
        try {
            const result = await axios.get(`http://localhost:3000/chat/addAdmin/${userid}`,
                { headers: { "Authorization": token } });
        }
        catch (err) {
            console.log(err)
        }


    }
    else if (e.target.classList.contains("remove")) {
        console.log("Remove")

        try {
            const result = await axios.get(`http://localhost:3000/chat/removeMember/${userid}`,
                { headers: { "Authorization": token } });
        }
        catch (err) {
            console.log(err)
        }

    }
}

function hidepopup() {
    document.getElementById("popup").style.display = 'none';
}

function logout() {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect the user to the login page or perform any other desired logout actions
    window.location.href = "/"; // Replace "/login" with the actual logout URL
}
async function deleteGroup(groupid) {
    const token = localStorage.getItem("token");

    try {
        // Send a DELETE request to the backend to delete the group
        await axios.delete(`http://localhost:3000/chat/deleteGroup/${groupid}`, {
            headers: { "Authorization": token }
        });

        // Remove the group from the page after successful deletion
        const groupElement = document.getElementById(groupid);
        if (groupElement) {
            groupElement.remove();
        }
    } catch (err) {
        console.log(err);
        // Handle any errors, such as displaying an error message to the user
    }
}
