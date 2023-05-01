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
  const PADDING = 12;
  const newLineRegex = /\n/gm;

  const chunks = str.split(newLineRegex).filter((x) => x);

  const totalHeightReqd = chunks.reduce((acc, curr) => {
    const lengthReqdToDisplayChunk = curr.length * charLength;
    const linesReqdForChunk = Math.ceil(
      lengthReqdToDisplayChunk / parentBoxWidth
    );
    // CharHeight+1  is because there will be space between the lines
    const heightOfChunk = linesReqdForChunk * (charHeight + 1);
    return acc + heightOfChunk;
  }, 0);

  return totalHeightReqd + 2 * PADDING;

  // const noOfLines = (str.match(/\n/gm) || []).length + 1;
  // const charsPerChunk = str.length / noOfLines;
  // const noOfLinesPerChunk = Math.ceil(
  //   (charsPerChunk * charLength) / parentBoxWidth
  // );
  // const heightOfChunk =
  //   noOfLinesPerChunk * (charHeight + PADDING) +
  //   (noOfLinesPerChunk - 1) * (charHeight / 10);
  // return heightOfChunk * noOfLines;
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

function getCurrentFinancialYearDates(dateString = null) {
  let date = dateString ? new Date(dateString) : new Date();

  let financialBeginYear =
    date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
  let financialYearStartDate = new Date(`04/01/${financialBeginYear} 00:00:00`);
  let financialYearEndDate = new Date(
    `03/31/${financialBeginYear + 1} 23:59:59`
  );

  return { start: financialYearStartDate, end: financialYearEndDate };
}

module.exports = {
  checkKeys,
  pickFromObject,
  removeFromObject,
  expectedHeightInPDF,
  walkThroughDir,
  getCurrentFinancialYearDates,
};
