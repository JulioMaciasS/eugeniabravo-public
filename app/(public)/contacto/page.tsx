import React from 'react'
import { Mail, MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react'
import { H1 } from '@/components/ui/Typography'

function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <H1 variant="public">
            Contacto
          </H1>
          {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes dudas legales o necesitas orientación profesional? 
            Estoy aquí para ayudarte a resolver tus desafíos legales de manera eficiente.
          </p> */}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
         {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">Envíanos un Mensaje</h2>
            {/* <p className="text-gray-600">
              Completa el formulario y te responderemos en menos de 24 horas.
            </p> */}
            
            {/* Embedded Form */}
            <div className="w-full">
              <iframe 
                width="100%" 
                height="900"
                title="Formulario de contacto demo"
                srcDoc={`<!doctype html><html><body style="margin:0;padding:32px;font-family:Arial,sans-serif;background:#f8fafc;color:#1f2937;"><h3 style="margin:0 0 12px;">Formulario de contacto demo</h3><p style="margin:0 0 16px;line-height:1.5;">Este es un marcador de posición. Conecta tu formulario real cuando lo necesites.</p><div style="height:480px;border:2px dashed #cbd5f5;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#64748b;">Área de formulario</div></body></html>`}
                className='rounded-lg border-0'
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}
              ></iframe>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#009483] p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                    <a 
                      href="tel:+34900123456"
                      className="text-[#009483] hover:underline text-lg font-medium"
                    >
                      +34 900 123 456
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#009483] p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a 
                      href="mailto:contact@eugeniabravodemo.com"
                      className="text-[#009483] hover:underline font-medium break-all"
                    >
                      contact@eugeniabravodemo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#009483] p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horario de Atención</h3>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-gray-600">Sábados: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestras Oficinas</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#009483] p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Madrid</h3>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Calle+Demo+123,+28000+Madrid,+España" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-gray-600 hover:text-[#009483] transition-colors inline-flex items-center gap-2"
                    >
                      <div>
                        Calle Demo 123<br />
                        Madrid – 28000<br />
                        España
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#009483]" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#009483] p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Barcelona</h3>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+Ejemplo+45,+08000+Barcelona,+España" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-gray-600 hover:text-[#009483] transition-colors inline-flex items-center gap-2"
                    >
                      <div>
                        Avenida Ejemplo 45<br />
                        Barcelona – 08000<br />
                        España
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#009483]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación de Nuestras Oficinas</h2>
            <p className="text-gray-600 mb-6">
              Contamos con dos oficinas estratégicamente ubicadas en España para brindarte mejor acceso a nuestros servicios.
            </p>
          </div>
          <div className="w-full">
            <iframe 
              src="https://maps.google.com/maps?q=Madrid%2C%20Spain&t=&z=12&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="400" 
              className="w-full border-0"
              title="Ubicación de Nuestras Oficinas">
            </iframe>                     
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
