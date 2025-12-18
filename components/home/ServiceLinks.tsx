import React from 'react';
import { ExternalLink } from 'lucide-react';

const serviceImage = '/images/service-placeholder.svg';

export default function ServiceLinks({ isSection }: { isSection: boolean }) {
  const sectionClass = !isSection
    ? "min-h-[calc(100vh-80px)] py-12 bg-gray-50"
    : "h-fit py-12 bg-gray-50";
  return (
    <section className={sectionClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSection && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explora Nuestras Soluciones
          </h2>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a 
            href="https://example.com/servicio-demo-1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
          >
            <img
              src={serviceImage} 
              alt="Servicio Demo 1" 
              className="w-full h-60 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl text-navy-900">
                  Servicio Demo 1
                </h3>
                <ExternalLink className="h-6 w-6 text-[#009483] group-hover:text-[#2a8d81]" />
              </div>
              <p className="text-gray-600">
                Servicios demostrativos para planificar proyectos legales con un enfoque
                práctico y claro.
              </p>
            </div>
          </a>
          
          <a 
            href="https://example.com/servicio-demo-2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
          >
            <img 
              src={serviceImage}
              alt="Servicio Demo 2" 
              className="w-full h-60 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl text-navy-900">
                  Servicio Demo 2
                </h3>
                <ExternalLink className="h-6 w-6 text-[#009483] group-hover:text-[#2a8d81]" />
              </div>
              <p className="text-gray-600">
                Asesoría demostrativa enfocada en soluciones prácticas y eficientes para
                todas las partes involucradas.
              </p>
            </div>
          </a>

          <a 
            href="https://example.com/servicio-demo-3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
          >
            <img 
              src={serviceImage}
              alt="Servicio Demo 3" 
              className="w-full h-60 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl text-navy-900">
                  Servicio Demo 3
                </h3>
                <ExternalLink className="h-6 w-6 text-[#009483] group-hover:text-[#2a8d81]" />
              </div>
              <p className="text-gray-600">
                Servicios legales demostrativos y asesoría jurídica integral para empresas
                y particulares con soluciones personalizadas.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
