const fs = require('fs');
const path = require('path');

const texturesDir = './textures/blocks/';
const outputFile = './textures/textures.json';

function getFiles(dir) {
  return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile());
}

function generateTextureList() {
  const files = getFiles(texturesDir);
  const textures = files.map(file => path.join(texturesDir, file));

  const jsonContent = JSON.stringify({ textures }, null, 2);
  fs.writeFileSync(outputFile, jsonContent);
}

generateTextureList();
