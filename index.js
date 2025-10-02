const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");

const licensesPath = "./licenses.json"; // inside your cloned repo

function loadLicenses() {
  if (!fs.existsSync(licensesPath)) return {};
  return JSON.parse(fs.readFileSync(licensesPath));
}

function saveLicenses(licenses) {
  fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2));
  try {
    execSync("git add .");
    execSync('git commit -m "Update licenses"');
    execSync("git push");
    console.log("✅ Changes pushed to GitHub");
  } catch (err) {
    console.error("⚠️ Git push failed:", err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
      licenses[key] = true;
      saveLicenses(licenses);
      rl.close();
    });
  } else if (opt === "2") {
    rl.question("Enter key to disable: ", (key) => {
      if (licenses[key] !== undefined) {
        licenses[key] = false;
        saveLicenses(licenses);
      } else {
        console.log("❌ Key not found.");
      }
      rl.close();
    });
  } else if (opt === "3") {
    rl.question("Enter key to enable: ", (key) => {
      if (licenses[key] !== undefined) {
        licenses[key] = true;
        saveLicenses(licenses);
      } else {
        console.log("❌ Key not found.");
      }
      rl.close();
    });
  } else if (opt === "4") {
    rl.question("Enter key to delete: ", (key) => {
      if (licenses[key] !== undefined) {
        delete licenses[key];
        saveLicenses(licenses);
      } else {
        console.log("❌ Key not found.");
      }
      rl.close();
    });
  } else if (opt === "5") {
    console.log(licenses);
    rl.close();
  } else {
    console.log("Invalid option.");
    rl.close();
  }
});