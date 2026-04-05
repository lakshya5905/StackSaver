/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Dumbbell, 
  Zap, 
  Flame, 
  Heart, 
  Utensils, 
  Leaf, 
  TrendingDown, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  ArrowLeft,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Milk,
  History,
  XCircle,
  Search as SearchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Fuse from 'fuse.js';
import { Product, Deal, StorePrice, Brand } from './types';
import { CATEGORIES, MOCK_DEALS, MOCK_PRODUCTS, MOCK_STORE_PRICES, BRANDS } from './constants';

// --- Components ---

const getCategory = (name: string) => {
  const lowerName = name.toLowerCase();
  
  // Remove brand names first to avoid miscategorization (e.g., "Yoga Bar" being caught by "bar")
  const brands = ['myprotein', 'yogabar', 'yoga bar', 'muscleblaze', 'optimum nutrition', 'avvatar', 'gnc'];
  let cleanName = lowerName;
  brands.forEach(brand => {
    cleanName = cleanName.replace(brand, '');
  });

  // Check for specific keywords in the cleaned name
  if (cleanName.includes('plant') || cleanName.includes('vegan')) return 'Plant Protein';
  if (cleanName.includes('bar')) return 'Protein Bars';
  if (cleanName.includes('oats') || cleanName.includes('muesli')) return 'Oats';
  if (cleanName.includes('creatine')) return 'Creatine';
  if (cleanName.includes('pre-workout') || cleanName.includes('preworkout') || cleanName.includes('pre workout')) return 'Pre-Workout';
  
  // Vitamins & Minerals
  if (
    cleanName.includes('vitamin') || 
    cleanName.includes('fish oil') || 
    cleanName.includes('l-carnitine') || 
    cleanName.includes('multivitamin') ||
    cleanName.includes('omega 3') ||
    cleanName.includes('zinc') ||
    cleanName.includes('magnesium') ||
    cleanName.includes('calcium') ||
    cleanName.includes('biotin')
  ) return 'Vitamins & Minerals';
  
  // Whey Protein - specifically looking for whey/isolate or protein
  if (cleanName.includes('whey') || cleanName.includes('isolate') || cleanName.includes('protein')) return 'Whey Protein';
  
  return 'Other';
};

const formatPrice = (price: number) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const ProductCard = ({ product, onClick }: { product: Product, onClick: (id: string) => void, key?: any }) => {
  const discount = Math.round(((product.originalPrice - product.bestPrice) / product.originalPrice) * 100);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(product.id)}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {discount}% OFF
          </span>
        </div>
      </div>
      <div className="px-2 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.brand}</p>
        <h3 className="font-bold text-slate-900 leading-tight mb-3 line-clamp-2 h-10">{product.name}</h3>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5 text-orange-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold text-slate-900">{product.rating}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">{formatPrice(product.bestPrice)}</span>
              <span className="ml-2 text-sm text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryDetailView = ({ category, onProductClick, onBack }: { category: typeof CATEGORIES[0], onProductClick: (id: string) => void, onBack: () => void }) => {
  const products = MOCK_PRODUCTS
    .filter(p => p.category === category.name)
    .sort((a, b) => {
      const discA = ((a.originalPrice - a.bestPrice) / a.originalPrice);
      const discB = ((b.originalPrice - b.bestPrice) / b.originalPrice);
      return discB - discA;
    });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-32 pb-20 bg-slate-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                {category.id === 'whey' && <Dumbbell className="w-8 h-8" />}
                {category.id === 'creatine' && <Zap className="w-8 h-8" />}
                {category.id === 'pre-workout' && <Flame className="w-8 h-8" />}
                {category.id === 'vitamins' && <Heart className="w-8 h-8" />}
                {category.id === 'bars' && <Utensils className="w-8 h-8" />}
                {category.id === 'vegan' && <Leaf className="w-8 h-8" />}
                {category.id === 'oats' && <Milk className="w-6 h-6" />}
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{category.name}</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">
              Showing the best deals for {category.name}, sorted by the highest discounts first.
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Products Found</p>
            <p className="text-2xl font-black text-slate-900">{products.length}</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductClick} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Dumbbell className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Products Found</h3>
            <p className="text-slate-500 font-medium">We couldn't find any products in this category at the moment.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CategoryProductsView = ({ onProductClick, onBack }: { onProductClick: (id: string) => void, onBack: () => void }) => {
  const groupedProducts = CATEGORIES.reduce((acc, cat) => {
    const productsInCategory = MOCK_PRODUCTS.filter(p => p.category === cat.name);
    if (productsInCategory.length > 0) {
      // Sort by discount percentage
      const sorted = [...productsInCategory].sort((a, b) => {
        const discA = ((a.originalPrice - a.bestPrice) / a.originalPrice);
        const discB = ((b.originalPrice - b.bestPrice) / b.originalPrice);
        return discB - discA;
      });
      acc[cat.name] = sorted;
    }
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 bg-slate-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">SHOP BY CATEGORY</h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Browse all products organized by category, sorted by the highest discounts first.
          </p>
        </div>

        <div className="space-y-24">
          {CATEGORIES.map((cat) => {
            const products = groupedProducts[cat.name];
            if (!products) return null;

            return (
              <div key={cat.id} id={cat.slug} className="scroll-mt-32">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                      {cat.id === 'whey' && <Dumbbell className="w-6 h-6" />}
                      {cat.id === 'creatine' && <Zap className="w-6 h-6" />}
                      {cat.id === 'pre-workout' && <Flame className="w-6 h-6" />}
                      {cat.id === 'vitamins' && <Heart className="w-6 h-6" />}
                      {cat.id === 'bars' && <Utensils className="w-6 h-6" />}
                      {cat.id === 'vegan' && <Leaf className="w-6 h-6" />}
                      {cat.id === 'oats' && <Milk className="w-6 h-6" />}
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{cat.name}</h2>
                  </div>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {products.length} Products
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={onProductClick} 
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ onHome, onCategories, onCategoryClick, onSearchOpen }: { 
  onHome: () => void, 
  onCategories: () => void, 
  onCategoryClick: (slug: string) => void,
  onSearchOpen: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToCategory = (slug: string) => {
    onCategoryClick(slug);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={onHome}
        >
          <img 
            src="https://res.cloudinary.com/dpoymblzq/image/upload/v1774709681/215f59f9-7089-4573-bcfe-5274d96d08d3_z5notu.png"
            alt="StackSaver Logo"
            style={{ height: '40px', width: 'auto', objectFit: 'contain', marginRight: '10px' }}
            className="transition-all duration-200 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-lg"
          />
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            STACK<span className="text-blue-600">SAVER</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={onCategories} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Categories</button>
          <button onClick={() => navigateToCategory('whey-protein')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Protein</button>
          <button onClick={() => navigateToCategory('creatine')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Creatine</button>
          <button onClick={() => navigateToCategory('pre-workout')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pre-Workout</button>
          <button onClick={() => navigateToCategory('vitamins-minerals')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Vitamins</button>
          
          <div className="flex items-center gap-3 border-l border-slate-200 ml-2 pl-4">
            <div 
              onClick={onSearchOpen}
              className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-2 cursor-pointer hover:border-blue-200 transition-all group min-w-[180px]"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-medium text-slate-400">Search products...</span>
            </div>
            <button 
              onClick={onSearchOpen}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={onSearchOpen}
            className="p-2 text-slate-900"
          >
            <Search className="w-6 h-6" />
          </button>
          <button 
            className="p-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-4 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <button onClick={() => navigateToCategory('whey-protein')} className="text-left text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl">Protein</button>
              <button onClick={() => navigateToCategory('creatine')} className="text-left text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl">Creatine</button>
              <button onClick={() => navigateToCategory('pre-workout')} className="text-left text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl">Pre-Workout</button>
              <button onClick={() => navigateToCategory('vitamins-minerals')} className="text-left text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl">Vitamins</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onSearchOpen }: { onSearchOpen: () => void }) => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 blur-[120px] rounded-full" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
          <Zap className="w-3.5 h-3.5 fill-blue-700" />
          The Smartest Way to Buy Supplements
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
          STOP OVERPAYING <br />
          <span className="text-blue-600">FOR YOUR STACK.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium mb-10">
          We track prices across 50+ stores to find you the lowest price on protein, creatine, and pre-workout. Save up to 40% every time you buy.
        </p>

        <div 
          className="max-w-2xl mx-auto relative group cursor-pointer"
          onClick={onSearchOpen}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-slate-100">
            <Search className="ml-4 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              readOnly
              placeholder="Search for 'Gold Standard Whey' or 'Creatine'..." 
              className="flex-1 px-4 py-4 text-lg font-medium focus:outline-none bg-transparent text-slate-900 placeholder:text-slate-400 cursor-pointer"
            />
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors hidden sm:block">
              Find Best Price
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-5 h-5" /> Lab Tested Products
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckCircle2 className="w-5 h-5" /> 1,000+ Products Tracked
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <TrendingDown className="w-5 h-5" /> Real-time Price Intelligence
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const DealCard = ({ deal, onClick }: { deal: Deal, onClick: () => void, key?: React.Key }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
      <img 
        src={deal.image} 
        alt={deal.productName} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${
          deal.type === 'HOT' ? 'bg-orange-600' : 'bg-blue-600'
        }`}>
          {deal.type}
        </span>
        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-100">
          -{deal.discountPercent}% OFF
        </span>
      </div>
    </div>
    <div className="px-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{deal.brand}</p>
      <h3 className="font-bold text-slate-900 leading-tight mb-3 line-clamp-1">{deal.productName}</h3>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-black text-slate-900">{formatPrice(deal.currentPrice)}</span>
          <span className="ml-2 text-sm text-slate-400 line-through font-bold">{formatPrice(deal.originalPrice)}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  </motion.div>
);

const CategoryGrid = ({ onCategoryClick, onViewAllCategories }: { onCategoryClick: (slug: string) => void, onViewAllCategories: () => void }) => {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Dumbbell': return <Dumbbell className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Flame': return <Flame className="w-8 h-8" />;
      case 'Heart': return <Heart className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Leaf': return <Leaf className="w-8 h-8" />;
      default: return <Dumbbell className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">SHOP BY CATEGORY</h2>
            <p className="text-slate-500 font-medium">Find the best deals in your specific niche.</p>
          </div>
          <button 
            onClick={onViewAllCategories}
            className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
          >
            View All <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => onCategoryClick(cat.slug)}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-center cursor-pointer group"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {getIcon(cat.icon)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandCard = ({ brand, onClick }: { brand: Brand, onClick: () => void, key?: React.Key }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group text-center"
    onClick={onClick}
  >
    <div className="w-24 h-24 mx-auto mb-4 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2">
      <img 
        src={brand.logo} 
        alt={brand.name} 
        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
    </div>
    <h3 className="font-bold text-slate-900 mb-1">{brand.name}</h3>
  </motion.div>
);

const VerificationCard = ({ brand, onClick }: { brand: Brand, onClick: () => void, key?: React.Key }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
    onClick={onClick}
  >
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </div>
    </div>
    
    <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2">
      <img 
        src={brand.logo} 
        alt={brand.name} 
        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="text-center">
      <h3 className="font-bold text-slate-900 mb-1">{brand.name}</h3>
      <div className="flex items-center justify-center gap-1 text-blue-600">
        <ShieldCheck className="w-3 h-3" />
        <span className="text-[10px] font-black uppercase tracking-widest">Lab Tested</span>
      </div>
    </div>
  </motion.div>
);

const VerificationPage = ({ brand, onBack }: { brand: Brand, onBack: () => void, key?: React.Key }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <div className="w-32 h-32 bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center">
            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{brand.name}</h1>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-600 font-medium max-w-2xl">Official Lab Verification & Authenticity Reports for {brand.name} products.</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              LAB TEST REPORTS
            </h2>
            
            <div className="max-w-2xl mx-auto">
              {/* PDF Reports */}
              <div 
                onClick={() => brand.reportUrl && window.open(brand.reportUrl, '_blank')}
                className={`bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-colors ${brand.reportUrl ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ExternalLink className="w-8 h-8" />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest mb-2">Latest PDF Reports</h4>
                <p className="text-slate-400 text-sm font-medium">Independent lab analysis for protein content and purity.</p>
                <div className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                  {brand.reportUrl ? 'View Documents' : 'No Documents'}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">VERIFICATION DETAILS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</p>
                <p className="font-black text-slate-900">Whey Protein Isolate (Batch #442)</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Test Date</p>
                <p className="font-black text-slate-900">March 15, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Source Lab</p>
                <p className="font-black text-blue-600">{brand.sourceLab || 'Certified Lab'}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

const BrandPage = ({ brand, products, onBack, onProductClick }: { 
  brand: Brand, 
  products: Product[], 
  onBack: () => void,
  onProductClick: (id: string) => void,
  key?: React.Key
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Whey Protein');
  
  const categories = [
    { id: 'protein', name: 'Protein', value: 'Whey Protein' },
    { id: 'plant-protein', name: 'Plant Protein', value: 'Plant Protein' },
    { id: 'creatine', name: 'Creatine', value: 'Creatine' },
    { id: 'pre-workout', name: 'Pre-Workout', value: 'Pre-Workout' },
    { id: 'vitamins', name: 'Vitamins', value: 'Vitamins' },
    { id: 'bars', name: 'Protein Bars', value: 'Protein Bars' },
    { id: 'oats', name: 'Oats', value: 'Oats' },
  ].filter(cat => {
    if (brand.id === 'avvatar') {
      return cat.id !== 'pre-workout' && cat.id !== 'vitamins' && cat.id !== 'bars' && cat.id !== 'oats' && cat.id !== 'plant-protein';
    }
    if (brand.id === 'yoga-bar') {
      return cat.id !== 'creatine' && cat.id !== 'pre-workout' && cat.id !== 'vitamins';
    }
    // For other brands, hide bars and oats unless they have products
    if (cat.id === 'bars' || cat.id === 'oats') {
      return brand.id === 'yoga-bar';
    }
    return true;
  });

  const filteredProducts = products.filter(p => {
    // If a brand has plant protein but we want to show it under "Protein" tab for some brands
    // or keep it separate. Given user request "Add this in ... protein", 
    // maybe showing it in both or just separate is fine.
    // Let's keep it separate but ensure it's visible.
    return p.category === selectedCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Brands
        </button>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <div className="w-32 h-32 bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center">
            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 uppercase">{brand.name}</h1>
            <p className="text-slate-600 font-medium max-w-2xl">{brand.description}</p>
          </div>
        </div>

        {/* Brand Category Nav */}
        <div className="flex items-center justify-center md:justify-start gap-2 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200 hover:text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const discount = product.originalPrice ? Math.round(((product.originalPrice - product.bestPrice) / product.originalPrice) * 100) : 0;
              
              return (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    {(product.discountBadge || discount > 0) && (
                      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {product.discountBadge || `${discount}% OFF`}
                      </div>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="px-2 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.bestStore}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 leading-tight mb-3 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-black text-slate-900">{formatPrice(product.bestPrice)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        View Deal <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No products found in this category.</p>
          </div>
        )}

        {/* Which One Should You Buy Section */}
        {brand.id === 'muscleblaze' && selectedCategory === 'Whey Protein' && (
          <div className="mt-20">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Which One Should You Buy?</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Biozyme Performance Whey",
                  desc: "Best all-round whey protein for daily nutrition and recovery. Balanced option for most people.",
                  highlight: "Best for most people"
                },
                {
                  name: "Iso-Zero Whey",
                  desc: "Best for people who are lactose intolerant. Very low carbs and fats."
                },
                {
                  name: "Biozyme Whey PR",
                  desc: "Best for people focusing on strength and performance. Includes added creatine."
                },
                {
                  name: "Biozyme Gold 100% Whey",
                  desc: "Best for people wanting higher purity whey protein. Premium blend for lean muscle support."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative">
                  {item.highlight && (
                    <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                      {item.highlight}
                    </div>
                  )}
                  <h4 className="font-black text-slate-900 mb-3 uppercase tracking-tight text-sm">{item.name}</h4>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProductPage = ({ product, onBack }: { product: Product, onBack: () => void, key?: React.Key }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Deals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left: Image */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] bg-slate-50 overflow-hidden border border-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Info & CTA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="w-4 h-4 fill-orange-500" />
                <span className="text-sm font-black text-slate-900">{product.rating}</span>
                <span className="text-sm text-slate-400 font-bold">({product.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest">{product.brand}</p>

            <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border border-slate-100">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Best Price Found</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-black text-slate-900">{formatPrice(product.bestPrice)}</span>
                    <span className="text-xl text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-black">
                      SAVE {Math.round((1 - product.bestPrice / product.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">At Store</p>
                  <p className="text-xl font-black text-blue-600 uppercase tracking-tighter">{product.bestStore}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => product.officialUrl && window.open(product.officialUrl, '_blank')}
                  disabled={!product.officialUrl}
                  className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 group ${
                    product.officialUrl 
                      ? 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  BUY AT OFFICIAL {product.brand.toUpperCase()} STORE
                  {product.officialUrl && <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>

                {(product.amazonUrl || product.healthkartUrl) && (
                  <div className={`grid gap-4 ${product.amazonUrl && product.healthkartUrl ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <button 
                      onClick={() => product.officialUrl && window.open(product.officialUrl, '_blank')}
                      disabled={!product.officialUrl}
                      className={`p-4 rounded-2xl transition-all group flex flex-col items-center gap-2 border-2 ${
                        product.officialUrl 
                          ? 'bg-white border-slate-100 hover:border-blue-600' 
                          : 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official</span>
                      <span className="font-black text-slate-900">{product.officialUrl ? formatPrice(product.officialPrice || product.bestPrice) : 'Unavailable'}</span>
                    </button>
                    {product.amazonUrl && (
                      <button 
                        onClick={() => product.amazonUrl && window.open(product.amazonUrl, '_blank')}
                        className="p-4 rounded-2xl transition-all group flex flex-col items-center gap-2 border-2 bg-white border-slate-100 hover:border-blue-600"
                      >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amazon</span>
                        <span className="font-black text-slate-900">{formatPrice(product.amazonPrice || Math.round(product.bestPrice * 1.05))}</span>
                      </button>
                    )}
                    {product.healthkartUrl && (
                      <button 
                        onClick={() => product.healthkartUrl && window.open(product.healthkartUrl, '_blank')}
                        className="p-4 rounded-2xl transition-all group flex flex-col items-center gap-2 border-2 bg-white border-slate-100 hover:border-blue-600"
                      >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HealthKart</span>
                        <span className="font-black text-slate-900">{formatPrice(product.healthkartPrice || Math.round(product.bestPrice * 1.08))}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Updated 2h ago</div>
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified Deal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mid Section: Benefits & Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">WHY WE RECOMMEND IT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'High Protein Density', desc: '24g of protein in a 30g scoop. Exceptional purity.' },
                { title: 'Fast Digestion', desc: 'Whey isolates are absorbed rapidly for post-workout recovery.' },
                { title: 'BCAA Rich', desc: 'Naturally occurring BCAAs to support muscle endurance.' },
                { title: 'Informed Choice', desc: 'Banned substance tested for athlete safety.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-green-50 text-green-600 p-2 rounded-lg h-fit">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">THE VERDICT</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                "Gold Standard remains the industry benchmark for a reason. It mixes perfectly, tastes great, and offers the best protein-per-dollar ratio in the premium isolate category."
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Best For</p>
              <p className="font-bold text-lg">Post-workout recovery & daily protein supplementation.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SearchOverlay = ({ isOpen, onClose, onProductClick }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onProductClick: (id: string) => void 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const popularSearches = ['Whey Protein', 'Creatine', 'Pre-Workout', 'GNC', 'MuscleBlaze', 'Chocolate'];

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const fuse = React.useMemo(() => new Fuse(MOCK_PRODUCTS, {
    keys: ['name', 'brand', 'category', 'description', 'flavor', 'weight'],
    threshold: 0.3,
    distance: 100,
    includeMatches: true,
    minMatchCharLength: 2
  }), []);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = fuse.search(query);
      setResults(searchResults.map(r => r.item));
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleProductSelect = (id: string) => {
    onProductClick(id);
    onClose();
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={i} className="bg-blue-100 text-blue-600 font-bold">{part}</span> 
        : part
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-slate-100 py-6 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, brands, or categories..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 pl-14 pr-12 text-xl font-bold text-slate-900 outline-none transition-all"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Close
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-10">
            <div className="max-w-4xl mx-auto">
              {query.length < 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <History className="w-4 h-4" /> Recent Searches
                      </h3>
                      <div className="space-y-2">
                        {recentSearches.map((s, i) => (
                          <button 
                            key={i}
                            onClick={() => handleSearch(s)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl text-slate-900 font-bold transition-all group"
                          >
                            {s}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" /> Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {popularSearches.map((s, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSearch(s)}
                          className="px-6 py-3 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Found {results.length} Results
                    </h3>
                  </div>

                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleProductSelect(product.id)}
                          className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
                        >
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.brand}</p>
                            <h4 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-1">
                              {highlightText(product.name, query)}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-slate-900">{formatPrice(product.bestPrice)}</span>
                              <span className="text-xs text-slate-400 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                            </div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Search className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                      <p className="text-slate-500 font-medium">Try searching for something else, like "Whey" or "GNC".</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const Footer = ({ onBrandClick }: { onBrandClick: (brandId: string) => void }) => (
  <footer className="bg-slate-900 text-white py-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-6 group cursor-pointer">
            <img 
              src="https://res.cloudinary.com/dpoymblzq/image/upload/v1774709681/215f59f9-7089-4573-bcfe-5274d96d08d3_z5notu.png"
              alt="StackSaver Logo"
              style={{ height: '40px', width: 'auto', objectFit: 'contain', marginRight: '10px' }}
              className="transition-all duration-200 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-lg"
            />
            <span className="text-3xl font-black tracking-tighter">
              STACK<span className="text-blue-500">SAVER</span>
            </span>
          </div>
          <p className="text-slate-400 max-w-sm font-medium mb-8">
            A price comparison platform for fitness supplements. We help you build your dream stack without breaking the bank.
          </p>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-sm mb-6">Categories</h4>
          <ul className="space-y-4 text-slate-400 font-bold text-sm">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Whey Protein</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Creatine</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Pre-Workout</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Vitamins</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase tracking-widest text-sm mb-6">Brands</h4>
          <ul className="space-y-4 text-slate-400 font-bold text-sm">
            {BRANDS.map((brand) => (
              <li key={brand.id}>
                <button 
                  onClick={() => onBrandClick(brand.id)}
                  className="hover:text-blue-500 transition-colors text-left"
                >
                  {brand.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            © 2026 STACKSAVER. ALL RIGHTS RESERVED.
          </p>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Prices may vary. We may earn affiliate commissions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> SECURE AFFILIATE PARTNER
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'product' | 'brand' | 'verification' | 'categories' | 'category'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedVerificationBrand, setSelectedVerificationBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setView('product');
      window.scrollTo(0, 0);
    }
  };

  const handleBrandClick = (brandId: string) => {
    const brand = BRANDS.find(b => b.id === brandId);
    if (brand) {
      setSelectedBrand(brand);
      setView('brand');
      window.scrollTo(0, 0);
    }
  };

  const handleVerificationClick = (brandId: string) => {
    const brand = BRANDS.find(b => b.id === brandId);
    if (brand) {
      setSelectedVerificationBrand(brand);
      setView('verification');
      window.scrollTo(0, 0);
    }
  };

  const handleCategoryClick = (slug: string) => {
    const category = CATEGORIES.find(c => c.slug === slug);
    if (category) {
      setSelectedCategory(category);
      setView('category');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        onHome={() => setView('home')} 
        onCategories={() => setView('categories')} 
        onCategoryClick={handleCategoryClick}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onProductClick={handleProductClick}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onSearchOpen={() => setIsSearchOpen(true)} />

            {/* Top Brands Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">TOP BRANDS</h2>
                    <p className="text-slate-500 font-medium">Shop authentic supplements from official brand partners.</p>
                  </div>
                  <button 
                    onClick={() => setView('categories')}
                    className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                  >
                    View All Categories <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {BRANDS.map((brand) => (
                    <BrandCard 
                      key={brand.id} 
                      brand={brand} 
                      onClick={() => handleBrandClick(brand.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <CategoryGrid 
              onCategoryClick={handleCategoryClick} 
              onViewAllCategories={() => setView('categories')}
            />

            {/* Lab Tested Brands Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                    LAB TESTED & <span className="text-blue-600">VERIFIED BRANDS</span>
                  </h2>
                  <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                    View independent lab test reports to verify supplement authenticity and quality.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {BRANDS.map((brand) => (
                    <VerificationCard 
                      key={brand.id} 
                      brand={brand} 
                      onClick={() => handleVerificationClick(brand.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Trust / SEO Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 leading-tight uppercase">
                      CORE PLATFORM <br />
                      <span className="text-blue-600">CAPABILITIES</span>
                    </h2>
                    <div className="space-y-8">
                      {[
                        { title: 'Price Monitoring', desc: 'We monitor major retailers throughout the day to help you identify genuine price reductions and historical lows.' },
                        { title: 'Cost Per Scoop/Gram', desc: 'Our algorithm normalizes prices across different container sizes so you can compare the true value per gram of protein.' },
                        { title: 'Lab Verified Supplements', desc: 'Access independent lab reports directly on our platform to verify protein content and purity before you buy.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6">
                          <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black">
                            0{i+1}
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden border border-slate-200 shadow-inner">
                      <img 
                        src="https://www.optimumnutrition.co.in/cdn/shop/files/748927072457_11.jpg?v=1767942045&width=1946" 
                        alt="Optimum Nutrition Product" 
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'category' && selectedCategory && (
          <CategoryDetailView 
            category={selectedCategory}
            onProductClick={handleProductClick}
            onBack={() => setView('home')}
          />
        )}

        {view === 'categories' && (
          <CategoryProductsView 
            onProductClick={handleProductClick}
            onBack={() => setView('home')}
          />
        )}

        {view === 'brand' && (
          <BrandPage 
            key="brand"
            brand={selectedBrand!}
            products={MOCK_PRODUCTS.filter(p => p.brand.toLowerCase().includes(selectedBrand?.name.toLowerCase() || ''))}
            onBack={() => setView('home')}
            onProductClick={handleProductClick}
          />
        )}

        {view === 'product' && (
          <ProductPage 
            key="product"
            product={selectedProduct!} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'verification' && (
          <VerificationPage 
            key="verification"
            brand={selectedVerificationBrand!}
            onBack={() => setView('home')}
          />
        )}
      </AnimatePresence>

      <Footer onBrandClick={handleBrandClick} />
    </div>
  );
}
