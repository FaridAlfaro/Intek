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
    },
    { id: 2, nombre: 'Edificio Las Heras', direccion: 'Las Heras 2300', puertas: 1, fechaBaterias: '2025-05-15', consorcioId: 101, lectores: 2, anticlon: false, observaciones: '', adminNombre: 'Administración Global S.A.', adminEmail: 'contacto@adminglobal.com' },
    { id: 3, nombre: 'Condominio del Sol', direccion: 'Soler 4500', puertas: 3, fechaBaterias: '2026-06-20', consorcioId: 102, lectores: 6, anticlon: true, observaciones: 'Requiere llave especial para terraza', adminNombre: 'Consorcios VIP', adminEmail: 'vip@consorcios.com' },
    { id: 4, nombre: 'Torre Madero', direccion: 'Alicia Moreau 500', puertas: 4, fechaBaterias: '2026-11-10', consorcioId: 103, lectores: 8, anticlon: true, observaciones: '', adminNombre: 'Madero Admin', adminEmail: 'info@maderoadmin.com' },
    { id: 5, nombre: 'Plaza San Martin', direccion: 'Florida 1000', puertas: 1, fechaBaterias: '2027-01-30', consorcioId: 104, lectores: 2, anticlon: true, observaciones: 'Edificio histórico', adminNombre: 'Centro S.A.', adminEmail: 'centro@admsa.com.ar' },
    { id: 6, nombre: 'Residencias Belgrano', direccion: 'Juramento 2100', puertas: 2, fechaBaterias: '2026-07-05', consorcioId: 105, lectores: 4, anticlon: false, observaciones: '', adminNombre: 'Belgrano Gestiones', adminEmail: 'gestiones@belgrano.com' },
    { id: 7, nombre: 'Edificio Pacifico', direccion: 'Santa Fe 4300', puertas: 1, fechaBaterias: '2027-03-12', consorcioId: 101, lectores: 2, anticlon: true, observaciones: 'Puerta de servicio averiada', adminNombre: 'Administración Global S.A.', adminEmail: 'contacto@adminglobal.com' },
    { id: 8, nombre: 'Torres Polo', direccion: 'Báez 300', puertas: 5, fechaBaterias: '2026-12-01', consorcioId: 102, lectores: 10, anticlon: true, observaciones: '', adminNombre: 'Consorcios VIP', adminEmail: 'vip@consorcios.com' },
    { id: 9, nombre: 'Edificio La Costa', direccion: 'Costanera 200', puertas: 2, fechaBaterias: '2026-08-22', consorcioId: 101, lectores: 4, anticlon: true, observaciones: 'Cuidado con filtraciones de agua en PB', adminNombre: 'Administración Global S.A.', adminEmail: 'contacto@adminglobal.com' },
    { id: 10, nombre: 'Altos de Nuñez', direccion: 'Cabildo 4000', puertas: 1, fechaBaterias: '2026-09-10', consorcioId: 106, lectores: 2, anticlon: false, observaciones: '', adminNombre: 'Nuñez Propiedades', adminEmail: 'admin@nunez.com' },
    { id: 11, nombre: 'Complejo Abasto', direccion: 'Corrientes 3200', puertas: 3, fechaBaterias: '2027-02-14', consorcioId: 107, lectores: 6, anticlon: true, observaciones: '', adminNombre: 'Abasto Mgmt', adminEmail: 'mgmt@abasto.com' }
  ]);

  const [consorcios, setConsorcios] = useState([
    { id: 101, nombre: 'Consorcio Libertador' }
  ]);

  const [llaveros, setLlaveros] = useState([
    { codigoUnico: '7791234567890', edificioId: 1, estado: 'En Stock' },
    { codigoUnico: '7791234567891', edificioId: 1, estado: 'En Stock' },
    { codigoUnico: '7791234567892', edificioId: 2, estado: 'En Stock' },
    { codigoUnico: '7791234567893', edificioId: 3, estado: 'En Stock' },
    { codigoUnico: '7791234567894', edificioId: 4, estado: 'En Stock' },
    { codigoUnico: '7791234567895', edificioId: 5, estado: 'En Stock' },
    { codigoUnico: '7791234567896', edificioId: 6, estado: 'En Stock' },
    { codigoUnico: '7791234567897', edificioId: 7, estado: 'En Stock' },
    { codigoUnico: '7791234567898', edificioId: 8, estado: 'En Stock' }
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
    },
    { id: 1002, edificioId: 2, solicitante: 'Maria Gomez', nombreCompleto: 'Maria Gomez', dni: '40111222', piso: '1', depto: 'A', estado: 'Pendiente' },
    { id: 1003, edificioId: 3, solicitante: 'Carlos Tevez', nombreCompleto: 'Carlos Tevez', dni: '28333444', piso: '7', depto: 'C', estado: 'Aprobada' },
    { id: 1004, edificioId: 1, solicitante: 'Ana Lopez', nombreCompleto: 'Ana Lopez', dni: '32555666', piso: 'PB', depto: '2', estado: 'Aprobada' },
    { id: 1005, edificioId: 4, solicitante: 'Luis Suarez', nombreCompleto: 'Luis Suarez', dni: '39777888', piso: '12', depto: 'F', estado: 'Aprobada' },
    { id: 1006, edificioId: 5, solicitante: 'Sofia Martinez', nombreCompleto: 'Sofia Martinez', dni: '42999000', piso: '3', depto: 'A', estado: 'Pendiente' }
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

  const handleAgregarStock = (edificioId, codigosArray) => {
    const nuevosLlaveros = codigosArray.map((codigo) => ({
      codigoUnico: codigo,
      edificioId,
      estado: 'En Stock'
    }));
    setLlaveros([...llaveros, ...nuevosLlaveros]);
  };

  const dbWrapper = { edificios, consorcios, llaveros, solicitudes, ventas, servicioTecnico };
  const handlers = { handleCreateSolicitud, handleCreateEdificio, handleCreateServicio, handleUpdateSolicitudEstado, handleGenerarVenta, handleAgregarStock };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white shadow border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Agregamos flex-wrap y una altura fija en sm para que el logo calcule su 70% */}
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between py-3 sm:py-0 sm:h-16 gap-y-4">
      
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center w-full sm:w-auto h-16 sm:h-full justify-center sm:justify-start">
        <img src="/logo.png" alt="INTEK" className="h-[50%] object-contain" />
      </div>
      
      {/* Botones */}
      <div className="flex flex-wrap justify-center w-full sm:w-auto gap-2 sm:gap-8">
        <button
          onClick={() => setCurrentView('public')}
          className={`${currentView === 'public' ? 'border-orange-500 text-orange-600' : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-slate-800'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
        >
          Público
        </button>
        <button
          onClick={() => setCurrentView('consorcio')}
          className={`${currentView === 'consorcio' ? 'border-orange-500 text-orange-400' : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-white'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
        >
          Admin Consorcio
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          className={`${currentView === 'admin' ? 'border-orange-500 text-orange-400' : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-white'} inline-flex items-center px-1 py-2 border-b-2 text-sm font-medium transition-colors`}
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