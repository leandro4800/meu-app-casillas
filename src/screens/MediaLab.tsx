import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Play, ExternalLink } from 'lucide-react';
import { Screen } from '../types';
import BottomNav from '../components/BottomNav';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Introdução ao Torneamento CNC',
    duration: '12:45',
    thumbnail: 'https://picsum.photos/seed/cnc1/400/225',
    url: 'https://youtube.com'
  },
  {
    id: '2',
    title: 'Fresagem de Alta Performance',
    duration: '08:20',
    thumbnail: 'https://picsum.photos/seed/cnc2/400/225',
    url: 'https://youtube.com'
  },
  {
    id: '3',
    title: 'Leitura de Micrômetro Passo a Passo',
    duration: '05:15',
    thumbnail: 'https://picsum.photos/seed/cnc3/400/225',
    url: 'https://youtube.com'
  },
  {
    id: '4',
    title: 'Cálculo de Engrenagens na Prática',
    duration: '15:30',
    thumbnail: 'https://picsum.photos/seed/cnc4/400/225',
    url: 'https://youtube.com'
  }
];

interface MediaLabProps {
  onBack: () => void;
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

const MediaLab: React.FC<MediaLabProps> = ({ onBack, navigate, currentScreen }) => {
  return (
    <div className="h-full w-full bg-[#0a0908] flex flex-col relative overflow-hidden">
      <header className="w-full h-16 px-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0908]/80 backdrop-blur-xl z-20">
        <button 
          onClick={onBack} 
          className="size-10 flex items-center justify-center text-[#eab308] hover:bg-white/5 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white font-black text-xs uppercase tracking-[0.2em]">Media Lab</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-32 custom-scrollbar">
        <div className="grid grid-cols-1 gap-6">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#141414] rounded-[2rem] overflow-hidden border border-white/5 group"
            >
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-16 rounded-full bg-[#eab308] flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1 leading-tight">{video.title}</h3>
                  <p className="text-gray-600 text-[8px] font-bold uppercase tracking-widest">Tutorial de Usinagem</p>
                </div>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-[#eab308] transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </div>
  );
};

export default MediaLab;
