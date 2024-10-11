import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// add the game name
const gameName = "My really cool game";
document.title = gameName;

// add a header
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// ----------- DEBUG TOGGLE -----------------
const DEBUG: boolean = false;
// ------------------------------------------
// adding a button
const clicker = document.createElement("button");
clicker.innerHTML = "🐈";
app.append(clicker);
// make it bigger
clicker.style.width = "200px";
clicker.style.height = "200px";
clicker.style.fontSize = "50px";

// make a variable to store the number of clicks we get
let counter: number = 0;
if (DEBUG) {
  counter = 1000;
}

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

//
let startTime: number;
let prevTime: number = 0;
function step(timestamp: number, buttonInfo: UpgradeButton) {
  if (startTime === undefined) {
    startTime = timestamp;
    prevTime = startTime;
  }

  // store the elapsed time by subtracting the current time from the last time we recorded
  const elapsed = timestamp - prevTime;

  // record this time for the next time we do math
  prevTime = timestamp;

  // time is in milliseconds, so we divide elapsed by 1000 to get the correct unit
  const increment =
    (elapsed / 1000) * buttonInfo.growthRate * buttonInfo.timesBought; // multiply the increment by this item's growth rate and the number of that item
  // add increment to counter
  counter += increment;

  DisplayPets();
  requestAnimationFrame(function (timestamp: number) {
    step(timestamp, buttonInfo);
  });
}

// create a generalized upgrade button so we can add more
interface UpgradeButton {
  label: string;
  firstPurchase: boolean;
  cost: number;
  growthRate: number;
  active: boolean;
  timesBought: number;
}

// function that makes upgrades
function makeUpgrade(attrs: UpgradeButton) {
  const button = document.createElement("button");
  button.innerHTML = attrs.label;
  if (!attrs.active) {
    button.disabled = true;
  }
  button.addEventListener("click", () => {
    ActivateUpgrade(attrs);
  });
  button.addEventListener("mouseover", () => {
    CheckFunds(button, attrs);
  }); // mouse check player funds each
  button.addEventListener("mouseout", () => {
    CheckFunds(button, attrs);
  }); // time them mouse over or leave the button

  app.append(button);
}
// function checks if player has enough to buy the current button and changes button state
function CheckFunds(button: HTMLButtonElement, buttonInfo: UpgradeButton) {
  if (counter >= buttonInfo.cost) {
    button.disabled = false; // actually changes button status
    buttonInfo.active = true; // tracks button status in the interface
  } else {
    button.disabled = true;
    buttonInfo.active = false;
  }
}

// function that will activate an upgrade if
function ActivateUpgrade(buttonInfo: UpgradeButton) {
  if (counter >= buttonInfo.cost) {
    counter -= buttonInfo.cost;
    buttonInfo.active = true;
    buttonInfo.firstPurchase = false;
    buttonInfo.timesBought += 1;
    buttonInfo.cost *= 1.15;    // increase the cost by a little bit
    DisplayStats();
  }
  // bool used to actually  the auto-clicker
  if (buttonInfo.active) {
    requestAnimationFrame(function (timestamp: number) {
      step(timestamp, buttonInfo);
    });
  }
}

const upgradeList: UpgradeButton[] = [];

// first upgrade, cost 10 pets, produces 0.1 pets/sec
const kittyPetter1000: UpgradeButton = {
  label: "Kitty Petter 1000",
  firstPurchase: true,
  cost: 10,
  growthRate: 0.1,
  active: false,
  timesBought: 0,
};
makeUpgrade(kittyPetter1000); // initialize our 1st upgrade button
upgradeList.push(kittyPetter1000); // add this upgrade to our list of upgrades

// second upgrade, cost 100 pets, produces 2 pets/sec
const DoubleArms: UpgradeButton = {
  label: "Double Arms",
  firstPurchase: true,
  cost: 100,
  growthRate: 2.0,
  active: false,
  timesBought: 0,
};
makeUpgrade(DoubleArms); // initialize  2nd upgrade button
upgradeList.push(DoubleArms);

// third upgrade, cost 100 pets, produces 2 pets/sec
const KittyCompanion: UpgradeButton = {
  label: "Kitty Companion",
  firstPurchase: true,
  cost: 1000,
  growthRate: 50.0,
  active: false,
  timesBought: 0,
};
makeUpgrade(KittyCompanion); // initialize  3rd upgrade button
upgradeList.push(KittyCompanion);

// display how many upgrades we have and what our growth rate is
const stats = document.createElement("div");
app.append(stats);
// stats.innerHTML;

function DisplayStats() {
  stats.innerHTML = "";
  let petRate = 0;
  for (let i = 0; i < upgradeList.length; i++) {
    stats.innerHTML +=
      upgradeList[i].label + ": " + upgradeList[i].timesBought + "\n";
    if (upgradeList[i].active) {
      petRate += upgradeList[i].growthRate * upgradeList[i].timesBought;
    }
  }
  stats.innerHTML += "\nPets per second: " + petRate.toFixed(1);
}

DisplayStats();
