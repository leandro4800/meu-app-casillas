
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.join(process.cwd(), 'assets', 'documents');

export async function ensureDocumentsExist() {
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
  }

  const catalogPath = path.join(DOCUMENTS_DIR, 'catalogo_hailtools.pdf');
  const eafuPath = path.join(DOCUMENTS_DIR, 'apostila_eafu.pdf');

  if (!fs.existsSync(catalogPath)) {
    await generateCatalogPDF(catalogPath);
  }

  if (!fs.existsSync(eafuPath)) {
    await generateEafuPDF(eafuPath);
  }

  return { catalogPath, eafuPath };
}

async function generateCatalogPDF(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      
      stream.on('error', (err) => {
        console.error("Catalog PDF Stream Error:", err);
        reject(err);
      });

      doc.pipe(stream);

      doc.fontSize(25).text('HAILTOOLS - CATÁLOGO DE FERRAMENTAS', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('Especialista em Ferramentas para Usinagem e Caldeiraria Pesada.');
      doc.moveDown();

      doc.fontSize(18).text('Principais Sistemas:', { underline: true });
      doc.fontSize(12).text('- CoroCut 2: Corte, canais e perfilamento de alta rigidez.');
      doc.text('- CoroThread 266: Estabilidade extrema para roscas offshore.');
      doc.text('- CoroDrill 880/870/860: Furação de alta performance.');
      doc.text('- CoroMill MF80/490/390: Fresamento pesado e esquadrejamento.');
      doc.text('- Silent Tools: Adaptadores antivibratórios para grandes balanços.');
      doc.moveDown();

      doc.fontSize(18).text('Dados de Corte e Fórmulas:', { underline: true });
      doc.fontSize(12).text('Rotação (RPM): n = (Vc * 318) / D');
      doc.text('Avanço da Mesa (mm/min): Vf = fz * n * Z');
      doc.moveDown();

      doc.fontSize(10).text('Contato: (27) 99921-4046 | hailtools@gmail.com', { align: 'center' });

      doc.end();
      stream.on('finish', () => {
        console.log("Catalog PDF generated successfully.");
        resolve();
      });
    } catch (err) {
      console.error("Error in generateCatalogPDF:", err);
      reject(err);
    }
  });
}

async function generateEafuPDF(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      stream.on('error', (err) => {
        console.error("EAFU PDF Stream Error:", err);
        reject(err);
      });

      doc.pipe(stream);

      doc.fontSize(25).text('APOSTILA EAFU - TREINAMENTO HAILTOOLS', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('Escolha e Aplicação de Ferramentas para Usinagem 4.0');
      doc.moveDown();

      doc.fontSize(18).text('Processo de Escolha em 3 Passos:', { underline: true });
      doc.fontSize(12).text('1. Escolha o Suporte: Capacidade geométrica para usinar a peça.');
      doc.text('2. Escolha a Pastilha: Material e característica geométrica baseada no material.');
      doc.text('3. Escolha os Dados de Corte: ap (profundidade), fn (avanço), Vc (velocidade).');
      doc.moveDown();

      doc.fontSize(18).text('Tabela de Materiais ISO:', { underline: true });
      doc.fontSize(12).text('P - Aços');
      doc.text('M - Aços Inoxidáveis');
      doc.text('K - Ferros Fundidos');
      doc.text('N - Metais não-ferrosos');
      doc.text('S - Super ligas e Titânio');
      doc.text('H - Aços endurecidos');
      doc.moveDown();

      doc.fontSize(18).text('Serviços e Workshops:', { underline: true });
      doc.fontSize(12).text('- Metrologia (8h)');
      doc.text('- Fresamento e Torneamento Produtivo (8h)');
      doc.text('- Silent Tools - Usinagem sem vibração (8h)');
      doc.text('- Usinagem Digital (8h)');

      doc.end();
      stream.on('finish', () => {
        console.log("EAFU PDF generated successfully.");
        resolve();
      });
    } catch (err) {
      console.error("Error in generateEafuPDF:", err);
      reject(err);
    }
  });
}
