function time() {


const now = new Date();
const currentTimeString = now.toLocaleTimeString();
console.log(currentTimeString);
const timetext = document.getElementById("time");
console.log(timetext)
timetext.innerHTML = currentTimeString;




}


time()





setInterval(function () {
  time()
}, 1000)



