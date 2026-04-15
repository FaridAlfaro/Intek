import React, { useState } from 'react';
import { Key } from 'lucide-react';

function PublicView({ db, handlers }) {
  const [form, setForm] = useState({
    nombreCompleto: '',
    dni: '',
    email: '',
    telefono: '',
    edificioId: '',
    torre: '',
    piso: '',
    depto: '',
    cantidad: 1,
    observacion: '',
    tipoUsuario: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.edificioId || !form.nombreCompleto || !form.depto) return;
    
    // Pasamos todos los datos del formulario al manejador
    handlers.handleCreateSolicitud({
      ...form,
      edificioId: parseInt(form.edificioId),
      cantidad: parseInt(form.cantidad)
    });
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      nombreCompleto: '',
      dni: '',
      email: '',
      telefono: '',
      edificioId: '',
      torre: '',
      piso: '',
      depto: '',
      cantidad: 1,
      observacion: '',
      tipoUsuario: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="text-center mb-10">
        <Key className="mx-auto h-16 w-16 text-orange-600 mb-4" />
        <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
          <span className="block">Bienvenido a</span>
          <span className="block text-orange-600">Gestión INTEK</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Solicita tu llavero digital de manera rápida y segura para tu edificio.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8 border border-slate-100">
        {submitted ? (
           <div className="text-center py-8">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <h3 className="text-2xl font-semibold text-slate-900 mb-2">Solicitud Enviada</h3>
             <p className="mt-2 text-base text-slate-500 mb-8">
               Tu solicitud ha sido registrada como Pendiente. El administrador de tu consorcio la revisará en breve.
             </p>
             <button 
               onClick={resetForm}
               className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
             >
               Solicitar otro llavero
             </button>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Fila 1: Edificio y Tipo de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:grid-cols-2 ">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Buscar Edificio *</label>
                <select
                  name="edificioId"
                  required
                  className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border bg-white"
                  value={form.edificioId}
                  onChange={handleChange}
                >
                  <option value="">-- Elige un edificio --</option>
                  {db?.edificios?.map(ed => (
                    <option key={ed.id} value={ed.id}>
                      {ed.direccion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Solicitante *</label>
                <select
                  name="tipoUsuario"
                  required
                  className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border bg-white"
                  value={form.tipoUsuario}
                  onChange={handleChange}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Propietario">Propietario</option>
                  <option value="Inquilino">Inquilino</option>
                  <option value="Administracion">Administración</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Fila 2: Datos Personales */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  name="nombreCompleto"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI *</label>
                <input
                  type="text"
                  name="dni"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.dni}
                  onChange={handleChange}
                  placeholder="Sin puntos ni espacios"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Cód. Área + Número"
                />
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Fila 3: Ubicación (Torre, Piso, Depto) */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Torre</label>
                <input
                  type="text"
                  name="torre"
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.torre}
                  onChange={handleChange}
                  placeholder="Ej. A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Piso</label>
                <input
                  type="text"
                  name="piso"
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.piso}
                  onChange={handleChange}
                  placeholder="Ej. 4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Depto *</label>
                <input
                  type="text"
                  name="depto"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.depto}
                  onChange={handleChange}
                  placeholder="Ej. B"
                />
              </div>
            </div>

            {/* Fila 4: Cantidad y Observaciones */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                <input
                  type="number"
                  name="cantidad"
                  min="1"
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.cantidad}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observación</label>
                <textarea
                  name="observacion"
                  rows="2"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={form.observacion}
                  onChange={handleChange}
                  placeholder="Algún detalle adicional..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Solicitar Llavero
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PublicView;