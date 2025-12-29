/**
 * Legal Domain Agents Configuration
 * Consolidated configuration for all legal domain agents
 * Replaces 8 individual agent classes with config-driven approach
 */

import type { AgentConfigMap } from './agent-config'

export const LEGAL_AGENTS_CONFIG: AgentConfigMap = {
  'criminal-law': {
    id: 'criminal-law',
    name: 'Criminal Law Agent',
    description: 'Specializes in criminal defense and procedural law',
    systemPromptKey: 'CRIMINAL_LAW_SYSTEM_PROMPT',
    promptsModule: '../prompts/criminal-law-prompts',
    keywords: [
      // Criminal terms
      'criminal', 'penal', 'crime', 'delito',
      // Procedures
      'prisão', 'prisao', 'preso', 'presa', 'flagrante', 'preventiva',
      // Legal actions
      'habeas corpus', 'habeas', 'denúncia', 'denuncia', 'inquérito', 'inquerito',
      // Court
      'delegacia', 'audiência criminal', 'audiencia criminal', 'júri', 'juri',
      // Crimes
      'furto', 'roubo', 'homicídio', 'homicidio', 'latrocínio', 'latrocinio',
      'estelionato', 'receptação', 'recepta', 'ameaça', 'ameaca',
      'lesão corporal', 'lesao corporal', 'agressão', 'agressao',
      // Charges
      'calúnia', 'calunia', 'difamação', 'difamacao', 'injúria', 'injuria',
      // Traffic
      'embriaguez ao volante', 'dirigir bêbado', 'dirigir bebado',
      // Drugs
      'tráfico', 'trafico', 'droga', 'entorpecente',
      // Violence
      'violência doméstica', 'violencia domestica', 'maria da penha',
      // Process
      'defesa criminal', 'advogado criminal', 'intimação', 'intimacao',
      'sentença criminal', 'sentenca criminal', 'condenação', 'condenacao',
      // Freedom
      'liberdade provisória', 'liberdade provisoria', 'fiança', 'fianca',
      'medidas cautelares', 'progressão de regime', 'progressao de regime',
    ],
    tasks: [
      {
        id: 'analyzeCase',
        name: 'Analyze Case',
        promptKey: 'analyzeCase',
        methodName: 'analyzeCase',
        paramName: 'caseDetails',
        description: 'Analyze a criminal case',
      },
      {
        id: 'evaluateHabeasCorpus',
        name: 'Evaluate Habeas Corpus',
        promptKey: 'habeascorpus',
        methodName: 'evaluateHabeasCorpus',
        paramName: 'situationDetails',
        description: 'Evaluate Habeas Corpus feasibility',
      },
      {
        id: 'createDefenseStrategy',
        name: 'Create Defense Strategy',
        promptKey: 'defensestrategy',
        methodName: 'createDefenseStrategy',
        paramName: 'caseInfo',
        description: 'Create defense strategy',
      },
      {
        id: 'calculateSentence',
        name: 'Calculate Sentence',
        promptKey: 'sentenceCalculation',
        methodName: 'calculateSentence',
        paramName: 'crimeDetails',
        description: 'Calculate sentence',
      },
    ],
  },

  'health-insurance': {
    id: 'health-insurance',
    name: 'Health Insurance Agent',
    description: 'Specializes in health plan denials, bariatric surgery, TEA treatment, and medical coverage',
    systemPromptKey: 'HEALTH_INSURANCE_SYSTEM_PROMPT',
    promptsModule: '../prompts/health-insurance-prompts',
    keywords: [
      // Health plan terms
      'plano de saude', 'plano de saúde', 'plano', 'operadora',
      'convênio', 'convenio', 'convênio médico', 'convenio medico',
      'unimed', 'amil', 'bradesco saúde', 'bradesco saude',
      'sulamerica', 'sul america', 'notredame', 'notre dame',
      'ans', 'agência nacional', 'agencia nacional',
      // Denial/coverage terms
      'negou', 'negativa', 'recusou', 'recusa', 'não autorizou', 'nao autorizou',
      'não cobriu', 'nao cobriu', 'cobertura', 'autorização', 'autorizacao',
      'carta de negativa', 'negou o procedimento',
      // Procedures
      'cirurgia', 'procedimento', 'internação', 'internacao', 'uti',
      'quimioterapia', 'radioterapia', 'quimio', 'radio',
      'exame', 'consulta especialista',
      // Bariatric surgery
      'bariatrica', 'bariátrica', 'gastroplastia', 'redução de estomago', 'reducao de estomago',
      'cirurgia obesidade', 'bypass gástrico', 'bypass gastrico',
      'imc', 'obesidade', 'obesidade mórbida', 'obesidade morbida',
      // TEA (Autism)
      'tea', 'autismo', 'autista', 'espectro autista',
      'aba', 'terapia aba', 'fonoaudiologia', 'fono',
      'terapia ocupacional', 'to', 'psicopedagogia',
      'atraso no desenvolvimento', 'sessões', 'sessoes',
      // Medical urgency
      'urgência', 'urgencia', 'emergência', 'emergencia',
      'risco de vida', 'grave', 'preciso operar',
      // Insurance issues
      'carência', 'carencia', 'doença preexistente', 'doenca preexistente',
      'rol ans', 'não está no rol', 'nao esta no rol',
    ],
    tasks: [
      {
        id: 'analyzeDenial',
        name: 'Analyze Denial',
        promptKey: 'analyzeDenial',
        methodName: 'analyzeDenial',
        paramName: 'denialDetails',
        description: 'Analyze health plan denial',
      },
      {
        id: 'evaluateBariatric',
        name: 'Evaluate Bariatric Surgery',
        promptKey: 'evaluateBariatric',
        methodName: 'evaluateBariatric',
        paramName: 'patientInfo',
        description: 'Evaluate bariatric surgery case',
      },
      {
        id: 'analyzeTEA',
        name: 'Analyze TEA Treatment',
        promptKey: 'analyzeTEA',
        methodName: 'analyzeTEA',
        paramName: 'treatmentDetails',
        description: 'Analyze TEA treatment coverage',
      },
      {
        id: 'createAppeal',
        name: 'Create Appeal',
        promptKey: 'createAppeal',
        methodName: 'createAppeal',
        paramName: 'caseInfo',
        description: 'Create appeal against denial',
      },
    ],
  },

  'financial-protection': {
    id: 'financial-protection',
    name: 'Financial Protection Agent',
    description: 'Specializes in banking issues, fraud, account blocking, and consumer protection',
    systemPromptKey: 'FINANCIAL_PROTECTION_SYSTEM_PROMPT',
    promptsModule: '../prompts/financial-protection-prompts',
    keywords: [
      // Banking
      'banco', 'bancário', 'bancario', 'conta bancária', 'conta bancaria',
      'cartão', 'cartao', 'empréstimo', 'emprestimo', 'financiamento',
      // Issues
      'bloqueio', 'bloqueou', 'bloqueada', 'bloqueado',
      'fraude', 'golpe', 'pix', 'transferência', 'transferencia',
      'saque', 'débito', 'debito', 'não autorizei', 'nao autorizei',
      // Consumer protection
      'cdc', 'código de defesa', 'codigo de defesa', 'consumidor',
      'procon', 'bacen', 'banco central',
      // Fees
      'tarifa', 'taxa abusiva', 'juros', 'multa',
    ],
    tasks: [
      {
        id: 'analyzeBlocking',
        name: 'Analyze Account Blocking',
        promptKey: 'analyzeBlocking',
        methodName: 'analyzeBlocking',
        paramName: 'blockingDetails',
        description: 'Analyze account blocking case',
      },
      {
        id: 'evaluateFraud',
        name: 'Evaluate Fraud Case',
        promptKey: 'evaluateFraud',
        methodName: 'evaluateFraud',
        paramName: 'fraudDetails',
        description: 'Evaluate fraud or scam case',
      },
    ],
  },

  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate Agent',
    description: 'Specializes in property law, usucapião, eviction, and real estate transactions',
    systemPromptKey: 'REAL_ESTATE_SYSTEM_PROMPT',
    promptsModule: '../prompts/real-estate-prompts',
    keywords: [
      // Property
      'imóvel', 'imovel', 'casa', 'apartamento', 'terreno', 'propriedade',
      'posse', 'domínio', 'dominio',
      // Legal actions
      'usucapião', 'usucapiao', 'despejo', 'reintegração', 'reintegracao',
      'possessória', 'possessoria',
      // Transactions
      'compra', 'venda', 'aluguel', 'locação', 'locacao',
      'escritura', 'registro', 'matrícula', 'matricula',
      // Issues
      'invasão', 'invasao', 'inquilino', 'locador', 'locatário', 'locatario',
    ],
    tasks: [
      {
        id: 'evaluateUsucapiao',
        name: 'Evaluate Usucapião',
        promptKey: 'evaluateUsucapiao',
        methodName: 'evaluateUsucapiao',
        paramName: 'propertyDetails',
        description: 'Evaluate usucapião feasibility',
      },
      {
        id: 'analyzeEviction',
        name: 'Analyze Eviction',
        promptKey: 'analyzeEviction',
        methodName: 'analyzeEviction',
        paramName: 'evictionDetails',
        description: 'Analyze eviction case',
      },
    ],
  },

  'social-security': {
    id: 'social-security',
    name: 'Social Security Agent',
    description: 'Specializes in INSS benefits, retirement, disability, and social security law',
    systemPromptKey: 'SOCIAL_SECURITY_SYSTEM_PROMPT',
    promptsModule: '../prompts/social-security-prompts',
    keywords: [
      // INSS
      'inss', 'previdência', 'previdencia', 'aposentadoria',
      'benefício', 'beneficio', 'auxílio', 'auxilio',
      // Benefits
      'auxílio-doença', 'auxilio-doenca', 'auxilio doenca',
      'aposentadoria por invalidez', 'invalidez',
      'pensão', 'pensao', 'salário-maternidade', 'salario-maternidade',
      // Issues
      'negado', 'indeferido', 'cessado', 'suspenso',
      'perícia', 'pericia', 'médico perito', 'medico perito',
    ],
    tasks: [
      {
        id: 'analyzeRetirement',
        name: 'Analyze Retirement',
        promptKey: 'analyzeRetirement',
        methodName: 'analyzeRetirement',
        paramName: 'contributionDetails',
        description: 'Analyze retirement eligibility',
      },
      {
        id: 'evaluateDisability',
        name: 'Evaluate Disability',
        promptKey: 'evaluateDisability',
        methodName: 'evaluateDisability',
        paramName: 'disabilityDetails',
        description: 'Evaluate disability benefit case',
      },
    ],
  },

  'medical-expertise': {
    id: 'medical-expertise',
    name: 'Medical Expertise Agent',
    description: 'Specializes in medical error, malpractice, and health law',
    systemPromptKey: 'MEDICAL_EXPERTISE_SYSTEM_PROMPT',
    promptsModule: '../prompts/medical-expertise-prompts',
    keywords: [
      // Medical error
      'erro médico', 'erro medico', 'negligência médica', 'negligencia medica',
      'imperícia', 'impericia', 'malpractice',
      // Procedures
      'cirurgia mal feita', 'cirurgia errada', 'diagnóstico errado', 'diagnostico errado',
      'infecção hospitalar', 'infeccao hospitalar',
      // Professionals
      'médico', 'medico', 'hospital', 'clínica', 'clinica',
      'crm', 'conselho regional de medicina',
    ],
    tasks: [
      {
        id: 'evaluateMalpractice',
        name: 'Evaluate Malpractice',
        promptKey: 'evaluateMalpractice',
        methodName: 'evaluateMalpractice',
        paramName: 'caseDetails',
        description: 'Evaluate medical malpractice case',
      },
    ],
  },

  'document-forensics': {
    id: 'document-forensics',
    name: 'Document Forensics Agent',
    description: 'Specializes in document analysis, signature fraud, and forensic expertise',
    systemPromptKey: 'DOCUMENT_FORENSICS_SYSTEM_PROMPT',
    promptsModule: '../prompts/document-forensics-prompts',
    keywords: [
      // Forensics
      'perícia', 'pericia', 'laudo', 'grafotécnica', 'grafotecnica',
      'documentoscopia', 'falsificação', 'falsificacao',
      // Documents
      'assinatura', 'documento', 'contrato', 'falsificado', 'falso',
      // Issues
      'fraude documental', 'assinatura falsa', 'documento falso',
    ],
    tasks: [
      {
        id: 'analyzeDocument',
        name: 'Analyze Document',
        promptKey: 'analyzeDocument',
        methodName: 'analyzeDocument',
        paramName: 'documentDetails',
        description: 'Analyze document authenticity',
      },
    ],
  },

  'property-valuation': {
    id: 'property-valuation',
    name: 'Property Valuation Agent',
    description: 'Specializes in property appraisal and real estate valuation',
    systemPromptKey: 'PROPERTY_VALUATION_SYSTEM_PROMPT',
    promptsModule: '../prompts/property-valuation-prompts',
    keywords: [
      // Valuation
      'avaliação', 'avaliacao', 'laudo de avaliação', 'laudo de avaliacao',
      'valor de mercado', 'valor venal',
      // Property
      'imóvel', 'imovel', 'residencial', 'comercial',
    ],
    tasks: [
      {
        id: 'evaluateProperty',
        name: 'Evaluate Property',
        promptKey: 'evaluateProperty',
        methodName: 'evaluateProperty',
        paramName: 'propertyDetails',
        description: 'Evaluate property value',
      },
    ],
  },
}
