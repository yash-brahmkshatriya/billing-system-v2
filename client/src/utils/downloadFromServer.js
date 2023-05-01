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
  const fileName = response.headers['content-filename'];
  return { objectURL: objectURL ?? null, fileName };
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
  const { objectURL, fileName } = await getFileAsBlob(url, callback);
  downloadFile(objectURL, fileName ?? name);
  window.URL.revokeObjectURL(objectURL);
}
export async function openHtmlAsDataUri(uri, name = null) {
  const response = await instance.get(uri);
  var wnd = window.open('about:blank', '_blank');
  wnd.document.write(response.data);
  wnd.requestIdleCallback(function () {
    wnd.focus();
    wnd.print();
  });
}
