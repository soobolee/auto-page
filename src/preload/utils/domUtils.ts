export const createTargetAlertCircle = () => {
  const targetAlertCircle = document.createElement("div");
  targetAlertCircle.id = "targetAlertCircle";
  targetAlertCircle.style.position = "absolute";
  targetAlertCircle.style.width = "20px";
  targetAlertCircle.style.height = "20px";
  targetAlertCircle.style.borderRadius = "100%";
  targetAlertCircle.style.zIndex = "99999";
  targetAlertCircle.style.display = "none";

  return targetAlertCircle;
};

export const getClassInfo = (eventTargetClassList: string[], eventTarget: HTMLElement) => {
  if (eventTargetClassList.length) {
    return eventTargetClassList.map((className) => {
      const duplicatedClassList = Array.from(document.getElementsByClassName(className));

      return {
        className: className,
        classIndex: duplicatedClassList.indexOf(eventTarget),
      };
    });
  }
};
