
import React, { useState, useEffect } from 'react';
import { MATERIALS } from '../constants';
import { MaterialData } from '../types';

interface MaterialComparisonProps {
  t: any;
}

const MaterialComparison: React.FC<MaterialComparisonProps> = ({ t }) => {
  const [selectedNames, setSelectedNames] = useState<string[]>(['SAE 1020', 'SAE 1045', 'INOX 304']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectedMaterials = selectedNames
    .map(name => MATERIALS.find(m => m.name === name))
    .filter(m => !!m) as MaterialData[];

  const removeMaterial = (name: string) => {
    if (selectedNames.length <= 1) return; // Mantém ao menos um para comparação
    setSelectedNames(prev => prev.filter(n => n !== name));
  };

  const addMaterial = (name: string) => {
    if (selectedNames.length >= 4) return;
    if (!selectedNames.includes(name)) {
      setSelectedNames(prev => [...prev, name]);
    }
    setShowAddModal(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simula processamento de PDF/Relatório Técnico
    setTimeout(() => {
      setIsExporting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2200);
  };

  const getUsinabilityLabel = (val: number) => {
    if (val >= 80) return { label: 'EXCELENTE', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (val >= 60) return { label: 'BOM', color: 'text-[#eab308]', bg: 'bg-[#eab308]/10' };
    if (val >= 50) return { label: 'MÉDIA', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    return { label: 'DIFÍCIL', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      {/* Notificação de Sucesso (Toast) */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-500">
           <span className="material-symbols-outlined">check_circle</span>
           {t.report_generated_success || 'Relatório Gerado com Sucesso!'}
        </div>
      )}

      {/* Header Info */}
      <div className="p-5 pb-0">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-white text-xl font-black uppercase tracking-tight">{t.technical_comparison || 'Comparativo Técnico'}</h2>
           <button 
             onClick={() => setSelectedNames(['SAE 1020', 'SAE 1045', 'INOX 304'])}
             className="text-[#eab308] p-2 hover:bg-white/5 rounded-full transition-all"
             title={t.reset_comparison || "Resetar Comparativo"}
           >
              <span className="material-symbols-outlined">restart_alt</span>
           </button>
        </div>

        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{t.selected_materials || 'Materiais Selecionados'} ({selectedNames.length}/4)</p>
        <div className="flex flex-wrap gap-2 mb-6">
           {selectedNames.length < 4 && (
             <button 
               onClick={() => setShowAddModal(true)}
               className="bg-[#252930] border-2 border-dashed border-[#eab308]/30 rounded-xl px-4 py-2 flex items-center gap-2 text-[#eab308] active:scale-95 transition-all group"
             >
                <span className="material-symbols-outlined text-sm font-black group-hover:rotate-90 transition-transform">add</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{t.add || 'Adicionar'}</span>
             </button>
           )}

           {selectedMaterials.map(mat => (
             <div key={mat.name} className="bg-[#252930] border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg animate-in fade-in zoom-in duration-300">
                <div className="size-2 rounded-full" style={{ backgroundColor: mat.color || '#eab308' }}></div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">{mat.name}</span>
                <button 
                  onClick={() => removeMaterial(mat.name)}
                  className="text-gray-500 hover:text-red-500 transition-colors ml-1"
                >
                   <span className="material-symbols-outlined text-sm">close</span>
                </button>
             </div>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-10 pb-32">
        {/* Gráfico de Dureza */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
              <h3 className="text-white text-lg font-black tracking-tight">{t.hardness || 'Dureza'} (Brinell HB)</h3>
              <span className="material-symbols-outlined text-[#eab308] opacity-50">bar_chart</span>
           </div>

           <div className="space-y-6 bg-[#252930] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 size-32 bg-[#eab308]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              {selectedMaterials.map(mat => (
                <div key={mat.name} className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full" style={{ backgroundColor: mat.color }}></div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{mat.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                         <span className="text-lg font-black text-[#eab308]">{mat.hardnessValue}</span>
                         <span className="text-[8px] font-black text-gray-600 uppercase">HB</span>
                      </div>
                   </div>
                   <div className="h-4 bg-[#121214] rounded-full overflow-hidden border border-white/5 relative">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(mat.hardnessValue / 250) * 100}%`,
                          backgroundColor: mat.color || '#eab308'
                        }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Usinabilidade */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
              <h3 className="text-white text-lg font-black tracking-tight">{t.machinability || 'Usinabilidade'}</h3>
              <span className="material-symbols-outlined text-[#eab308] opacity-50">precision_manufacturing</span>
           </div>

           <div className="grid grid-cols-3 gap-3">
              {selectedMaterials.map(mat => {
                const status = getUsinabilityLabel(mat.usinability);
                return (
                  <div key={mat.name} className="bg-[#252930] p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-4 relative overflow-hidden group shadow-lg">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter truncate w-full text-center">{mat.name}</span>
                     
                     <div className="relative size-16 flex items-center justify-center">
                        <svg className="size-full -rotate-90">
                           <circle 
                             cx="32" cy="32" r="28" 
                             fill="transparent" stroke="#121214" strokeWidth="6" 
                           />
                           <circle 
                             cx="32" cy="32" r="28" 
                             fill="transparent" 
                             stroke={mat.color || '#eab308'} 
                             strokeWidth="6" 
                             strokeDasharray={175}
                             strokeDashoffset={175 - (175 * mat.usinability) / 100}
                             strokeLinecap="round"
                             className="transition-all duration-1000 ease-out"
                           />
                        </svg>
                        <span className="absolute text-sm font-black text-white">{mat.usinability}%</span>
                     </div>

                     <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                        {status.label}
                     </span>
                  </div>
                );
              })}
           </div>
        </section>

        {/* Propriedades Mecânicas */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
              <h3 className="text-white text-lg font-black tracking-tight">{t.mechanical_properties || 'Propriedades Mecânicas'}</h3>
              <span className="material-symbols-outlined text-[#eab308] opacity-50">analytics</span>
           </div>

           <div className="bg-[#252930] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[#121214]/50 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                         <th className="p-4 border-b border-white/5">{t.property || 'Propriedade'}</th>
                         {selectedMaterials.map(m => (
                           <th key={m.name} className="p-4 text-center border-b border-white/5" style={{ color: m.color }}>
                              {m.name.split(' ')[1] || m.name}
                           </th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-[10px] font-bold text-gray-400">{t.yield_strength || 'Limite Elástico'} <br/><span className="text-[8px] uppercase opacity-40">(Yield)</span></td>
                         {selectedMaterials.map(m => (
                           <td key={m.name} className="p-4 text-center font-mono text-sm font-bold text-white">
                              {m.yieldStrength} <span className="text-[8px] text-gray-600 block">MPa</span>
                           </td>
                         ))}
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-[10px] font-bold text-gray-400">{t.tensile_strength || 'Resistência Tração'} <br/><span className="text-[8px] uppercase opacity-40">Tração</span></td>
                         {selectedMaterials.map(m => (
                           <td key={m.name} className="p-4 text-center font-mono text-sm font-bold text-white">
                              {m.tensileStrength} <span className="text-[8px] text-gray-600 block">MPa</span>
                           </td>
                         ))}
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                         <td className="p-4 text-[10px] font-bold text-gray-400">{t.carbon || 'Carbono'} (C)</td>
                         {selectedMaterials.map(m => (
                           <td key={m.name} className="p-4 text-center font-mono text-sm font-bold text-white">
                              {m.carbonContent}
                           </td>
                         ))}
                      </tr>
                   </tbody>
                </table>
              </div>
           </div>
        </section>
      </div>

      {/* Footer Floating Action */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
         <button 
           onClick={handleExport}
           disabled={isExporting}
           className={`w-full text-black font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all pointer-events-auto ${isExporting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#eab308]'}`}
         >
            {isExporting ? (
              <>
                <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                {t.generating_report || 'GERANDO RELATÓRIO...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">download</span>
                {t.export_report || 'EXPORTAR RELATÓRIO'}
              </>
            )}
         </button>
      </div>

      {/* Modal de Adição */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-[#1c1e22] rounded-t-[40px] border-t border-[#eab308]/30 p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-white text-2xl font-black tracking-tight">{t.material_selection || 'Seleção de Material'}</h3>
                 <button onClick={() => setShowAddModal(false)} className="text-gray-500">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pb-10">
                 {MATERIALS.map(mat => (
                   <button 
                     key={mat.name}
                     disabled={selectedNames.includes(mat.name)}
                     onClick={() => addMaterial(mat.name)}
                     className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all ${
                       selectedNames.includes(mat.name) 
                         ? 'bg-white/5 border-white/5 opacity-50 grayscale' 
                         : 'bg-[#252930] border-white/5 hover:border-[#eab308]/30 active:scale-95'
                     }`}
                   >
                      <div className="flex items-center gap-4">
                         <div className="size-3 rounded-full" style={{ backgroundColor: mat.color }}></div>
                         <div className="text-left">
                            <p className="text-white font-black text-base">{mat.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{mat.category}</p>
                         </div>
                      </div>
                      <span className="material-symbols-outlined text-[#eab308]">
                        {selectedNames.includes(mat.name) ? 'check' : 'add_circle'}
                      </span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MaterialComparison;
