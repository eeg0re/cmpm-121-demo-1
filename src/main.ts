import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// add the game name
const gameName = "My really cool game";
document.title = gameName;

// add a header
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// adding a button
const clicker = document.createElement("button");
clicker.innerHTML = "🐈";
app.append(clicker);

// make a variable to store the number of clicks we get
let counter: number = 0;
const game_message = document.createElement("div");
game_message.innerHTML = `${counter} pets given`;
app.append(game_message);

// function for increasing the counter
function IncreaseCounter(this: HTMLButtonElement) {
  // increase the counting vairable
  counter++;
  // display the updated message
  game_message.innerHTML = `${counter} pets given`;
  return;
}

// check for button clicks
clicker.addEventListener("click", IncreaseCounter);

// set up the auto-clicker 
setInterval(IncreaseCounter, 1000);
