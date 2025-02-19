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

async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

ipcMain.handle("capture-page", async (_, webviewSize) => {
  await sleep(300);
  const captureImage = await mainWindow.webContents.capturePage(webviewSize);
  const resizeImage = await captureImage.resize({
    quality: "good",
  });
  const imageUrl = await resizeImage.toDataURL();

  return imageUrl;
});

ipcMain.handle("save-macro", (_, fileName, fileContent, contentType) => {
  return writeMacroInfoFile(fileName, fileContent, contentType);
});

ipcMain.handle("save-image", (_, fileName, fileContent) => {
  return writeMacroInfoFile(fileName, fileContent, "image");
});

ipcMain.handle("delete-macro-and-iamge", (_, fileName) => {
  deleteFile(fileName);

  return getMacroItemList();
});

ipcMain.handle("get-macro-item", () => {
  return getMacroItemList();
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

function writeMacroInfoFile(fileName, fileContent, contentType) {
  try {
    const folderPath = getMacroFilePath(contentType);
    let macroName = fileName || getCurrentTime();

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const filePath = getMacroFilePath(contentType, `${macroName}.json`);

    if (fs.existsSync(filePath)) {
      const beforeJson = fs.readFileSync(filePath);

      if (!beforeJson) {
        console.error("매크로 관련 파일을 불러오지 못했습니다.");
        return;
      }

      const parseJson = JSON.parse(beforeJson);
      parseJson[contentType] = fileContent;

      fs.writeFileSync(filePath, JSON.stringify(parseJson), {flag: "w+"});
    } else {
      fs.writeFileSync(filePath, JSON.stringify({[contentType]: fileContent}), {flag: "w+"});
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}

function deleteFile(fileName) {
  try {
    const addedJsonFileName = `${fileName}.json`;
    const macroFilePath = getMacroFilePath("stageList", addedJsonFileName);
    const imageFilePath = getMacroFilePath("image", addedJsonFileName);

    const pathList = [macroFilePath, imageFilePath];

    pathList.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function getMacroFilePath(contentType = "stageList", fileName = "") {
  if (contentType === "image") {
    return join(__dirname, `../../imageFile/${fileName}`);
  }

  return join(__dirname, `../../macroFile/${fileName}`);
}

function getMacroItemList(contentType) {
  try {
    if (!fs.existsSync(getMacroFilePath(contentType))) {
      return [];
    }

    const macroItemNameList = fs.readdirSync(getMacroFilePath(contentType));
    const macroItemList = [];

    macroItemNameList.forEach((macroName) => {
      if (macroName.includes("json")) {
        const readFile = fs.readFileSync(getMacroFilePath(contentType, macroName), {encoding: "utf8"});
        const parseReadFile = JSON.parse(readFile);

        parseReadFile["macroName"] = macroName.replace(".json", "");
        macroItemList.push(parseReadFile);
      }
    });

    return macroItemList;
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
