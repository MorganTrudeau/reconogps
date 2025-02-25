const fs = require("fs");
const plist = require("plist");

// Utility function to increment version numbers
function incrementVersion(version, buildNumber) {
  if (process.env.BUILD_NUMBER) {
    return {
      version,
      buildNumber: Number(buildNumber) + 1,
    };
  }
  const versionParts = version.split(".").map(Number);
  versionParts[2] += 1; // Increment patch version
  if (versionParts[2] >= 10) {
    versionParts[2] = 0;
    versionParts[1] += 1;
  }
  if (versionParts[1] >= 10) {
    versionParts[1] = 0;
    versionParts[0] += 1;
  }
  return {
    version: versionParts.join("."),
    buildNumber: Number(buildNumber) + 1,
  };
}

// Update app.json
function updateAppJson() {
  const appJsonPath = "./app.json";
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

  const newVersionInfo = incrementVersion(appJson.expo.version, appJson.expo.buildNumber);

  appJson.version = newVersionInfo.version;
  appJson.buildNumber = Number(newVersionInfo.buildNumber);

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log(
    `Updated app.json to Version ${appJson.version}-${appJson.buildNumber}`
  );
}

// Update android/app/build.gradle
function updateAndroidBuildGradle() {
  const buildGradlePath = "./android/app/build.gradle";
  let buildGradle = fs.readFileSync(buildGradlePath, "utf8");

  // Update versionCode and versionName
  const versionCodeMatch = /versionCode (\d+)/.exec(buildGradle);
  const versionNameMatch = /versionName "(\d+\.\d+\.\d+)"/.exec(buildGradle);

  if (versionCodeMatch && versionNameMatch) {
    const newVersionInfo = incrementVersion(
      versionNameMatch[1],
      parseInt(versionCodeMatch[1], 10)
    );

    buildGradle = buildGradle.replace(
      /versionCode \d+/,
      `versionCode ${newVersionInfo.buildNumber}`
    );
    buildGradle = buildGradle.replace(
      /versionName "\d+\.\d+\.\d+"/,
      `versionName "${newVersionInfo.version}"`
    );

    fs.writeFileSync(buildGradlePath, buildGradle);
    console.log(
      `Updated android/app/build.gradle to version ${newVersionInfo.version}, build ${newVersionInfo.buildNumber}`
    );
  } else {
    console.error("Could not find versionCode or versionName in build.gradle");
  }
}

// Update ios/employeelink/Info.plist
function updateIosInfoPlist() {
  const infoPlistPath = "./ios/recono/Info.plist";
  const infoPlistContent = fs.readFileSync(infoPlistPath, "utf8");
  const infoPlist = plist.parse(infoPlistContent);

  const newVersionInfo = incrementVersion(
    infoPlist.CFBundleShortVersionString,
    parseInt(infoPlist.CFBundleVersion, 10)
  );

  infoPlist.CFBundleShortVersionString = newVersionInfo.version;
  infoPlist.CFBundleVersion = newVersionInfo.buildNumber.toString();

  fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
  console.log(
    `Updated ios/recono/Info.plist to Version ${newVersionInfo.version}-${newVersionInfo.buildNumber}`
  );
}

// Run updates
updateAppJson();
updateAndroidBuildGradle();
updateIosInfoPlist();
