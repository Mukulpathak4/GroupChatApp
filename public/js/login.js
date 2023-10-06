// Get the submit button by its ID
const btn = document.getElementById('submit');

// Add an event listener to the submit button
btn.addEventListener('click', loginUser);

// Function to handle user login
async function loginUser(e) {
    try {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the user's email and password from the input fields
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create an object with the login details
        const loginDetails = {
            email,
            password
        };

        // Send a POST request to the login endpoint
        const response = await axios.post('http://localhost:3000/login', loginDetails);

        // Log the response and display a message
        console.log(response);
        alert(response.data.message);

        // Store the authentication token in local storage
        localStorage.setItem('token', response.data.token);

        // Display a success message and redirect to the chat home page
        document.getElementById('someResponse').textContent = `${response.data.message}`;
        document.getElementById('someResponse').style.color = 'green';
        window.location.href = '../html/chatHome.html';
    } catch (err) {
        console.log(err);

        // Display an error message if the login fails
        document.getElementById('someResponse').innerHTML = `Error: ${err.response.data.error}`;
        document.getElementById('someResponse').style.color = 'red';
    }
}
