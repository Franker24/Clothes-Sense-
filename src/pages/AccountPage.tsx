import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Calendar,
  Eye,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatARS, formatDate } from '../utils/formatters';
import { Order, UserAddress } from '../types';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    login, 
    register, 
    logout, 
    updateProfile, 
    addAddress, 
    removeAddress, 
    orders,
    wishlistCount 
  } = useStore();

  // Auth form states (when logged out)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Logged-in navigation tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<UserAddress, 'id'>>({
    alias: 'Casa',
    fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    street: '',
    number: '',
    floorApt: '',
    city: 'CABA',
    province: 'Ciudad Autónoma de Buenos Aires',
    postalCode: '',
    phone: currentUser?.phone || '',
    isDefault: false,
  });

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
  });

  // Handler for login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    login(loginEmail.trim());
  };

  // Handler for register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regFirstName.trim()) return;
    register(regFirstName.trim(), regLastName.trim(), regEmail.trim(), regPhone.trim());
  };

  // Handler for recovery
  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    setRecoverySent(true);
  };

  // Handler for adding address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.number) return;
    addAddress(newAddr);
    setShowAddressModal(false);
    setNewAddr({
      alias: 'Trabajo',
      fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
      street: '',
      number: '',
      floorApt: '',
      city: 'CABA',
      province: 'Ciudad Autónoma de Buenos Aires',
      postalCode: '',
      phone: currentUser?.phone || '',
      isDefault: false,
    });
  };

  // Filter orders for the user
  const userOrders = currentUser
    ? orders.filter((o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* If NOT logged in: show modern authentication portal */}
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white p-8 border border-[#DCDCD9] rounded-[2px] shadow-xs">
          
          {/* Auth Tab Switcher */}
          <div className="flex border-b border-[#DCDCD9] mb-6">
            <button
              onClick={() => { setAuthMode('login'); setRecoverySent(false); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                authMode === 'login' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setAuthMode('register'); setRecoverySent(false); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                authMode === 'register' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#777777] hover:text-[#111111]'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo: mateo.romero@gmail.com"
                  className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('recovery')}
                    className="text-[11px] text-[#777777] hover:text-[#111111] underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Ingresar a SENSE
              </button>

              <div className="text-[11px] text-[#777777] text-center pt-2">
                <span>Podés ingresar con cualquier email de prueba (ej: </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('mateo.romero@gmail.com');
                    setLoginPassword('demo1234');
                  }}
                  className="underline text-[#111111] font-semibold"
                >
                  mateo.romero@gmail.com
                </button>
                <span>)</span>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Mateo"
                    className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Romero"
                    className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+54 11 4829-1920"
                  className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Crear Mi Cuenta
              </button>
            </form>
          )}

          {/* PASSWORD RECOVERY FORM */}
          {authMode === 'recovery' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-[#111111]">
                Recuperación de contraseña
              </h3>
              <p className="text-xs text-[#777777]">
                Ingresá tu correo electrónico registrado y te enviaremos un enlace seguro para restablecer tu clave.
              </p>

              {recoverySent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 space-y-2">
                  <p className="font-semibold">¡Enlace enviado!</p>
                  <p>Si la casilla existe en nuestra base, recibirás las instrucciones en los próximos minutos.</p>
                  <button
                    onClick={() => { setAuthMode('login'); setRecoverySent(false); }}
                    className="text-xs font-bold underline mt-2 block"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRecoverySubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Ingresá tu email"
                    className="w-full h-11 px-3 text-xs bg-white border border-[#DCDCD9] rounded focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black"
                  >
                    Enviar instrucciones
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full text-xs text-[#777777] hover:underline"
                  >
                    Cancelar y volver al login
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-[#DCDCD9] text-center text-[11px] text-[#777777]">
            <p>Arquitectura desacoplada lista para Supabase Auth</p>
          </div>
        </div>
      ) : (
        /* LOGGED IN ACCOUNT DASHBOARD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Account Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F3F3F1] p-6 rounded-[2px] border border-[#DCDCD9]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center font-display font-extrabold text-xl">
                  {currentUser.firstName[0]}
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-[#111111]">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <p className="text-xs text-[#777777]">{currentUser.email}</p>
                  <span className="text-[10px] font-mono text-[#777777]">
                    Miembro SENSE desde {new Date(currentUser.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav className="mt-6 pt-6 border-t border-[#DCDCD9] space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'orders' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#EAEAE7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Mis Pedidos</span>
                  </div>
                  <span className="font-mono">{userOrders.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'addresses' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#EAEAE7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Direcciones Guardadas</span>
                  </div>
                  <span className="font-mono">{currentUser.addresses.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === 'profile' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#EAEAE7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Datos Personales</span>
                  </div>
                </button>

                <Link
                  to="/favorites"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[#111111] hover:bg-[#EAEAE7] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4" />
                    <span>Favoritos</span>
                  </div>
                  <span className="font-mono">{wishlistCount}</span>
                </Link>

                <div className="pt-3 border-t border-[#DCDCD9]">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#C8102E] hover:underline"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Right Column: Tab View Content (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    Historial de Pedidos
                  </h3>
                  <span className="text-xs text-[#777777]">
                    Mostrando {userOrders.length} pedidos
                  </span>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-[#DCDCD9] rounded">
                    <Package className="w-8 h-8 text-[#777777] mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#111111]">No realizaste pedidos todavía</p>
                    <p className="text-xs text-[#777777] mt-1">Tus compras confirmadas aparecerán registradas acá con su seguimiento en tiempo real.</p>
                    <Link to="/catalog" className="mt-4 inline-block px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded">
                      Comenzar a comprar
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border border-[#DCDCD9] p-5 rounded-[2px] hover:border-[#111111] transition-all space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-[#DCDCD9]/60">
                          <div>
                            <span className="font-mono font-bold text-[#111111] text-sm">
                              Orden #{ord.orderNumber}
                            </span>
                            <span className="text-[#777777] ml-3">
                              {formatDate(ord.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-emerald-100 text-emerald-800">
                              {ord.paymentStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-[#111111] text-white">
                              {ord.fulfillmentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 overflow-x-auto">
                            {ord.items.map((it, i) => (
                              <img
                                key={i}
                                src={it.image}
                                alt={it.productName}
                                className="w-12 h-14 object-cover rounded bg-[#F3F3F1] border border-[#DCDCD9]"
                                title={`${it.brand} - ${it.productName} (${it.quantity})`}
                              />
                            ))}
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-[#777777] block">Total abonado</span>
                            <span className="text-sm font-mono font-bold text-[#111111]">
                              {formatARS(ord.total)}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex items-center justify-between text-xs">
                          <div className="text-[#777777] text-[11px]">
                            {ord.trackingNumber && (
                              <span>Seguimiento: <strong className="text-[#111111] font-mono">{ord.trackingNumber}</strong></span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="inline-flex items-center gap-1.5 font-bold uppercase text-[#111111] hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Detalle Completo</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    Mis Direcciones de Envío
                  </h3>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase rounded hover:bg-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Dirección</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 border border-[#DCDCD9] rounded bg-white relative space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider text-[#111111]">
                          {addr.alias}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold uppercase bg-[#111111] text-white px-1.5 py-0.5 rounded">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[#111111]">{addr.fullName}</p>
                      <p className="text-[#555]">{addr.street} {addr.number} {addr.floorApt}</p>
                      <p className="text-[#555]">{addr.city}, {addr.province} ({addr.postalCode})</p>
                      <p className="text-[#777777]">Tel: {addr.phone}</p>

                      <div className="pt-3 border-t border-[#DCDCD9] flex justify-end">
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-[#C8102E] hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#DCDCD9]">
                  <h3 className="font-display font-bold text-xl text-[#111111]">
                    Datos Personales
                  </h3>
                  <p className="text-xs text-[#777777] mt-1">
                    Administrá tu información de contacto y preferencias.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile(profileForm);
                  }}
                  className="bg-white p-6 border border-[#DCDCD9] rounded space-y-4 max-w-lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full h-10 px-3 text-xs border border-[#DCDCD9] rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full h-10 px-3 text-xs border border-[#DCDCD9] rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Correo Electrónico (no modificable)
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full h-10 px-3 text-xs bg-[#F3F3F1] border border-[#DCDCD9] rounded text-[#777777]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full h-10 px-3 text-xs border border-[#DCDCD9] rounded focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full p-6 relative border border-[#DCDCD9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777777]">Comprobante Oficial</span>
                <h3 className="font-display font-bold text-lg text-[#111111]">
                  Orden #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#777777] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#F3F3F1] p-3 rounded">
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase">Fecha</span>
                  <span className="font-semibold">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase">Estado Pago</span>
                  <span className="font-semibold capitalize text-emerald-800">{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#DCDCD9]">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.productName} className="w-10 h-12 object-cover rounded" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#777777]">{item.brand}</span>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-[11px] text-[#777777]">Talle: {item.size} · Color: {item.color} · Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold">{formatARS(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-[#DCDCD9] space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatARS(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#C8102E]">
                    <span>Descuento</span>
                    <span className="font-mono">-{formatARS(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#DCDCD9]">
                  <span>Total</span>
                  <span className="font-mono">{formatARS(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCDCD9] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative border border-[#DCDCD9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCDCD9]">
              <h3 className="font-display font-bold text-base text-[#111111]">
                Nueva Dirección de Entrega
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="p-1 text-[#777777]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Nombre de referencia (Alias)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Casa, Trabajo, Casa de Verano"
                  value={newAddr.alias}
                  onChange={(e) => setNewAddr({ ...newAddr, alias: e.target.value })}
                  className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold uppercase mb-1">Calle</label>
                  <input
                    type="text"
                    required
                    placeholder="Av. del Libertador"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Número</label>
                  <input
                    type="text"
                    required
                    placeholder="2450"
                    value={newAddr.number}
                    onChange={(e) => setNewAddr({ ...newAddr, number: e.target.value })}
                    className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase mb-1">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Código Postal</label>
                  <input
                    type="text"
                    required
                    placeholder="C1425"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full h-9 px-3 border border-[#DCDCD9] rounded focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCDCD9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#DCDCD9] text-xs font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded"
                >
                  Guardar Dirección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
