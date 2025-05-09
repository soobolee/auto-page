import {app} from "electron";
import fs from "fs";
import {join} from "path";

import {MacroContentType, MacroFileData, MacroStage} from "../types/main";
import {getCurrentTime} from "./commonUtils";
import {inputValueDecrypt, inputValueEncrypt} from "./cryptUtils";

export function getMacroFilePath(contentType: MacroContentType = "stageList", fileName = ""): string {
  const baseDir = contentType === "image" ? "imageFile" : "macroFile";
  return join(app.getPath("userData"), baseDir, fileName);
}

export function writeMacroInfoFile(
  fileName: string,
  fileContent: MacroStage[],
  contentType: MacroContentType
): boolean {
  try {
    const folderPath = getMacroFilePath(contentType);
    const macroName = fileName || getCurrentTime();

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    const filePath = getMacroFilePath(contentType, `${macroName}.json`);

    if (contentType === "stageList") {
      const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"), "utf8");
      const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"), "utf8");

      fileContent = fileContent.map((content) => ({
        ...content,
        value: content.value ? inputValueEncrypt(content.value, key, iv) : content.value,
      }));
    }

    const newContent = {[contentType]: fileContent};

    if (fs.existsSync(filePath)) {
      const beforeJson = fs.readFileSync(filePath, "utf8");
      if (!beforeJson) throw new Error("파일 읽기 실패");

      const parsed = JSON.parse(beforeJson);
      fs.writeFileSync(filePath, JSON.stringify({...parsed, ...newContent}), {flag: "w+"});
    } else {
      fs.writeFileSync(filePath, JSON.stringify(newContent), {flag: "w+"});
    }

    return true;
  } catch (error) {
    console.error("writeMacroInfoFile error:", error);
    throw error;
  }
}

export function deleteFile(fileName: string, imageDeleteOption = false): boolean {
  try {
    const macroFilePath = getMacroFilePath("stageList", `${fileName}.json`);
    const imageFilePath = getMacroFilePath("image", `${fileName}.json`);

    const pathsToDelete = [macroFilePath];
    if (imageDeleteOption) {
      pathsToDelete.push(imageFilePath);
    }

    pathsToDelete.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    return true;
  } catch (error) {
    console.error("deleteFile error:", error);
    throw error;
  }
}

export function getMacroItemList(contentType: MacroContentType): MacroFileData[] {
  try {
    const folderPath = getMacroFilePath(contentType);

    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(folderPath);
    const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
    const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

    return fileNames
      .filter((name) => name.endsWith(".json"))
      .map((name) => {
        const filePath = getMacroFilePath(contentType, name);
        const content = fs.readFileSync(filePath, "utf8");
        const stat = fs.statSync(filePath);
        const parsed: MacroFileData = JSON.parse(content);

        if (parsed.stageList) {
          parsed.stageList = parsed.stageList.map((content: MacroStage) => ({
            ...content,
            value: content.value ? inputValueDecrypt(content.value, key, iv) : content.value,
          }));
        }

        return {
          ...parsed,
          macroName: name.replace(".json", ""),
          birthTime: stat.birthtime,
          accessTime: stat.atime,
        };
      });
  } catch (error) {
    console.error("getMacroItemList error:", error);
    throw error;
  }
}

export function getMacroItem(contentType: MacroContentType, fileName: string): MacroFileData {
  try {
    const filePath = getMacroFilePath(contentType, `${fileName}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error("해당 매크로 파일이 존재하지 않습니다.");
    }

    const content = fs.readFileSync(filePath, "utf8");
    const parsed: MacroFileData = JSON.parse(content);

    if (parsed.stageList) {
      const key = fs.readFileSync(join(app.getPath("userData"), "CRYPT_KEY"));
      const iv = fs.readFileSync(join(app.getPath("userData"), "CRYPT_IV"));

      parsed.stageList = parsed.stageList.map((content: MacroStage) => ({
        ...content,
        value: content.value ? inputValueDecrypt(content.value, key, iv) : content.value,
      }));
    }

    return parsed;
  } catch (error) {
    console.error("getMacroItem error:", error);
    throw error;
  }
}
