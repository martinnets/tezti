"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProvidersDirectory() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Datos de ejemplo para proveedores
  const mockProviders = [
    { 
      id: 1, 
      name: 'TechSolutions SL', 
      category: 'Tecnología', 
      description: 'Servicios informáticos y soluciones tecnológicas para empresas', 
      rating: 4.8,
      location: 'Madrid'
    },
    { 
      id: 2, 
      name: 'ConsultoraPro', 
      category: 'Consultoría', 
      description: 'Servicios de consultoría empresarial y estratégica', 
      rating: 4.5,
      location: 'Barcelona'
    },
    { 
      id: 3, 
      name: 'LogísticaExpress', 
      category: 'Logística', 
      description: 'Servicios de transporte y logística para empresas', 
      rating: 4.2,
      location: 'Valencia'
    },
    { 
      id: 4, 
      name: 'MarketingDigital Plus', 
      category: 'Marketing', 
      description: 'Servicios de marketing digital y posicionamiento web', 
      rating: 4.7,
      location: 'Sevilla'
    },
    { 
      id: 5, 
      name: 'FinanSoluciones', 
      category: 'Finanzas', 
      description: 'Asesoría financiera y contable para empresas', 
      rating: 4.4,
      location: 'Bilbao'
    },
  ];

  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setProviders(mockProviders);
      setIsLoading(false);
    }, 800);
  }, []);

  const categories = ['all', ...new Set(mockProviders.map(provider => provider.category))];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full inline-block animate-spin"></div>
        <p className="mt-4">Cargando proveedores...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Directorio de Proveedores</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gray-100 h-32 flex items-center justify-center">
              <div className="text-4xl font-bold text-blue-600">{provider.name.charAt(0)}</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">{provider.category}</span>
                <span className="text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(provider.rating))}
                  <span className="text-gray-300">{"★".repeat(5 - Math.floor(provider.rating))}</span>
                  <span className="text-gray-600 ml-1">{provider.rating}</span>
                </span>
              </div>
              <p className="text-gray-600 mb-4">{provider.description}</p>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {provider.location}
              </div>
              <Link
                href={`/providers/${provider.id}`}
                className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Ver perfil
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProviders.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No se encontraron proveedores con los criterios seleccionados.</p>
        </div>
      )}
    </div>
  );
}