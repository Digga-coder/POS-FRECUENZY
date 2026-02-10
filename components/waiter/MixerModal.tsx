import React from 'react';
import { Product } from '../../types';
import { PRODUCTS } from '../../constants';
import { X } from 'lucide-react';

interface MixerModalProps {
  parentProduct: Product;
  onSelectMixer: (mixer: Product) => void;
  onClose: () => void;
}

export const MixerModal: React.FC<MixerModalProps> = ({ parentProduct, onSelectMixer, onClose }) => {
  const mixers = PRODUCTS.filter(p => p.is_mixer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-zinc-800 flex justify-between items-center border-b border-zinc-700">
          <div>
            <span className="text-zinc-400 text-sm uppercase tracking-wider">Combinar</span>
            <h2 className="text-xl font-bold text-white">{parentProduct.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-700 rounded-full text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
            <h3 className="text-center text-white mb-4 text-lg">¿Con qué refresco?</h3>
            <div className="grid grid-cols-2 gap-3">
            {mixers.map((mixer) => (
                <button
                key={mixer.id}
                onClick={() => onSelectMixer(mixer)}
                className="h-24 rounded-xl bg-zinc-800 border-2 border-zinc-700 active:border-emerald-500 active:bg-zinc-700 flex flex-col items-center justify-center transition-all"
                >
                <span className="text-lg font-bold text-white">{mixer.name}</span>
                {mixer.price > 0 && (
                    <span className="text-xs text-zinc-400 mt-1">+{mixer.price.toFixed(2)}€</span>
                )}
                </button>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};
