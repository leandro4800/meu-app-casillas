
import React, { useState } from 'react';
import { MATERIALS } from '../constants';
import { MaterialData } from '../types';

interface MaterialsScreenProps {
  t: any;
}

const MaterialsScreen: React.FC<MaterialsScreenProps> = ({ t }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | null>(null);

  return (
    <div className="p-5 flex flex-col gap-6 relative">
      <div className="space-y-1">
        <h3 className="text-[#eab308] text-2xl font-bold tracking-tight uppercase">{t.materials_hardness || 'Materiais e Dureza'}</h3>
        <p className="text-gray-500 text-sm">{t.materials_guide || 'Guia técnico para seleção de ferramentas.'}</p>
      </div>

      <div className="bg-gradient-to-r from-[#eab308]/20 to-transparent border-l-4 border-[#eab308] p-4 rounded-r-xl">
        <p className="text-[#eab308] text-xs font-bold uppercase mb-1 tracking-wider">{t.technical_tip || 'Dica Técnica'}</p>
        <p className="text-sm text-gray-400">{t.hardness_desc || 'Durezas indicadas para o estado de fornecimento padrão (recozido).'}</p>
      </div>

      <div className="space-y-4">
        {MATERIALS.map(mat => (
          <div key={mat.name} className="bg-[#252930] rounded-2xl border border-white/5 overflow-hidden shadow-lg group">
            <div className="p-4 flex items-center justify-between border-b border-white/5 group-hover:bg-white/5 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#eab308] uppercase tracking-widest">{mat.category}</span>
                <h4 className="text-xl font-bold text-white mt-0.5">{mat.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-white font-mono">{mat.hardnessHb.split(' ')[0]}</span>
                <span className="text-[10px] text-gray-500 block uppercase font-bold">HB</span>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4 bg-[#121214]/40">
              <div className="space-y-3">
                <div>
                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{t.machinability || 'Usinabilidade'}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${mat.usinability}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{mat.usinability}%</span>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{t.tensile_strength || 'Resistência Tração'}</p>
                   <p className="text-sm text-white font-bold">{mat.strength} <span className="text-[10px] text-gray-600 font-medium">kg/mm²</span></p>
                </div>
              </div>
              
              <div className="flex flex-col justify-end">
                 <button 
                  onClick={() => setSelectedMaterial(mat)}
                  className="w-full py-2.5 rounded-lg border border-[#eab308]/30 text-[#eab308] text-xs font-bold uppercase hover:bg-[#eab308] hover:text-black transition-all"
                 >
                    {t.view_details || 'Ver Detalhes'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c1e22] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#eab308]/10 to-transparent">
              <div>
                <span className="text-[10px] font-bold text-[#eab308] uppercase tracking-widest">{selectedMaterial.category}</span>
                <h4 className="text-2xl font-bold text-white">{selectedMaterial.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t.hardness || 'Dureza'}</p>
                  <p className="text-xl font-bold text-white font-mono">{selectedMaterial.hardnessHb}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t.resistance || 'Resistência'}</p>
                  <p className="text-xl font-bold text-white font-mono">{selectedMaterial.tensileStrength} <span className="text-xs text-gray-500">MPa</span></p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedMaterial.chemicalComposition && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-widest">{t.chemical_composition || 'Composição Química'}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMaterial.chemicalComposition}</p>
                  </div>
                )}
                
                {selectedMaterial.typicalApps && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-widest">{t.typical_apps || 'Aplicações Típicas'}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMaterial.typicalApps}</p>
                  </div>
                )}

                {selectedMaterial.thermalTreatment && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-widest">{t.thermal_treatment || 'Tratamento Térmico'}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMaterial.thermalTreatment}</p>
                  </div>
                )}

                {selectedMaterial.weldingInfo && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-widest">{t.welding_info || 'Informações de Soldagem'}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMaterial.weldingInfo}</p>
                  </div>
                )}
              </div>

              <div className="bg-[#eab308]/5 border border-[#eab308]/20 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-[#eab308] uppercase font-bold tracking-widest">{t.machinability || 'Usinabilidade'}</p>
                  <span className="text-xs font-bold text-[#eab308]">{selectedMaterial.usinability}%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-[#eab308]" style={{ width: `${selectedMaterial.usinability}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#121214] border-t border-white/5">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="w-full py-4 rounded-xl bg-[#eab308] text-black font-bold uppercase tracking-widest hover:bg-[#facc15] transition-all active:scale-95"
              >
                {t.close_details || 'Fechar Detalhes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsScreen;
