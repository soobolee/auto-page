import {app} from "electron";
import fs from "fs";
import {join} from "path";

import {getCurrentTime} from "./commonUtils";
import {inputValueDecrypt, inputValueEncrypt} from "./cryptUtils";

export const writeMacroInfoFile = (fileName, fileContent, contentType) => {
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
          const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
          const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

          content.value = inputValueEncrypt(content.value, key, iv);
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

export const deleteFile = (fileName, imageDeleteOption) => {
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

export const getMacroFilePath = (contentType = "stageList", fileName = "") => {
  if (contentType === "image") {
    return join(app.getPath("userData"), `/imageFile/${fileName}`);
  }

  return join(app.getPath("userData"), `/macroFile/${fileName}`);
};

export const getMacroItemList = (contentType) => {
  try {
    if (!fs.existsSync(getMacroFilePath(contentType))) {
      return [];
    }

    const macroItemNameList = fs.readdirSync(getMacroFilePath(contentType));

    const macroItemList = macroItemNameList.map((macroName) => {
      if (macroName.includes("json")) {
        const readFile = fs.readFileSync(getMacroFilePath(contentType, macroName), {
          encoding: "utf8",
        });
        const fileStat = fs.statSync(getMacroFilePath(contentType, macroName));
        const parseReadFile = JSON.parse(readFile);

        parseReadFile.stageList.forEach((content) => {
          if (content.value) {
            const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
            const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

            content.value = inputValueDecrypt(content.value, key, iv);
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

export const getMacroItem = (contentType, fileName) => {
  try {
    const addedJsonFileName = `${fileName}.json`;

    if (!fs.existsSync(getMacroFilePath(contentType, addedJsonFileName))) {
      return [];
    }
    const readFile = fs.readFileSync(getMacroFilePath(contentType, addedJsonFileName), {
      encoding: "utf8",
    });
    const parseReadFile = JSON.parse(readFile);

    if (parseReadFile.stageList) {
      parseReadFile.stageList.forEach((content) => {
        if (content.value) {
          const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
          const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

          content.value = inputValueDecrypt(content.value, key, iv);
        }
      });
    }

    return parseReadFile;
  } catch (error) {
    console.error(error);
  }
};
