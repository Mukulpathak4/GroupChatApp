const createGroupBtn = document.getElementById('createGroupBtn');
const deleteGroupBtn = document.getElementById('deleteGroupBtn');
const addToGroupBtn = document.getElementById('addToGroupBtn');

    // Function to create a group
    function createGroup() {
        // Get the container where the input and button will be displayed
        const container = document.getElementById('action-container');
        
        // Create an input field for group name
        const groupNameInput = document.createElement('input');
        groupNameInput.placeholder = 'Enter group name';
        
        // Create a button to create the group
        const createButton = document.createElement('button');
        createButton.textContent = 'Create';
        
        // Add an event listener to the create button
        createButton.addEventListener('click', () => {
            const groupName = groupNameInput.value;
            // Make a POST request to create the group
            axios.post('http://localhost:3000/group/createGroup', { groupName })
                .then(response => {
                    // Handle the response (e.g., show a success message)
                    console.log('Group created:', response.data);
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error creating group:', error);
                });
        });
        
        // Append the input and button to the container
        container.innerHTML = '';
        container.appendChild(groupNameInput);
        container.appendChild(createButton);
    }

    // Function to delete a group
    function deleteGroup() {
        // Get the container where the search bar and delete button will be displayed
        const container = document.getElementById('action-container');
        
        // Create a search input field
        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Search group name';
        
        // Create a button to delete the group
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        
        // Add an event listener to the delete button
        deleteButton.addEventListener('click', () => {
            const groupName = searchInput.value;
            // Make a DELETE request to delete the group
            axios.post(`http://localhost:3000/group/deleteGroup/${groupName}`)
                .then(response => {
                    // Handle the response (e.g., show a success message)
                    console.log('Group deleted:', response.data);
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error deleting group:', error);
                });
        });
        
        // Append the search input and delete button to the container
        container.innerHTML = '';
        container.appendChild(searchInput);
        container.appendChild(deleteButton);
    }

    // Function to add a user to a group
    function addToGroup() {
        // Get the container where the search bar and add button will be displayed
        const container = document.getElementById('action-container');
        
        // Create a search input field
        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Search group name';
        
        // Create a button to add a user to the group
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        
        // Add an event listener to the add button
        addButton.addEventListener('click', () => {
            const groupName = searchInput.value;
            // Make a POST request to add the user to the group
            axios.post('http://localhost:3000/group/addToGroup', { groupName })
                .then(response => {
                    // Handle the response (e.g., show a success message)
                    console.log('User added to group:', response.data);
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error adding user to group:', error);
                });
        });
        
        // Append the search input and add button to the container
        container.innerHTML = '';
        container.appendChild(searchInput);
        container.appendChild(addButton);
    }

createGroupBtn.addEventListener('click', createGroup);
deleteGroupBtn.addEventListener('click', deleteGroup);
addToGroupBtn.addEventListener('click', addToGroup);