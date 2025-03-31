import {electronApp, is, optimizer} from "@electron-toolkit/utils";
import crypto from "crypto";
import {BrowserWindow, app, ipcMain} from "electron";
import fs from "fs";
import {join} from "path";

import icon from "../../resources/icon.png?asset";
import {sleep} from "./commonUtils";
import {deleteFile, getMacroItem, getMacroItemList, writeMacroInfoFile} from "./fileUtils";

let mainWindow = null;
let didMacroExecute = false;
let webviewSession = `persist:${crypto.randomBytes(16)}`;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    ...(process.platform === "linux" ? {icon} : {}),
    icon: icon,
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
    webPreferences.partition = webviewSession;
    webPreferences.preload = join(__dirname, "../preload/index.js");
  });
};

const createCryptKey = () => {
  const keyPath = join(app.getPath("userData"), "CRYPT_KEY");
  const ivPath = join(app.getPath("userData"), "CRYPT_IV");

  const savedKey = fs.existsSync(keyPath);
  const savedIv = fs.existsSync(ivPath);

  if (!savedKey || !savedIv) {
    fs.writeFileSync(keyPath, crypto.randomBytes(32));
    fs.writeFileSync(ivPath, crypto.randomBytes(16));
  }
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  createCryptKey();

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

ipcMain.on("did-execute-macro", (_, isMacroExecuting) => {
  didMacroExecute = isMacroExecuting;

  if (didMacroExecute) {
    webviewSession = `persist:${crypto.randomBytes(16)}`;
  }
});

ipcMain.on("event-occurred", (event, payload) => {
  event.reply("client-event", payload);
});

ipcMain.handle("capture-page", async (_, webviewSize) => {
  try {
    await sleep(400);
    const captureImage = await mainWindow.webContents.capturePage(JSON.parse(webviewSize));
    const resizeImage = await captureImage.resize({
      quality: "good",
    });
    const imageUrl = await resizeImage.toDataURL();

    return imageUrl || null;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle("save-macro", (_, fileName, fileContent, contentType) => {
  return writeMacroInfoFile(fileName, fileContent, contentType);
});

ipcMain.handle("save-image", (_, fileName, fileContent) => {
  return writeMacroInfoFile(fileName, fileContent, "image");
});

ipcMain.handle("delete-macro-and-image", (_, fileName, imageDeleteOption) => {
  const deletedResult = deleteFile(fileName, imageDeleteOption);

  if (!deletedResult) {
    return;
  }

  return getMacroItemList();
});

ipcMain.handle("get-macro-item-list", () => {
  return getMacroItemList();
});

ipcMain.handle("get-macro-item", (_, contentType, fileName) => {
  return getMacroItem(contentType, fileName);
});
