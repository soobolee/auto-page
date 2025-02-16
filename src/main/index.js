import {app, BrowserWindow, ipcMain} from "electron";
import {join} from "path";
import fs from "fs";
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

ipcMain.on("event-occurred", (event, payload) => {
  macroFileWrite(payload);

  event.reply("down-success", payload);
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

function macroFileWrite(fileContent) {
  try {
    if (fs.existsSync(join(__dirname, "recordedStaged.json"))) {
      const beforeStageList = fs.readFileSync(join(__dirname, "recordedStaged.json"));

      if (!beforeStageList) {
        console.error("매크로 파일을 불러오지 못했습니다.");
        return;
      }

      fs.writeFileSync(join(__dirname, "recordedStaged.json"), JSON.stringify([...JSON.parse(beforeStageList), fileContent]), {flag: "w+"});
    } else {
      fs.writeFileSync(join(__dirname, "recordedStaged.json"), JSON.stringify([fileContent]), {flag: "w+"});
    }
  } catch (error) {
    console.error(error);
  }
}
