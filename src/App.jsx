import React, { useState } from 'react';
import PublicView from './components/PublicView';
import AdminLayout from './components/AdminLayout';

function App() {
  // Global State (Backend Simulation)
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin'

  const [edificios, setEdificios] = useState([
    { id: 1, direccion: 'Av. Libertador 100', puertas: 2, fechaBaterias: '2024-01-10', consorcioId: 101 }
  ]);

  const [consorcios, setConsorcios] = useState([
    { id: 101, nombre: 'Consorcio Libertador' }
  ]);

  const [llaveros, setLlaveros] = useState([
    { codigoUnico: 'LL-001', edificioId: 1, estado: 'En Stock' },
    { codigoUnico: 'LL-002', edificioId: 1, estado: 'En Stock' }
  ]);

  const [solicitudes, setSolicitudes] = useState([
    { id: 1001, edificioId: 1, solicitante: 'Juan Perez', depto: '4B', estado: 'Pendiente' }
  ]);

  const [ventas, setVentas] = useState([]);
  const [servicioTecnico, setServicioTecnico] = useState([]);

  // State Mutation Functions (Backend Handlers)
  
  // Public handlers
  const handleCreateSolicitud = (newSolicitudInfo) => {
    // Simula un POST a /api/solicitudes
    const newId = solicitudes.length > 0 ? Math.max(...solicitudes.map(s => s.id)) + 1 : 1000;
    const newSolicitud = {
      ...newSolicitudInfo,
      id: newId,
      estado: 'Pendiente'
    };
    setSolicitudes([...solicitudes, newSolicitud]);
  };

  // Admin handlers
  const handleCreateEdificio = (newEdificioInfo) => {
    // Simula un POST a /api/edificios
    const newId = edificios.length > 0 ? Math.max(...edificios.map(e => e.id)) + 1 : 1;
    setEdificios([...edificios, { ...newEdificioInfo, id: newId }]);
  };

  const handleCreateServicio = (newServicioInfo) => {
    // Simula un POST a /api/servicio-tecnico
    const newId = servicioTecnico.length > 0 ? Math.max(...servicioTecnico.map(s => s.id)) + 1 : 1;
    setServicioTecnico([...servicioTecnico, { ...newServicioInfo, id: newId, fecha: new Date().toISOString() }]);
  };

  const handleUpdateSolicitudEstado = (solicitudId, nuevoEstado) => {
    // Simula un PATCH a /api/solicitudes/:id
    setSolicitudes(solicitudes.map(s => 
      s.id === solicitudId ? { ...s, estado: nuevoEstado } : s
    ));
  };

  const handleGenerarVenta = (ventaInfo) => {
    // Simula transacción compleja: POST /api/ventas y PATCH /api/llaveros/:id
    // 1) Cambiar estado del llavero a 'Vendido'
    setLlaveros(llaveros.map(ll => 
      ll.codigoUnico === ventaInfo.llaveroId ? { ...ll, estado: 'Vendido' } : ll
    ));
    // 2) Crear venta
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

  const dbWrapper = {
    edificios,
    consorcios,
    llaveros,
    solicitudes,
    ventas,
    servicioTecnico
  };

  const handlers = {
    handleCreateSolicitud,
    handleCreateEdificio,
    handleCreateServicio,
    handleUpdateSolicitudEstado,
    handleGenerarVenta
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar for Context Switch (Public / Admin) */}
      <nav className="bg-white shadow border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600 tracking-tight">INTEK</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setCurrentView('public')}
                  className={`${currentView === 'public' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Público
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`${currentView === 'admin' ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentView === 'public' ? (
          <PublicView db={dbWrapper} handlers={handlers} />
        ) : (
          <AdminLayout db={dbWrapper} handlers={handlers} />
        )}
      </main>
    </div>
  );
}

export default App;
