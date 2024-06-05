import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Mapeia o alias @ para a pasta src
    },
  };
};
