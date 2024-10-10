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
DisplayPets();
app.append(game_message);

// function for increasing the counter
function IncreaseClickCounter(this: HTMLButtonElement) {
  // increase the counting vairable
  counter++;
  // display the updated message
  DisplayPets();
  return;
}

// function to display the current number of pets 
function DisplayPets(){
  const formattedCount = counter.toFixed(1);
  game_message.innerHTML = formattedCount + " times pet";
}
// check for button clicks
clicker.addEventListener("click", IncreaseClickCounter);

// set up the autoclicker that increments based on framerate
let startTime: number;
let prevTime: number = 0; 
function step(timestamp: number){
  if(startTime === undefined){
    startTime = timestamp;
  }

  // store the elapsed time by subtracting the current time from the last time we recorded
  const elapsed = timestamp - prevTime;

  // record this time for the next time we do math
  prevTime = timestamp;

  // time is in milliseconds, so we divide elapsed by 1000 to get the correct unit
  const increment = elapsed / 1000;

  // add increment to counter 
  counter += increment; 

  DisplayPets();

  requestAnimationFrame(step);
}

requestAnimationFrame(step);