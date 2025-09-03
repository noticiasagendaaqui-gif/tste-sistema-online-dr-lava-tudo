
export const seoPages = {
  home: {
    title: "LimpaBrasil - Empresa de Limpeza Profissional em São José da Lapa, MG",
    description: "Empresa líder em limpeza profissional em São José da Lapa, MG. Serviços residenciais e comerciais com equipe qualificada. Orçamento grátis!",
    keywords: "limpeza profissional, limpeza residencial, limpeza comercial, São José da Lapa, empresa de limpeza MG, serviços de limpeza",
    url: "https://limpabrasil.com.br/"
  },
  about: {
    title: "Sobre a LimpaBrasil - História e Valores da Empresa",
    description: "Conheça a história da LimpaBrasil, empresa de limpeza profissional com mais de 10 anos de experiência em São José da Lapa, MG.",
    keywords: "sobre LimpaBrasil, história empresa limpeza, valores empresa, experiência limpeza profissional",
    url: "https://limpabrasil.com.br/sobre"
  },
  services: {
    title: "Serviços de Limpeza Profissional - Residencial e Comercial",
    description: "Conheça todos os nossos serviços: limpeza residencial, comercial, pós-obra, higienização de estofados e muito mais. Qualidade garantida!",
    keywords: "serviços limpeza, limpeza residencial, limpeza comercial, limpeza pós-obra, higienização estofados",
    url: "https://limpabrasil.com.br/servicos"
  },
  booking: {
    title: "Agendar Serviço de Limpeza - Agendamento Online",
    description: "Agende seu serviço de limpeza de forma rápida e fácil. Escolha data, horário e tipo de serviço. Atendimento em São José da Lapa e região.",
    keywords: "agendar limpeza, agendamento online, marcar serviço limpeza, agendar limpeza residencial",
    url: "https://limpabrasil.com.br/agendamento"
  },
  contact: {
    title: "Contato - Fale Conosco | LimpaBrasil",
    description: "Entre em contato com a LimpaBrasil. WhatsApp: (31) 98025-2882. Atendimento de segunda a sábado. Orçamento sem compromisso!",
    keywords: "contato LimpaBrasil, telefone empresa limpeza, WhatsApp limpeza, fale conosco",
    url: "https://limpabrasil.com.br/contato"
  },
  admin: {
    title: "Painel Administrativo - LimpaBrasil",
    description: "Acesso restrito ao painel administrativo da LimpaBrasil para gerenciamento de agendamentos e serviços.",
    keywords: "painel admin, administração LimpaBrasil, login admin",
    url: "https://limpabrasil.com.br/admin",
    robots: "noindex, nofollow"
  },
  client: {
    title: "Área do Cliente - LimpaBrasil",
    description: "Acesse sua área exclusiva para acompanhar agendamentos, histórico de serviços e muito mais.",
    keywords: "área cliente, dashboard cliente, meus agendamentos",
    url: "https://limpabrasil.com.br/cliente"
  }
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateServiceSchema = (service) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "LimpaBrasil",
      "telephone": "+55 31 98025-2882",
      "email": "contato@limpabrasil.com.br"
    },
    "areaServed": {
      "@type": "City",
      "name": "São José da Lapa",
      "containedInPlace": {
        "@type": "State",
        "name": "Minas Gerais"
      }
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceRange": service.priceRange || "$$"
    }
  };
};
