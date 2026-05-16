export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const setNestedValue = (obj, path, value) => {
  const parts = path.split('.');
  const last = parts.pop();
  let current = obj;
  for (const part of parts) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[last] = value;
};

export const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const mergeWithDefaults = (defaults, saved) => {
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  if (!isPlainObject(defaults)) return saved ?? defaults;
  const result = { ...defaults };
  if (!isPlainObject(saved)) return result;
  Object.keys(saved).forEach((key) => {
    result[key] = key in defaults ? mergeWithDefaults(defaults[key], saved[key]) : saved[key];
  });
  return result;
};
