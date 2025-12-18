"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: "¿Cuáles son los servicios que ofrecen?",
      answer: "Ofrecemos asesoramiento legal especializado en derecho familiar, divorcio, mediación familiar, extranjería, planificación patrimonial y derecho civil. Con más de 20 años de experiencia, brindamos soluciones personalizadas para cada cliente."
    },
    {
      question: "¿Cuál es el proceso para agendar una consulta?",
      answer: "Puede agendar una consulta a través de nuestro formulario de contacto en línea, llamándonos directamente al +34 900 123 456, o enviándonos un email. Ofrecemos consultas presenciales en nuestras oficinas de Madrid y Barcelona, así como consultas online."
    },
    {
      question: "¿Qué experiencia tienen en el sector legal?",
      answer: "EugeniaBravoDemo cuenta con más de una década de experiencia especializada en derecho familiar y gestión de divorcios. Nuestro despacho ha ayudado a cientos de familias a resolver sus conflictos de manera amigable y eficiente."
    },
    {
      question: "¿Ofrecen servicios de mediación familiar?",
      answer: "Sí, somos especialistas en mediación familiar. Este proceso alternativo permite resolver conflictos familiares de manera consensuada, reduciendo costos y tiempos, y preservando las relaciones familiares, especialmente importante cuando hay menores involucrados."
    },
    {
      question: "¿Cuáles son sus tarifas y formas de pago?",
      answer: "Nuestras tarifas son transparentes y competitivas. Ofrecemos diferentes modalidades de pago y presupuestos personalizados según la complejidad del caso. En la primera consulta evaluamos su situación y le proporcionamos un presupuesto detallado sin compromiso."
    }
  ];

  return (
    <motion.section 
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros servicios legales y procesos
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-in-out group hover:shadow-md"
            >
              <summary className="cursor-pointer text-gray-900 text-lg font-semibold py-2 list-none flex items-center justify-between">
                {faq.question}
                <ChevronDown className="h-5 w-5 text-[#009483] transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-4" />
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">¿No encuentras la respuesta que buscas?</p>
          <a 
            href="/contacto" 
            className="inline-flex items-center gap-2 bg-[#009483] hover:bg-[#007a6b] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contáctanos
          </a>
        </div> */}
      </div>
    </motion.section>
  );
}
