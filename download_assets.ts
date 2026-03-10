import fs from 'fs';
import https from 'https';

const logoUrl = "https://files.oaiusercontent.com/file-S4Z8H7W5Y9K2M1P4N6B3D1?se=2025-02-21T16%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dlogo_casillas.png";
const consultantUrl = "https://files.oaiusercontent.com/file-9ZJ3D8F6V2M5L1P0N4B7?se=2025-02-21T16%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dconsultor_casillas.png";

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

async function run() {
  try {
    console.log("Downloading logo...");
    await download(logoUrl, 'logo_casillas.png');
    console.log("Downloading consultant...");
    await download(consultantUrl, 'consultor_casillas.png');
    console.log("Done!");
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
