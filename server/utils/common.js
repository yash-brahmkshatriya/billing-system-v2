const fs = require('fs');
const path = require('path');

/**
 * @function checkKeys
 * Check Keys
 * @param {Object} data Data to be checked
 * @param {Array} keys Keys required to be checked
 * @returns {Boolean} True if all keys present in data
 */
const checkKeys = (data, keys) => {
  for (let key of keys) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      return false;
    }
  }
  return true;
};

/**
 * @function pickFromObject
 * Subset of Object
 * @param {Object} data Initial Data
 * @param {Array} keys Keys required in subset
 * @returns {Object} Object with given keys if present
 */
function pickFromObject(object, keys) {
  const ans = {};
  for (let key of keys) {
    ans[key] = object[key] ?? null;
  }
  return ans;
}

/**
 * @function removeFromObject
 * Subset of Object
 * @param {Object} data Initial Data
 * @param {Array} keys Keys to be removed from data
 * @returns {Object} Object with removed keys if present
 */
function removeFromObject(object, keys) {
  for (let key of keys) {
    delete object[key];
  }
  return object;
}

/**
 * @function expectedNumberOfLinesInPDF
 * Expected Height in Pixels based on options
 * @param {String} str String to be printed
 * @param {Object} options Options to calculate height
 * @returns {Number} expected height in px
 */
function expectedHeightInPDF(
  str,
  charLength = 12,
  charHeight = 12,
  parentBoxWidth = 350
) {
  // For faster calculation, assuming equal splits by "new line" character
  const noOfLines = (str.match(/\n/gm) || []).length;
  const charsPerChunk = str.length / noOfLines;
  const noOfLinesPerChunk = Math.ceil(
    (charsPerChunk * charLength) / parentBoxWidth
  );
  const heightOfChunk = noOfLinesPerChunk * charHeight + noOfLinesPerChunk - 1;
  return heightOfChunk * noOfLines;
}

function walkThroughDir(dirPath) {
  let files = [];
  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    let filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = [...files, ...walkThroughDir(filePath)];
    } else files.push(filePath);
  });
  return files;
}

module.exports = {
  checkKeys,
  pickFromObject,
  removeFromObject,
  expectedHeightInPDF,
  walkThroughDir,
};
