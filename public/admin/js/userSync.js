// userSync.js
// This file keeps the user table updated with new users from the server

document.addEventListener('DOMContentLoaded', function() {
    // Waits for the webpage to load before starting
    const API_BASE_URL = '/api/v1/admin'; // Where we get user data from

    async function fetchUsers() {
        try {
            // Gets the user list from the server
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET', // Asking for data
                headers: {
                    'Content-Type': 'application/json', // Data format
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Secret key to access
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users'); // Stops if there’s an error
            const data = await response.json(); // Turns server data into usable info
            const formattedData = {}; // Empty box for users
            data.forEach(user => {
                // Adds each user to the box with their ID
                formattedData[user.id || Object.keys(window.usersData).length + 1] = user;
            });
            return formattedData; // Sends the user box back
        } catch (error) {
            console.error('Error fetching users:', error); // Shows error if something goes wrong
            return null; // Returns nothing to avoid breaking
        }
    }

    async function updateUserTable() {
        // Gets new users and updates the table
        const users = await fetchUsers();
        if (users) {
            // Mixes old and new users
            window.usersData = { ...window.usersData, ...users };
            // Updates the table with the new list
            window.refreshUserTable(window.usersData);
        }
    }

    setInterval(updateUserTable, 10000); // Checks for new users every 10 seconds
    updateUserTable(); // Checks right away when the page loads
});