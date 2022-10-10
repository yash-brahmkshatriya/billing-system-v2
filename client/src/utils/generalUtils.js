export function getErrorMessage(err) {
  return (
    err.response?.data?.message ||
    err.response?.message ||
    err.message ||
    JSON.stringify(err)
  );
}

export function pickFromObject(object, keys) {
  const ans = {};
  for (let key of keys) {
    ans[key] = object[key] ?? null;
  }
  return ans;
}

export function removeFromObject(object, keys) {
  for (let key of keys) {
    delete object[key];
  }
  return object;
}

export function kNeighborsOfIndex(arr, index, k = 5) {
  let dl = index,
    ul = arr.length - index - 1;
  let lowerIndex, upperIndex;
  if (dl < ul) {
    lowerIndex = Math.max(index - Math.floor(k / 2), 0);
    upperIndex = Math.min(lowerIndex + k, arr.length);
  } else {
    upperIndex = Math.min(index + Math.ceil(k / 2), arr.length);
    lowerIndex = Math.max(upperIndex - k, 0);
  }
  return arr.slice(lowerIndex, upperIndex);
}

export function copyToClipboard(value) {
  navigator.clipboard.writeText(value);
}
