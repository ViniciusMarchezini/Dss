import { Gestor, Article, PushNotification, SimConfig } from "./types";

// Import manager avatars
import denilsonAvatar from "./assets/images/regenerated_image_1779733486756.jpg";
import davisonAvatar from "./assets/images/regenerated_image_1779733487477.jpg";

export const GESTORES: Gestor[] = [
  {
    id: "denilson",
    name: "Denilson Santos",
    phone: "+55 11 99355-1951",
    whatsappUrl: "https://api.whatsapp.com/send?phone=5511993551951&text=Olá,%20Denilson.%20Estive%20navegando%20no%20site%20da%20DSS%20Intermediação%20e%20gostaria%20de%20realizar%20uma%20reunião%20estratégica%20de%20consórcio.",
    email: "denilson.santos@dss.com.br",
    role: "Gestor Autorizado de Consórcios",
    experience: "12+ anos de especialidade no mercado financeiro e imobiliário",
    description: "Especialista em grandes contas imobiliárias e investimentos corporativos. Denilson tem larga atuação orientando empresários a alavancar patrimônios através de grupos estratégicos de consórcios Ademicon, aliando alto rendimento e planejamento tributário seguro.",
    specialty: ["Imóveis de Alto Padrão", "Alavancagem Corporativa", "Aposentadoria Imobiliária"],
    avatarUrl: denilsonAvatar
  },
  {
    id: "davison",
    name: "Davison Santos",
    phone: "+55 11 98280-3557",
    whatsappUrl: "https://api.whatsapp.com/send?phone=5511982803557&text=Olá,%20Davison.%20Estive%20navegando%20no%20site%20da%20DSS%20Intermediação%20e%20gostaria%20de%20realizar%20uma%20reunião%20estratégica%20de%20consórcio.",
    email: "davison.santos@dss.com.br",
    role: "Gestor Autorizado de Consórcios",
    experience: "10+ anos de consultoria patrimonial e planejamento de frotas",
    description: "Referência em consórcios de veículos, frotas de transporte e agronegócio. Davison atua na consultoria estratégica de lances e estruturação de grupos para aquisição acelerada, garantindo que o cliente otimize o fluxo de caixa sem descapitalizar a empresa.",
    specialty: ["Consórcio de Caminhões/Frotas", "Maquinário Agrícola", "Bens de Serviço e Tecnologia"],
    avatarUrl: davisonAvatar
  }
];

export const SIM_CONFIGS: Record<'imoveis' | 'veiculos' | 'servicos', SimConfig> = {
  imoveis: {
    minCredit: 100000,
    maxCredit: 10000000, // 10mi BRL
    stepCredit: 50000,
    defaultCredit: 500000,
    terms: [120, 150, 180, 240],
    defaultTerm: 180,
    adminTax: 0.15, // 15% taxa administração total
    reserveTax: 0.01 // 1% fundo de reserva
  },
  veiculos: {
    minCredit: 30000,
    maxCredit: 3000000, // 3mi BRL
    stepCredit: 10000,
    defaultCredit: 150000,
    terms: [36, 48, 60, 80, 100], // Até 100 parcelas
    defaultTerm: 60,
    adminTax: 0.14, // 14% taxa de administração
    reserveTax: 0.01 // 1% fundo de reserva
  },
  servicos: {
    minCredit: 10000,
    maxCredit: 100000, // 100mil BRL
    stepCredit: 5000,
    defaultCredit: 35000,
    terms: [12, 24, 36, 48, 50], // Até 50 parcelas
    defaultTerm: 36,
    adminTax: 0.12, // 12% taxa de administração
    reserveTax: 0.01 // 1% fundo de reserva
  }
};

export const EDUCATION_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Consórcio vs. Financiamento Imobiliário",
    category: "Planejamento Financeiro",
    readTime: "4 min de leitura",
    summary: "Como economizar até 3x mais ao planejar a aquisição de um imóvel de alto padrão utilizando consórcios em vez das taxas cumulativas dos bancos.",
    iconName: "TrendingUp",
    content: [
      "O financiamento bancário tradicional utiliza a tabela SAC ou PRICE, onde as taxas de juros nominais acumulam juros sobre juros ao longo de 20 a 30 anos. Ao final do contrato, o comprador frequentemente pagou o equivalente a 2,5 ou até 3 vezes o valor real do imóvel.",
      "No consórcio imobiliário do parceiro Ademicon, não há taxas de juros. Em vez disso, é aplicada apenas uma Taxa de Administração diluída de forma linear durante todo o contrato. Em um plano típico de 180 meses, essa taxa representa menos de 1% ao ano, gerando uma parcela muito menor.",
      "A economia total obtida pode ser reinvestida na aquisição de novos ativos imobiliários, potencializando de forma expressiva o enriquecimento patrimonial de longo prazo."
    ]
  },
  {
    id: "art-2",
    title: "A Regra dos 70%: Conheça a Parcela Facilitada Ademicon",
    category: "Estratégia Ademicon",
    readTime: "3 min de leitura",
    summary: "Entenda o mecanismo oficial no qual você paga apenas 70% da parcela antes de ser contemplado, mantendo as finanças e o caixa da empresa flexíveis.",
    iconName: "Award",
    content: [
      "Uma das maiores barreiras para quem deseja iniciar um consórcio de alto valor é o receio de sobrecarregar o orçamento mensal antes de tomar posse do bem.",
      "Para resolver essa objeção, a Ademicon desenvolveu uma facilidade exclusiva chamada Parcela Reduzida / Facilitada 70%. Sob este modelo, o participante paga apenas 70% do valor de prestação cheia mensal até o momento exato em que for contemplado por sorteio ou lance.",
      "Após a contemplação e recebimento do bem, a diferença é amortizada e recalculada de forma diluída nas prestações restantes. Isso assegura que o participante inicie o plano imobiliário com enorme conforto de caixa e liquidez."
    ]
  },
  {
    id: "art-3",
    title: "Como usar o FGTS para contemplação acelerada no Imobiliário",
    category: "Dicas de Consórcio",
    readTime: "5 min de leitura",
    summary: "O passo a passo para utilizar o saldo do seu Fundo de Garantia como lance embutido oficial ou aporte de recursos na Ademicon.",
    iconName: "Home",
    content: [
      "Muitos trabalhadores possuem recursos importantes acumulados no FGTS, mas acreditam que esses recursos só podem ser retirados diretamente em financiamentos tradicionais de bancos comerciais.",
      "Na Ademicon, o uso do FGTS é totalmente regulado e integrado de acordo com as regras da Caixa Econômica Federal. Você pode utilizar seu FGTS em três frentes altamente benéficas:",
      "1. Oferta de Lance: Use o saldo como garantia de lance para acelerar a contemplação da sua carta.\n2. Complemento de Compra: Caso o imóvel escolhido ultrapasse o valor da carta de crédito.\n3. Amortização de Saldo Devedor: Diminuindo o prazo ou o valor das prestações mensais."
    ]
  },
  {
    id: "art-4",
    title: "Alavancagem com Lance Embutido: Estratégia Avançada",
    category: "Investimentos",
    readTime: "4 min de leitura",
    summary: "Utilize até 30% da própria carta para dar lance e antecipar sua contemplação sem mexer na sua reserva financeira pessoal.",
    iconName: "Car",
    content: [
      "O Lance Embutido é uma das estratégias de aceleração de consórcio mais seguras e inteligentes recomendadas pela equipe técnica da DSS Intermediação.",
      "O funcionamento é simples: você pode indicar à Ademicon que deseja utilizar até 30% do valor da sua própria carta como desconto de lance de contemplação.",
      "Caso o lance seja vencedor, o valor oferecido é diretamente descontado da sua carta e você recebe a diferença líquida para comprar o seu bem à vista. É um mecanismo fantástico de ganho de tempo e segurança financeira, sem necessidade de se descapitalizar."
    ]
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: "not-1",
    title: "Oportunidade Imobiliária Ademicon",
    body: "Grupo exclusivo imobiliário com taxas diferenciadas e lances médios reduzidos aberto para adesões esta semana. Fale com Davison ou Denilson.",
    time: "Há 10 min",
    isNew: true,
    category: "opportunity"
  },
  {
    id: "not-2",
    title: "Ademicon completa 30 anos com recorde",
    body: "Consolidada como a maior administradora independente do Brasil, ultrapassando R$ 10 bilhões em carteira ativa sob gestão.",
    time: "Ontem",
    isNew: false,
    category: "news"
  },
  {
    id: "not-3",
    title: "Dica de Contemplação Rápida",
    body: "Estatística oficial de lances do último mês demonstra excelentes médias para lances fixos de 30% com uso de lance embutido.",
    time: "Há 2 dias",
    isNew: false,
    category: "alert"
  }
];
