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
function DisplayPets() {
  const formattedCount = counter.toFixed(1);
  game_message.innerHTML = formattedCount + " times pet";
}
// check for button clicks
clicker.addEventListener("click", IncreaseClickCounter);

// set up the autoclicker that increments based on framerate
let startTime: number;
let prevTime: number = 0;
let auto_multiplier: number = 1; 
function step(timestamp: number) {
  if (startTime === undefined) {
    startTime = timestamp;
    prevTime = startTime;
  }

  
  // store the elapsed time by subtracting the current time from the last time we recorded
  const elapsed = timestamp - prevTime;

  // record this time for the next time we do math
  prevTime = timestamp;

  // time is in milliseconds, so we divide elapsed by 1000 to get the correct unit
  const increment = (elapsed / 1000) * auto_multiplier;
  // add increment to counter
  counter += increment;

  DisplayPets();
  requestAnimationFrame(step);
}

// add a button for players to purrchase a kitty petter
const autoPetButton = document.createElement("button");
autoPetButton.disabled = true;
autoPetButton.innerHTML = "Kitty Petter 1000";
app.append(autoPetButton);
autoPetButton.addEventListener("click", ActivatePetter);
autoPetButton.addEventListener("mouseover", CheckFunds);  // mouse check player funds each
autoPetButton.addEventListener("mouseout", CheckFunds);   // time them mouse over or leave the button
let kittyPetter: boolean = false; // use this to check if the player has bought the kitty petter
let firstAutoPet: boolean = true; // check if it's the first time the player has bought this
let autoCost: number = 10; 

function CheckFunds(this: HTMLButtonElement){
  if(counter >= autoCost){
    autoPetButton.disabled = false; 
  }
  else{
    autoPetButton.disabled = true; 
  }
}

function ActivatePetter(this: HTMLButtonElement){
  if(counter >= autoCost){
    if(!firstAutoPet){
      auto_multiplier *= 1.1; // increase the amount of auto petting by a little bit
      autoCost *= 1.1;  // increase the cost little by little
    }
    counter -= autoCost; 
    kittyPetter = true;
    firstAutoPet = false;
  }

  // bool used to call the auto-clicker
  if(kittyPetter){
    requestAnimationFrame(step);
  }
}


