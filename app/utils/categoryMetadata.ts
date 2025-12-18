// Category metadata for SEO optimization
export const categoryMetadata: Record<string, { description: string; intro: string }> = {
  'derecho-civil': {
    description: 'Artículos especializados en Derecho Civil. Asesoramiento sobre contratos, familia, sucesiones y responsabilidad civil.',
    intro: 'El Derecho Civil regula las relaciones entre particulares. Encuentra aquí artículos sobre contratos, obligaciones, derecho de familia, sucesiones y responsabilidad civil.',
  },
  'derecho-penal': {
    description: 'Artículos sobre Derecho Penal. Información sobre delitos, procedimientos penales y defensa criminal.',
    intro: 'El Derecho Penal establece las consecuencias jurídicas del delito. Explora artículos sobre tipos penales, procedimientos criminales y defensa penal.',
  },
  'derecho-laboral': {
    description: 'Artículos sobre Derecho Laboral. Información sobre contratos de trabajo, despidos, salarios y relaciones laborales.',
    intro: 'El Derecho Laboral regula las relaciones entre empleadores y trabajadores. Encuentra información sobre contratos, despidos, salarios y derechos laborales.',
  },
  'derecho-mercantil': {
    description: 'Artículos sobre Derecho Mercantil. Asesoramiento en derecho de sociedades, contratos comerciales y operaciones mercantiles.',
    intro: 'El Derecho Mercantil regula la actividad empresarial y comercial. Descubre artículos sobre sociedades, contratos comerciales y operaciones mercantiles.',
  },
  'derecho-administrativo': {
    description: 'Artículos sobre Derecho Administrativo. Información sobre procedimientos administrativos, recursos y relaciones con la Administración.',
    intro: 'El Derecho Administrativo regula la organización y funcionamiento de las Administraciones Públicas. Encuentra artículos sobre procedimientos, recursos y actos administrativos.',
  },
  'derecho-fiscal': {
    description: 'Artículos sobre Derecho Fiscal y Tributario. Información sobre impuestos, declaraciones fiscales y obligaciones tributarias.',
    intro: 'El Derecho Fiscal regula el sistema tributario. Explora artículos sobre impuestos, declaraciones fiscales, sanciones tributarias y planificación fiscal.',
  },
  'derecho-internacional': {
    description: 'Artículos sobre Derecho Internacional. Información sobre tratados, arbitraje internacional y derecho transnacional.',
    intro: 'El Derecho Internacional regula las relaciones entre Estados y organizaciones internacionales. Descubre artículos sobre tratados, arbitraje internacional y comercio exterior.',
  },
  'derecho-constitucional': {
    description: 'Artículos sobre Derecho Constitucional. Información sobre derechos fundamentales, garantías constitucionales y organización del Estado.',
    intro: 'El Derecho Constitucional establece los principios fundamentales del ordenamiento jurídico. Encuentra artículos sobre derechos fundamentales, garantías y organización estatal.',
  },
  'contratos-y-obligaciones': {
    description: 'Artículos sobre Contratos y Obligaciones. Información sobre formación, ejecución y cumplimiento de contratos.',
    intro: 'Los contratos son acuerdos vinculantes entre partes. Explora artículos sobre formación contractual, ejecución, incumplimiento y tipos de contratos.',
  },
  'derecho-de-la-empresa': {
    description: 'Artículos sobre Derecho de la Empresa. Información sobre constitución de sociedades, operaciones corporativas y derecho societario.',
    intro: 'El Derecho de la Empresa regula la actividad societaria y corporativa. Descubre artículos sobre constitución, administración y operaciones empresariales.',
  },
  'derecho-del-consumidor': {
    description: 'Artículos sobre Derecho del Consumidor. Información sobre protección al consumidor, garantías y reclamaciones.',
    intro: 'El Derecho del Consumidor protege los derechos de los usuarios. Encuentra artículos sobre garantías, devoluciones, reclamaciones y protección del consumidor.',
  },
  'derecho-inmobiliario': {
    description: 'Artículos sobre Derecho Inmobiliario. Información sobre compraventa, arrendamientos y propiedad horizontal.',
    intro: 'El Derecho Inmobiliario regula las relaciones sobre bienes inmuebles. Explora artículos sobre compraventa, arrendamientos, hipotecas y propiedad horizontal.',
  },
  'derecho-familiar': {
    description: 'Artículos sobre Derecho de Familia. Información sobre matrimonio, divorcio, custodia y relaciones familiares.',
    intro: 'El Derecho de Familia regula las relaciones familiares y sus efectos jurídicos. Descubre artículos sobre matrimonio, divorcio, custodia, alimentos y herencias.',
  },
  'mediacion-y-arbitraje': {
    description: 'Artículos sobre Mediación y Arbitraje. Información sobre resolución alternativa de conflictos y procedimientos extrajudiciales.',
    intro: 'La Mediación y el Arbitraje son métodos alternativos de resolución de conflictos. Encuentra artículos sobre procedimientos, ventajas y aplicación práctica.',
  },
  'propiedad-intelectual': {
    description: 'Artículos sobre Propiedad Intelectual. Información sobre derechos de autor, patentes, marcas y protección de la creatividad.',
    intro: 'La Propiedad Intelectual protege las creaciones del intelecto humano. Explora artículos sobre derechos de autor, patentes, marcas y propiedad industrial.',
  },
};

// Helper function to get metadata for a category slug
export function getCategoryMetadata(categorySlug: string): { description: string; intro: string } | null {
  return categoryMetadata[categorySlug] || null;
}

// Helper function to get all category slugs (useful for static generation)
export function getAllCategorySlugs(): string[] {
  return Object.keys(categoryMetadata);
}
