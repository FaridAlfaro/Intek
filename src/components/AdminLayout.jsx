import React, { useState } from 'react';
import { Building2, Wrench, ShoppingCart } from 'lucide-react';
import EdificiosTab from './admin/EdificiosTab';
import ServicioTecnicoTab from './admin/ServicioTecnicoTab';
import VentasStockTab from './admin/VentasStockTab';

function AdminLayout({ db, handlers }) {
  const [activeTab, setActiveTab] = useState('edificios');

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-100 rounded-lg overflow-hidden shadow-inner">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Administración</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('edificios')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'edificios' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Building2 className="w-5 h-5" />
            <span>Edificios</span>
          </button>
          
          <button
            onClick={() => setActiveTab('servicio')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'servicio' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Wrench className="w-5 h-5" />
            <span>Servicio Técnico</span>
          </button>

          <button
            onClick={() => setActiveTab('ventas')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ventas' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Ventas y Stock</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-slate-50 p-6">
        {activeTab === 'edificios' && <EdificiosTab db={db} handlers={handlers} />}
        {activeTab === 'servicio' && <ServicioTecnicoTab db={db} handlers={handlers} />}
        {activeTab === 'ventas' && <VentasStockTab db={db} handlers={handlers} />}
      </div>
    </div>
  );
}

export default AdminLayout;
