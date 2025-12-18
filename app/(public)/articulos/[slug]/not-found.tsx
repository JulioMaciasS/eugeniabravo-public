import Link from 'next/link'
import { ArrowLeft, FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <FileX className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Artículo no encontrado
          </h1>
          <p className="text-xl text-gray-600">
            Lo sentimos, el artículo que buscas no existe o ha sido movido.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/articulos"
            className="inline-flex items-center gap-2 bg-[#009483] text-white px-6 py-3 rounded-lg hover:bg-[#007a6b] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Ver todos los artículos
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>¿No encuentras lo que buscas?</p>
            <Link 
              href="/contacto" 
              className="text-[#009483] hover:text-[#007a6b] font-medium"
            >
              Contáctanos para ayudarte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
