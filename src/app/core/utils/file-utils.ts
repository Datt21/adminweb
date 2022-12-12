export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise(((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = err => {
      reject(err);
    };
    reader.readAsDataURL(file);
  }));
};

export const fileToBlobUrl = (file: File) => {
  return window.URL.createObjectURL(file);
};
