const signupButton = document.getElementById("signUpBtn");

const signUpName = document.getElementById("signupName"); // Assuming there's a name input field
const signUpEmail = document.getElementById("signupEmail");
const signUpPassword = document.getElementById("signupPassword");
const signUpPhoneNumber = document.getElementById("signupphonenumber");


const loginButton = document.getElementById("signInBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

function login() {
  // Create an object with login details from the input fields.
  const loginDetails = {
    loginEmail: loginEmail.value, // Get the email from the loginEmail input field
    loginPassword: loginPassword.value, // Get the password from the loginPassword input field
  };

  // Send a POST request to the server to log in the user.
  axios
    .post("http://13.200.99.59    :3000/login", loginDetails)
    .then((result) => {
      // Display a success message and store the token in local storage.
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);

      // Redirect to the home page.
      window.location.href = "/home";
    })
    .catch((error) => {
      if (error.response) {
        // If the server responds with an error, display the error message.
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        // If there's a network error or other issues, display a generic error message.
        alert("An error occurred. Please try again later.");
      }
    });
}

// Add a click event listener to the login button to trigger the login function.
loginButton.addEventListener("click", login);

function signup(){
    const signUpDetails = {
       name: signUpName.value, // Get the name from the name input field
       email: signUpEmail.value, // Get the email from the signupEmail input field
       password: signUpPassword.value, // Get the password from the signupPassword input field
       phone: signUpPhoneNumber.value
    };

    axios
    .post("http://13.200.99.59    :3000/signUp", signUpDetails)
    .then((result)=>{
        alert('SignUp Complete.');

        window.location.href = "/";
    })
    .catch((error)=>{
        if(error.response){
            const errorMessage = error.response.data.message;
            alert(`Here is error`);
        }
        else {
            alert("Oops Error occurred Try Again.")
        }
    });
}

signupButton.addEventListener("click", signup);