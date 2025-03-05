import {app, BrowserWindow, ipcMain} from "electron";
import {join} from "path";
import fs from "fs";
import crypto from "crypto";
import {electronApp, optimizer, is} from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

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
  const sleep = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

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

const writeMacroInfoFile = (fileName, fileContent, contentType) => {
  try {
    const folderPath = getMacroFilePath(contentType);
    let macroName = fileName || getCurrentTime();

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const filePath = getMacroFilePath(contentType, `${macroName}.json`);

    if (contentType === "stageList") {
      fileContent.forEach((content) => {
        if (content.value) {
          content.value = encrypt(content.value);
        }
      });
    }

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
};

const deleteFile = (fileName, imageDeleteOption) => {
  try {
    const addedJsonFileName = `${fileName}.json`;
    const macroFilePath = getMacroFilePath("stageList", addedJsonFileName);
    const imageFilePath = getMacroFilePath("image", addedJsonFileName);
    const pathList = [];

    pathList.push(macroFilePath);

    if (imageDeleteOption) {
      pathList.push(imageFilePath);
    }

    pathList.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    return true;
  } catch (error) {
    console.error(error);
  }
};

const getMacroFilePath = (contentType = "stageList", fileName = "") => {
  if (contentType === "image") {
    return join(app.getPath("userData"), `/imageFile/${fileName}`);
  }

  return join(app.getPath("userData"), `/macroFile/${fileName}`);
};

const getMacroItemList = (contentType) => {
  try {
    if (!fs.existsSync(getMacroFilePath(contentType))) {
      return [];
    }

    const macroItemNameList = fs.readdirSync(getMacroFilePath(contentType));

    const macroItemList = macroItemNameList.map((macroName) => {
      if (macroName.includes("json")) {
        const readFile = fs.readFileSync(getMacroFilePath(contentType, macroName), {encoding: "utf8"});
        const fileStat = fs.statSync(getMacroFilePath(contentType, macroName));
        const parseReadFile = JSON.parse(readFile);

        parseReadFile.stageList.forEach((content) => {
          if (content.value) {
            content.value = decrypt(content.value);
          }
        });

        parseReadFile["macroName"] = macroName.replace(".json", "");
        parseReadFile["birthTime"] = fileStat.birthtime;
        parseReadFile["accessTime"] = fileStat.atime;

        return parseReadFile;
      }
    });

    return macroItemList;
  } catch (error) {
    console.error(error);
  }
};

const getMacroItem = (contentType, fileName) => {
  try {
    const addedJsonFileName = `${fileName}.json`;

    if (!fs.existsSync(getMacroFilePath(contentType, addedJsonFileName))) {
      return [];
    }
    const readFile = fs.readFileSync(getMacroFilePath(contentType, addedJsonFileName), {encoding: "utf8"});
    const parseReadFile = JSON.parse(readFile);

    if (parseReadFile.stageList) {
      parseReadFile.stageList.forEach((content) => {
        if (content.value) {
          content.value = decrypt(content.value);
        }
      });
    }

    return parseReadFile;
  } catch (error) {
    console.error(error);
  }
};

function encrypt(text) {
  const algorithm = "aes-256-cbc";
  const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
  const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

function decrypt(encryptText) {
  const algorithm = "aes-256-cbc";
  const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
  const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

const getCurrentTime = () => {
  const date = new Date();
  const year = addFrontZero(date.getFullYear());
  const month = addFrontZero(date.getMonth() + 1);
  const day = addFrontZero(date.getDate());
  const hour = addFrontZero(date.getHours());
  const minute = addFrontZero(date.getMinutes());
  const second = addFrontZero(date.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};

const addFrontZero = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};
