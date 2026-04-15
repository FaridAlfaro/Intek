import React, { useState } from 'react';

function EdificiosTab({ db, handlers }) {
  const [selectedEdificioId, setSelectedEdificioId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    direccion: '',
    puertas: '',
    fechaBaterias: '',
    consorcioId: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    handlers.handleCreateEdificio({
      direccion: form.direccion,
      puertas: parseInt(form.puertas),
      fechaBaterias: form.fechaBaterias,
      consorcioId: parseInt(form.consorcioId)
    });
    setForm({ direccion: '', puertas: '', fechaBaterias: '', consorcioId: '' });
    setShowForm(false);
  };

  const selectedEdificio = db.edificios.find(e => e.id === selectedEdificioId);
  const serviciosFiltrados = selectedEdificioId ? db.servicioTecnico.filter(s => s.edificioId === selectedEdificioId) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Gestión de Edificios</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Edificio'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-600 mb-1">Dirección</label>
            <input required className="w-full border p-2 rounded-md" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
          </div>
          <div className="w-24">
            <label className="block text-sm text-slate-600 mb-1">Puertas</label>
            <input required type="number" className="w-full border p-2 rounded-md" value={form.puertas} onChange={e => setForm({...form, puertas: e.target.value})} />
          </div>
          <div className="w-40">
            <label className="block text-sm text-slate-600 mb-1">Cambio Baterías</label>
            <input required type="date" className="w-full border p-2 rounded-md" value={form.fechaBaterias} onChange={e => setForm({...form, fechaBaterias: e.target.value})} />
          </div>
          <div className="w-48">
            <label className="block text-sm text-slate-600 mb-1">Consorcio</label>
            <select required className="w-full border p-2 rounded-md" value={form.consorcioId} onChange={e => setForm({...form, consorcioId: e.target.value})}>
              <option value="">Seleccionar...</option>
              {db.consorcios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            Guardar
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Consorcio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Puertas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200 cursor-pointer">
            {db.edificios.map(edificio => (
              <tr 
                key={edificio.id} 
                onClick={() => setSelectedEdificioId(edificio.id)}
                className={selectedEdificioId === edificio.id ? 'bg-blue-50' : 'hover:bg-slate-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">#{edificio.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{edificio.direccion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {db.consorcios.find(c => c.id === edificio.consorcioId)?.nombre || 'Desconocido'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{edificio.puertas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Ver Detalles</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEdificio && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mt-6 hidden md:block animate-fade-in-up">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            Detalles - {selectedEdificio.direccion}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Fecha de Baterías:</span> {selectedEdificio.fechaBaterias}</p>
            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Llaveros en Stock:</span> {db.llaveros.filter(ll => ll.edificioId === selectedEdificio.id && ll.estado === 'En Stock').length}</p>
          </div>

          <h4 className="text-md font-semibold text-slate-700 mb-3">Historial de Servicio Técnico</h4>
          {serviciosFiltrados.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No hay registros de servicio técnico para este edificio.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {serviciosFiltrados.map(srv => (
                <li key={srv.id} className="py-3">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-slate-900">{srv.tarea}</div>
                    <div className="text-xs text-slate-500">{new Date(srv.fecha).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm text-slate-500">Técnico: {srv.nombreTecnico} | Puerta N°: {srv.numPuerta}</div>
                  {srv.repuestos && <div className="text-xs mt-1 text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">Repuestos: {srv.repuestos}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default EdificiosTab;
