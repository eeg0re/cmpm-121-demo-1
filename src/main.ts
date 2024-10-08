import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

// add the game name
const gameName = "My really cool game";
document.title = gameName;

// add a header
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// add a button
const clicker = document.createElement("button");
clicker.innerHTML = "🐈";
app.append(clicker);
