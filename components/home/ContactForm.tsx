"use client"

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react'; // adjust icon imports as needed
import { ArrowUpRight } from 'lucide-react'; // adjust icon imports as needed
import { motion } from 'framer-motion';

export default function ContactForm({ isSection }: { isSection: boolean }) {
  const sectionClass = isSection
    ? "min-h-[calc(80vh-80px)] py-12 bg-gray-50 justify-center"
    : "min-h-[calc(100vh-80px)] py-12 bg-gray-50";
  return (
    // <motion.section
    //   className={sectionClass}
    //   initial={{ opacity: 0, y: 50 }}
    //   whileInView={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.8, ease: "easeOut" }}
    //   viewport={{ once: true, amount: 0.2 }}
    // >
    <div className={sectionClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className={`flex flex-col h-full items-center ${isSection ? 'justify-center' : 'justify-start'}`}>            
            <h2 className="text-3xl font-bold text-gray-900 mb-8 lg:text-left">
              Contactar
            </h2>
            <div className="flex flex-col items-center justify-center self-center xs:max-w-[70vw] sm:max-w-[50vw] lg:items-start p-4">
              <p className="text-gray-600 mb-8 text-left lg:text-left text-xl lg:mx-0 lg:max-w-none">
                <span className="italic font-semibold">
                  ¿Tienes dudas legales o necesitas orientación?
                </span>
                <br /><br /> Agenda tu consulta con nosotros y descubre cómo podemos ayudarte a resolver tus
                desafíos legales de manera eficiente y profesional. ¡Estamos aquí para ayudarte!
              </p>
              <div className="space-y-6 lg:mx-0 lg:max-w-non w-full">
                <div className="flex flex-col items-start justify-start">
                  {/* Header row: Icon and Title */}
                  <div className="flex flex-row items-center">
                    <Phone className="h-6 w-6 text-[#009483] mr-2" />
                    <p className="font-medium text-navy-900">Teléfono</p>
                  </div>
                  {/* Details row */}
                  <p className="text-gray-600 mt-1">+34 900 123 456</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <div className="flex flex-row items-center">
                    <Mail className="h-6 w-6 text-[#009483] mr-2" />
                    <p className="font-medium text-navy-900">Email</p>
                    <a 
                      href="mailto:contact@eugeniabravodemo.com"
                      className="ml-2 text-[#009483] hover:underline"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                  <a 
                    href="mailto:contact@eugeniabravodemo.com"
                    className="text-gray-600 mt-1 break-all hover:underline"
                  >
                    contact@eugeniabravodemo.com
                  </a>
                </div>
                <div className="flex flex-col items-start justify-start mt-6">
                  <div className="flex flex-row items-center">
                    <MapPin className="h-6 w-6 text-[#009483] mr-2" />
                    <p className="font-medium text-navy-900">Oficinas</p>
                  </div>
                  <div className="space-y-4 mt-1">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Calle+Demo+123,+28000+Madrid,+España" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="block text-gray-600 hover:underline"
                    >
                      Calle Demo 123<br />
                      Madrid – 28000<br />
                      España
                      <span className="inline-block ml-2">
                        <ArrowUpRight className="h-4 w-4 text-[#009483]" />
                      </span>
                    </a>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Avenida+Ejemplo+45,+08000+Barcelona,+España" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="block text-gray-600 hover:underline"
                    >
                      Avenida Ejemplo 45<br />
                      Barcelona – 08000<br />
                      España
                      <span className="inline-block ml-2">
                        <ArrowUpRight className="h-4 w-4 text-[#009483]" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Responsive iframe container */}
          <div className="w-full mt-8">
            <iframe 
              width="540" 
              title="Formulario de contacto demo"
              srcDoc={`<!doctype html><html><body style="margin:0;padding:32px;font-family:Arial,sans-serif;background:#f8fafc;color:#1f2937;"><h3 style="margin:0 0 12px;">Formulario de contacto demo</h3><p style="margin:0 0 16px;line-height:1.5;">Este es un marcador de posición. Conecta tu formulario real cuando lo necesites.</p><div style="height:520px;border:2px dashed #cbd5f5;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#64748b;">Área de formulario</div></body></html>`}
              className='h-[1100px] md:h-[900px]'
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}
            ></iframe>
          </div>
        </div>
      </div>
      </div>
    // </motion.section>
  );
}
