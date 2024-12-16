const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './', // Directorio raíz de tu proyecto
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

module.exports = createJestConfig(customJestConfig);
