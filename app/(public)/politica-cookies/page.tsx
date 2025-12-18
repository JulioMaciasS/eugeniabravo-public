'use client'

import { useEffect } from 'react'

export default function PoliticaCookiesPage() {
  useEffect(() => {
    // Set the document title on client side
    document.title = 'Política de Cookies - EugeniaBravoDemo Asesoría Legal';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Política de cookies del sitio web de EugeniaBravoDemo, información sobre el uso de cookies.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Política de cookies del sitio web de EugeniaBravoDemo, información sobre el uso de cookies.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleCookieSettings = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.CookieScript) {
      // @ts-ignore
      window.CookieScript.instance.show();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Política de Cookies
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Qué son las cookies?
              </h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
                Permiten que el sitio web recuerde sus acciones y preferencias (como el idioma, el tamaño de fuente y otras 
                preferencias de visualización) durante un período de tiempo, para que no tenga que volver a configurarlas 
                cada vez que regrese al sitio o navegue de una página a otra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Cómo utilizamos las cookies?
              </h2>
              <p>
                En el sitio web de EugeniaBravoDemo utilizamos cookies para mejorar la experiencia del usuario y 
                proporcionar funcionalidades esenciales del sitio. Las cookies que utilizamos se clasifican en las siguientes categorías:
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Cookies Técnicas o Necesarias
              </h3>
              <p>
                Estas cookies son esenciales para el funcionamiento del sitio web y no pueden ser desactivadas. 
                Incluyen cookies de autenticación, seguridad y accesibilidad que permiten navegar por el sitio web 
                y utilizar sus funciones básicas.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-blue-900 mb-2">Cookies utilizadas:</h4>
                <ul className="list-disc pl-5 text-blue-800 space-y-1">
                  <li><strong>Supabase Auth:</strong> Gestión de sesiones de usuario autenticado</li>
                  <li><strong>CSRF Protection:</strong> Protección contra ataques de falsificación</li>
                  <li><strong>Session Management:</strong> Mantenimiento del estado de sesión</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Cookies de Preferencias
              </h3>
              <p>
                Estas cookies permiten recordar información que cambia la forma en que se comporta o se ve el sitio web, 
                como su idioma preferido o la región en la que se encuentra.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Cookies de Análisis y Rendimiento
              </h3>
              <p>
                Utilizamos Google Analytics para recopilar información sobre cómo los visitantes utilizan nuestro sitio web. 
                Estas cookies nos ayudan a mejorar el funcionamiento del sitio web.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-green-900 mb-2">Google Analytics:</h4>
                <ul className="list-disc pl-5 text-green-800 space-y-1">
                  <li><strong>_ga:</strong> Distingue a los usuarios únicos (duración: 2 años)</li>
                  <li><strong>_ga_[ID]:</strong> Mantiene el estado de la sesión (duración: 2 años)</li>
                  <li><strong>_gid:</strong> Distingue a los usuarios únicos (duración: 24 horas)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Gestión de Cookies
              </h2>
              <p>
                Puede gestionar sus preferencias de cookies en cualquier momento utilizando el panel de configuración 
                de cookies que aparece al visitar nuestro sitio web por primera vez, o accediendo a él desde el enlace 
                en el pie de página.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Panel de Control de Cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  Utilizamos CookieScript para gestionar el consentimiento de cookies. 
                  Puede modificar sus preferencias haciendo clic en el botón siguiente:
                </p>
                <button 
                  onClick={handleCookieSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Gestionar Preferencias de Cookies
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies de Terceros
              </h2>
              <p>
                Nuestro sitio web puede contener cookies de terceros. Estas cookies son colocadas por servicios externos 
                que utilizamos para mejorar la funcionalidad del sitio:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Google Analytics:</strong> Para análisis de tráfico web y comportamiento de usuarios
                </li>
                <li>
                  <strong>Google Fonts:</strong> Para la carga de fuentes tipográficas
                </li>
                <li>
                  <strong>Supabase:</strong> Para servicios de backend y autenticación
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Configuración del Navegador
              </h2>
              <p>
                También puede gestionar las cookies directamente desde la configuración de su navegador web. 
                La mayoría de navegadores permiten:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Ver qué cookies están almacenadas y eliminarlas individualmente</li>
                <li>Bloquear cookies de terceros</li>
                <li>Bloquear cookies de sitios específicos</li>
                <li>Bloquear todas las cookies</li>
                <li>Eliminar todas las cookies al cerrar el navegador</li>
              </ul>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800">
                  <strong>Nota importante:</strong> Si decide bloquear o eliminar las cookies, 
                  es posible que algunas partes de nuestro sitio web no funcionen correctamente.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Bases Legales
              </h2>
              <p>
                El tratamiento de datos personales a través de cookies se basa en el consentimiento del usuario, 
                de acuerdo con el artículo 6.1.a) del Reglamento General de Protección de Datos (RGPD) y 
                el artículo 22.2 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información 
                y de comercio electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Actualizaciones de la Política
              </h2>
              <p>
                Esta política de cookies puede ser actualizada periódicamente para reflejar cambios en las cookies 
                que utilizamos o por razones operativas, legales o reglamentarias. 
                Le recomendamos que revise esta página regularmente.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Última actualización:</strong> Agosto 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contacto
              </h2>
              <p>
                Si tiene alguna pregunta sobre nuestra política de cookies, puede contactarnos:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <ul className="space-y-2">
                  <li><strong>Email:</strong> contact@eugeniabravodemo.com</li>
                  <li><strong>Teléfono:</strong> +34 900 123 456</li>
                  <li><strong>Dirección:</strong> Calle Demo 123, 28000 Madrid, España</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
