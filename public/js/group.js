// Get the close button element by its ID
const close = document.getElementById('close');

// Add a click event listener to the close button
close.addEventListener('click', () => {
    // Redirect to the chat app page when the close button is clicked
    window.location.href = '../html/chatHome.html';
});

// Get the submit button element by its ID
const submitbtn = document.getElementById('submitGroup');

// Add a click event listener to the submit button, which triggers the createGroup function
submitbtn.addEventListener('click', createGroup);

// Function to create a new group
async function createGroup(e) {
    try {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the group name input value
        const groupName = document.getElementById('groupName').value;

        // Create an object to send as the request body
        const groupObj = {
            groupName,
        };

        // Get the user's token from local storage
        const token = localStorage.getItem('token');

        // Send a POST request to create a new group using Axios
        const res = await axios.post('http://localhost:3000/group/create', groupObj, {
            headers: { "Authorization": token },
        });

        // Log the response from the server to the console
        console.log(res);

        // Store the new group details and set the user as the admin
        localStorage.setItem('groupDetails', JSON.stringify(res.data.newGroup));
        localStorage.setItem('isAdmin', JSON.stringify(true));

        // Display a success message to the user
        alert(res.data.message);

        // Clear the group name input field if the request was successful
        if (res.status === 202) {
            document.getElementById('groupName').value = '';
        }
    } catch (err) {
        // Handle errors and display an error message to the user
        console.log(err);
        document.getElementById('showResponse').textContent = err.response.data.error;
        document.getElementById('showResponse').style.color = 'red';
    }
}
