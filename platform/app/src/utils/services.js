import axios from 'axios';

// const BASE_URL = `https://pacsdev.iotcom.io/node/`;
// const BASE_URL = 'https://volente2.iotcom.io/node/';
// const BASE_URL = 'https://volente2.iotcom.io/';
// const BASE_URL = 'https://volente.iotcom.io:8080/';
// const BASE_URL = 'http://pacc.iotcom.io:5500/';
//const BASE_URL = 'http://localhost:5500/';
// const BASE_URL = 'http://rad.iotcom.io:5500/';
const BASE_URL = `${window.location.origin}/node/`;

const getToken = () => {
  return localStorage.getItem('token');
};

export const getDataFromServer = async ({ end_point, params, call_back, props }) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const url = BASE_URL + end_point;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const object = {
      response: response.data,
      status: 'success',
      error: undefined,
      props,
    };
    call_back(object);
  } catch (error) {
    const object = {
      response: undefined,
      status: 'error',
      error,
      props,
    };
    call_back(object);
  }
};

export const postDatatoServer = ({ end_point, body, call_back, props }) => {
  const token = getToken();
  if (!token) {
    call_back({
      response: undefined,
      status: 'error',
      error: 'No token found',
      props,
    });
    return;
  }

  const url = BASE_URL + end_point;
  axios
    .post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      const object = {
        response: response.data,
        status: 'success',
        error: undefined,
        props,
      };
      call_back(object);
    })
    .catch(error => {
      const object = {
        response: undefined,
        status: 'error',
        error,
        props,
      };
      call_back(object);
    });
};

export const uploadImageToServer = async ({ end_point, data, fileName }) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const url = BASE_URL + end_point;
    const formData = new FormData();

    formData.append('file', data, fileName);

    const response = await axios.post(url, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const object = {
      response: response.data,
      status: 'success',
      error: undefined,
    };
    return object;
  } catch (error) {
    console.error('Error uploading file:', error);
    return { status: 'error', error };
  }
};

export const downloadFileServer = async ({ end_point, props }) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const url = BASE_URL + end_point;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer',
    });
    const fileBlob = new Blob([response.data], { type: 'application/msword' });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', props);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.log(error);
  }
};
