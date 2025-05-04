declare global {
  interface Window {
    electronAPI: {
      changeSession: (flag: boolean) => void;
    };
  }
}

export {};
