"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonialVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: custom * 0.2 },
  }),
};

export default function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Cliente - Proceso de Divorcio",
      content: "El equipo de EugeniaBravoDemo me acompañó durante todo mi proceso de divorcio con una profesionalidad y calidez humana excepcional. Su experiencia en mediación familiar fue clave para llegar a un acuerdo beneficioso para todos, especialmente para mis hijos.",
      rating: 5
    },
    {
      name: "Carlos Martínez",
      role: "Cliente - Derecho de Extranjería",
      content: "Excelente servicio profesional. Me ayudaron con mi proceso de nacionalización española de manera eficiente y clara. Siempre estuvieron disponibles para resolver mis dudas y me mantuvieron informado en cada paso del proceso.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      role: "Cliente - Planificación Patrimonial",
      content: "Una experiencia muy positiva donde el enfoque humano y profesional se combinan para brindar un servicio excepcional. Su asesoramiento en planificación patrimonial superó mis expectativas completamente.",
      rating: 5
    }
  ];

  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La confianza de nuestros clientes es nuestro mayor logro. Conoce sus experiencias trabajando con nosotros.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={testimonialVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="absolute -top-4 left-8">
                <div className="bg-[#009483] p-3 rounded-full">
                  <Quote className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="pt-4">
                {/* Rating Stars */}
                {/* <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div> */}

                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </h4>
                  <span className="text-sm text-[#009483] font-medium">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿Quieres ser parte de nuestras historias de éxito?
          </p>
          <a 
            href="/contacto" 
            className="inline-flex items-center gap-2 bg-[#009483] hover:bg-[#007a6b] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Agenda tu Consulta
          </a>
        </div> */}
      </div>
    </motion.section>
  );
}
