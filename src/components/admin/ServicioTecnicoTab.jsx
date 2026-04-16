import React, { useState } from 'react';

function ServicioTecnicoTab({ db, handlers }) {
  const [form, setForm] = useState({
    edificioId: '',
    numPuerta: '',
    nombreTecnico: '',
    motivoVisita: '',
    tarea: '',
    instalacionNueva: 'No',
    proceso: 'Terminado',
    faltaTerminar: '',
    repuestos: '',
    cantidadMateriales: '',
    fechaBaterias: '',
    cantidadBaterias: ''
  });

  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.edificioId) return;

    handlers.handleCreateServicio({
      edificioId: parseInt(form.edificioId),
      numPuerta: parseInt(form.numPuerta),
      nombreTecnico: form.nombreTecnico,
      motivoVisita: form.motivoVisita,
      tarea: form.tarea,
      instalacionNueva: form.instalacionNueva,
      proceso: form.proceso,
      faltaTerminar: form.faltaTerminar,
      repuestos: form.repuestos,
      cantidadMateriales: form.cantidadMateriales,
      fechaBaterias: form.fechaBaterias,
      cantidadBaterias: form.cantidadBaterias
    });

    setMessage('Registro guardado con éxito!');
    setForm({ 
      edificioId: '', numPuerta: '', nombreTecnico: '', motivoVisita: '', 
      tarea: '', instalacionNueva: 'No', proceso: 'Terminado', 
      faltaTerminar: '', repuestos: '', cantidadMateriales: '', 
      fechaBaterias: '', cantidadBaterias: '' 
    });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Registro de Servicio Técnico</h2>
        
        {message && (
          <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Edificio</label>
              <select
                required
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.edificioId}
                onChange={(e) => setForm({...form, edificioId: e.target.value})}
              >
                <option value="">-- Seleccionar --</option>
                {db.edificios.map(ed => (
                  <option key={ed.id} value={ed.id}>{ed.direccion}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">N° de Puerta</label>
              <input
                type="number"
                required
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.numPuerta}
                onChange={(e) => setForm({...form, numPuerta: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Motivo de la Visita</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.motivoVisita}
                onChange={(e) => setForm({...form, motivoVisita: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Técnico</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.nombreTecnico}
                onChange={(e) => setForm({...form, nombreTecnico: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Instalación Nueva</label>
              <select
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.instalacionNueva}
                onChange={(e) => setForm({...form, instalacionNueva: e.target.value})}
              >
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proceso</label>
              <select
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.proceso}
                onChange={(e) => setForm({...form, proceso: e.target.value})}
              >
                <option value="Listo">Listo</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Terminado">Terminado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trabajo Realizado</label>
            <textarea
              required
              rows={3}
              className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              value={form.tarea}
              onChange={(e) => setForm({...form, tarea: e.target.value})}
            />
          </div>

          {form.proceso === 'En Proceso' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">¿Qué falta terminar?</label>
              <textarea
                rows={2}
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.faltaTerminar}
                onChange={(e) => setForm({...form, faltaTerminar: e.target.value})}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repuestos Utilizados</label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.repuestos}
                placeholder="Ej. Sensores, Cables"
                onChange={(e) => setForm({...form, repuestos: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de Materiales</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.cantidadMateriales}
                onChange={(e) => setForm({...form, cantidadMateriales: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Baterías</label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.fechaBaterias}
                onChange={(e) => setForm({...form, fechaBaterias: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de Baterías</label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                value={form.cantidadBaterias}
                onChange={(e) => setForm({...form, cantidadBaterias: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition"
            >
              Registrar Tarea
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Últimos Registros Globales</h3>
        {db.servicioTecnico.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay registros de servicio técnico.</p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {[...db.servicioTecnico].reverse().map(srv => {
              const edificio = db.edificios.find(e => e.id === srv.edificioId);
              return (
                <div key={srv.id} className="bg-slate-50 p-4 rounded-md border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{edificio?.direccion} <span className="text-slate-500 font-normal">| Puerta {srv.numPuerta}</span></h4>
                    <p className="text-xs text-orange-600 font-bold mt-1 uppercase">{srv.motivoVisita || 'Sin motivo'}</p>
                    <p className="text-sm text-slate-600 mt-1">{srv.tarea}</p>
                    
                    <div className="mt-2 text-xs flex flex-wrap gap-2">
                      <span className="bg-slate-100 px-2 py-1 rounded">Proceso: {srv.proceso}</span>
                      {srv.instalacionNueva === 'Sí' && <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Instalación Nueva</span>}
                      {srv.proceso === 'En Proceso' && srv.faltaTerminar && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded w-full">Falta: {srv.faltaTerminar}</span>}
                    </div>

                    <div className="mt-2 text-xs flex gap-4 text-slate-500">
                      {srv.repuestos && <span>📦 {srv.repuestos} ({srv.cantidadMateriales || 0})</span>}
                      {srv.fechaBaterias && <span>🔋 Baterías: {srv.cantidadBaterias || 0} ({new Date(srv.fechaBaterias).toLocaleDateString()})</span>}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between shrink-0">
                    <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded inline-block self-end">{srv.nombreTecnico}</span>
                    <span className="text-xs text-slate-400 mt-2">{new Date(srv.fecha).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicioTecnicoTab;
