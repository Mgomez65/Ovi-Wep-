module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(png|jpg|jpeg|gif|svg)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nombre-del-paquete-que-necesita-transformacion)/'  // Solo si es necesario
  ]
};