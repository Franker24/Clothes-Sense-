import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Search, 
  BarChart3, 
  Tag, 
  Layers, 
  ArrowLeft 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatARS, formatDate } from '../utils/formatters';
import { Product, Brand, Order, ProductCategory, Gender } from '../types';
import { CATEGORIES_CONFIG } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    brands, 
    addBrand, 
    updateBrand, 
    deleteBrand, 
    orders, 
    updateOrderStatus,
    promotions 
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'orders' | 'brands' | 'promotions'>('overview');

  // Search & filter for products table
  const [productSearch, setProductSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Nike',
    gender: 'hombre' as Gender,
    category: 'remeras-tops' as ProductCategory,
    price: 49990,
    originalPrice: 0,
    description: '',
    detailsText: 'Algodón 100%\nCalce regular\nImportado',
    sizesText: 'S, M, L, XL',
    stockTotal: 15,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    isNew: true,
    isFeatured: true,
  });

  // Brand modal
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: '',
    slug: '',
    origin: '',
    description: '',
  });

  // Selected Order for status editing
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // KPIs Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'aprobado' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  
  // Stock alerts (variants with stock <= 3)
  const lowStockProducts = products.filter((p) =>
    p.variants.some((v) => v.stock > 0 && v.stock <= 3)
  );

  // Handlers for Products
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      brand: brands[0]?.name || 'Nike',
      gender: 'hombre',
      category: 'remeras-tops',
      price: 59900,
      originalPrice: 0,
      description: 'Prenda confeccionada con textiles de primera calidad.',
      detailsText: 'Algodón orgánico\nCosturas reforzadas\nLavado suave',
      sizesText: 'S, M, L, XL',
      stockTotal: 20,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      isNew: true,
      isFeatured: false,
    });
    setShowProductModal(true);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      brand: p.brand,
      gender: p.gender,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      description: p.description,
      detailsText: p.details.join('\n'),
      sizesText: p.availableSizes.join(', '),
      stockTotal: p.variants.reduce((sum, v) => sum + v.stock, 0),
      imageUrl: p.images[0] || '',
      isNew: !!p.isNew,
      isFeatured: !!p.isFeatured,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const sizes = productForm.sizesText.split(',').map((s) => s.trim()).filter(Boolean);
    const details = productForm.detailsText.split('\n').map((d) => d.trim()).filter(Boolean);

    // Build default variants
    const perVariantStock = Math.max(1, Math.floor(productForm.stockTotal / (sizes.length || 1)));
    const variants = sizes.map((sz, idx) => ({
      id: `v-custom-${Date.now()}-${idx}`,
      colorName: 'Predeterminado',
      colorHex: '#111111',
      size: sz,
      stock: perVariantStock,
      sku: `${productForm.brand.substring(0, 2).toUpperCase()}-${sz}-${Date.now().toString().slice(-4)}`,
    }));

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        brand: productForm.brand,
        gender: productForm.gender,
        category: productForm.category,
        price: productForm.price,
        originalPrice: productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
        description: productForm.description,
        details,
        availableSizes: sizes,
        variants,
        images: [productForm.imageUrl],
        isNew: productForm.isNew,
        isFeatured: productForm.isFeatured,
      });
    } else {
      addProduct({
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: productForm.name,
        brand: productForm.brand,
        gender: productForm.gender,
        category: productForm.category,
        price: productForm.price,
        originalPrice: productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
        description: productForm.description,
        details,
        availableColors: [{ name: 'Predeterminado', hex: '#111111' }],
        availableSizes: sizes,
        variants,
        images: [productForm.imageUrl],
        isNew: productForm.isNew,
        isFeatured: productForm.isFeatured,
        rating: 5.0,
        reviewsCount: 1,
      });
    }
    setShowProductModal(false);
  };

  // Handlers for Brands
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;
    const slug = brandForm.slug.trim().toLowerCase() || brandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addBrand({
      name: brandForm.name,
      slug,
      origin: brandForm.origin,
      description: brandForm.description,
      logoText: brandForm.name.toUpperCase(),
      featured: true,
      productCount: 0,
    });
    setShowBrandModal(false);
    setBrandForm({ name: '', slug: '', origin: '', description: '' });
  };

  // Filtered products list for table
  const filteredProductList = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesBrand = filterBrand ? p.brand === filterBrand : true;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCDCD9] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#777777]">
            <ShieldCheck className="w-4 h-4 text-[#111111]" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-[#111111] mt-1">
            SENSE Backoffice
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DCDCD9] rounded text-xs font-semibold uppercase hover:bg-[#F3F3F1] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Tienda Online</span>
          </Link>
          <button
            onClick={handleOpenNewProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-4 border-b border-[#DCDCD9] mb-8 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2 rounded transition-colors ${
            activeAdminTab === 'overview' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          Vista General
        </button>
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`px-4 py-2 rounded transition-colors ${
            activeAdminTab === 'products' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          Catálogo ({products.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2 rounded transition-colors ${
            activeAdminTab === 'orders' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          Órdenes ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('brands')}
          className={`px-4 py-2 rounded transition-colors ${
            activeAdminTab === 'brands' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          Marcas ({brands.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('promotions')}
          className={`px-4 py-2 rounded transition-colors ${
            activeAdminTab === 'promotions' ? 'bg-[#111111] text-white' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          Campañas ({promotions.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-[#DCDCD9] rounded-[2px] shadow-xs">
              <div className="flex items-center justify-between text-[#777777] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Ventas Totales</span>
                <DollarSign className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#111111]">
                {formatARS(totalRevenue)}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                +18.4% vs mes anterior
              </span>
            </div>

            <div className="p-5 bg-white border border-[#DCDCD9] rounded-[2px] shadow-xs">
              <div className="flex items-center justify-between text-[#777777] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Órdenes Procesadas</span>
                <ShoppingBag className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#111111]">
                {totalOrdersCount}
              </p>
              <span className="text-[11px] text-[#777777] mt-1 block">
                100% liquidadas vía Mercado Pago
              </span>
            </div>

            <div className="p-5 bg-white border border-[#DCDCD9] rounded-[2px] shadow-xs">
              <div className="flex items-center justify-between text-[#777777] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Ticket Promedio</span>
                <BarChart3 className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#111111]">
                {formatARS(averageOrderValue)}
              </p>
              <span className="text-[11px] text-[#777777] mt-1 block">
                2.1 prendas por orden
              </span>
            </div>

            <div className="p-5 bg-white border border-[#DCDCD9] rounded-[2px] shadow-xs">
              <div className="flex items-center justify-between text-[#777777] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Alertas de Stock</span>
                <AlertTriangle className="w-4 h-4 text-[#C8102E]" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#C8102E]">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-[#777777] mt-1 block">
                Productos con &le; 3 unidades
              </span>
            </div>
          </div>

          {/* Interactive Sales Chart Visualization */}
          <div className="bg-white p-6 border border-[#DCDCD9] rounded-[2px] shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-base text-[#111111]">
                  Evolución Mensual de Ventas (ARS)
                </h3>
                <p className="text-xs text-[#777777]">Crecimiento en volumen de facturación 2026</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#111111]">Octubre 2026</span>
            </div>

            {/* SVG Bars Simulation */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-[#DCDCD9]">
              {[
                { month: 'May', val: 420000, height: '40%' },
                { month: 'Jun', val: 580000, height: '55%' },
                { month: 'Jul', val: 710000, height: '68%' },
                { month: 'Ago', val: 690000, height: '65%' },
                { month: 'Sep', val: 890000, height: '82%' },
                { month: 'Oct', val: 1140000, height: '100%' },
              ].map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatARS(bar.val)}
                  </span>
                  <div
                    className="w-full bg-[#111111] group-hover:bg-black rounded-t-[2px] transition-all"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] font-bold text-[#777777] uppercase">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 border border-[#DCDCD9] rounded-[2px] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Últimas Órdenes Ingresadas
              </h3>
              <button
                onClick={() => setActiveAdminTab('orders')}
                className="text-xs font-semibold text-[#111111] underline"
              >
                Ver todas las órdenes →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#DCDCD9] font-bold uppercase tracking-wider text-[#777777]">
                    <th className="py-2.5">N° Orden</th>
                    <th className="py-2.5">Cliente</th>
                    <th className="py-2.5">Fecha</th>
                    <th className="py-2.5">Pago</th>
                    <th className="py-2.5">Fulfillment</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDCD9]/60 font-mono">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-[#F3F3F1]">
                      <td className="py-3 font-bold text-[#111111]">{o.orderNumber}</td>
                      <td className="py-3 font-sans font-medium text-[#111111]">
                        {o.customer.firstName} {o.customer.lastName}
                      </td>
                      <td className="py-3 text-[#777777]">{formatDate(o.createdAt)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#111111] text-white">
                          {o.fulfillmentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[#111111]">
                        {formatARS(o.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#777777] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en catálogo..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>

              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="h-10 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none"
              >
                <option value="">Todas las marcas</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="w-full sm:w-auto h-10 px-5 bg-[#111111] text-white text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 hover:bg-black"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-[#DCDCD9] rounded-[2px] overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F3F3F1] border-b border-[#DCDCD9] font-bold uppercase tracking-wider text-[#777777]">
                  <th className="p-3">Producto</th>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Precio ARS</th>
                  <th className="p-3">Stock Total</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDCD9]/60">
                {filteredProductList.map((p) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded bg-[#F3F3F1] border border-[#DCDCD9]"
                          />
                          <div>
                            <p className="font-semibold text-[#111111]">{p.name}</p>
                            <span className="text-[10px] text-[#777777] font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold uppercase">{p.brand}</td>
                      <td className="p-3 capitalize text-[#777777]">{p.category.replace('-', ' ')}</td>
                      <td className="p-3 font-mono font-bold">{formatARS(p.price)}</td>
                      <td className="p-3">
                        <span className={`font-mono font-semibold ${totalStock <= 5 ? 'text-[#C8102E]' : 'text-[#111111]'}`}>
                          {totalStock} unidades
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {p.isNew && <span className="bg-[#111111] text-white text-[9px] px-1.5 py-0.5 rounded uppercase">Nuevo</span>}
                          {p.isFeatured && <span className="bg-[#F3F3F1] text-[#111111] text-[9px] px-1.5 py-0.5 rounded border border-[#DCDCD9] uppercase">Destacado</span>}
                        </div>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F1] rounded transition-colors"
                          title="Editar producto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseás eliminar "${p.name}" del catálogo?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-[#777777] hover:text-[#C8102E] hover:bg-red-50 rounded transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DCDCD9] rounded-[2px] overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F3F3F1] border-b border-[#DCDCD9] font-bold uppercase tracking-wider text-[#777777]">
                  <th className="p-3">N° Orden</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Productos</th>
                  <th className="p-3">Pago</th>
                  <th className="p-3">Fulfillment</th>
                  <th className="p-3">Seguimiento</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDCD9]/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="p-3 font-bold font-mono text-[#111111]">{o.orderNumber}</td>
                    <td className="p-3 text-[#777777]">{formatDate(o.createdAt)}</td>
                    <td className="p-3">
                      <p className="font-semibold text-[#111111]">{o.customer.firstName} {o.customer.lastName}</p>
                      <span className="text-[10px] text-[#777777]">{o.customer.email}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{o.items.length} artículos</span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.paymentStatus}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any, o.fulfillmentStatus, o.trackingNumber)}
                        className="px-2 py-1 bg-white border border-[#DCDCD9] rounded text-[11px] font-semibold uppercase cursor-pointer"
                      >
                        <option value="aprobado">Aprobado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.fulfillmentStatus}
                        onChange={(e) => updateOrderStatus(o.id, o.paymentStatus, e.target.value as any, o.trackingNumber)}
                        className="px-2 py-1 bg-white border border-[#DCDCD9] rounded text-[11px] font-semibold uppercase cursor-pointer"
                      >
                        <option value="preparando">Preparando</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#777777]">
                      {o.trackingNumber || 'Sin tracking'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {formatARS(o.total)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingOrder(o)}
                        className="px-2.5 py-1 text-xs border border-[#DCDCD9] rounded hover:bg-[#F3F3F1] font-semibold"
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BRANDS MANAGEMENT */}
      {activeAdminTab === 'brands' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#777777]">
              Marcas oficiales registradas en el catálogo de SENSE.
            </p>
            <button
              onClick={() => setShowBrandModal(true)}
              className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Nueva Marca</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((b) => {
              const brandProductCount = products.filter(
                (p) => p.brand.toLowerCase() === b.name.toLowerCase()
              ).length;

              return (
                <div
                  key={b.id}
                  className="flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="px-6 py-8 sm:p-8 sm:pb-6 flex-1">
                    <div className="grid items-center justify-center w-full grid-cols-1 text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-lg font-medium tracking-tighter text-gray-900 lg:text-3xl font-display">
                            {b.name}
                          </h2>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar marca ${b.name}?`)) deleteBrand(b.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-neutral-100 transition-colors"
                            title="Eliminar marca"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {b.description || `Colección oficial registrada. Origen: ${b.origin}`}
                        </p>
                      </div>
                      <div className="mt-6">
                        <p className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-light tracking-tight text-black font-mono">
                            {brandProductCount}
                          </span>
                          <span className="text-base font-medium text-gray-500"> / prendas </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex px-6 pb-8 sm:px-8">
                    <Link
                      to={`/catalog?brand=${b.slug}`}
                      aria-describedby={`tier-${b.slug}`}
                      className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm font-semibold uppercase tracking-wider transition-all"
                    >
                      Ver en catálogo
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: PROMOTIONS & BANNERS */}
      {activeAdminTab === 'promotions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <div key={promo.id} className="p-6 bg-white border border-[#DCDCD9] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777] bg-[#F3F3F1] px-2 py-0.5 rounded">
                    {promo.discountTag}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">● Activo en Home</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#111111]">
                  {promo.title}
                </h3>
                <p className="text-xs text-[#555]">{promo.subtitle}</p>
                <div className="pt-3 border-t border-[#DCDCD9] flex items-center justify-between text-xs">
                  <span className="font-mono text-[#777777]">Cupón: <strong>{promo.code || 'Ninguno'}</strong></span>
                  <span className="text-[#111111] font-semibold">{promo.ctaText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative border border-[#DCDCD9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <h3 className="font-display font-bold text-lg text-[#111111]">
                {editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto en Catálogo'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 text-[#777777]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej: Dunk Low Retro Triple White"
                  className="w-full h-10 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Marca *</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded bg-white"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Género *</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as Gender })}
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded bg-white"
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="ninos">Niños</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Categoría *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded bg-white"
                  >
                    {CATEGORIES_CONFIG.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Precio Actual (ARS) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Precio Original / Lista (opcional)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    placeholder="Dejar 0 si no tiene descuento"
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">URL de Imagen (Editorial / Producto)</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full h-10 px-3 border border-[#DCDCD9] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase mb-1">Talles Disponibles (separados por coma)</label>
                  <input
                    type="text"
                    value={productForm.sizesText}
                    onChange={(e) => setProductForm({ ...productForm, sizesText: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Stock Total Inicial</label>
                  <input
                    type="number"
                    value={productForm.stockTotal}
                    onChange={(e) => setProductForm({ ...productForm, stockTotal: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-[#DCDCD9] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Descripción del Producto</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-[#111111]"
                  />
                  <span>Marcar como Nuevo Ingreso</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-[#111111]"
                  />
                  <span>Destacar en Portada</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#DCDCD9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-[#DCDCD9] rounded text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded hover:bg-black"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRAND MODAL */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative border border-[#DCDCD9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Añadir Marca al Catálogo
              </h3>
              <button onClick={() => setShowBrandModal(false)} className="p-1 text-[#777777]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBrand} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Nombre de la Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jordan"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Origen / Ciudad</label>
                <input
                  type="text"
                  placeholder="Chicago, USA"
                  value={brandForm.origin}
                  onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                  className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Legado y estética de la marca..."
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  className="w-full p-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>
              <div className="pt-4 border-t border-[#DCDCD9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-4 py-2 border border-[#DCDCD9] text-xs font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded"
                >
                  Crear Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER EDIT DETAIL MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative border border-[#DCDCD9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Gestión de Orden #{editingOrder.orderNumber}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="p-1 text-[#777777]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div className="bg-[#F3F3F1] p-3 rounded space-y-1">
                <p><strong>Cliente:</strong> {editingOrder.customer.firstName} {editingOrder.customer.lastName} ({editingOrder.customer.email})</p>
                <p><strong>Dirección:</strong> {editingOrder.shippingAddress.street} {editingOrder.shippingAddress.number}, {editingOrder.shippingAddress.city}</p>
                <p><strong>Total:</strong> {formatARS(editingOrder.total)}</p>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Número de Seguimiento (Tracking)</label>
                <input
                  type="text"
                  defaultValue={editingOrder.trackingNumber || ''}
                  id="admin-tracking-input"
                  placeholder="Ej: AND-928102-BA"
                  className="w-full h-9 px-3 border border-[#DCDCD9] rounded font-mono uppercase"
                />
              </div>

              <div className="pt-4 border-t border-[#DCDCD9] flex justify-end gap-2">
                <button
                  onClick={() => {
                    const input = document.getElementById('admin-tracking-input') as HTMLInputElement;
                    if (input) {
                      updateOrderStatus(editingOrder.id, editingOrder.paymentStatus, 'enviado', input.value);
                    }
                    setEditingOrder(null);
                  }}
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded"
                >
                  Guardar y Marcar Enviado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
