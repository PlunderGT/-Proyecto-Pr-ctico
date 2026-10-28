// Lee la versión SemVer de backend/package.json y la expone al pipeline como $(appVersion).
const { version } = require('../../backend/package.json');
console.log(`##vso[task.setvariable variable=appVersion]${version}`);
console.log(`Versión de la aplicación: ${version}`);
