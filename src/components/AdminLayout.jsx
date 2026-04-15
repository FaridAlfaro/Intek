import React, { useState } from 'react';
import EdificiosTab from './admin/EdificiosTab';
import VentasStockTab from './admin/VentasStockTab';
import ServicioTecnicoTab from './admin/ServicioTecnicoTab';
import ServiciosProgramados from './admin/ServiciosProgramados';

function AdminLayout({ db, handlers }) {
  const [activeTab, setActiveTab] = useState('edificios');

  const tabs = [
    { id: 'edificios', label: 'Edificios' },
    { id: 'ventas', label: 'Ventas y Stock' },
    { id: 'servicio', label: 'Servicio Técnico' },
    { id: 'servicios', label: 'Servicios Programados' },
  ];

  return (
    <div className="space-y-6">
      {/* Contenedor de pestañas responsive: scroll lateral en móvil */}
      <div className="border-b border-slate-200 bg-white rounded-t-lg shadow-sm overflow-x-auto overflow-y-hidden">
        <nav className="flex -mb-px px-4 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'edificios' && <EdificiosTab db={db} handlers={handlers} />}
        {activeTab === 'ventas' && <VentasStockTab db={db} handlers={handlers} />}
        {activeTab === 'servicio' && <ServicioTecnicoTab db={db} handlers={handlers} />}
        {activeTab === 'servicios' && <ServiciosProgramados db={db} handlers={handlers} />}
      </div>
    </div>
  );
}

export default AdminLayout;