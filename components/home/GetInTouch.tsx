"use client"

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GetInTouch({ isSection }: { isSection: boolean }) {
  const sectionClass = isSection
    ? "py-32 bg-white justify-center"
    : "min-h-[calc(60vh-80px)] py-16 bg-gradient-to-br from-gray-100 to-gray-50";

  return (
    <motion.section
      className={sectionClass}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            ¿Necesitas Servicios Legales?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-gray-800">
              Agenda tu consulta con nosotros
            </span>{' '}
            y descubre cómo podemos ayudarte a resolver tus desafíos legales de manera eficiente y profesional.
          </p>
          
          {/* CTA Button */}
          <div className="space-y-6">
            <Link 
              href="/contacto"
              className="inline-flex items-center gap-3 bg-[#009483] hover:bg-[#007a6b] text-white font-bold text-lg px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Contactar Ahora
              <ArrowRight className="h-6 w-6" />
            </Link>
            {/* <p className="text-sm text-gray-500 font-medium">
              ✓ Respuesta garantizada en menos de 24 horas
            </p> */}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
