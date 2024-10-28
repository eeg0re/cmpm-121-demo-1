import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// add the game name
const gameName = "Pet the Cat";
document.title = gameName;

// add a header
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const mainButtonColor: string = "#604a70";
const upgradeButtonColor: string = "#4b345c";
const documentColor: string = "#8760a3";

// change the document color
document.body.style.backgroundColor = documentColor;

// adding a button
const clicker = document.createElement("button");
clicker.innerHTML = "🐈";
app.append(clicker);
// Add some sauce to it
clicker.style.width = "200px";
clicker.style.height = "200px";
clicker.style.fontSize = "60px";
clicker.style.backgroundColor = mainButtonColor;
clicker.style.borderRadius = "50%";
clicker.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.3)";

// make a variable to store the number of clicks we get
let counter: number = 0;
//---------------------- DEBUG TOGGLE ------------------------
const DEBUG: boolean = false;
if (DEBUG) {
  counter = 100000;
}
// -----------------------------------------------------------

// function to display the current number of pets
function DisplayPets() {
  const formattedCount = counter.toFixed(1);
  game_message.innerHTML = formattedCount + " times pet";
}

// --------- functions that'll switch colors for our fun catnip upgrade ----------------
//              The base of these 2 functions are provided from Brace
function interpolateColors(
  start: [number, number, number],
  end: [number, number, number],
  steps: number,
  step: number,
): string {
  const r = Math.round(start[0] + ((end[0] - start[0]) / steps) * step);
  const g = Math.round(start[1] + ((end[1] - start[1]) / steps) * step);
  const b = Math.round(start[2] + ((end[2] - start[2]) / steps) * step);
  return `rgb(${r}, ${g}, ${b})`;
}
//
function ActivateCatnip(
  interval: number,
  steps: number,
  colors: Array<[number, number, number]>,
) {
  let stepCount = 0;
  let currentColor = 0;
  setInterval(() => {
    const { currColor, numSteps } = HandleColorTransition(
      colors,
      currentColor,
      stepCount,
      steps,
    );
    currentColor = currColor;
    stepCount = numSteps;
  }, interval);
}
// --------------------------------------------------------------------------------------

function HandleColorTransition(
  colorList: Array<[number, number, number]>,
  currColor: number,
  numSteps: number,
  steps: number,
) {
  if (currColor < colorList.length - 1) {
    const gradientColor = interpolateColors(
      colorList[currColor],
      colorList[currColor + 1],
      steps,
      numSteps,
    );
    clicker.style.backgroundColor = gradientColor;
    numSteps++;

    if (numSteps > steps) {
      numSteps = 0;
      currColor++;
    }
  } else {
    currColor = 0;
    numSteps = 0;
  }
  return { currColor, numSteps };
}
// generalized tooltip interface so we can have fun messages for each button
function makeToolTip(button: HTMLButtonElement, buttonInfo: UpgradeButton) {
  const tooltip = document.createElement("div");
  tooltip.textContent =
    `Cost: ${buttonInfo.cost.toFixed(1)}. Rate: ${buttonInfo.growthRate.toFixed(1)}. ` +
    buttonInfo.message;
  tooltip.style.position = "absolute";
  tooltip.style.backgroundColor = "black";
  tooltip.style.padding = "5px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.display = "none"; // tooltip will be hidden initially
  app.append(tooltip);

  // add event listeners to the existing button so we can display this tooltip
  button.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
  }); // show on hover
  button.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  }); // hide when we leave
  button.addEventListener("mousemove", (event) => {
    // position the tooltip next to the cursor
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
  });

  return tooltip;
}

// function that makes upgrades
function makeUpgrade(attrs: UpgradeButton) {
  const button = document.createElement("button");
  button.innerHTML = attrs.label;
  button.style.backgroundColor = upgradeButtonColor;
  makeToolTip(button, attrs); // make a tooltip for this instance of a button
  if (!attrs.active) {
    button.disabled = true;
  }
  button.addEventListener("click", () => {
    ActivateUpgrade(button, attrs);
  });
  button.addEventListener("mouseover", () => {
    CheckFunds(button, attrs);
  });
  // check player funds each time they mouse over or leave the button
  button.addEventListener("mouseout", () => {
    CheckFunds(button, attrs);
  });

  app.append(button);
}

// function checks if player has enough to buy the current button and changes button state
function CheckFunds(
  button: HTMLButtonElement,
  buttonInfo: UpgradeButton,
): boolean {
  if (counter >= buttonInfo.cost) {
    button.disabled = false; // actually changes button status
    buttonInfo.active = true; // tracks button status in the interface
    return true;
  } else {
    button.disabled = true;
    buttonInfo.active = false;
    return false;
  }
}

const GRADIENT_INTERVAL = 10;
const GRADIENT_STEP = 100;
let totalPetRate = 0;
// function that will activate an upgrade if
function ActivateUpgrade(button: HTMLButtonElement, buttonInfo: UpgradeButton) {
  if (CheckFunds(button, buttonInfo)) {
    counter -= buttonInfo.cost;
    // buttonInfo.active = true;
    if (buttonInfo.label == "Catnip" && buttonInfo.firstPurchase) {
      ActivateCatnip(GRADIENT_INTERVAL, GRADIENT_STEP, colorSequence);
    }
    buttonInfo.firstPurchase = false;
    buttonInfo.timesBought += 1;
    buttonInfo.cost *= 1.15; // increase the cost by a little bit
    totalPetRate += buttonInfo.growthRate;
    DisplayStats();
    makeToolTip(button, buttonInfo);
  }
  // bool used to actually  the auto-clicker
  if (buttonInfo.active) {
    requestAnimationFrame(function (timestamp: number) {
      step(timestamp, buttonInfo);
    });
  }
}

function createUpgradesFromList(upgrades: UpgradeButton[]) {
  for (let i = 0; i < upgrades.length; i++) {
    makeUpgrade(upgrades[i]);
  }
}

function DisplayStats() {
  stats.innerHTML = "";
  let petRate = 0;
  for (let i = 0; i < upgradeList.length; i++) {
    stats.innerHTML +=
      "[ " + upgradeList[i].label + ": " + upgradeList[i].timesBought + " ]\n";
    if (upgradeList[i].active) {
      petRate += upgradeList[i].growthRate * upgradeList[i].timesBought;
    }
  }
  stats.innerHTML += "\nPets per second: " + petRate.toFixed(1);
}

function IncreaseClickCounter(this: HTMLButtonElement) {
  // increase the counting vairable
  counter++;
  // display the updated message
  DisplayPets();
  return;
}

const game_message = document.createElement("div");
game_message.style.fontSize = "25px";

DisplayPets();
app.append(game_message);

// check for button clicks on kitty
clicker.addEventListener("click", IncreaseClickCounter);

// define the colors to switch between when we activate catnip
const colorSequence: Array<[number, number, number]> = [
  [96, 74, 112],
  [103, 150, 199],
  [19, 128, 30],
  [237, 190, 21],
  [237, 190, 21],
  [191, 25, 114],
];

// step is the recursive function called by requestAnimationFrame, allows us to do our time math
let startTime: number; // time program starts
let prevTime: number = 0; // used to record previous timestamps (for math)
function step(timestamp: number, buttonInfo: UpgradeButton) {
  if (startTime === undefined) {
    startTime = timestamp;
    prevTime = startTime;
  }
  const elapsed = timestamp - prevTime; // store the elapsed time by subtracting the current time from the last time we recorded
  prevTime = timestamp; // record this time for the next time we do math

  // time is in milliseconds, so we divide elapsed by 1000 to get the correct unit
  const increment = (elapsed / 1000) * totalPetRate; // multiply the increment by this item's growth rate and the number of that item
  counter += increment; // add increment to counter
  DisplayPets(); // update the display with current number of pets

  requestAnimationFrame(function (timestamp: number) {
    // recursive call to requestAnimationFrame
    step(timestamp, buttonInfo); // use anonymous function call to allow step to take parameters
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
  message: string;
}

// make the upgrades a part of the list by default
const upgradeList: UpgradeButton[] = [
  // cost 10 pets, produces 0.1 pets/sec
  {
    label: "Kitty Petter 1000",
    firstPurchase: true,
    cost: 10,
    growthRate: 0.1,
    active: false,
    timesBought: 0,
    message:
      "A machine that pets a kitty for you. It doesn't work very fast but if you buy enough of them your cat will be happy.",
  },
  // cost 100 pets, produces 2 pets/sec
  {
    label: "Xtra Arms",
    firstPurchase: true,
    cost: 100,
    growthRate: 2.0,
    active: false,
    timesBought: 0,
    message:
      "An extra set of arms that keeps petting cats even when you have other things to do.",
  },
  // cost 50, 5 pets per sec
  {
    label: "Kitty Petter 5000",
    firstPurchase: true,
    cost: 500,
    growthRate: 10.0,
    active: false,
    timesBought: 0,
    message:
      "The stronger, better, faster version of the KP-1000. Pet kitties like never before with this must-have device.",
  },
  // cost 100 pets, produces 50 pets/sec
  {
    label: "Cat Companion",
    firstPurchase: true,
    cost: 1000,
    growthRate: 50.0,
    active: false,
    timesBought: 0,
    message:
      "A robot that stays by a cat's side and offers endless pets. It doesn't have hands so nobody really knows how it works.",
  },
  // cost 5000 pets, produce 100 pets/sec
  {
    label: "Cardboard Box",
    firstPurchase: true,
    cost: 5000,
    growthRate: 100.0,
    active: false,
    timesBought: 0,
    message: "You should probably throw this out but cats love it.",
  },
  // cost 10,000
  {
    label: "Catnip",
    firstPurchase: true,
    cost: 10000,
    growthRate: 200.0,
    active: false,
    timesBought: 0,
    message: "I don't know if you should give that to the cat.",
  },
];

createUpgradesFromList(upgradeList);

// display how many upgrades we have and what our growth rate is
const stats = document.createElement("div");
app.append(stats);

DisplayStats();
