/**
 * @function checkKeys
 * Check Keys
 * @param {Object} data Data to be checked
 * @param {Array} keys Keys required to be checked
 * @returns {Boolean} True if all keys present in data
 */
const checkKeys = (data, keys) => {
  for (let key of keys) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      return false;
    }
  }
  return true;
};

/**
 * @function subsetOfObject
 * Subset of Object
 * @param {Object} data Initial Data
 * @param {Array} keys Keys required in subset
 * @returns {Object} Object with given keys if present
 */
const subsetOfObject = (data, keys) => {
  const subset = {};
  for (let key of keys) {
    if (data[key]) subset[key] = data[key];
  }
  return subset;
};

module.exports = {
  checkKeys,
  subsetOfObject,
};
