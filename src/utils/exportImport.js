export const downloadJson = (filename, data) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute("href", dataStr);
  anchor.setAttribute("download", filename);
  anchor.click();
};

export const readJsonFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try { resolve(JSON.parse(event.target.result)); } catch (error) { reject(error); }
  };
  reader.onerror = reject;
  reader.readAsText(file);
});
