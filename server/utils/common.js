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

module.exports = {
  checkKeys,
  pickFromObject,
  removeFromObject,
};
