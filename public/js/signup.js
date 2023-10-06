// Get the submit button element by its ID
const btn = document.getElementById('submit');

// Add a click event listener to the submit button, which triggers the storeSignupDetails function
btn.addEventListener('click', storeSignupDetails);

// Function to store user signup details and send them to the server
async function storeSignupDetails(e) {
    try {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get user input values from the form
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;

        // Create an object to store signup details
        let signupDetails = {
            name,
            email,
            phoneNumber,
            password
        };

        // Log a message to the console for debugging purposes
        console.log('Sign-up button clicked');

        // Send a POST request to the server to create a new user account
        const response = await axios.post('http://localhost:3000/signup', signupDetails);

        // Log a success message to the console
        console.log('Sign-up successful');
        console.log(response.data.message);
        console.log(response);

        // Display a success message to the user
        alert(response.data.message);

        // Update the response message element with a success message and set its color to green
        document.getElementById('someResponse').textContent = `${response.data.message}`;
        document.getElementById('someResponse').style.color = 'green';

        // Redirect the user to the login page
        window.location.href = '../html/login.html';
    } catch (err) {
        // Handle errors and display an error message to the user
        alert(err.response.data.error);

        // Update the response message element with an error message and set its color to red
        document.getElementById('someResponse').innerHTML = `Error: ${err.response.data.error}`;
        document.getElementById('someResponse').style.color = 'red';

        // Log the error to the console for debugging purposes
        console.log(err);
    }
}
