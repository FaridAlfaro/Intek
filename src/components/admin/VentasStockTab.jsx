import React, { useState } from 'react';
import { CheckCircle, Clock, Package, ScanLine, ArrowRight, History } from 'lucide-react';

function VentasStockTab({ db, handlers }) {
  const [ventaForm, setVentaForm] = useState({ llaveroId: '', solicitudId: '', monto: '' });
  const [selectedSol, setSelectedSol] = useState(null); 
  const [mensaje, setMensaje] = useState('');

  // 1. Enriquecer las solicitudes con datos del edificio
  const solicitudesEnriquecidas = db.solicitudes.map(sol => {
    const edificio = db.edificios.find(e => e.id === sol.edificioId);
    return {
      ...sol,
      edificioNombre: edificio ? edificio.nombre : 'Desconocido',
      edificioDireccion: edificio ? edificio.direccion : 'Desconocido'
    };
  }).sort((a, b) => b.id - a.id);

  // 2. Historial enriquecido (Siempre visible abajo)
  const ventasHistorial = db.ventas.map(venta => {
    const solicitud = solicitudesEnriquecidas.find(s => s.id === venta.solicitudId);
    return {
      ...venta,
      solicitante: solicitud ? solicitud.nombreCompleto : 'Desconocido',
      edificio: solicitud ? solicitud.edificioNombre : 'Desconocido',
      ubicacion: solicitud ? `Piso ${solicitud.piso} - Dpto ${solicitud.depto}` : ''
    };
  }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const handleSelectSolicitud = (sol) => {
    if (sol.estado !== 'Aprobada') return;
    setSelectedSol(sol);
    // Reseteamos el formulario al cambiar de solicitud
    setVentaForm({ llaveroId: '', solicitudId: sol.id, monto: '' });
    setMensaje('');
  };

  // Stock disponible filtrado AUTOMÁTICAMENTE para el edificio de la solicitud
  const stockDisponible = selectedSol 
    ? db.llaveros.filter(ll => ll.edificioId === selectedSol.edificioId && ll.estado === 'En Stock')
    : [];

  const handleVenta = (e) => {
    e.preventDefault();
    if (!ventaForm.llaveroId || !selectedSol || !ventaForm.monto) return;

    const codigoEscaneado = ventaForm.llaveroId.trim();

    // Validar que el código ingresado/seleccionado realmente exista en stock para ese edificio
    const llaveroValido = stockDisponible.find(ll => ll.codigoUnico === codigoEscaneado);

    if (!llaveroValido) {
      setMensaje('❌ Error: El código ingresado no existe o no pertenece a este edificio.');
      setTimeout(() => setMensaje(''), 4000);
      return;
    }

    // Registrar Venta
    handlers.handleGenerarVenta({
      llaveroId: codigoEscaneado,
      solicitudId: selectedSol.id,
      monto: parseFloat(ventaForm.monto)
    });

    handlers.handleUpdateSolicitudEstado(selectedSol.id, 'Entregado');
    setMensaje('✅ Venta registrada y llavero entregado exitosamente.');
    setSelectedSol(null);
    setVentaForm({ llaveroId: '', solicitudId: '', monto: '' });
    setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* SECCIÓN SUPERIOR: Solicitudes (Izquierda) y Panel de Venta (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: Lista de Solicitudes */}
        <div className="lg:col-span-5 flex flex-col h-[500px]">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            Solicitudes Pendientes de Entrega
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {solicitudesEnriquecidas.map(sol => {
              const isSelected = selectedSol?.id === sol.id;
              return (
                <div 
                  key={sol.id}
                  onClick={() => handleSelectSolicitud(sol)}
                  className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                    isSelected ? 'border-orange-500 bg-orange-50 shadow-md' : 
                    sol.estado === 'Aprobada' ? 'border-slate-200 bg-white hover:border-green-300 cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-900">{sol.nombreCompleto}</h4>
                      <p className="text-xs font-semibold text-slate-600">{sol.edificioNombre}</p>
                      <p className="text-xs text-slate-500">Piso {sol.piso} - Dpto {sol.depto}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                      sol.estado === 'Aprobada' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {sol.estado}
                    </span>
                  </div>
                  {isSelected && <ArrowRight className="absolute right-3 bottom-3 w-5 h-5 text-orange-500 animate-pulse" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO: Formulario de Venta (Aparece al seleccionar) */}
        <div className="lg:col-span-7">
          {!selectedSol ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white">
              <Package className="w-16 h-16 mb-4 text-slate-300" />
              <p className="font-medium text-lg text-slate-500">Seleccione una solicitud <span className="text-green-600 font-bold">APROBADA</span><br/>para efectuar la entrega y cobro.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden animate-fade-in-right">
              <div className="bg-orange-600 p-6 text-white">
                <h3 className="text-xl font-bold">Procesar Entrega</h3>
                <p className="text-orange-100 text-sm mt-1">
                  Entregando a: <strong>{selectedSol.nombreCompleto}</strong> (DNI: {selectedSol.dni})<br/>
                  Destino: {selectedSol.edificioNombre} - {selectedSol.piso}{selectedSol.depto}
                </p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. Selección visual de stock */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Llaveros Físicos Disponibles (Haga click para elegir)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stockDisponible.length > 0 ? (
                      stockDisponible.map(ll => (
                        <button 
                          key={ll.codigoUnico}
                          type="button"
                          onClick={() => setVentaForm({...ventaForm, llaveroId: ll.codigoUnico})}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                            ventaForm.llaveroId === ll.codigoUnico ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-400'
                          }`}
                        >
                          #{ll.codigoUnico}
                        </button>
                      ))
                    ) : (
                      <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">
                        ⚠️ No hay llaveros en stock para este edificio.
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleVenta} className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* 2. Ingreso por texto / Lector de barras */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CÓDIGO DE LLAVERO (ESCANEAR O ESCRIBIR)</label>
                      <div className="relative">
                        <ScanLine className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text"
                          className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none transition-colors focus:bg-white"
                          value={ventaForm.llaveroId}
                          onChange={e => setVentaForm({...ventaForm, llaveroId: e.target.value})}
                          placeholder="Escanear o elegir arriba..."
                        />
                      </div>
                    </div>

                    {/* 3. Monto */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">MONTO A COBRAR ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                        <input 
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-green-700 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                          value={ventaForm.monto}
                          onChange={e => setVentaForm({...ventaForm, monto: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!ventaForm.llaveroId || !ventaForm.monto || stockDisponible.length === 0}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    FINALIZAR VENTA Y ENTREGAR
                  </button>
                </form>
              </div>
            </div>
          )}
          {mensaje && (
            <div className={`mt-4 p-4 rounded-lg font-bold text-center border ${mensaje.includes('❌') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Historial Global de Ventas (SIEMPRE VISIBLE) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Historial Global de Ventas y Entregas</h3>
        </div>
        
        {/* Envoltorio overflow-x-auto para responsividad en móviles */}
        <div className="overflow-x-auto">
          {ventasHistorial.length === 0 ? (
            <div className="text-center py-8 text-slate-500 italic">
              No hay ventas registradas aún.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Llavero Entregado</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Destinatario</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Inmueble</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Cobro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {ventasHistorial.map(venta => (
                  <tr key={venta.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(venta.fecha).toLocaleDateString('es-AR', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-orange-600">
                      #{venta.llaveroId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {venta.solicitante}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {venta.edificio} <span className="text-xs text-slate-400 block">{venta.ubicacion}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700 text-right">
                      ${venta.monto.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default VentasStockTab;