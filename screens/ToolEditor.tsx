
import React, { useState, useEffect } from 'react';
import { ToolInsert } from '../types';

interface ToolEditorProps {
  tool: ToolInsert | null;
  onSave: (tool: ToolInsert) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  t: any;
}

const ToolEditor: React.FC<ToolEditorProps> = ({ tool, onSave, onDelete, onBack, t }) => {
  const [formData, setFormData] = useState<ToolInsert>({
    id: Math.random().toString(36).substr(2, 9),
    code: '',
    grade: '',
    coating: '',
    geometry: '',
    geometryDesc: '',
    category: 'Torneamento',
    isoCategories: ['P'],
    applicationPrimary: 'P25',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=new-tool',
    parameters: {
      vc: 200,
      vcRange: [150, 250],
      fn: 0.2,
      fnRange: [0.1, 0.4],
      ap: 2.0,
      apRange: [0.5, 5.0]
    }
  });

  useEffect(() => {
    if (tool) setFormData(tool);
  }, [tool]);

  const toggleIso = (iso: string) => {
    setFormData(prev => ({
      ...prev,
      isoCategories: prev.isoCategories.includes(iso) 
        ? prev.isoCategories.filter(i => i !== iso) 
        : [...prev.isoCategories, iso]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1e22]">
      <div className="p-4 flex justify-between items-center border-b border-white/5 bg-[#1c1e22] sticky top-0 z-20">
         <button onClick={onBack} className="text-[#eab308] p-1">
            <span className="material-symbols-outlined">close</span>
         </button>
         <h2 className="text-white font-black text-xs uppercase tracking-widest">
           {tool ? (t.edit_tool || 'Editar Ferramenta') : (t.new_tool || 'Nova Ferramenta')}
         </h2>
         <button 
           onClick={() => onSave(formData)}
           className="text-[#eab308] font-bold text-sm uppercase px-2"
         >
           {t.save || 'Salvar'}
         </button>
      </div>

      <div className="p-4 space-y-8 pb-32 overflow-y-auto">
        {/* Preview da Imagem e Edição da URL */}
        <section className="space-y-4">
           <h4 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest ml-1">Imagem da Ferramenta</h4>
           <div className="flex flex-col items-center gap-4 bg-[#252930] p-6 rounded-3xl border border-white/5">
              <div className="size-32 bg-[#121214] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                 <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
              </div>
              <div className="w-full space-y-2">
                 <label className="text-[9px] font-black text-gray-600 uppercase">URL da Imagem</label>
                 <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Cole a URL da imagem aqui..."
                    className="w-full bg-[#121214] border border-white/10 rounded-xl h-12 px-4 text-xs text-gray-400 focus:border-[#eab308] outline-none"
                 />
              </div>
           </div>
        </section>

        {/* Dados Básicos */}
        <section className="space-y-4">
           <h4 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest ml-1">Identificação</h4>
           <div className="bg-[#252930] p-5 rounded-3xl border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase">Código</label>
                    <input 
                       type="text" 
                       value={formData.code}
                       onChange={(e) => setFormData({...formData, code: e.target.value})}
                       className="w-full bg-[#121214] border border-white/5 rounded-xl h-12 px-4 text-white font-bold outline-none focus:border-[#eab308]"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-600 uppercase">Classe (Grade)</label>
                    <input 
                       type="text" 
                       value={formData.grade}
                       onChange={(e) => setFormData({...formData, grade: e.target.value})}
                       className="w-full bg-[#121214] border border-white/5 rounded-xl h-12 px-4 text-white font-bold outline-none focus:border-[#eab308]"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-600 uppercase">Categoria de Processo</label>
                 <select 
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                   className="w-full bg-[#121214] border border-white/5 rounded-xl h-12 px-4 text-white outline-none appearance-none"
                 >
                    <option value="Torneamento">Torneamento</option>
                    <option value="Fresamento">Fresamento</option>
                    <option value="Furação">Furação</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-gray-600 uppercase">Categorias ISO Aplicáveis</label>
                 <div className="flex flex-wrap gap-2">
                    {['P', 'M', 'K', 'S', 'N', 'H'].map(iso => (
                       <button 
                        key={iso}
                        onClick={() => toggleIso(iso)}
                        className={`size-10 rounded-lg flex items-center justify-center font-black transition-all ${
                           formData.isoCategories.includes(iso) ? 'bg-[#eab308] text-black shadow-lg shadow-[#eab308]/20' : 'bg-[#121214] text-gray-600'
                        }`}
                       >
                          {iso}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Parâmetros Técnicos */}
        <section className="space-y-4">
           <h4 className="text-[#eab308] text-[10px] font-black uppercase tracking-widest ml-1">Parâmetros de Corte (Médios)</h4>
           <div className="bg-[#252930] p-5 rounded-3xl border border-white/5 grid grid-cols-3 gap-3">
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-600 uppercase">Vc (m/min)</label>
                 <input type="number" value={formData.parameters.vc} onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, vc: Number(e.target.value)}})} className="w-full bg-[#121214] rounded-xl h-12 text-center text-white" />
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-600 uppercase">fn (mm/r)</label>
                 <input type="number" step="0.01" value={formData.parameters.fn} onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, fn: Number(e.target.value)}})} className="w-full bg-[#121214] rounded-xl h-12 text-center text-white" />
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] font-black text-gray-600 uppercase">ap (mm)</label>
                 <input type="number" step="0.1" value={formData.parameters.ap} onChange={(e) => setFormData({...formData, parameters: {...formData.parameters, ap: Number(e.target.value)}})} className="w-full bg-[#121214] rounded-xl h-12 text-center text-white" />
              </div>
           </div>
        </section>

        {tool && (
           <button 
             onClick={() => { if(confirm('Excluir esta ferramenta permanentemente?')) onDelete(tool.id) }}
             className="w-full py-5 rounded-2xl border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-xs mt-10"
           >
              Excluir Ferramenta
           </button>
        )}
      </div>
    </div>
  );
};

export default ToolEditor;
