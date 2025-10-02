const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");
const chalk = require("chalk")
const licensesPath = __dirname+"/licenses.json"; // inside your cloned repo

function loadLicenses() {
  if (!fs.existsSync(licensesPath)) return {};
  return JSON.parse(fs.readFileSync(licensesPath));
}

function saveLicenses(licenses) {
  fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2));
  try {
    execSync("git add .", { stdio: "ignore" });
    execSync('git commit -m "Update licenses"', { stdio: "ignore" });
    execSync("git push", { stdio: "ignore" });
    success("✅ Licenses has been updated");
    startManager();
  } catch (err) {
    error("⚠️ Git push failed:", err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
startManager()
function startManager() {

console.log("License Manager:");
console.log("[1] Add key");
console.log("[2] Disable key");
console.log("[3] Enable key");
console.log("[4] Delete key");
console.log("[5] List keys");

rl.question("Choose option: ", (opt) => {
  const licenses = loadLicenses();
  if (opt === "1") {
    rl.question("Enter new key: ", (key) => {
        if(licenses[key]) {
            error("This key is already signed.")
            return startManager()
        }
      licenses[key] = true;
      saveLicenses(licenses);
      startManager()
    });
  } else if (opt === "2") {
    rl.question("Enter key to disable: ", (key) => {
      if (licenses[key] !== undefined) {
        licenses[key] = false;
        saveLicenses(licenses);
        startManager()
      } else {
        startManager()
        error("❌ Key not found.");
      }
      
    });
  } else if (opt === "3") {
    rl.question("Enter key to enable: ", (key) => {
      if (licenses[key] !== undefined) {
        licenses[key] = true;
        saveLicenses(licenses);
        startManager()
      } else {
        error("❌ Key not found.");
        startManager()
      }
    });
  } else if (opt === "4") {
    rl.question("Enter key to delete: ", (key) => {
      if (licenses[key] !== undefined) {
        delete licenses[key];
        saveLicenses(licenses);
        startManager()
      } else {
        error("❌ Key not found.");
        startManager()
      }
    });
  } else if (opt === "5") {
    console.log(licenses);
    startManager()
  } else {
    error("Invalid option.");
    startManager()
  }
});
}

function error(log) {
return console.error(chalk.red(chalk.bold(log)));
}
function success(log) {
return console.log(chalk.green(chalk.bold(log)));
}
function log(log) {
return console.log(this.log);
}