import React, { useState } from 'react';
import PublicView from './components/PublicView';
import AdminLayout from './components/AdminLayout';
import ConsorcioView from './components/ConsorcioView';

function App() {
  // Global State (Backend Simulation)
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin' | 'consorcio'

  const [edificios, setEdificios] = useState([
    { 
      id: 1, 
      nombre: 'Torre Libertador',
      direccion: 'Av. Libertador 100', 
      puertas: 2, 
      fechaBaterias: '2025-04-10', 
      consorcioId: 101,
      lectores: 4,
      anticlon: true,
      observaciones: 'Los ascensores de servicio están al final del pasillo B.',
      adminNombre: 'Administración Global S.A.',
      adminEmail: 'contacto@adminglobal.com'
    }
  ]);

  const [consorcios, setConsorcios] = useState([
    { id: 101, nombre: 'Consorcio Libertador' }
  ]);

  const [llaveros, setLlaveros] = useState([
    { codigoUnico: '7791234567890', edificioId: 1, estado: 'En Stock' }, // Código de barras simulado
    { codigoUnico: '7791234567891', edificioId: 1, estado: 'En Stock' }
  ]);

  const [solicitudes, setSolicitudes] = useState([
    { 
      id: 1001, 
      edificioId: 1, 
      solicitante: 'Juan Perez', // Legacy
      nombreCompleto: 'Juan Perez', 
      dni: '35123456',
      piso: '4',
      depto: 'B', 
      estado: 'Pendiente' 
    }
  ]);

  const [ventas, setVentas] = useState([]);
  const [servicioTecnico, setServicioTecnico] = useState([]);

  // Public handlers
  const handleCreateSolicitud = (newSolicitudInfo) => {
    const newId = solicitudes.length > 0 ? Math.max(...solicitudes.map(s => s.id)) + 1 : 1000;
    const newSolicitud = {
      ...newSolicitudInfo,
      solicitante: newSolicitudInfo.nombreCompleto, // compatibilidad
      id: newId,
      estado: 'Pendiente'
    };
    setSolicitudes([...solicitudes, newSolicitud]);
  };

  // Admin handlers
  const handleCreateEdificio = (newEdificioInfo) => {
    const newId = edificios.length > 0 ? Math.max(...edificios.map(e => e.id)) + 1 : 1;
    setEdificios([...edificios, { ...newEdificioInfo, id: newId }]);
  };

  const handleCreateServicio = (newServicioInfo) => {
    const newId = servicioTecnico.length > 0 ? Math.max(...servicioTecnico.map(s => s.id)) + 1 : 1;
    setServicioTecnico([...servicioTecnico, { ...newServicioInfo, id: newId, fecha: new Date().toISOString() }]);
  };

  const handleUpdateSolicitudEstado = (solicitudId, nuevoEstado) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === solicitudId ? { ...s, estado: nuevoEstado } : s
    ));
  };

  const handleGenerarVenta = (ventaInfo) => {
    setLlaveros(llaveros.map(ll => 
      ll.codigoUnico === ventaInfo.llaveroId ? { ...ll, estado: 'Vendido' } : ll
    ));
    const newId = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1;
    const newVenta = {
      id: newId,
      llaveroId: ventaInfo.llaveroId,
      solicitudId: ventaInfo.solicitudId,
      monto: ventaInfo.monto,
      fecha: new Date().toISOString()
    };
    setVentas([...ventas, newVenta]);
  };

  const dbWrapper = { edificios, consorcios, llaveros, solicitudes, ventas, servicioTecnico };
  const handlers = { handleCreateSolicitud, handleCreateEdificio, handleCreateServicio, handleUpdateSolicitudEstado, handleGenerarVenta };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-white shadow border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Agregamos flex-wrap y quitamos el alto fijo (h-16) para que pueda crecer hacia abajo */}
    <div className="flex flex-wrap items-center justify-between py-3 gap-y-4">
      
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-2xl font-bold text-blue-600 tracking-tight">INTEK</span>
      </div>
      
      {/* Botones: Quitamos 'hidden' y usamos flex-wrap con centrado en móviles */}
      <div className="flex flex-wrap justify-center w-full sm:w-auto gap-2 sm:gap-8">
        <button
          onClick={() => setCurrentView('public')}
          className={`${currentView === 'public' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
        >
          Público
        </button>
        <button
          onClick={() => setCurrentView('consorcio')}
          className={`${currentView === 'consorcio' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
        >
          Admin Consorcio
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          className={`${currentView === 'admin' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
        >
          Admin INTEK
        </button>
      </div>

    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
  {/* El contenido se ajustará automáticamente gracias a px-4 (móvil) y sm:px-6 (desktop) */}
  {currentView === 'public' && <PublicView db={dbWrapper} handlers={handlers} />}
  {currentView === 'consorcio' && <ConsorcioView db={dbWrapper} handlers={handlers} />}
  {currentView === 'admin' && <AdminLayout db={dbWrapper} handlers={handlers} />}
</main>
    </div>
  );
}

export default App;