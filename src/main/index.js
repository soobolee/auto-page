import {app, BrowserWindow, ipcMain} from "electron";
import {join} from "path";
import fs from "fs";
import {electronApp, optimizer, is} from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    ...(process.platform === "linux" ? {icon} : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      webviewTag: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.webContents.on("will-attach-webview", (_, webPreferences) => {
    webPreferences.preload = join(__dirname, "../preload/index.js");
  });
}

ipcMain.on("event-occurred", (event, payload) => {
  event.reply("client-event", payload);
});

const waitUntil = async () => {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!mainWindow.webContents.isBeingCaptured()) {
        resolve();
        clearInterval(interval);
      }
    }, 0);
  });
};

ipcMain.handle("capture-page", async (_, webviewSize) => {
  await waitUntil();
  const captureImage = await mainWindow.webContents.capturePage(JSON.parse(webviewSize));
  const resizeImage = await captureImage.resize({
    quality: "good",
  });
  const imageUrl = await resizeImage.toDataURL();

  return imageUrl;
});

ipcMain.handle("save-macro", (_, fileName, fileContent) => {
  writeMacroInfoFile(fileName, fileContent);
});

ipcMain.handle("save-image", (_, fileName, fileContent) => {
  writeMacroInfoFile(fileName, fileContent, true);
});

ipcMain.on("save-shortcut", (_, shortCutInfo) => {
  writeShortCutInfoFile(shortCutInfo);
});

ipcMain.handle("get-macro-item", () => {
  return getMacroItemList();
});

ipcMain.handle("get-shortcut-list", () => {
  return getShortCutList();
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function writeMacroInfoFile(fileName, fileContent, isImage) {
  try {
    const folderPath = getMacroFilePath(isImage);
    let macroName = fileName || getCurrentTime();

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const filePath = getMacroFilePath(isImage, `${macroName}.json`);

    if (fs.existsSync(filePath)) {
      const beforeJsonList = fs.readFileSync(filePath);

      if (!beforeJsonList) {
        console.error("매크로 관련 파일을 불러오지 못했습니다.");
        return;
      }

      const newJsonList = JSON.parse(beforeJsonList);
      newJsonList.push(fileContent);

      fs.writeFileSync(filePath, JSON.stringify(newJsonList), {flag: "w+"});
    } else {
      fs.writeFileSync(filePath, JSON.stringify(fileContent), {flag: "w+"});
    }
  } catch (error) {
    console.error(error);
  }
}

function writeShortCutInfoFile(fileContent) {
  try {
    const folderPath = join(__dirname, `../../shortCutFile`);
    const filePath = join(__dirname, `../../shortCutFile/shortcut.json`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    if (fs.existsSync(filePath)) {
      const beforeJsonList = fs.readFileSync(filePath);

      if (!beforeJsonList) {
        console.error("단축키 관련 파일을 불러오지 못했습니다.");
        return;
      }

      const newJsonList = JSON.parse(beforeJsonList);
      newJsonList.push(fileContent);

      fs.writeFileSync(filePath, JSON.stringify(newJsonList), {flag: "w+"});
    } else {
      fs.writeFileSync(filePath, JSON.stringify([fileContent]), {flag: "w+"});
    }
  } catch (error) {
    console.error(error);
  }
}

function getMacroFilePath(isImage, fileName = "") {
  if (isImage) {
    return join(__dirname, `../../imageFile/${fileName}`);
  } else {
    return join(__dirname, `../../macroFile/${fileName}`);
  }
}

function getMacroItemList(isImage) {
  try {
    if (!fs.existsSync(getMacroFilePath(isImage))) {
      return [];
    }

    const macroItemNameList = fs.readdirSync(getMacroFilePath(isImage));
    const macroItemList = [];

    macroItemNameList.forEach((macroName) => {
      if (macroName.includes("json")) {
        macroItemList.push({[macroName.replace(".json", "")]: fs.readFileSync(getMacroFilePath(isImage, macroName), {encoding: "utf8"})});
      }
    });

    return macroItemList;
  } catch (error) {
    console.error(error);
  }
}

function getShortCutList() {
  try {
    const filePath = join(__dirname, "../../shortCutFile/shortcut.json");

    if (!fs.existsSync(filePath)) {
      return [];
    }

    return fs.readFileSync(filePath, {encoding: "utf8"});
  } catch (error) {
    console.error(error);
  }
}

function getCurrentTime() {
  const date = new Date();
  const year = addFrontZero(date.getFullYear());
  const month = addFrontZero(date.getMonth() + 1);
  const day = addFrontZero(date.getDate());
  const hour = addFrontZero(date.getHours());
  const minute = addFrontZero(date.getMinutes());
  const second = addFrontZero(date.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
}

function addFrontZero(number) {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
}
