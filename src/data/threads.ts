export interface ThreadInfo {
  nominal: string;
  pitch: number;
  tapDrill: number;
  majorDia: number;
}

export const metricThreads: ThreadInfo[] = [
  { nominal: "M3", pitch: 0.5, tapDrill: 2.5, majorDia: 3.0 },
  { nominal: "M4", pitch: 0.7, tapDrill: 3.3, majorDia: 4.0 },
  { nominal: "M5", pitch: 0.8, tapDrill: 4.2, majorDia: 5.0 },
  { nominal: "M6", pitch: 1.0, tapDrill: 5.0, majorDia: 6.0 },
  { nominal: "M8", pitch: 1.25, tapDrill: 6.8, majorDia: 8.0 },
  { nominal: "M10", pitch: 1.5, tapDrill: 8.5, majorDia: 10.0 },
  { nominal: "M12", pitch: 1.75, tapDrill: 10.2, majorDia: 12.0 },
  { nominal: "M14", pitch: 2.0, tapDrill: 12.0, majorDia: 14.0 },
  { nominal: "M16", pitch: 2.0, tapDrill: 14.0, majorDia: 16.0 },
  { nominal: "M20", pitch: 2.5, tapDrill: 17.5, majorDia: 20.0 },
];

export const metricFineThreads: ThreadInfo[] = [
  { nominal: "M8x1", pitch: 1.0, tapDrill: 7.0, majorDia: 8.0 },
  { nominal: "M10x1", pitch: 1.0, tapDrill: 9.0, majorDia: 10.0 },
  { nominal: "M10x1.25", pitch: 1.25, tapDrill: 8.8, majorDia: 10.0 },
  { nominal: "M12x1.25", pitch: 1.25, tapDrill: 10.8, majorDia: 12.0 },
  { nominal: "M12x1.5", pitch: 1.5, tapDrill: 10.5, majorDia: 12.0 },
];

export interface InchThreadInfo {
  nominal: string;
  tpi: number;
  tapDrill: string;
  majorDia: number;
}

export const uncThreads: InchThreadInfo[] = [
  { nominal: "1/4-20", tpi: 20, tapDrill: "#7 (5.1mm)", majorDia: 6.35 },
  { nominal: "5/16-18", tpi: 18, tapDrill: "F (6.6mm)", majorDia: 7.94 },
  { nominal: "3/8-16", tpi: 16, tapDrill: "5/16 (7.9mm)", majorDia: 9.53 },
  { nominal: "1/2-13", tpi: 13, tapDrill: "27/64 (10.7mm)", majorDia: 12.7 },
  { nominal: "5/8-11", tpi: 11, tapDrill: "17/32 (13.5mm)", majorDia: 15.88 },
];
