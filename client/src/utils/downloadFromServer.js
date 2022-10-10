import BILL_URLS from '@/redux/bill/billUrls';
import instance from '@/redux/apiCalls';

export async function getFileAsBlob(url, downloadProgressCallback) {
  const response = await instance.get(url, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      if (downloadProgressCallback) downloadProgressCallback(progressEvent);
    },
  });
  const file = new Blob([response.data], { type: response.data.type });
  const objectURL = URL.createObjectURL(file);
  return objectURL ?? null;
}

export function downloadFile(url, name = null) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadFileAsBlob(url, callback, name = null) {
  const blobUrl = await getFileAsBlob(url, callback);
  downloadFile(blobUrl, name);
  window.URL.revokeObjectURL(blobUrl);
}
