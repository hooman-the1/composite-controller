const config = {
    preset: 'ts-jest/presets/default-esm',
    globals: {
        'ts-jest': {
            useESM: true,
            isolatedModules: true,
            testEnvironment: "node"
        },
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    modulePathIgnorePatterns: ["dist"]
};
export default config;
