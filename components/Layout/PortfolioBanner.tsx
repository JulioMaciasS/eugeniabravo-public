'use client'

import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';

export default function PortfolioBanner() {
  return (
    <div className="bg-gradient-to-r from-[#009483] to-[#007a6d] text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-medium mb-1">
                ¿Necesitas una web profesional como esta?
              </p>
              <p className="text-xs sm:text-sm text-white/90">
                Desarrollo web personalizado por <span className="font-semibold">JulioDev</span>
              </p>
            </div>
          </div>
          <a
            href="https://portfolio.juliodev.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#009483] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Ver Servicios
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
