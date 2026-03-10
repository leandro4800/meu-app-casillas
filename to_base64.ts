import fs from 'fs';

const logoBase64 = fs.readFileSync('logo_casillas.png', { encoding: 'base64' });
const consultantBase64 = fs.readFileSync('consultor_casillas.png', { encoding: 'base64' });

console.log("LOGO_BASE64_START");
console.log(`data:image/png;base64,${logoBase64}`);
console.log("LOGO_BASE64_END");

console.log("CONSULTANT_BASE64_START");
console.log(`data:image/png;base64,${consultantBase64}`);
console.log("CONSULTANT_BASE64_END");
