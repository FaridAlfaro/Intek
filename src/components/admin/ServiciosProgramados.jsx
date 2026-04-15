import React, { useState } from 'react';
import { CalendarClock, AlertTriangle, Wrench, CheckCircle, Clock } from 'lucide-react';

function ServiciosProgramados({ db, handlers }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    edificioId: '',
    tipoServicio: '',
    fechaEjecucion: '',
    tecnicoAsignado: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    handlers.handleCreateServicio({
      edificioId: parseInt(form.edificioId),
      tipoServicio: form.tipoServicio,
      fechaEjecucion: form.fechaEjecucion,
      tecnicoAsignado: form.tecnicoAsignado,
      estado: 'Pendiente'
    });
    setForm({ edificioId: '', tipoServicio: '', fechaEjecucion: '', tecnicoAsignado: '' });
    setShowForm(false);
  };

  // =================================================================
  // LÓGICA DE EVENTOS AUTOMÁTICOS (Cambio de Baterías al año)
  // =================================================================
  const hoy = new Date();
  
  const alertasAutomaticas = db.edificios.map(edificio => {
    if (!edificio.fechaBaterias) return null;
    
    // Parseamos la fecha de instalación (ej. 2024-01-10)
    const fechaInstalacion = new Date(edificio.fechaBaterias);
    
    // Le sumamos exactamente 1 año
    const fechaVencimiento = new Date(fechaInstalacion);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
    
    // Calculamos la diferencia en días
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Si faltan 30 días o menos (o si ya se pasó), creamos la alerta
    if (diffDays <= 30) {
      return {
        id: `auto-${edificio.id}`,
        isAuto: true,
        edificioId: edificio.id,
        edificioNombre: edificio.nombre,
        direccion: edificio.direccion,
        tipoServicio: 'Reemplazo Anual de Baterías',
        fechaEjecucion: fechaVencimiento.toISOString().split('T')[0],
        tecnicoAsignado: 'A designar',
        estado: diffDays < 0 ? 'Vencido' : 'Próximo',
        diasRestantes: diffDays
      };
    }
    return null;
  }).filter(Boolean); // Eliminamos los nulos

  // =================================================================
  // UNIFICACIÓN DE SERVICIOS (Manuales + Automáticos)
  // =================================================================
  
  // Enriquecemos los servicios manuales creados por el usuario
  const serviciosManuales = db.servicioTecnico.map(srv => {
    const edificio = db.edificios.find(e => e.id === srv.edificioId);
    return {
      ...srv,
      isAuto: false,
      edificioNombre: edificio?.nombre || 'Desconocido',
      direccion: edificio?.direccion || 'Desconocido'
    };
  });

  // Juntamos ambos arrays y los ordenamos por fecha más próxima
  const todosLosServicios = [...alertasAutomaticas, ...serviciosManuales].sort(
    (a, b) => new Date(a.fechaEjecucion) - new Date(b.fechaEjecucion)
  );

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Wrench className="w-6 h-6 text-blue-600" />
          Servicios Programados
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Programar Servicio'}
        </button>
      </div>

      {/* Formulario de Creación */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 animate-fade-in-down">
          <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Agendar Nuevo Mantenimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">EDIFICIO</label>
              <select 
                required 
                className="w-full border border-slate-300 rounded-md p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
                value={form.edificioId}
                onChange={e => setForm({...form, edificioId: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {db.edificios.map(ed => (
                  <option key={ed.id} value={ed.id}>{ed.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TIPO DE SERVICIO / FALLA</label>
              <input 
                required 
                type="text"
                placeholder="Ej. Reparación de lector puerta principal"
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={form.tipoServicio}
                onChange={e => setForm({...form, tipoServicio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">FECHA PROGRAMADA</label>
              <input 
                required 
                type="date"
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={form.fechaEjecucion}
                onChange={e => setForm({...form, fechaEjecucion: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TÉCNICO ASIGNADO</label>
              <input 
                required 
                type="text"
                placeholder="Ej. Roberto Sánchez"
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={form.tecnicoAsignado}
                onChange={e => setForm({...form, tecnicoAsignado: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button type="submit" className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium transition shadow-sm">
              Guardar Servicio
            </button>
          </div>
        </form>
      )}

      {/* Panel de Alertas Automáticas Críticas */}
      {alertasAutomaticas.some(a => a.estado === 'Vencido') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">¡Atención! Hay mantenimientos de batería vencidos.</h3>
          </div>
          <p className="text-sm text-red-700 mt-1">Revisa la lista inferior. Los sistemas de estos edificios podrían fallar ante un corte de luz.</p>
        </div>
      )}

      {/* Tabla de Servicios Programados (Responsive) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Agenda de Mantenimiento Integral</h3>
        </div>

        <div className="overflow-x-auto">
          {todosLosServicios.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No hay servicios programados ni vencimientos de baterías cercanos.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Edificio / Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Técnico</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Fecha Ejecución</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {todosLosServicios.map(srv => {
                  
                  // Colores de estado
                  let estadoColor = 'bg-slate-100 text-slate-700';
                  if (srv.estado === 'Completado') estadoColor = 'bg-green-100 text-green-700';
                  if (srv.estado === 'Pendiente' || srv.estado === 'Próximo') estadoColor = 'bg-yellow-100 text-yellow-800';
                  if (srv.estado === 'Vencido') estadoColor = 'bg-red-100 text-red-800 font-bold';

                  return (
                    <tr key={srv.id} className={`hover:bg-slate-50 transition-colors ${srv.estado === 'Vencido' ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{srv.edificioNombre}</div>
                        <div className="text-xs text-slate-500">{srv.direccion}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {srv.isAuto ? <AlertTriangle className="w-4 h-4 text-orange-500" /> : <Wrench className="w-4 h-4 text-slate-400" />}
                          <span className={`text-sm font-medium ${srv.isAuto ? 'text-orange-700' : 'text-slate-700'}`}>
                            {srv.tipoServicio}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {srv.tecnicoAsignado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div className="font-medium">
                          {new Date(srv.fechaEjecucion + 'T00:00:00').toLocaleDateString('es-AR')}
                        </div>
                        {srv.isAuto && (
                          <div className={`text-[10px] uppercase font-bold mt-1 ${srv.diasRestantes < 0 ? 'text-red-600' : 'text-orange-500'}`}>
                            {srv.diasRestantes < 0 ? `Vencido hace ${Math.abs(srv.diasRestantes)} días` : `Vence en ${srv.diasRestantes} días`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${estadoColor}`}>
                          {srv.estado === 'Completado' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {srv.estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}

export default ServiciosProgramados;