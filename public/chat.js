let socket = io();
let name = "<%= user.username %>"
const btn = document.querySelector("#send");
let messageForm = document.querySelector("#message-input");
let chatForm = document.getElementById("chat-form");
let messageContainer = document.querySelector("#msg-container"); 
let chatContainer = document.querySelector("#chat-container");
let panel = document.querySelector("#notify");
let arr = ["soz1","soz2"];
let userId = "<%= user.id %>"
let messageD = document.querySelector("p.message");
let audio = document.getElementById("audio");
let vipKeys = [
  "xsfOsppS",
  "aFrYspD",
  "PsHdodoMexy",
  "fLQeYwpdS",
  "aNekanzJdo",
  "socKet"
 ];

let badwords = [];

  chatForm.addEventListener("submit", e =>{
  e.preventDefault()      
  if(messageForm.value === ""){
    return;
  } else if(messageForm.value.startsWith("/")){
    return;
  } else if(name.startsWith("AFK")){
    localStorage.setItem("name", name.substring(0, 4))
    location.reload()
  } else if(arr.some(arrElem => messageForm.value.includes(arrElem.toLowerCase()))){
    socket.emit("badWord", name );
  } else if(badwords.some( words => messageForm.value.includes(words))){
    return;
  } else {
  socket.emit("message", { message : messageForm.value, name : name.split("@").shift() })
  createMyMessage(`${name.split("@").shift()} : ${messageForm.value}`);
  reset()     
  socket.emit("leveling", { name : name })
  chatContainer.scrollTop = chatContainer.scrollHeight;
  panel.scrollTop = panel.scrollHeight;
  }
})   


btn.addEventListener("click",() =>{
  if(messageForm.value.startsWith("/duyuru")){
    let args = messageForm.value.split(" ").slice(1).join(" ");
    socket.emit("duyuru", args)
 }
  if(messageForm.value === "/id"){
    createBotMessage(userId)
  }
  
  if(messageForm.value === "/vip"){
    if(name.split("@").shift() === "qtuncay40"){
      createBotMessage("Sən VIP-sən");
    }
  }
  
      
  if(messageForm.value.startsWith("/qutu-aç")){
    socket.emit("qutu-ac", name)
}
  
  if(messageForm.value.startsWith("/ban")){
    let socketID = messageForm.value.split(" ").slice(1);
    socket.emit("banUser", socketID);
  }
  
  if(messageForm.value.startsWith("/afk")){
    let reason = messageForm.value.split(" ").slice(1);
    localStorage.setItem("name", `AFK | ${name}`);
    location.reload()
  }
  
  if(messageForm.value === "/clear"){
    location.reload()
  }
  audio.play()
  chatContainer.scrollTop = chatContainer.scrollHeight;
  panel.scrollTop = panel.scrollHeight;
})

socket.on("message", data =>{
  if(vipKeys.some(keys => data.name.split("@").pop() === keys)){
     createVipMessage(`${data.name} : ${data.message}`);
     audio.play()
     chatContainer.scrollTop = chatContainer.scrollHeight;
  } else {
  createStrangerMessage(`${data.name.split("@").shift()} : ${data.message}`)
  audio.play()
  chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});



socket.on("connected", () =>{
  socket.emit("user-connection", name)
})

socket.on("disconnected", () =>{
  socket.emit("user-disconnection", name)
})
  
socket.on("badword", name =>{
  return createBotMessage(`${name} istifadəçisi qadağan olunmuş söz işlətdi!`);
})

socket.on("silah", data =>{
  const options = {
    headers : {
      "Content-Type" : "application/json"
  },
    
    method : "POST"
  }
  
fetch("https://papyrus-bot.glitch.me/apis/random-gun", options)
.then(res => res.json())
.then(gunData => {
   createBotMessage(`${data} istifadəçisi Silah Qutusu açdı!<br><br>
   Silah Tipi : ${gunData.gun_type}<br>
   Silah Növü : ${gunData.gun_name}`)
})
})

socket.on("nicknameUpdate", nick =>{
  if(nick.newNick.includes("🏆")){
    if(vipKeys(keys => nick.newNick.split("@").pop() !== keys)){
   return;
  }
}
  createBotMessage(`${nick.oldNick.split("@").shift()} istifadəçisi adını dəyişdi! Yeni adı : ${nick.newNick.split("-").shift()}`)
})

socket.on("userConnection", message =>{
  
 return createBotMessage(message.message + "<br>")
})

socket.on("levelUp", data =>{
  alert("s")
})

socket.on("userDisconnection", message =>{
  return createBotMessage(message + "<br>")
})

socket.on("duyuru",data =>{
  createBotMessage(`${data}`)
})

socket.on("vip-user", name2 =>{
  return createBotMessage(`VIP İstifadəçi qoşuldu : ${name2.split("-").shift()}`)
})

function reset(){
  messageForm.value = "";
}

function createMyMessage(message){
 let messageElement = document.createElement("p");
  messageElement.classList.add("message");
  messageElement.innerHTML = message;
  document.querySelector(".msg-container").appendChild(messageElement)
}

function createStrangerMessage(message){
  let messageElement = document.createElement("p");
  messageElement.classList.add("message2");
  messageElement.innerHTML = message;
  document.querySelector(".msg-container").appendChild(messageElement);
}
    
function createBotMessage(message){
  let messageElement = document.createElement("p");
  messageElement.classList.add("message3")
  messageElement.innerHTML = "Project Alpha : " + message;
  document.querySelector("#notify").appendChild(messageElement);
};

function previewFile(){
  let fileInput = document.getElementById("file");
  let file = fileInput.files[0];
  let reader = new FileReader()
  let preview = document.getElementById("sekil");
  
   reader.addEventListener("load", function () {
     createImage(reader.result)
}, false);

if (file){
let url = reader.readAsDataURL(file)
socket.emit("image", url)
}
}    

function createImage(url){
  let img = document.createElement("img");
  img.setAttribute("src", url)
  document.querySelector(".msg-container").appendChild(img)
}

function createUserList(list){
  let div = document.getElementById("listofusers")
  div.innerHTML = list;
}