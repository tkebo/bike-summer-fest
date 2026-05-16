export const createEditorValueResolver = (editor, defaults) => {
  return (key) => editor[key] !== undefined ? editor[key] : defaults[key];
};
