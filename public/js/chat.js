
async function sendMsg() {

    const msg = document.getElementById("messageInput").value;
    const token = localStorage.getItem("token")

    if (!msg) {
        return
    }
    try {

        await axios.post("http://localhost:3000/send-msg", {
            msg: msg
        }, { headers: { "Authorization": token } })

        document.getElementById("messageInput").value = "";

    }

    catch (err) {
        console.log(err);
    }

}

async function DOMloadChat(grpid) {
    const token = localStorage.getItem("token");
    const localChats = localStorage.getItem(`localChats${grpid}`);
    let lastMsgId;
    document.getElementById("chatBoxBody").innerHTML = "";
    
    if (localChats == undefined) {
        const getAllChats = await axios.get("http://localhost:3000/getAllChats",
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
        const result = await axios.get(`http://localhost:3000/getGroupToken/${grpid}`,
            { headers: { "Authorization": token } });
        token = result.data.token;
    }

    localStorage.setItem("token", token);

    const updatedMsg = await axios.get(`http://localhost:3000/getUpdate/${lastMsgId}`,
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

function appendChatToPage(message, name) {
    const p = document.createElement("p");
    p.className = "border "
    p.appendChild(document.createTextNode(`${name}: ${message}`));
    document.getElementById("chats").appendChild(p);
}

async function createGroup() {

    try {
        const groupName = document.getElementById("groupName").value;
        const token = localStorage.getItem("token");
        if (!groupName) {
            throw new Error("Enter Group Name");
            return
        }
        const result = await axios.post("http://localhost:3000/createGroup", { groupName: groupName }, { headers: { "Authorization": token } });

        console.log(result)
        const { groupid, groupname } = result.data.result;

        appendGroupToPage(groupname, groupid);
    }
    catch (err) {
        console.log(err);
    }
}

async function DOMloadGroups() {
    const token = localStorage.getItem("token");
    const getGroups = await axios.get("http://localhost:3000/getAllGroups",
        { headers: { "Authorization": token } });

    document.getElementById("groups").innerHTML = "";

    if (getGroups.data.allGroups.length > 0) {
        getGroups.data.allGroups.forEach((item) => {
            appendGroupToPage(item.groupname, item.groupid);
        })
        document.getElementById("groups").addEventListener("click", onGroupClick);
    }
    else {
        document.getElementById("groups").innerHTML = "<p>No groups found</p>";
    }
}

function appendGroupToPage(groupname, groupid) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(groupname));
    li.name = groupname;
    li.id = groupid;
    li.className = "float-left"

    const btnOpen = document.createElement("button");
    btnOpen.className = "btn btn-sm btn-info float-right open";
    btnOpen.appendChild(document.createTextNode("OpenChat"));

    li.appendChild(btnOpen);
    document.getElementById("groups").appendChild(li);
}

async function addmember() {
    const member = document.getElementById("addmember").value;
    const token = localStorage.getItem("token");
    if (member) {
        console.log(member);
        try {
            const result = await axios.post("http://localhost:3000/addmember", {
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


