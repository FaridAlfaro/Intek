import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Clock, Building2, User, KeyRound, AlertCircle } from 'lucide-react';

function ConsorcioView({ db, handlers }) {
  // SIMULADOR DE ENLACE (Solo para la maqueta)
  // En producción, este ID se leería directamente de la URL (ej: /aprobar/:id)
  const [enlaceSimuladoId, setEnlaceSimuladoId] = useState('');

  const solicitud = db.solicitudes.find(s => s.id === parseInt(enlaceSimuladoId));
  const edificio = solicitud ? db.edificios.find(e => e.id === solicitud.edificioId) : null;

  const handleAutorizar = () => {
    if (solicitud) {
      handlers.handleUpdateSolicitudEstado(solicitud.id, 'Aprobada');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* BARRA DE SIMULACIÓN (Exclusivo para probar la maqueta) */}
      <div className="bg-slate-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center text-slate-200">
          <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
          <span className="text-sm font-medium">Simulador de Enlace (Maqueta)</span>
        </div>
        <select 
          className="bg-slate-700 text-white border border-slate-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
          value={enlaceSimuladoId}
          onChange={(e) => setEnlaceSimuladoId(e.target.value)}
        >
          <option value="">-- Seleccionar solicitud a revisar --</option>
          {db.solicitudes.map(s => (
            <option key={s.id} value={s.id}>Solicitud #{s.id} - {s.nombreCompleto}</option>
          ))}
        </select>
      </div>

      {/* VISTA REAL DEL ADMINISTRADOR */}
      {!solicitud ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
          <ShieldCheck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-medium text-slate-600">Portal de Autorización Segura</h2>
          <p className="text-slate-500 mt-2">Selecciona una solicitud en el simulador de arriba para ver cómo lo verá el administrador.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
          
          {/* Cabecera del Documento */}
          <div className="bg-blue-600 px-6 py-8 text-white text-center">
            <ShieldCheck className="mx-auto h-16 w-16 mb-4 text-blue-200" />
            <h1 className="text-2xl font-bold tracking-tight">Autorización de Llavero Digital</h1>
            <p className="text-blue-100 mt-2">Revisión de solicitud para acceso a las instalaciones</p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Estado Actual */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estado de Solicitud</span>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                solicitud.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                solicitud.estado === 'Aprobada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {solicitud.estado === 'Pendiente' && <Clock className="w-4 h-4 mr-2"/>}
                {solicitud.estado === 'Aprobada' && <CheckCircle className="w-4 h-4 mr-2"/>}
                {solicitud.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Datos del Edificio / Ubicación */}
              <div className="space-y-4">
                <div className="flex items-center text-blue-600 mb-2 border-b border-slate-100 pb-2">
                  <Building2 className="w-5 h-5 mr-2" />
                  <h3 className="font-bold text-lg">Inmueble</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-500">Edificio:</span> {edificio?.nombre || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-500">Dirección:</span> {edificio?.direccion || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-500">Torre:</span> {solicitud.torre || 'Única'}</p>
                  <p><span className="font-semibold text-slate-500">Piso y Depto:</span> Piso {solicitud.piso} - Dpto {solicitud.depto}</p>
                </div>
              </div>

              {/* Datos del Solicitante */}
              <div className="space-y-4">
                <div className="flex items-center text-blue-600 mb-2 border-b border-slate-100 pb-2">
                  <User className="w-5 h-5 mr-2" />
                  <h3 className="font-bold text-lg">Solicitante</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-500">Nombre:</span> <span className="font-medium text-slate-900">{solicitud.nombreCompleto}</span></p>
                  <p><span className="font-semibold text-slate-500">DNI:</span> {solicitud.dni}</p>
                  <p><span className="font-semibold text-slate-500">Email:</span> <a href={`mailto:${solicitud.email}`} className="text-blue-600 hover:underline">{solicitud.email || 'No proporcionado'}</a></p>
                  <p><span className="font-semibold text-slate-500">Teléfono:</span> {solicitud.telefono || 'No proporcionado'}</p>
                  <p><span className="font-semibold text-slate-500">Rol:</span> {solicitud.tipoUsuario || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Detalles del Pedido */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center text-blue-600 mb-2 border-b border-slate-100 pb-2">
                <KeyRound className="w-5 h-5 mr-2" />
                <h3 className="font-bold text-lg">Detalles del Pedido</h3>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700 mb-2"><span className="font-semibold text-slate-500">Cantidad solicitada:</span> <span className="text-lg font-bold text-slate-900 mx-2">{solicitud.cantidad || 1}</span> unidad(es)</p>
                <div>
                  <span className="font-semibold text-slate-500 text-sm">Observaciones del solicitante:</span>
                  <p className="mt-1 text-sm text-slate-600 bg-white p-3 rounded border border-slate-200 italic">
                    "{solicitud.observacion || 'Sin observaciones.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-8 border-t border-slate-200">
              {solicitud.estado === 'Pendiente' ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-slate-500 mb-4">
                    Al hacer clic en "Autorizar Solicitud", confirmas que la persona indicada reside/trabaja en la unidad especificada y estás avalando la entrega del dispositivo de acceso.
                  </p>
                  <button
                    onClick={handleAutorizar}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-1"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" />
                    AUTORIZAR SOLICITUD
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-bold text-green-800">Solicitud Autorizada</h3>
                  <p className="text-green-700 text-sm mt-1">Esta solicitud ya ha sido procesada y autorizada por la administración. El área de ventas procederá con la entrega.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ConsorcioView;