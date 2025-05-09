import {electronApp, is, optimizer} from "@electron-toolkit/utils";
import crypto from "crypto";
import {BrowserWindow, IpcMainInvokeEvent, app, ipcMain} from "electron";
import fs from "fs";
import {join} from "path";

import icon from "../../resources/icon.png?asset";
import {MacroContentType, MacroStage} from "./types/main";
import {sleep} from "./utils/commonUtils";
import {deleteFile, getMacroItem, getMacroItemList, writeMacroInfoFile} from "./utils/fileUtils";

let mainWindow: BrowserWindow | null = null;
let webviewSession = `persist:${crypto.randomBytes(16).toString("hex")}`;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    ...(process.platform === "linux" ? {icon} : {}),
    icon,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      webviewTag: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.maximize();
    mainWindow?.show();
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

const createCryptKey = (): void => {
  const keyPath = join(app.getPath("userData"), "CRYPT_KEY");
  const ivPath = join(app.getPath("userData"), "CRYPT_IV");

  if (!fs.existsSync(keyPath)) {
    fs.writeFileSync(keyPath, crypto.randomBytes(32), "utf8");
  }

  if (!fs.existsSync(ivPath)) {
    fs.writeFileSync(ivPath, crypto.randomBytes(16), "utf8");
  }
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  createCryptKey();

  app.on("activate", () => {
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

ipcMain.on("did-execute-macro", (_, isMacroExecuting: boolean) => {
  if (isMacroExecuting) {
    webviewSession = `persist:${crypto.randomBytes(16).toString("hex")}`;
  }
});

ipcMain.on("event-occurred", (event, payload) => {
  event.reply("client-event", payload);
});

ipcMain.handle("capture-page", async (_: IpcMainInvokeEvent, webviewSize: string) => {
  try {
    await sleep(400);
    if (!mainWindow) {
      throw new Error("mainWindow is not initialized");
    }

    const captureImage = await mainWindow.webContents.capturePage(JSON.parse(webviewSize));
    const resized = await captureImage.resize({quality: "good"});

    return resized.toDataURL();
  } catch (error) {
    console.error("capture-page error:", error);
    return null;
  }
});

ipcMain.handle(
  "save-macro",
  (_: IpcMainInvokeEvent, fileName: string, fileContent: MacroStage[], contentType: MacroContentType) => {
    return writeMacroInfoFile(fileName, fileContent, contentType);
  }
);

ipcMain.handle("save-image", (_: IpcMainInvokeEvent, fileName: string, fileContent: MacroStage[]) => {
  return writeMacroInfoFile(fileName, fileContent, "image");
});

ipcMain.handle("delete-macro-and-image", (_: IpcMainInvokeEvent, fileName: string, imageDeleteOption: boolean) => {
  const deleted = deleteFile(fileName, imageDeleteOption);
  return deleted ? getMacroItemList("stageList") : null;
});

ipcMain.handle("get-macro-item-list", () => {
  return getMacroItemList("stageList");
});

ipcMain.handle("get-macro-item", (_: IpcMainInvokeEvent, contentType: MacroContentType, fileName: string) => {
  return getMacroItem(contentType, fileName);
});
