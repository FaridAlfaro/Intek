import React, { useState } from 'react';

function VentasStockTab({ db, handlers }) {
  const [selectedEdificioId, setSelectedEdificioId] = useState('');
  const [ventaForm, setVentaForm] = useState({
    llaveroId: '',
    solicitudId: '',
    monto: ''
  });
  const [mensaje, setMensaje] = useState('');

  const edificioElegido = parseInt(selectedEdificioId);
  
  // Datos filtrados por edificio
  const solicitudesFiltradas = db.solicitudes.filter(s => s.edificioId === edificioElegido);
  const stockDisponible = db.llaveros.filter(ll => ll.edificioId === edificioElegido && ll.estado === 'En Stock');
  const solicitudesAutorizadas = solicitudesFiltradas.filter(s => s.estado === 'Autorizado');

  const handleAutorizar = (solicitudId) => {
    handlers.handleUpdateSolicitudEstado(solicitudId, 'Autorizado');
  };

  const handleVenta = (e) => {
    e.preventDefault();
    if (!ventaForm.llaveroId || !ventaForm.solicitudId || !ventaForm.monto) return;

    handlers.handleGenerarVenta({
      llaveroId: ventaForm.llaveroId,
      solicitudId: parseInt(ventaForm.solicitudId),
      monto: parseFloat(ventaForm.monto)
    });

    setMensaje('Venta registrada exitosamente.');
    setVentaForm({ llaveroId: '', solicitudId: '', monto: '' });
    
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-800 mb-2">Seleccionar Edificio para Gestionar</label>
        <select
          className="w-full md:w-1/2 border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedEdificioId}
          onChange={(e) => setSelectedEdificioId(e.target.value)}
        >
          <option value="">-- Elige un edificio --</option>
          {db.edificios.map(ed => (
            <option key={ed.id} value={ed.id}>{ed.direccion}</option>
          ))}
        </select>
      </div>

      {edificioElegido ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Panel Izquierdo: Solicitudes y Stock */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Solicitudes</h3>
              {solicitudesFiltradas.length === 0 ? (
                <p className="text-sm text-slate-500">No hay solicitudes para este edificio.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {solicitudesFiltradas.map(sol => (
                    <li key={sol.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{sol.solicitante} <span className="text-xs text-slate-500 ml-1">(Depto {sol.depto})</span></p>
                        <p className={`text-xs mt-1 inline-block px-2 py-1 rounded font-medium ${sol.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {sol.estado}
                        </p>
                      </div>
                      {sol.estado === 'Pendiente' && (
                        <button 
                          onClick={() => handleAutorizar(sol.id)}
                          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition"
                        >
                          Autorizar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Stock Disponible</h3>
              {stockDisponible.length === 0 ? (
                <p className="text-sm text-red-500 font-medium">Sin stock para este edificio.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {stockDisponible.map(ll => (
                    <span key={ll.codigoUnico} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded">
                      {ll.codigoUnico}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Venta y Historial */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Venta</h3>
              
              {mensaje && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 text-sm rounded-md border border-green-200">
                  {mensaje}
                </div>
              )}

              <form onSubmit={handleVenta} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Llavero a Vender</label>
                  <select 
                    required 
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    value={ventaForm.llaveroId}
                    onChange={e => setVentaForm({...ventaForm, llaveroId: e.target.value})}
                  >
                    <option value="">-- Seleccionar Llavero --</option>
                    {stockDisponible.map(ll => (
                      <option key={ll.codigoUnico} value={ll.codigoUnico}>{ll.codigoUnico}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Solicitud Autorizada</label>
                  <select 
                    required 
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    value={ventaForm.solicitudId}
                    onChange={e => setVentaForm({...ventaForm, solicitudId: e.target.value})}
                  >
                    <option value="">-- Seleccionar Solicitud --</option>
                    {solicitudesAutorizadas.map(sol => (
                      <option key={sol.id} value={sol.id}>{sol.solicitante} - Depto: {sol.depto}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    step="0.01"
                    className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    value={ventaForm.monto}
                    onChange={e => setVentaForm({...ventaForm, monto: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={stockDisponible.length === 0 || solicitudesAutorizadas.length === 0}
                  className="w-full bg-slate-900 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800 disabled:bg-slate-300 transition"
                >
                  Confirmar Venta
                </button>
                {(stockDisponible.length === 0 || solicitudesAutorizadas.length === 0) && (
                  <p className="text-xs text-red-500 mt-2 text-center">Requiere stock y al menos una solicitud autorizada.</p>
                )}
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Historial de Ventas</h3>
              {db.ventas.length === 0 ? (
                <p className="text-sm text-slate-500">No se han registrado ventas globales.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Fecha</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Llavero</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Solicitud ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {/* Vemos todas las ventas para simplicidad */}
                      {[...db.ventas].reverse().map(v => (
                        <tr key={v.id}>
                          <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{new Date(v.fecha).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-sm font-medium text-slate-800">{v.llaveroId}</td>
                          <td className="px-3 py-2 text-sm text-slate-600">#{v.solicitudId}</td>
                          <td className="px-3 py-2 text-sm text-green-600 font-semibold">${v.monto}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200 border-dashed">
          <p className="text-slate-500 text-sm">Selecciona un edificio en la parte superior para comenzar a gestionar sus ventas y stock.</p>
        </div>
      )}
    </div>
  );
}

export default VentasStockTab;
