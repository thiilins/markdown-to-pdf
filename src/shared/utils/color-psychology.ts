import chroma from 'chroma-js'

export interface ColorPsychology {
  name: string
  tags: string[]
  psychology: string[]
  meaning: string
  applications: string[]
}

/**
 * Analisa a cor e retorna sua psicologia e aplicações em PT-BR
 */
export function getColorPsychology(hex: string): ColorPsychology {
  if (!chroma.valid(hex)) {
    return {
      name: 'Desconhecida',
      tags: [],
      psychology: [],
      meaning: '',
      applications: [],
    }
  }

  const color = chroma(hex)
  const [h, s, l] = color.hsl() // h=0-360, s=0-1, l=0-1

  // 1. Detectar Neutros (Branco, Preto, Cinza) pela saturação/luminosidade
  if (l > 0.96) return COLORS_DATA.white
  if (l < 0.12) return COLORS_DATA.black
  if (s < 0.12) return COLORS_DATA.grey

  // 2. Mapear Hue (0-360) para categorias de cor
  if ((h >= 0 && h < 15) || h >= 345) return COLORS_DATA.red
  if (h >= 15 && h < 45) return COLORS_DATA.orange
  if (h >= 45 && h < 70) return COLORS_DATA.yellow
  if (h >= 70 && h < 165) return COLORS_DATA.green
  if (h >= 165 && h < 195) return COLORS_DATA.cyan
  if (h >= 195 && h < 260) return COLORS_DATA.blue
  if (h >= 260 && h < 300) return COLORS_DATA.purple
  if (h >= 300 && h < 345) return COLORS_DATA.pink

  return COLORS_DATA.grey // Fallback padrão
}

// Base de conhecimento em Português do Brasil
const COLORS_DATA: Record<string, ColorPsychology> = {
  red: {
    name: 'Família Vermelha',
    tags: ['Intenso', 'Quente', 'Urgente'],
    psychology: ['Paixão', 'Energia', 'Perigo', 'Excitação', 'Ação'],
    meaning:
      'Uma cor poderosa associada à energia, força, determinação, bem como paixão, desejo e amor. No marketing, cria senso de urgência e estimula o apetite.',
    applications: [
      'Alimentação (Fast Food)',
      'Botões de Ação (CTA)',
      'Promoções/Liquidação',
      'Esportes',
      'Emergência',
    ],
  },
  orange: {
    name: 'Família Laranja',
    tags: ['Amigável', 'Criativo', 'Jovem'],
    psychology: ['Criatividade', 'Aventura', 'Entusiasmo', 'Sucesso', 'Equilíbrio'],
    meaning:
      'Combina a energia do vermelho e a felicidade do amarelo. É associada à alegria, luz do sol e trópicos. Representa entusiasmo, fascínio, felicidade e estimula a atividade mental.',
    applications: [
      'Entretenimento',
      'Alimentos & Bebidas',
      'Produtos Infantis',
      'Tecnologia (SaaS)',
      'Logística',
    ],
  },
  yellow: {
    name: 'Família Amarela',
    tags: ['Feliz', 'Atenção', 'Brilhante'],
    psychology: ['Felicidade', 'Otimismo', 'Alerta', 'Intelecto', 'Clareza'],
    meaning:
      'A cor do sol. Produz um efeito de aquecimento, desperta alegria e estimula a atividade mental. Também é muito usada para indicar atenção e cuidado.',
    applications: ['Construção Civil', 'Turismo', 'Varejo', 'Sinais de Trânsito', 'Vitrines'],
  },
  green: {
    name: 'Família Verde',
    tags: ['Natural', 'Fresco', 'Financeiro'],
    psychology: ['Natureza', 'Crescimento', 'Saúde', 'Dinheiro', 'Harmonia'],
    meaning:
      'A cor da natureza. Simboliza crescimento, harmonia, frescor e fertilidade. Tem forte correspondência emocional com segurança e estabilidade financeira.',
    applications: [
      'Marcas Ecológicas',
      'Finanças/Bancos',
      'Saúde & Bem-estar',
      'Imobiliárias',
      'Ciência',
    ],
  },
  cyan: {
    name: 'Família Ciano/Turquesa',
    tags: ['Refrescante', 'Moderno', 'Limpo'],
    psychology: ['Clareza', 'Comunicação', 'Inspiração', 'Calma', 'Higiene'],
    meaning:
      'Promove uma sensação de limpeza e pureza. É frequentemente associada à água, tecnologia moderna, startups e energia refrescante.',
    applications: [
      'Startups de Tech',
      'Produtos de Limpeza',
      'Viagens (Praia)',
      'Médico/Hospitalar',
      'Software',
    ],
  },
  blue: {
    name: 'Família Azul',
    tags: ['Confiável', 'Corporativo', 'Calmo'],
    psychology: ['Confiança', 'Lealdade', 'Sabedoria', 'Segurança', 'Inteligência'],
    meaning:
      'Considerada benéfica para a mente e o corpo. Produz um efeito calmante e transmite confiança e estabilidade. É a cor favorita das grandes corporações.',
    applications: ['Negócios Corporativos', 'Tecnologia', 'Saúde', 'Advocacia', 'Seguros'],
  },
  purple: {
    name: 'Família Roxa',
    tags: ['Luxo', 'Misterioso', 'Criativo'],
    psychology: ['Realeza', 'Luxo', 'Ambição', 'Magia', 'Espiritualidade'],
    meaning:
      'Combina a estabilidade do azul e a energia do vermelho. Simboliza poder, nobreza, luxo e ambição. Frequentemente associada à sabedoria, dignidade e mistério.',
    applications: [
      'Bens de Luxo',
      'Beleza/Estética',
      'Marcas Espirituais',
      'Agências Criativas',
      'Doces Finos',
    ],
  },
  pink: {
    name: 'Família Rosa',
    tags: ['Romântico', 'Suave', 'Lúdico'],
    psychology: ['Romance', 'Amor', 'Amizade', 'Feminilidade', 'Delicadeza'],
    meaning:
      'Significa romance, amor e amizade. Denota qualidades femininas, passividade e ternura. Em tons fortes (pink), transmite ousadia e modernidade.',
    applications: ['Beleza/Maquiagem', 'Moda', 'Confeitaria', 'Brinquedos', 'Casamentos'],
  },
  white: {
    name: 'Família Clara/Branca',
    tags: ['Puro', 'Minimalista', 'Limpo'],
    psychology: ['Pureza', 'Inocência', 'Limpeza', 'Neutralidade', 'Paz'],
    meaning:
      'Associada à luz, bondade, inocência e pureza. É considerada a cor da perfeição. No design, o espaço em branco é fundamental para dar respiro.',
    applications: [
      'Médico',
      'Design Minimalista',
      'Casamentos',
      'Tecnologia (Estilo Apple)',
      'ONGs',
    ],
  },
  black: {
    name: 'Família Escura/Preta',
    tags: ['Elegante', 'Poderoso', 'Sofisticado'],
    psychology: ['Poder', 'Elegância', 'Formalidade', 'Mistério', 'Autoridade'],
    meaning:
      'Associada ao poder, elegância, formalidade e mistério. Denota força e autoridade; é considerada uma cor muito formal, elegante e de prestígio.',
    applications: ['Carros de Luxo', 'Alta Moda', 'Hardware', 'Marketing Premium', 'Fotografia'],
  },
  grey: {
    name: 'Família Cinza',
    tags: ['Neutro', 'Profissional', 'Equilibrado'],
    psychology: ['Neutralidade', 'Equilíbrio', 'Intelecto', 'Compromisso'],
    meaning:
      'Uma cor sem emoção forte. É imparcial, neutra e profissional. Do ponto de vista da psicologia das cores, o cinza é a cor do compromisso e da transição.',
    applications: ['Tecnologia', 'Industrial', 'Arquitetura', 'Jurídico', 'Backgrounds de Design'],
  },
}
