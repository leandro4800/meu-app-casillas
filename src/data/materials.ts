export interface MaterialInfo {
  name: string;
  category: string;
  hardness: string;
  machinability: number; // 0-100
  density: number; // g/cm3
}

export const materials: MaterialInfo[] = [
  { name: "Aço 1020", category: "Aço Carbono", hardness: "120 HB", machinability: 70, density: 7.85 },
  { name: "Aço 1045", category: "Aço Carbono", hardness: "180 HB", machinability: 60, density: 7.85 },
  { name: "Aço 4140", category: "Aço Liga", hardness: "220 HB", machinability: 50, density: 7.85 },
  { name: "Aço 4340", category: "Aço Liga", hardness: "240 HB", machinability: 45, density: 7.85 },
  { name: "Inox 304", category: "Aço Inoxidável", hardness: "170 HB", machinability: 40, density: 8.00 },
  { name: "Inox 316", category: "Aço Inoxidável", hardness: "180 HB", machinability: 35, density: 8.00 },
  { name: "Alumínio 6061", category: "Alumínio", hardness: "95 HB", machinability: 90, density: 2.70 },
  { name: "Latão", category: "Cobre/Ligas", hardness: "100 HB", machinability: 100, density: 8.50 },
  { name: "Ferro Fundido Cinzento", category: "Ferro Fundido", hardness: "200 HB", machinability: 65, density: 7.20 },
];
