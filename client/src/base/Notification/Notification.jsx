import { toast } from 'react-toastify';

const options = {
  position: toast.POSITION.TOP_RIGHT,
};

export const successNoti = (msg) => {
  toast.success(msg, options);
};

export const errorNoti = (msg) => {
  toast.error(msg, options);
};

export const warnNoti = (msg) => {
  toast.warning(msg, options);
};

export const loadingNoti = (msg) => {
  return toast.loading(msg, options);
};
