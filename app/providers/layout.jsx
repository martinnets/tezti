export default function ProvidersLayout({ children }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-800 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Portal de Proveedores</h1>
              <div className="flex items-center gap-4">
                <a href="/" className="text-sm hover:underline">Inicio</a>
                <a href="/providers/register" className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">Registro Proveedores</a>
                <a href="/auth/login" className="px-3 py-1 bg-white text-blue-800 hover:bg-gray-100 rounded text-sm">Área Clientes</a>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-blue-900 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2025 Portal de Clientes y Proveedores</p>
              <div className="mt-4 md:mt-0">
                <a href="#" className="text-sm hover:underline mr-4">Términos y Condiciones</a>
                <a href="#" className="text-sm hover:underline mr-4">Política de Privacidad</a>
                <a href="#" className="text-sm hover:underline">Contacto</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }