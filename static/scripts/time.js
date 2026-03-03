function time() {


const now = new Date();
const currentTimeString = now.toLocaleTimeString();

const timetext = document.getElementById("time");

timetext.innerHTML = currentTimeString;




}


time()





setInterval(function () {
  time()
}, 1000)



