function showNotification(result, subresult, success, login) {

var notification = document.createElement("div")



document.body.appendChild(notification)




var h1 = document.createElement("h1")
var h2 = document.createElement("h2")
h1.textContent = result;
h2.textContent = subresult;
notification.appendChild(h1)
notification.appendChild(h2)




if (success == true) {
var svg = document.createElement("svg")
svg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg>`
notification.appendChild(svg)









    notification.classList.add("notification", "success");
    setTimeout(() => {
    notification.classList.add("notification", "fadeOut");
    
}, 3000);

setTimeout(() => {
    notification.remove()
    if (login=true) {
        window.location.replace(redirectUrl);
    }
    
}, 3400);



} 

else {


var svg = document.createElement("svg")
svg.innerHTML = `<svg width="16px" height="16px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
<g id="style=bulk">
<g id="error-box">
<path id="vector (Stroke)" fill="#000000 fill-rule="evenodd" clip-rule="evenodd" d="M1.25 8C1.25 4.27208 4.27208 1.25 8 1.25H16C19.7279 1.25 22.75 4.27208 22.75 8V16C22.75 19.7279 19.7279 22.75 16 22.75H8C4.27208 22.75 1.25 19.7279 1.25 16V8Z" fill="#BFBFBF"/>
<path id="vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd" d="M8.46967 8.46967C8.76257 8.17678 9.23744 8.17678 9.53033 8.46967L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7625 15.8232 14.4696 15.5303L8.46967 9.53033C8.17678 9.23743 8.17678 8.76256 8.46967 8.46967Z" fill="#000000"/>
<path id="vector (Stroke)_3" fill-rule="evenodd" clip-rule="evenodd" d="M15.5303 8.46967C15.8232 8.76257 15.8232 9.23744 15.5303 9.53033L9.53033 15.5303C9.23743 15.8232 8.76256 15.8232 8.46967 15.5303C8.17678 15.2374 8.17678 14.7625 8.46967 14.4696L14.4697 8.46967C14.7626 8.17678 15.2374 8.17678 15.5303 8.46967Z" fill="#000000"/>
</g>
</g>
</svg>`
notification.appendChild(svg)





notification.classList.add("notification", "failed");
    setTimeout(() => {
    notification.classList.add("notification", "fadeOut");
    
}, 3000);

setTimeout(() => {
    notification.remove()
    
}, 3400);



}





}