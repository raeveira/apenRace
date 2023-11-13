// leaderboard.js

document.addEventListener("DOMContentLoaded", function () {
    const showLeaderboardButton = document.getElementById("scoreboard");
    const closeLeaderboardButton = document.getElementById("closeLeaderboardButton");
    const leaderboardPopup = document.getElementById("leaderboardPopup");

    // Event listener to show leaderboard when the button is clicked
    showLeaderboardButton.addEventListener("click", () => {
        leaderboardPopup.style.display = "block";
    });

    // Event listener to close the leaderboard when the button is clicked
    closeLeaderboardButton.addEventListener("click", () => {
        leaderboardPopup.style.display = "none";
    });

    // Load the user's selected difficulty when the page loads
    async function fetchLeader() {
        try {
            const response = await fetch("/leaderboard/get-leaderboard");
            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            // Check if the 'wins' array contains entries
            if (data.wins && data.wins.length > 0) {
                const leaderboardContainer = document.getElementById("leaderboardContainer");
                const leaderRankContent = document.getElementById("leaderRankContent");
                const leaderUsernameContent = document.getElementById("leaderUsernameContent");
                const leaderWinsContent = document.getElementById("leaderWinsContent");
                
                let rank = 1; // Initialize the rank
    
                // Sort the 'wins' array in descending order by the 'wins' property
                data.wins.sort((a, b) => b.wins - a.wins);
    
                // Loop through the sorted array and create a paragraph for each entry
                data.wins.forEach(entry => {
                    const paragraphRank = document.createElement("p");
                    const paragraphUser = document.createElement("p");
                    const paragraphWins = document.createElement("p");
                    paragraphRank.textContent = `${rank}.`;
                    paragraphUser.textContent = `${entry.user_name}`;
                    paragraphWins.textContent = `${entry.wins}`;
    


                    // Append the paragraph to the container
                    leaderRankContent.appendChild(paragraphRank);
                    leaderUsernameContent.appendChild(paragraphUser);
                    leaderWinsContent.appendChild(paragraphWins);
    
                    rank++; // Increment the rank
                });
            }
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to be handled elsewhere if needed.
        }
    }

    // Call the fetchLeader function and use the returned data
    fetchLeader();
});
