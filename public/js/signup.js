const signupButton = document.getElementById("signUpBtn");

const signUpName = document.getElementById("signupName"); // Assuming there's a name input field
const signUpEmail = document.getElementById("signupEmail");
const signUpPassword = document.getElementById("signupPassword");
const signUpPhoneNumber = document.getElementById("signupphonenumber");


function signup(){
    const signUpDetails = {
       name: signUpName.value, // Get the name from the name input field
       email: signUpEmail.value, // Get the email from the signupEmail input field
       password: signUpPassword.value, // Get the password from the signupPassword input field
       phoneNumber: signUpPhoneNumber.value
    };

    axios
    .post("http://localhost:3000/signUp", signUpDetails)
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

