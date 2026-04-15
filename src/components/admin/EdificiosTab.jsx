import React, { useState } from 'react';
import { Search, Info, PackageOpen, X, Plus } from 'lucide-react';

function EdificiosTab({ db, handlers }) {
  const [selectedEdificioId, setSelectedEdificioId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockInput, setStockInput] = useState('');

  const handleAddStock = () => {
    if(!stockInput.trim() || !handlers.handleAgregarStock) return;
    const codigos = stockInput.split(',').map(c => c.trim()).filter(c => c);
    if(codigos.length > 0) {
      handlers.handleAgregarStock(selectedEdificioId, codigos);
      setStockInput('');
    }
  };

  // Lógica de filtrado
  const edificiosFiltrados = db.edificios.filter(edificio => {
    const busqueda = searchTerm.toLowerCase();
    return (
      edificio.nombre.toLowerCase().includes(busqueda) ||
      edificio.direccion.toLowerCase().includes(busqueda)
    );
  });

  const selectedEdificio = db.edificios.find(e => e.id === selectedEdificioId);
  const stockEdificio = selectedEdificio 
    ? db.llaveros.filter(ll => ll.edificioId === selectedEdificio.id && ll.estado === 'En Stock')
    : [];

  return (
    <div className="space-y-6">
      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Gestión de Edificios</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition font-medium shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Edificio'}
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md bg-slate-50 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Buscar por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA RESPONSIVA: Contenedor con overflow-x-auto */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nombre / Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lectores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase whitespace-nowrap">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {edificiosFiltrados.map(edificio => {
                const stockCount = db.llaveros.filter(ll => ll.edificioId === edificio.id && ll.estado === 'En Stock').length;
                return (
                  <tr 
                    key={edificio.id} 
                    onClick={() => setSelectedEdificioId(edificio.id)}
                    className={`cursor-pointer transition-colors ${selectedEdificioId === edificio.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{edificio.nombre}</div>
                      <div className="text-xs text-slate-500">{edificio.direccion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{edificio.lectores} uds.</div>
                      {edificio.anticlon && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">ANTICLON</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stockCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {stockCount} llaveros
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP: FICHA TÉCNICA AMPLIADA CON TODOS LOS DATOS RESTAURADOS */}
      {selectedEdificio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg">Detalle del Edificio: {selectedEdificio.nombre}</h3>
              </div>
              <button onClick={() => setSelectedEdificioId(null)} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
              
              {/* 1. Infraestructura */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Infraestructura</h4>
                <p className="text-sm text-slate-700 flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Dirección:</span> <span>{selectedEdificio.direccion}</span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Puertas de acceso:</span> <span>{selectedEdificio.puertas}</span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Lectores instalados:</span> 
                  <span>
                    {selectedEdificio.lectores} 
                    {selectedEdificio.anticlon ? <span className="ml-1 text-orange-600 font-medium">(Anticlon)</span> : <span className="ml-1 text-slate-500">(Estándar)</span>}
                  </span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between pb-1">
                  <span className="font-semibold">Baterías renovadas:</span> <span>{selectedEdificio.fechaBaterias}</span>
                </p>
              </div>

              {/* 2. Administración */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Administración</h4>
                <p className="text-sm text-slate-700 flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Empresa a cargo:</span> 
                  <span className="text-right ml-2">{selectedEdificio.adminNombre}</span>
                </p>
                <p className="text-sm text-slate-700 flex justify-between border-b border-slate-200 pb-1">
                  <span className="font-semibold">Contacto Email:</span> 
                  <a href={`mailto:${selectedEdificio.adminEmail}`} className="text-orange-500 hover:underline text-right ml-2 break-all">{selectedEdificio.adminEmail}</a>
                </p>
                <p className="text-sm text-slate-700 flex justify-between pb-1">
                  <span className="font-semibold">Consorcio Vinculado:</span> 
                  <span className="text-right ml-2">{db.consorcios.find(c => c.id === selectedEdificio.consorcioId)?.nombre || 'N/A'}</span>
                </p>
              </div>

              {/* 3. Stock de Llaveros */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex flex-col">
                <div className="flex items-center justify-between mb-2 text-orange-800">
                  <div className="flex items-center gap-2">
                    <PackageOpen className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Inventario en Stock</h4>
                  </div>
                </div>
                <p className="text-2xl font-black text-orange-900 mb-2">{stockEdificio.length} <span className="text-sm font-medium">unidades</span></p>
                
                {/* Formulario carga rapida */}
                <div className="mt-auto pt-3 border-t border-orange-200">
                  <p className="text-[10px] font-bold text-orange-700 mb-1">Cargar códigos (separados por coma)</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      placeholder="Ej: 779... , 779..." 
                      className="w-full text-xs p-1.5 border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                    />
                    <button onClick={handleAddStock} className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1 content-start max-h-16 overflow-y-auto">
                  {stockEdificio.slice(0, 5).map(ll => (
                    <span key={ll.codigoUnico} className="text-[10px] bg-white border border-orange-200 px-1.5 py-0.5 rounded text-orange-600 font-bold">
                      #{ll.codigoUnico.slice(-4)}
                    </span>
                  ))}
                  {stockEdificio.length > 5 && <span className="text-[10px] text-orange-500 font-medium py-0.5">+{stockEdificio.length - 5} más</span>}
                </div>
              </div>

            </div>

            {/* Observaciones (Ancho completo) */}
            <div className="bg-amber-50 p-4 border-t border-amber-100 px-6 shrink-0 mt-auto">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Observaciones Generales</h4>
              <p className="text-sm text-amber-900 whitespace-pre-wrap">{selectedEdificio.observaciones || 'Sin observaciones registradas.'}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default EdificiosTab;