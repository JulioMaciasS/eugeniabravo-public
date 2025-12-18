import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal - EugeniaBravoDemo Asesoría Legal',
  description: 'Aviso legal del sitio web de EugeniaBravoDemo, asesoría legal especializada.',
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Aviso Legal
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Datos Identificativos
              </h2>
              <p>
                En cumplimiento de lo establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, 
                de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa que:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Titular:</strong> EugeniaBravoDemo</li>
                <li><strong>NIF:</strong> DEMO-0000</li>
                <li><strong>Actividad:</strong> Servicios de asesoría legal</li>
                <li><strong>Domicilio:</strong> Calle Demo 123, 28000 Madrid, España</li>
                <li><strong>Teléfono:</strong> +34 900 123 456</li>
                <li><strong>Email:</strong> contact@eugeniabravodemo.com</li>
                <li><strong>Registro profesional:</strong> Colegio de Abogados de Madrid - Nº Colegiada: DEMO-0000</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Objeto y Condiciones de Uso
              </h2>
              <p>
                Este sitio web tiene como objeto proporcionar información sobre los servicios de asesoría legal 
                ofrecidos por EugeniaBravoDemo. El acceso y uso de este sitio web otorga la condición de usuario 
                y supone la aceptación plena de todas las condiciones incluidas en este aviso legal.
              </p>
              <p>
                El usuario se compromete a hacer un uso correcto del sitio web de conformidad con las leyes, 
                la buena fe, el orden público, los usos del tráfico y el presente aviso legal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Propiedad Intelectual e Industrial
              </h2>
              <p>
                Todos los contenidos del sitio web, incluyendo a título enunciativo pero no limitativo, 
                textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño 
                gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a EugeniaBravoDemo, 
                sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos.
              </p>
              <p>
                Todos los nombres comerciales, marcas o signos distintivos están protegidos por la Ley de Marcas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Exclusión de Responsabilidades
              </h2>
              <p>
                EugeniaBravoDemo se exime de cualquier tipo de responsabilidad derivada de la información publicada 
                en su sitio web, siempre que esta información haya sido manipulada o introducida por un tercero ajeno.
              </p>
              <p>
                El sitio web puede contener enlaces a otros sitios web. EugeniaBravoDemo no ejerce control alguno 
                sobre dichos sitios web, por lo que no asume responsabilidad alguna por los contenidos o servicios 
                que pudieran ofrecerse en los sitios enlazados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Política de Enlaces
              </h2>
              <p>
                Desde el sitio web es posible que se redirija a contenidos de terceros sitios web. 
                Dado que no podemos controlar siempre los contenidos introducidos por los terceros en sus respectivos sitios web, 
                no asumimos ningún tipo de responsabilidad respecto a dichos contenidos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Derecho de Exclusión
              </h2>
              <p>
                EugeniaBravoDemo se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios 
                ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios 
                que incumplan las presentes condiciones generales de uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Generalidades
              </h2>
              <p>
                EugeniaBravoDemo perseguirá el incumplimiento de las presentes condiciones así como cualquier 
                utilización indebida de su sitio web ejerciendo todas las acciones civiles y penales que le puedan corresponder en derecho.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Modificación de las Presentes Condiciones y Duración
              </h2>
              <p>
                EugeniaBravoDemo puede modificar en cualquier momento las condiciones aquí determinadas, 
                siendo debidamente publicadas como aquí aparecen. La vigencia de las citadas condiciones 
                irá en función de su exposición y estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Legislación Aplicable y Jurisdicción
              </h2>
              <p>
                La relación entre EugeniaBravoDemo y el usuario se regirá por la normativa española vigente y 
                cualquier controversia se someterá a los Juzgados y Tribunales de Madrid, España.
              </p>
            </section>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
              <p className="text-sm text-green-800">
                <strong>Información actualizada:</strong> Este documento contiene los datos específicos reales 
                de EugeniaBravoDemo, Colegiada Nº DEMO-0000 del Colegio de Abogados de Madrid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
