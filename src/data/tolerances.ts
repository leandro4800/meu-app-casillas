export interface ToleranceValue {
  upper: number;
  lower: number;
}

export interface ToleranceRange {
  min: number;
  max: number;
  values: Record<string, ToleranceValue>;
}

export const ISO_TOLERANCES: {
  shafts: ToleranceRange[];
  holes: ToleranceRange[];
} = {
  shafts: [
    {
      min: 1, max: 3,
      values: {
        d8: { upper: -0.020, lower: -0.034 },
        d9: { upper: -0.020, lower: -0.045 },
        e7: { upper: -0.014, lower: -0.024 },
        f7: { upper: -0.006, lower: -0.016 },
        g6: { upper: -0.002, lower: -0.008 },
        h6: { upper: 0, lower: -0.006 },
        h7: { upper: 0, lower: -0.010 },
        j6: { upper: 0.004, lower: -0.002 },
        k6: { upper: 0.006, lower: 0 },
        m6: { upper: 0.008, lower: 0.002 },
        p6: { upper: 0.012, lower: 0.006 },
      }
    },
    {
      min: 3, max: 6,
      values: {
        d8: { upper: -0.030, lower: -0.048 },
        d9: { upper: -0.030, lower: -0.060 },
        e7: { upper: -0.020, lower: -0.032 },
        f7: { upper: -0.010, lower: -0.022 },
        g6: { upper: -0.004, lower: -0.012 },
        h6: { upper: 0, lower: -0.008 },
        h7: { upper: 0, lower: -0.012 },
        j6: { upper: 0.006, lower: -0.002 },
        k6: { upper: 0.009, lower: 0.001 },
        m6: { upper: 0.012, lower: 0.004 },
        p6: { upper: 0.020, lower: 0.012 },
      }
    },
    {
      min: 6, max: 10,
      values: {
        d8: { upper: -0.040, lower: -0.062 },
        d9: { upper: -0.040, lower: -0.076 },
        e7: { upper: -0.025, lower: -0.040 },
        f7: { upper: -0.013, lower: -0.028 },
        g6: { upper: -0.005, lower: -0.014 },
        h6: { upper: 0, lower: -0.009 },
        h7: { upper: 0, lower: -0.015 },
        j6: { upper: 0.007, lower: -0.002 },
        k6: { upper: 0.010, lower: 0.001 },
        m6: { upper: 0.015, lower: 0.006 },
        p6: { upper: 0.024, lower: 0.015 },
      }
    },
    {
      min: 10, max: 18,
      values: {
        d8: { upper: -0.050, lower: -0.077 },
        d9: { upper: -0.050, lower: -0.093 },
        e7: { upper: -0.032, lower: -0.050 },
        f7: { upper: -0.016, lower: -0.034 },
        g6: { upper: -0.006, lower: -0.017 },
        h6: { upper: 0, lower: -0.011 },
        h7: { upper: 0, lower: -0.018 },
        j6: { upper: 0.008, lower: -0.003 },
        k6: { upper: 0.012, lower: 0.001 },
        m6: { upper: 0.018, lower: 0.007 },
        p6: { upper: 0.029, lower: 0.018 },
      }
    },
    {
      min: 18, max: 30,
      values: {
        d8: { upper: -0.065, lower: -0.098 },
        d9: { upper: -0.065, lower: -0.117 },
        e7: { upper: -0.040, lower: -0.061 },
        f7: { upper: -0.020, lower: -0.041 },
        g6: { upper: -0.007, lower: -0.020 },
        h6: { upper: 0, lower: -0.013 },
        h7: { upper: 0, lower: -0.021 },
        j6: { upper: 0.009, lower: -0.004 },
        k6: { upper: 0.015, lower: 0.002 },
        m6: { upper: 0.021, lower: 0.008 },
        p6: { upper: 0.035, lower: 0.022 },
      }
    },
    {
      min: 30, max: 50,
      values: {
        d8: { upper: -0.080, lower: -0.119 },
        d9: { upper: -0.080, lower: -0.142 },
        e7: { upper: -0.050, lower: -0.075 },
        f7: { upper: -0.025, lower: -0.050 },
        g6: { upper: -0.009, lower: -0.025 },
        h6: { upper: 0, lower: -0.016 },
        h7: { upper: 0, lower: -0.025 },
        j6: { upper: 0.011, lower: -0.005 },
        k6: { upper: 0.018, lower: 0.002 },
        m6: { upper: 0.025, lower: 0.009 },
        p6: { upper: 0.042, lower: 0.026 },
      }
    },
    {
      min: 50, max: 80,
      values: {
        d8: { upper: -0.100, lower: -0.146 },
        d9: { upper: -0.100, lower: -0.174 },
        e7: { upper: -0.060, lower: -0.090 },
        f7: { upper: -0.030, lower: -0.060 },
        g6: { upper: -0.010, lower: -0.029 },
        h6: { upper: 0, lower: -0.019 },
        h7: { upper: 0, lower: -0.030 },
        j6: { upper: 0.012, lower: -0.007 },
        k6: { upper: 0.021, lower: 0.002 },
        m6: { upper: 0.030, lower: 0.011 },
        p6: { upper: 0.051, lower: 0.032 },
      }
    },
    {
      min: 80, max: 120,
      values: {
        d8: { upper: -0.120, lower: -0.174 },
        d9: { upper: -0.120, lower: -0.207 },
        e7: { upper: -0.072, lower: -0.107 },
        f7: { upper: -0.036, lower: -0.071 },
        g6: { upper: -0.012, lower: -0.034 },
        h6: { upper: 0, lower: -0.022 },
        h7: { upper: 0, lower: -0.035 },
        j6: { upper: 0.013, lower: -0.009 },
        k6: { upper: 0.025, lower: 0.003 },
        m6: { upper: 0.035, lower: 0.013 },
        p6: { upper: 0.059, lower: 0.037 },
      }
    },
    {
      min: 120, max: 180,
      values: {
        d8: { upper: -0.145, lower: -0.208 },
        d9: { upper: -0.145, lower: -0.245 },
        e7: { upper: -0.085, lower: -0.125 },
        f7: { upper: -0.043, lower: -0.083 },
        g6: { upper: -0.014, lower: -0.039 },
        h6: { upper: 0, lower: -0.025 },
        h7: { upper: 0, lower: -0.040 },
        j6: { upper: 0.014, lower: -0.011 },
        k6: { upper: 0.028, lower: 0.003 },
        m6: { upper: 0.040, lower: 0.015 },
        p6: { upper: 0.068, lower: 0.043 },
      }
    },
    {
      min: 180, max: 250,
      values: {
        d8: { upper: -0.170, lower: -0.242 },
        d9: { upper: -0.170, lower: -0.285 },
        e7: { upper: -0.100, lower: -0.148 },
        f7: { upper: -0.050, lower: -0.096 },
        g6: { upper: -0.015, lower: -0.044 },
        h6: { upper: 0, lower: -0.029 },
        h7: { upper: 0, lower: -0.048 },
        j6: { upper: 0.016, lower: -0.013 },
        k6: { upper: 0.033, lower: 0.004 },
        m6: { upper: 0.046, lower: 0.017 },
        p6: { upper: 0.079, lower: 0.050 },
      }
    }
  ],
  holes: [
    {
      min: 1, max: 3,
      values: {
        D8: { upper: 0.034, lower: 0.020 },
        D9: { upper: 0.045, lower: 0.020 },
        E7: { upper: 0.024, lower: 0.014 },
        F7: { upper: 0.016, lower: 0.006 },
        G6: { upper: 0.008, lower: 0.002 },
        H6: { upper: 0.006, lower: 0 },
        H7: { upper: 0.010, lower: 0 },
        J6: { upper: 0.002, lower: -0.004 },
        K6: { upper: 0, lower: -0.006 },
        M6: { upper: -0.002, lower: -0.008 },
      }
    },
    {
      min: 3, max: 6,
      values: {
        D8: { upper: 0.048, lower: 0.030 },
        D9: { upper: 0.060, lower: 0.030 },
        E7: { upper: 0.032, lower: 0.020 },
        F7: { upper: 0.022, lower: 0.010 },
        G6: { upper: 0.012, lower: 0.004 },
        H6: { upper: 0.008, lower: 0 },
        H7: { upper: 0.012, lower: 0 },
        J6: { upper: 0.005, lower: -0.003 },
        K6: { upper: 0.002, lower: -0.006 },
        M6: { upper: -0.004, lower: -0.012 },
      }
    },
    {
      min: 6, max: 10,
      values: {
        D8: { upper: 0.062, lower: 0.040 },
        D9: { upper: 0.076, lower: 0.040 },
        E7: { upper: 0.040, lower: 0.025 },
        F7: { upper: 0.028, lower: 0.013 },
        G6: { upper: 0.014, lower: 0.005 },
        H6: { upper: 0.009, lower: 0 },
        H7: { upper: 0.015, lower: 0 },
        J6: { upper: 0.005, lower: -0.004 },
        K6: { upper: 0.002, lower: -0.007 },
        M6: { upper: -0.006, lower: -0.015 },
      }
    },
    {
      min: 10, max: 18,
      values: {
        D8: { upper: 0.077, lower: 0.050 },
        D9: { upper: 0.093, lower: 0.050 },
        E7: { upper: 0.050, lower: 0.032 },
        F7: { upper: 0.034, lower: 0.016 },
        G6: { upper: 0.017, lower: 0.006 },
        H6: { upper: 0.011, lower: 0 },
        H7: { upper: 0.018, lower: 0 },
        J6: { upper: 0.006, lower: -0.005 },
        K6: { upper: 0.002, lower: -0.009 },
        M6: { upper: -0.007, lower: -0.018 },
      }
    },
    {
      min: 18, max: 30,
      values: {
        D8: { upper: 0.098, lower: 0.065 },
        D9: { upper: 0.117, lower: 0.065 },
        E7: { upper: 0.061, lower: 0.040 },
        F7: { upper: 0.041, lower: 0.020 },
        G6: { upper: 0.020, lower: 0.007 },
        H6: { upper: 0.013, lower: 0 },
        H7: { upper: 0.021, lower: 0 },
        J6: { upper: 0.008, lower: -0.005 },
        K6: { upper: 0.002, lower: -0.011 },
        M6: { upper: -0.008, lower: -0.021 },
      }
    },
    {
      min: 30, max: 50,
      values: {
        D8: { upper: 0.119, lower: 0.080 },
        D9: { upper: 0.142, lower: 0.080 },
        E7: { upper: 0.075, lower: 0.050 },
        F7: { upper: 0.050, lower: 0.025 },
        G6: { upper: 0.025, lower: 0.009 },
        H6: { upper: 0.016, lower: 0 },
        H7: { upper: 0.025, lower: 0 },
        J6: { upper: 0.010, lower: -0.006 },
        K6: { upper: 0.003, lower: -0.013 },
        M6: { upper: -0.009, lower: -0.025 },
      }
    },
    {
      min: 50, max: 80,
      values: {
        D8: { upper: 0.146, lower: 0.100 },
        D9: { upper: 0.174, lower: 0.100 },
        E7: { upper: 0.090, lower: 0.060 },
        F7: { upper: 0.060, lower: 0.030 },
        G6: { upper: 0.029, lower: 0.010 },
        H6: { upper: 0.019, lower: 0 },
        H7: { upper: 0.030, lower: 0 },
        J6: { upper: 0.013, lower: -0.006 },
        K6: { upper: 0.004, lower: -0.015 },
        M6: { upper: -0.011, lower: -0.030 },
      }
    },
    {
      min: 80, max: 120,
      values: {
        D8: { upper: 0.174, lower: 0.120 },
        D9: { upper: 0.207, lower: 0.120 },
        E7: { upper: 0.107, lower: 0.072 },
        F7: { upper: 0.071, lower: 0.036 },
        G6: { upper: 0.034, lower: 0.012 },
        H6: { upper: 0.022, lower: 0 },
        H7: { upper: 0.035, lower: 0 },
        J6: { upper: 0.016, lower: -0.006 },
        K6: { upper: 0.004, lower: -0.018 },
        M6: { upper: -0.013, lower: -0.035 },
      }
    },
    {
      min: 120, max: 180,
      values: {
        D8: { upper: 0.208, lower: 0.145 },
        D9: { upper: 0.245, lower: 0.145 },
        E7: { upper: 0.125, lower: 0.085 },
        F7: { upper: 0.083, lower: 0.043 },
        G6: { upper: 0.039, lower: 0.014 },
        H6: { upper: 0.025, lower: 0 },
        H7: { upper: 0.040, lower: 0 },
        J6: { upper: 0.018, lower: -0.007 },
        K6: { upper: 0.004, lower: -0.021 },
        M6: { upper: -0.015, lower: -0.040 },
      }
    },
    {
      min: 180, max: 250,
      values: {
        D8: { upper: 0.242, lower: 0.170 },
        D9: { upper: 0.285, lower: 0.170 },
        E7: { upper: 0.148, lower: 0.100 },
        F7: { upper: 0.096, lower: 0.050 },
        G6: { upper: 0.044, lower: 0.015 },
        H6: { upper: 0.029, lower: 0 },
        H7: { upper: 0.048, lower: 0 },
        J6: { upper: 0.022, lower: -0.007 },
        K6: { upper: 0.005, lower: -0.024 },
        M6: { upper: -0.017, lower: -0.048 },
      }
    }
  ]
};
