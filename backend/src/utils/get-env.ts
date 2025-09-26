export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value !== undefined) return value;

  if (defaultValue !== undefined) {
    console.warn(`Environment variable ${key} not set. Using default: ${defaultValue}`);
    return defaultValue;
  }

  throw new Error(`Environment variable ${key} is not set`);
};
