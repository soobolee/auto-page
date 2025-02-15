import {app, BrowserWindow, ipcMain} from "electron";
import {join} from "path";
import fs from "fs/promises";
import {electronApp, optimizer, is} from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

function createWindow() {
  const mainWindow = new BrowserWindow({
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

const macroStageList = [];

ipcMain.on("event-occurred", (event, payload) => {
  macroStageList.push(JSON.parse(payload));

  event.reply("down-success", JSON.stringify(macroStageList));
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
