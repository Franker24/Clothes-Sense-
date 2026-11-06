import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const FavoritesPage: React.FC = () => {
  const { wishlist, products, clearWishlist } = useStore();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#DCDCD9] mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#777777]">
            Mi Lista de Deseos
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#111111] mt-1">
            Favoritos
          </h1>
        </div>

        {favoriteProducts.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#777777] font-mono">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
            </span>
            <button
              onClick={clearWishlist}
              className="text-xs text-[#777777] hover:text-[#C8102E] underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar lista</span>
            </button>
          </div>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#DCDCD9] rounded-lg">
          <div className="w-16 h-16 rounded-full bg-[#F3F3F1] mx-auto flex items-center justify-center text-[#777777] mb-4">
            <Heart className="w-8 h-8 stroke-[1.25]" />
          </div>
          <h2 className="font-display font-bold text-xl text-[#111111]">
            Todavía no tenés productos guardados
          </h2>
          <p className="text-xs text-[#777777] mt-2 max-w-sm mx-auto">
            Hacé clic en el ícono de corazón en cualquier producto para guardarlo acá y seguirlo de cerca.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            <span>Explorar Colecciones</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
