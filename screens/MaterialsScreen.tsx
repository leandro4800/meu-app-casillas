
import React from 'react';
import { MATERIALS } from '../constants';

interface MaterialsScreenProps {
  t: any;
}

const MaterialsScreen: React.FC<MaterialsScreenProps> = ({ t }) => {
  return (
    <div className="p-5 flex flex-col gap-6">
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
                 <button className="w-full py-2.5 rounded-lg border border-[#eab308]/30 text-[#eab308] text-xs font-bold uppercase hover:bg-[#eab308] hover:text-black transition-all">
                    {t.view_details || 'Ver Detalhes'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsScreen;
