import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Globe, Scale, BookOpen, Shield } from 'lucide-react'

const timelinePortugal = [
  {
    year: '1661',
    title: 'Diogo Garcez Palha',
    subtitle: 'Fundador da Linhagem',
    location: 'Lisboa, Portugal',
    description:
      'Nascido em 21 de maio de 1661, batizado na Paróquia de São José. Filho de Duarte Garcez e D. Ana da Costa.',
    achievements: [
      'Moço da Câmara (1699)',
      'Cavaleiro da Ordem de Cristo (1708)',
      'Escudeiro Fidalgo da Casa Real (1713)',
      'Tesoureiro Geral dos Consulados (1725)',
    ],
    details:
      'Casou com D. Antónia Serafina Cavalhera Cruzada (Monteiro de Macedo) em 1698. Teve 12 filhos e consolidou a posição da família na alta nobreza lisboeta.',
  },
  {
    year: '1700',
    title: 'Lucas Germano Garcez Palha',
    subtitle: 'Consolidação Nobiliárquica',
    location: 'Lisboa, Portugal',
    description:
      'Terceiro filho de Diogo, batizado na Paróquia da Encarnação. Elevou o prestígio familiar.',
    achievements: [
      'Tença de 12$000 réis com Hábito de Cristo (1713)',
      'Almoxarife das Armas e Ribeira da Junta do Comércio (1717)',
      'Cavaleiro professo da Ordem de Cristo',
      'Moço da Câmara e Escudeiro Fidalgo da Casa Real',
    ],
    details:
      'Casou com D. Guiomar Antónia Maria da Cunha, unindo os Garcez Palha à prestigiada família Cunha.',
  },
]

const timelineGoa = [
  {
    year: '1775',
    title: 'Joaquim Mourão Garcez Palha',
    subtitle: 'O Grande Governador',
    location: 'Goa, Índia Portuguesa',
    description:
      'Nascido em 8 de agosto de 1775 em Goa. Figura mais proeminente da família, serviu com distinção em três continentes.',
    achievements: [
      'Capitão de Mar e Guerra na Marinha Portuguesa',
      'Governador da Fortaleza e Cidade de Diu (1800-1818)',
      'Comandou a fragata Salamandra para libertar Macau (1822-1823)',
      '48º Governador de Macau (1825-1827)',
      '90º Governador da Índia Portuguesa (1843-1844)',
      'Comendador honorário da Ordem de Cristo',
      'Pensão hereditária de 500 taéis de Macau',
    ],
    details:
      'Filho de Cândido José Mourão Garcez (Governador de Damão) e D. Ângela Maria de Sousa Rancosa. Casou com D. Lizarda Joaquina de Mendonça Corte Real. Faleceu em 26 de julho de 1850 em Ribandar.',
  },
  {
    year: '1810',
    title: 'Cândido José Mourão Garcez Palha',
    subtitle: '1º Visconde de Bucelas',
    location: 'Ribandar, Goa',
    description:
      'Nascido em 5 de novembro de 1810. Educado no Colégio de São Tomás de Aquino e na Academia Militar de Goa.',
    achievements: [
      'Coronel do Corpo de Engenheiros do Estado da Índia',
      'Governador de Damão (1845)',
      'Presidente do Supremo Conselho de Justiça Militar',
      'Diretor das Obras Públicas, Telégrafos e Observatório Meteorológico',
      'Professor na Escola Matemática e Militar',
      '1º Visconde de Bucelas (23 de agosto de 1870)',
      'Comendador da Ordem de Cristo',
      'Conselheiro d\'El-Rei D. Luís I',
    ],
    details:
      'Casou com D. Emília da Costa Campos de Aguiar Pereira de Lacerda. Autor de "Elementos de construção" e pioneiro na modernização de Goa. Faleceu em 28 de janeiro de 1873.',
  },
  {
    year: '1837',
    title: 'Joaquim Mourão Garcez Palha',
    subtitle: '2º Visconde de Bucelas',
    location: 'Goa, Índia Portuguesa',
    description:
      'Renovação do título viscondal em 29 de março de 1878. Continuou a tradição familiar de serviço.',
    achievements: [
      '2º Visconde de Bucelas (1878)',
      'Moço Fidalgo da Casa Real (1887)',
      'Bibliotecário da Biblioteca Pública de Goa',
      'Professor da Escola Nacional de Goa',
    ],
    details: 'Casou com D. Cândida Lopes da Silva em 12 de agosto de 1878. Faleceu em 10 de dezembro de 1902.',
  },
  {
    year: '1842',
    title: 'Tomás de Aquino Mourão Garcez Palha',
    subtitle: 'Barão de Combarjúa - Defensor da Língua Konkani',
    location: 'Ribandar, Goa',
    description:
      'Filho do 1º Visconde de Bucelas. Especialista em konkani, marata e sânscrito. Pioneiro na defesa cultural.',
    achievements: [
      'Barão de Combarjúa',
      'Inspetor de Instrução em Goa',
      'Pioneiro da campanha pela "ressurreição do konkani" (1905)',
      'Mentor de Varde Valaulicar (Shenoi Goembab)',
      'Compilador do Dicionário do Konkani (1879, Academia das Ciências de Lisboa)',
    ],
    details:
      'Afirmava que o konkani, não o marata, era a língua materna de todos os goeses. Desafiou tanto autoridade colonial quanto consenso acadêmico. Figura progressista comprometida com justiça cultural.',
  },
  {
    year: '1840',
    title: 'Joaquim Mourão Garcez Palha',
    subtitle: '1º Conde de Ribandar',
    location: 'Ribandar, Goa',
    description:
      'A mais alta graduação alcançada pela família na hierarquia nobiliárquica portuguesa.',
    achievements: [
      '1º Visconde de Ribandar',
      '1º Conde de Ribandar',
      'Moço Fidalgo da Casa Real (1877)',
      'Conselheiro de Sua Majestade El-Rei D. Luís I',
      'Comendador da Ordem de Nossa Senhora da Conceição e Vila Viçosa',
    ],
    details: 'Casou com D. Henriqueta Adelaide de Cárcomo Lobo. O Condado representou reconhecimento máximo aos serviços prestados pelos Garcez Palha ao império português.',
  },
]

const timelineBrasil = [
  {
    year: '1780',
    title: 'Diogo Garcez Palha',
    subtitle: 'Fundador da Linha Brasileira',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascido em 1780 em Portugal, falecido em 1843. Capitão que migrou durante o período joanino (1808-1821).',
    achievements: [
      'Patente de Capitão',
      'Migração durante a transferência da Corte Portuguesa (1808)',
      'Estabelecimento na elite carioca',
    ],
    details:
      'A transferência da Corte trouxe aproximadamente 15.000 pessoas da elite portuguesa ao Rio de Janeiro, transformando a cidade em capital do império.',
  },
  {
    year: '1856',
    title: 'João Antônio Garcez Palha Filho',
    subtitle: 'Consolidação na Elite Imperial',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascido em 1856, falecido em 26 de maio de 1925. Solidificou a posição familiar através de casamento estratégico.',
    achievements: [
      'Membro da elite carioca oitocentista',
      'Aliança matrimonial com família Leitão',
      'Participação ativa no período imperial',
    ],
    details:
      'Casou com Delphina Leitão (1859-1906), unindo duas linhagens luso-brasileiras. O casamento ocorreu durante o apogeu do Império de D. Pedro II.',
  },
  {
    year: '1888',
    title: 'José Luiz Garcez Palha',
    subtitle: 'Geração de Transição',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascido em 4 de junho de 1888, apenas 40 dias após a Lei Áurea. Testemunhou as maiores transformações da história brasileira.',
    achievements: [
      'Nascido no ano da Abolição da Escravatura',
      'Testemunhou a Proclamação da República (1889)',
      'Viveu a Belle Époque Carioca',
      'Atravessou seis décadas de transformações',
    ],
    details:
      'Filho de João Antônio e Delphina Leitão. Faleceu em 15 de outubro de 1950 no Rio de Janeiro aos 62 anos.',
  },
  {
    year: '1922',
    title: 'Zilka Garcez Palha',
    subtitle: 'Matriarca Centenária',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascida em 29 de outubro de 1922, viveu 98 anos e nove meses. Testemunha vivente de quase todo o século XX.',
    achievements: [
      'Nascida no ano da Semana de Arte Moderna',
      'Viveu através da Era Vargas, Ditadura Militar e Redemocratização',
      'Guardiã da memória familiar',
      'Faleceu em 31 de julho de 2021',
    ],
    details:
      'Bisneta de João Antônio Garcez Palha Filho, representou a consolidação definitiva da família no Brasil.',
  },
  {
    year: '1956',
    title: 'Humberto Garcez Palha da Silva',
    subtitle: '5ª Geração Brasileira',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascido em 27 de outubro de 1956, filho de Zilka. Viveu as transformações do Brasil moderno.',
    achievements: [
      'Nascido durante o governo JK',
      'Testemunhou a construção de Brasília',
      'Atravessou a ditadura e redemocratização',
    ],
    details: 'Cresceu em período de transformações aceleradas: desenvolvimentismo, ditadura militar e abertura política.',
  },
  {
    year: '1986',
    title: 'Leonardo Mendonça Palha da Silva',
    subtitle: '6ª Geração Brasileira - Fundador do Escritório',
    location: 'Rio de Janeiro, Brasil',
    description:
      'Nascido em 24 de fevereiro de 1986, representa a síntese entre herança histórica e excelência profissional contemporânea.',
    achievements: [
      'Advogado inscrito na OAB/RJ',
      'Perito Judicial credenciado pelo CONPEJ/RJ',
      'Corretor de Imóveis com CRECI/RJ',
      'Fundador da Garcez Palha Consultoria Jurídica & Pericial',
      'União de tradição nobiliárquica com expertise jurídica contemporânea',
    ],
    details:
      'Descendente direto de Viscondes, Barões e Governadores coloniais. Sua formação jurídica conecta-se à tradição de serviço público e justiça que caracterizou os Garcez Palha por séculos.',
  },
]

const familyValues = [
  {
    icon: Crown,
    title: 'Excelência no Serviço',
    description:
      'Desde os Tesoureiros Gerais até advogados contemporâneos, sempre o mais alto padrão de desempenho.',
  },
  {
    icon: Shield,
    title: 'Integridade e Honra',
    description:
      'Múltiplos títulos de Fidalgo da Casa Real exigiam conduta irrepreensível. Tradição que perpassa gerações.',
  },
  {
    icon: Globe,
    title: 'Visão e Inovação',
    description:
      'Cândido José modernizou Goa; Tomás defendeu línguas oprimidas. Capacidade de antecipar necessidades.',
  },
  {
    icon: Scale,
    title: 'Compromisso com Justiça',
    description:
      'Do Supremo Conselho de Justiça Militar à defesa de culturas oprimidas, sempre do lado da justiça.',
  },
  {
    icon: BookOpen,
    title: 'Educação e Conhecimento',
    description:
      'Professores, autores e educadores. Conhecimento como fundamento de contribuição social.',
  },
]

export default function HistoriaPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            A Família Garcez Palha
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            364 Anos de Tradição, Nobreza e Excelência
          </p>
          <p className="text-lg text-muted-foreground">
            Uma linhagem luso-brasileira com raízes documentadas na nobreza portuguesa desde o século XVII,
            atuação distinta em três continentes: Portugal, Índia Portuguesa e Brasil.
          </p>
        </div>

        {/* Intro Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Tradição desde 1661</CardTitle>
              <CardDescription className="text-base">
                Excelência desde sempre | www.garcezpalha.com
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <p>
                A linhagem GARCEZ PALHA representa uma das mais notáveis dinastias luso-brasileiras,
                com raízes documentadas na nobreza portuguesa desde o século XVII. Durante mais de
                <strong> 350 anos</strong>, membros desta família serviram como <strong>governadores coloniais,
                viscondes, barões, capitães militares, engenheiros, educadores e defensores culturais</strong>,
                deixando legado indelével em Portugal, na Índia Portuguesa (Goa) e no Brasil.
              </p>
              <p>
                Esta herança histórica fundamenta hoje a tradição de excelência e serviço que caracteriza
                a <strong>Garcez Palha Consultoria Jurídica & Pericial</strong>, conectando o prestígio ancestral à
                expertise jurídica contemporânea.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Origem dos Sobrenomes */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Origem dos Sobrenomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">GARCEZ</h4>
                <p className="text-muted-foreground">
                  Origem patronímica basco-navarra, derivando do nome próprio pré-romano "Garcia"
                  (do basco <em>hartze-a</em>, "o urso", ou <em>gartzea</em>, "o jovem"), com sufixo
                  "-ez" indicando "filho de Garcia". Primeira documentação remonta ao século IX,
                  com Íñigo Giménez García, rei de Sobrarbe e Navarra em 839.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">PALHA</h4>
                <p className="text-muted-foreground">
                  Provém do latim <em>palĕa</em> (caule seco de cereais). Apelido documentado desde
                  o século XIII, quando Vicente Palha viveu em Lisboa. A família original proveio da
                  Galiza, estabelecendo-se posteriormente em Portugal.
                </p>
              </div>
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="font-medium">
                  A união destes dois apelidos consolidou-se no final do século XVII, criando a linhagem
                  GARCEZ PALHA que se distinguiria por gerações de serviço à Coroa portuguesa.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Portugal */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="font-display text-4xl font-bold mb-12 text-center">
            Século XVII-XVIII: Portugal
          </h2>
          <div className="space-y-8">
            {timelinePortugal.map((event) => (
              <Card key={event.year} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {event.year}
                    </Badge>
                    <Badge variant="outline">{event.location}</Badge>
                  </div>
                  <CardTitle className="font-heading text-2xl">{event.title}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {event.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{event.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">Títulos e Cargos:</h5>
                      <ul className="space-y-1">
                        {event.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Detalhes:</h5>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Goa */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="font-display text-4xl font-bold mb-4 text-center">
            Séculos XVIII-XX: Índia Portuguesa
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            O ramo Mourão Garcez Palha estabeleceu-se em Ribandar, localidade estratégica entre
            Pangim e Velha Goa, residência de numerosos nobres portugueses que formaram uma verdadeira
            facção de elite.
          </p>
          <div className="space-y-8">
            {timelineGoa.map((event) => (
              <Card key={event.year} className="border-l-4 border-l-secondary">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {event.year}
                    </Badge>
                    <Badge variant="outline">{event.location}</Badge>
                  </div>
                  <CardTitle className="font-heading text-2xl">{event.title}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {event.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{event.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">Títulos e Realizações:</h5>
                      <ul className="space-y-1">
                        {event.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-secondary mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Detalhes:</h5>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Brasil */}
        <div className="max-w-5xl mx-auto mb-24">
          <h2 className="font-display text-4xl font-bold mb-4 text-center">
            Séculos XIX-XXI: Brasil
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            A conexão brasileira inicia-se com a transferência da Corte Portuguesa em 1808.
            A família estabeleceu-se solidamente na elite carioca durante o período imperial e
            adaptou-se às transformações da República.
          </p>
          <div className="space-y-8">
            {timelineBrasil.map((event) => (
              <Card key={event.year} className="border-l-4 border-l-green-600">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge className="bg-green-600 text-lg px-4 py-1">{event.year}</Badge>
                    <Badge variant="outline">{event.location}</Badge>
                  </div>
                  <CardTitle className="font-heading text-2xl">{event.title}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {event.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{event.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">Marcos:</h5>
                      <ul className="space-y-1">
                        {event.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Detalhes:</h5>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Valores Familiares */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="font-display text-4xl font-bold mb-12 text-center">
            Valores e Legado Perenes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyValues.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-heading text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legado */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="font-display text-3xl">O Legado Continua</CardTitle>
              <CardDescription className="text-base">
                Passado como fundamento do futuro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <p>
                Quando clientes do escritório <strong>Garcez Palha Consultoria Jurídica & Pericial</strong> contratam
                os serviços de Leonardo Mendonça Palha da Silva, conectam-se a esta extraordinária tradição
                de excelência que atravessa 364 anos.
              </p>
              <p>
                O sobrenome carrega peso de <strong>governadores coloniais, viscondes e barões,
                engenheiros que modernizaram cidades, educadores que formaram gerações, defensores
                culturais que preservaram línguas</strong>, e imigrantes que construíram nova pátria
                sem esquecer suas raízes.
              </p>
              <p className="font-semibold text-primary">
                Verdadeira nobreza não reside em títulos herdados, mas em valores praticados,
                excelência perseguida e legado construído geração após geração.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Números */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">1661</div>
              <div className="text-sm text-muted-foreground">Ano de Fundação</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-secondary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Séculos de História</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">Continentes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-secondary mb-2">6</div>
              <div className="text-sm text-muted-foreground">Gerações no Brasil</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Compromisso</div>
            </CardContent>
          </Card>
        </div>

        {/* Tagline Final */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-2xl font-display font-bold text-primary">
            Garcez Palha Consultoria Jurídica & Pericial
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Tradição desde 1661 | Excelência desde sempre
          </p>
          <p className="text-base text-muted-foreground mt-1">
            www.garcezpalha.com
          </p>
        </div>
      </div>
    </div>
  )
}
