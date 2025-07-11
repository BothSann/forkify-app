import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    console.log(`Fetching from: ${url}`);

    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response text:', errorText);
      throw new Error(
        `HTTP Error ${response.status}: ${errorText || 'Unknown error'}`
      );
    }

    const data = await response.json();
    console.log('Parsed JSON data:', data);
    return data;
  } catch (err) {
    console.error('AJAX Error:', err.message);
    console.error('Full error:', err);
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uplaodData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uplaodData),
//     });
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);
//   } catch (err) {
//     throw err;
//   }
// };
