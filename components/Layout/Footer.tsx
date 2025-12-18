'use client'

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const serviceImage = '/images/service-placeholder.svg';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white w-full">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6 sm:gap-8">        {/* First Row: Brand and Description */}
        <div className="text-center md:text-left px-2 sm:px-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">EugeniaBravoDemo</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
            Asesoría legal especializada con más de 20 años de experiencia. Claridad, confianza y control en cada paso.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4 text-[#009483] text-left">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#009483] flex-shrink-0" />
                <a 
                  href="tel:+34900123456"
                  title="Llamar a EugeniaBravoDemo"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +34 900 123 456
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#009483] flex-shrink-0" />
                <a 
                  href="mailto:contact@eugeniabravodemo.com"
                  title="Enviar email a EugeniaBravoDemo"
                  className="text-gray-300 hover:text-white transition-colors break-all"
                >
                  contact@eugeniabravodemo.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#009483] flex-shrink-0 mt-1" />
                <div className="text-gray-300">
                  <p className="hover:text-white transition-colors">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Calle+Demo+123,+28000+Madrid,+España" 
                      target="_blank" 
                      rel="noreferrer"
                      title="Ver ubicación oficina Madrid en Google Maps"
                    >
                      Madrid
                    </a>
                  </p>
                  <p className="hover:text-white transition-colors">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+Ejemplo+45,+08000+Barcelona,+España" 
                      target="_blank" 
                      rel="noreferrer"
                      title="Ver ubicación oficina Barcelona en Google Maps"
                    >
                      Barcelona
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4 text-[#009483] text-left">Ubicación</h3>
            <div className="w-full rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://maps.google.com/maps?q=Madrid%2C%20Spain&t=&z=12&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="280" 
                className="w-full"
                style={{ border: 0 }}
                title="Ubicación de oficinas demo">
              </iframe>                     
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <h3 className="font-semibold text-lg mb-6 text-[#009483] text-center">Explora nuestros servicios demo</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <a 
              href="https://example.com/servicio-demo-1" 
              target="_blank" 
              rel="noreferrer"
              title="Servicio Demo 1"
              className="flex flex-col sm:flex-row sm:items-center hover:text-[#009483] transition-colors group bg-gray-700 p-4 rounded-lg"
            >
              <img 
                src={serviceImage}
                alt="Servicio Demo 1" 
                className="h-20 w-44 object-contain mb-2 sm:mb-0 sm:mr-4 flex-shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className='font-medium text-white'>Servicio Demo 1</span>
                  <ExternalLink className="h-4 w-4 text-[#009483] group-hover:text-white transition-colors flex-shrink-0" />
                </div>
                <p className="font-light text-gray-300 text-sm">
                  Soluciones legales demostrativas con foco en claridad y confianza.
                </p>
              </div>
            </a>
            <a 
              href="https://example.com/servicio-demo-2" 
              target="_blank" 
              rel="noreferrer"
              title="Servicio Demo 2"
              className="flex flex-col sm:flex-row sm:items-center hover:text-[#009483] transition-colors group bg-gray-700 p-4 rounded-lg"
            >
              <img 
                src={serviceImage}
                alt="Servicio Demo 2" 
                className="h-20 w-40 object-contain mb-2 sm:mb-0 sm:mr-4 flex-shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className='font-medium text-white'>Servicio Demo 2</span>
                  <ExternalLink className="h-4 w-4 text-[#009483] group-hover:text-white transition-colors flex-shrink-0" />
                </div>
                <p className="font-light text-gray-300 text-sm">
                  Acompañamiento legal demo con enfoque integral y práctico.
                </p>
              </div>
            </a>
            <a 
              href="https://example.com/servicio-demo-3" 
              target="_blank" 
              rel="noreferrer"
              title="Servicio Demo 3"
              className="flex flex-col sm:flex-row sm:items-center hover:text-[#009483] transition-colors group bg-gray-700 p-4 rounded-lg"
            >
              <img 
                src={serviceImage}
                alt="Servicio Demo 3" 
                className="h-20 w-40 object-contain mb-2 sm:mb-0 sm:mr-4 flex-shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className='font-medium text-white'>Servicio Demo 3</span>
                  <ExternalLink className="h-4 w-4 text-[#009483] group-hover:text-white transition-colors flex-shrink-0" />
                </div>
                <p className="font-light text-gray-300 text-sm">
                  Servicios demo especializados y asesoría jurídica integral.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
      {/* Lower Section */}
      <div className="border-t border-gray-600 mt-12 pt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center lg:text-left">
            © {new Date().getFullYear()} EugeniaBravoDemo - Asesoría Legal. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/aviso-legal" title="Aviso Legal" className="text-gray-400 hover:text-[#009483] transition-colors">
              Aviso Legal
            </Link>
            <Link href="/politica-privacidad" title="Política de Privacidad" className="text-gray-400 hover:text-[#009483] transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/politica-cookies" title="Política de Cookies" className="text-gray-400 hover:text-[#009483] transition-colors">
              Cookies
            </Link>
            <Link href="/terminos-condiciones" title="Términos y Condiciones" className="text-gray-400 hover:text-[#009483] transition-colors">
              Términos y Condiciones
            </Link>
            <button
              onClick={() => {
                // @ts-ignore
                if (typeof window !== 'undefined' && window.CookieScript) {
                  // @ts-ignore
                  window.CookieScript.instance.show();
                }
              }}
              className="text-gray-400 hover:text-[#009483] transition-colors cursor-pointer bg-transparent border-none p-0 underline"
            >
              Configurar Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
}
