
import React, { useState, useMemo } from 'react';

interface ConversionProps {
  t: any;
}

const Conversion: React.FC<ConversionProps> = ({ t }) => {
  const [mode, setMode] = useState<'mm_pol' | 'pol_mm'>('mm_pol');
  const [inputValue, setInputValue] = useState('25.4');
  const [precision, setPrecision] = useState('.0000');
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Lógica de Fração de Polegada
  const getNearestFraction = (val: number) => {
    if (isNaN(val) || val <= 0) return '---';
    const inches = mode === 'mm_pol' ? val / 25.4 : val;
    
    const denominator = 64;
    const numerator = Math.round(inches * denominator);
    
    if (numerator === 0) return '---';
    
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const common = gcd(numerator, denominator);
    
    const finalNum = numerator / common;
    const finalDen = denominator / common;
    
    const wholes = Math.floor(finalNum / finalDen);
    const remNum = finalNum % finalDen;

    if (wholes > 0 && remNum > 0) return `${wholes} ${remNum}/${finalDen}"`;
    if (wholes > 0) return `${wholes}"`;
    return `${finalNum}/${finalDen}"`;
  };

  const getOutput = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';
    
    const precMap: Record<string, number> = { '.0': 1, '.00': 2, '.000': 3, '.0000': 4 };
    const p = precMap[precision] || 4;

    if (mode === 'mm_pol') {
      return (val / 25.4).toFixed(p);
    }
    return (val * 25.4).toFixed(p);
  }, [inputValue, mode, precision]);

  const handleKey = (key: string) => {
    if (key === 'del') {
      setInputValue(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === 'ok') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } else if (key === '.') {
      if (!inputValue.includes('.')) {
        setInputValue(prev => prev + '.');
      }
    } else {
      setInputValue(prev => (prev === '0' ? key : prev + key));
    }
  };

  const selectFromTable = (val: string, unit: 'mm' | 'pol') => {
    if (unit === 'mm') {
      setMode('mm_pol');
      setInputValue(val);
    } else {
      setMode('pol_mm');
      setInputValue(val);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getOutput);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const quickTableData = [
    { f: '1/64"', d: '0.0156', m: '0.397' },
    { f: '1/32"', d: '0.0312', m: '0.794' },
    { f: '1/16"', d: '0.0625', m: '1.588' },
    { f: '1/8"', d: '0.1250', m: '3.175' },
    { f: '3/16"', d: '0.1875', m: '4.762' },
    { f: '1/4"', d: '0.2500', m: '6.350' },
    { f: '5/16"', d: '0.3125', m: '7.937' },
    { f: '3/8"', d: '0.3750', m: '9.525' },
    { f: '7/16"', d: '0.4375', m: '11.112' },
    { f: '1/2"', d: '0.5000', m: '12.700' },
    { f: '5/8"', d: '0.6250', m: '15.875' },
    { f: '3/4"', d: '0.7500', m: '19.050' },
    { f: '7/8"', d: '0.8750', m: '22.225' },
    { f: '1"', d: '1.0000', m: '25.400' }
  ];

  const filteredTable = quickTableData.filter(item => 
    item.f.includes(searchTerm) || item.m.includes(searchTerm) || item.d.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-[#161412] text-white">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#eab308] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl animate-bounce">
           {t.action_performed || 'Ação Realizada!'}
        </div>
      )}

      {/* 1. SEÇÃO FIXA SUPERIOR: Displays */}
      <div className="p-4 space-y-4 shrink-0 bg-[#1c1e22]/50 border-b border-white/5 shadow-2xl">
        <div className="flex bg-[#121214] rounded-2xl p-1 border border-white/5 shadow-inner">
          <button 
            onClick={() => { setMode('mm_pol'); setInputValue('25.4'); }}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${mode === 'mm_pol' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'}`}
          >
            mm → pol
          </button>
          <button 
            onClick={() => { setMode('pol_mm'); setInputValue('1.0'); }}
            className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${mode === 'pol_mm' ? 'bg-[#eab308] text-black shadow-lg' : 'text-gray-500'}`}
          >
            pol → mm
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-[#eab308] uppercase tracking-widest ml-1 opacity-70">{t.input} ({mode === 'mm_pol' ? 'mm' : 'pol'})</p>
            <div className="bg-[#121214] border-2 border-[#eab308]/30 rounded-2xl h-14 flex items-center justify-center relative overflow-hidden">
               <span className="text-2xl font-black text-white tabular-nums z-10">{inputValue}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.converted}</p>
            <div className="bg-[#252930] border border-white/5 rounded-2xl h-14 flex flex-col items-center justify-center shadow-inner">
               <span className="text-2xl font-black text-[#eab308] tabular-nums tracking-tighter leading-none">{getOutput}</span>
               <span className="text-[8px] font-black text-gray-600 uppercase mt-0.5">{getNearestFraction(parseFloat(inputValue))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEÇÃO CENTRAL SCROLLABLE: Tabela de Referência */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#121214]/20">
        <div className="bg-[#121214] rounded-3xl border border-white/5 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <h4 className="text-[#eab308] font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">table_chart</span>
                {t.quick_reference}
              </h4>
              <div className="bg-[#1c1e22] rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/5">
                 <span className="material-symbols-outlined text-gray-500 text-xs">search</span>
                 <input 
                  type="text" 
                  placeholder={t.filter} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-[9px] text-white w-16 font-bold" 
                 />
              </div>
           </div>

           <div className="space-y-0.5">
              <div className="grid grid-cols-3 text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] pb-2 border-b border-white/5 px-2">
                 <span>{t.fraction}</span>
                 <span className="text-center">{t.decimal}</span>
                 <span className="text-right">{t.millimeter}</span>
              </div>
              <div className="divide-y divide-white/5">
                {filteredTable.map((row, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectFromTable(mode === 'mm_pol' ? row.m : row.d, mode === 'mm_pol' ? 'mm' : 'pol')}
                    className="w-full grid grid-cols-3 items-center py-3 px-2 hover:bg-[#eab308]/10 transition-all active:scale-[0.98] rounded-lg group"
                  >
                    <span className="text-white font-black text-xs text-left group-hover:text-[#eab308]">{row.f}</span>
                    <span className="text-gray-500 text-[10px] font-mono text-center">{row.d}</span>
                    <span className="text-[#eab308] font-black text-xs text-right">{row.m}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* 3. SEÇÃO INFERIOR FIXA: Teclado Numérico */}
      <div className="bg-[#1c1e22] border-t border-white/10 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] safe-pb">
        {/* Seleção de Precisão */}
        <div className="flex justify-around p-2 bg-[#121214]/50 border-b border-white/5">
           {[".0", ".00", ".000", ".0000"].map(p => (
            <button 
              key={p} 
              onClick={() => setPrecision(p)}
              className={`px-4 py-1.5 text-[9px] font-black rounded-lg border transition-all ${precision === p ? 'bg-[#eab308] text-black border-[#eab308] shadow-lg' : 'bg-transparent text-gray-600 border-white/5'}`}
            >
              {p}
            </button>
          ))}
        </div>
        
        {/* Teclado */}
        <div className="grid grid-cols-4 gap-1 p-2">
          {['1','2','3','del','4','5','6','copy','7','8','9','ok','0','.'].map(key => (
            <button 
              key={key}
              onClick={() => {
                if(key === 'copy') copyToClipboard();
                else if(key === 'ok') handleKey('ok');
                else handleKey(key);
              }}
              className={`h-12 rounded-xl font-black text-lg flex items-center justify-center transition-all active:scale-90 shadow-md ${
                key === 'ok' ? 'bg-[#eab308] text-black row-span-2 h-24' : 
                key === 'del' ? 'bg-red-500/10 text-red-500' : 
                key === 'copy' ? 'bg-blue-500/10 text-blue-500' :
                'bg-[#252930] text-white'
              } ${key === '0' ? 'col-span-2' : ''}`}
            >
              {key === 'del' ? <span className="material-symbols-outlined text-lg">backspace</span> : 
               key === 'copy' ? <span className="material-symbols-outlined text-lg">content_copy</span> :
               key === 'ok' ? 'OK' : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conversion;
