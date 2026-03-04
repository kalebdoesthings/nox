function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

const debouncedSearch = debounce(searchUser, 500);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-wrapper input').addEventListener('input', debouncedSearch);
});

function constructUser(username) {
const parent = document.querySelector('.friends');

const friendpanel = document.createElement('div');
friendpanel.className = "friendpanel"
const usernameText = document.createElement("h1")
usernameText.textContent = username
const pfp = document.createElement("img")
pfp.classList = "friendPfp"
pfp.src = `/static/svg/circle-user.svg`



parent.appendChild(friendpanel);
friendpanel.appendChild(pfp)
friendpanel.appendChild(usernameText)



}







async function searchUser(e) {
    const username = e.target.value;

    // Clear results if input is empty
    if (username.length === 0) {
        document.querySelectorAll('.friendpanel').forEach(panel => panel.remove());
        document.querySelectorAll('.noUser').forEach(el => el.remove());
        return;
    }

    // Only search if at least 2 characters
    if (username.length < 2) return;

    const response = await fetch("/usersearch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username })
});

const data = await response.json();





if (data.results == "404_Username") {
    
    document.querySelectorAll('.friendpanel').forEach(panel => panel.remove());
    document.querySelectorAll('.noUser').forEach(el => el.remove());

    const noUser = document.createElement("h1")
    noUser.classList = "noUser";
    noUser.textContent = "No results..."
    const parent = document.querySelector('.friends');
    parent.appendChild(noUser)
}

else {
    
    document.querySelectorAll('.friendpanel').forEach(panel => panel.remove());
    document.querySelectorAll('.noUser').forEach(el => el.remove());

    data.results.forEach(user => {
        constructUser(user.username)
    });
}
}