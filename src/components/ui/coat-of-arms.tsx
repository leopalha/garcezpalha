/**
 * Brasão Heráldico da Família Garcez Palha
 * Linhagem nobre luso-brasileira documentada desde 1661
 *
 * Elementos heráldicos:
 * - Escudo português vermelho carmesim (gules)
 * - Rio de prata com ondas (oceanos navegados)
 * - Torre medieval de prata (fortalezas coloniais)
 * - Cabeça de mouro (conquistas no Oriente)
 * - Leão rampante dourado com coroa (nobreza real)
 * - Elmo de cavaleiro de prata
 * - Coroa de Visconde (Visconde de Bucelas)
 * - Paquife vermelho e prata
 * - Listel com lema "Fidelidade e Excelência - Desde 1661"
 */

interface CoatOfArmsProps {
  width?: number
  height?: number
  variant?: 'full' | 'simplified' | 'minimal' | 'monochrome'
  className?: string
}

export function CoatOfArms({
  width = 800,
  height = 1000,
  variant = 'full',
  className = ''
}: CoatOfArmsProps) {

  // Color palette
  const colors = {
    gules: '#DC143C',      // Vermelho carmesim
    argent: '#F5F5F5',     // Prata/Branco
    azure: '#4682B4',      // Azul-turquesa
    or: '#FFD700',         // Ouro
    sable: '#000000',      // Negro
  }

  if (variant === 'minimal') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 800 1000"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          {/* Gradientes para profundidade */}
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.gules} stopOpacity="1" />
            <stop offset="100%" stopColor="#A01020" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Escudo simplificado */}
        <path
          d="M 400 100
             C 280 100, 200 150, 200 250
             L 200 600
             C 200 750, 280 850, 400 950
             C 520 850, 600 750, 600 600
             L 600 250
             C 600 150, 520 100, 400 100 Z"
          fill="url(#shieldGradient)"
          stroke={colors.or}
          strokeWidth="3"
        />

        {/* GP Central */}
        <text
          x="400"
          y="550"
          fontSize="200"
          fontWeight="bold"
          fontFamily="serif"
          fill={colors.argent}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          GP
        </text>
      </svg>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 800 1000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradientes para profundidade */}
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.gules} stopOpacity="1" />
          <stop offset="100%" stopColor="#A01020" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor={colors.argent} stopOpacity="1" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFED4E" stopOpacity="1" />
          <stop offset="50%" stopColor={colors.or} stopOpacity="1" />
          <stop offset="100%" stopColor="#CCAA00" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.argent} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.azure} stopOpacity="0.5" />
        </linearGradient>

        {/* Filtros para efeitos */}
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>

        <filter id="emboss">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="1" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ====== PAQUIFE (Manto ornamental) ====== */}
      {variant === 'full' && (
        <g id="mantling">
          {/* Lado esquerdo do manto */}
          <path
            d="M 350 120 Q 250 150, 180 220 Q 150 280, 140 350 Q 135 400, 150 450 Q 160 480, 180 500
               L 200 480 Q 190 450, 195 420 Q 200 380, 220 340 Q 250 280, 300 240 Z"
            fill={colors.gules}
            stroke={colors.sable}
            strokeWidth="1.5"
            opacity="0.9"
          />
          <path
            d="M 340 125 Q 260 155, 200 215 Q 175 270, 170 330 Q 168 370, 180 410
               L 195 395 Q 188 360, 195 325 Q 210 280, 250 245 Z"
            fill={colors.argent}
            stroke="none"
            opacity="0.7"
          />

          {/* Lado direito do manto */}
          <path
            d="M 450 120 Q 550 150, 620 220 Q 650 280, 660 350 Q 665 400, 650 450 Q 640 480, 620 500
               L 600 480 Q 610 450, 605 420 Q 600 380, 580 340 Q 550 280, 500 240 Z"
            fill={colors.gules}
            stroke={colors.sable}
            strokeWidth="1.5"
            opacity="0.9"
          />
          <path
            d="M 460 125 Q 540 155, 600 215 Q 625 270, 630 330 Q 632 370, 620 410
               L 605 395 Q 612 360, 605 325 Q 590 280, 550 245 Z"
            fill={colors.argent}
            stroke="none"
            opacity="0.7"
          />
        </g>
      )}

      {/* ====== ESCUDO PRINCIPAL ====== */}
      <g id="shield" filter="url(#shadow)">
        {/* Forma do escudo português */}
        <path
          d="M 400 150
             C 300 150, 240 190, 240 270
             L 240 600
             C 240 720, 300 810, 400 900
             C 500 810, 560 720, 560 600
             L 560 270
             C 560 190, 500 150, 400 150 Z"
          fill="url(#shieldGradient)"
          stroke={colors.or}
          strokeWidth="4"
        />
      </g>

      {/* ====== ELEMENTOS DO ESCUDO ====== */}
      <g id="shield-charges">

        {/* Rio de Prata (Base) - Ondas */}
        <g id="river">
          {/* Onda 1 (mais baixa) */}
          <path
            d="M 250 750 Q 280 730, 310 750 Q 340 770, 370 750 Q 400 730, 430 750 Q 460 770, 490 750 Q 520 730, 550 750 L 550 800 Q 520 820, 490 800 Q 460 780, 430 800 Q 400 820, 370 800 Q 340 780, 310 800 Q 280 820, 250 800 Z"
            fill="url(#waveGradient)"
            stroke={colors.azure}
            strokeWidth="1"
          />

          {/* Onda 2 */}
          <path
            d="M 260 680 Q 290 660, 320 680 Q 350 700, 380 680 Q 410 660, 440 680 Q 470 700, 500 680 Q 530 660, 540 680 L 540 730 Q 510 750, 480 730 Q 450 710, 420 730 Q 390 750, 360 730 Q 330 710, 300 730 Q 270 750, 260 730 Z"
            fill="url(#waveGradient)"
            stroke={colors.azure}
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Onda 3 (mais alta) */}
          <path
            d="M 270 610 Q 300 590, 330 610 Q 360 630, 390 610 Q 420 590, 450 610 Q 480 630, 510 610 Q 530 590, 530 610 L 530 660 Q 500 680, 470 660 Q 440 640, 410 660 Q 380 680, 350 660 Q 320 640, 290 660 Q 270 680, 270 660 Z"
            fill="url(#waveGradient)"
            stroke={colors.azure}
            strokeWidth="1"
            opacity="0.8"
          />
        </g>

        {/* Torre Medieval de Prata */}
        <g id="tower" transform="translate(350, 400)">
          {/* Corpo principal da torre */}
          <rect x="0" y="60" width="100" height="180" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="2"/>

          {/* Janelas */}
          <rect x="20" y="100" width="25" height="35" fill={colors.sable} rx="2"/>
          <rect x="55" y="100" width="25" height="35" fill={colors.sable} rx="2"/>
          <rect x="20" y="160" width="25" height="35" fill={colors.sable} rx="2"/>
          <rect x="55" y="160" width="25" height="35" fill={colors.sable} rx="2"/>

          {/* Porta em arco ogival */}
          <path
            d="M 30 240 L 30 210 Q 30 200, 35 195 L 50 180 L 65 195 Q 70 200, 70 210 L 70 240 Z"
            fill={colors.sable}
            stroke={colors.sable}
            strokeWidth="2"
          />

          {/* Ameias (topo) */}
          <rect x="-5" y="55" width="15" height="10" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>
          <rect x="20" y="55" width="15" height="10" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>
          <rect x="45" y="55" width="15" height="10" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>
          <rect x="70" y="55" width="15" height="10" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>
          <rect x="95" y="55" width="15" height="10" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>

          {/* Base do topo */}
          <rect x="-5" y="55" width="110" height="5" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="1.5"/>
        </g>

        {/* Leão Rampante (no topo da torre) */}
        <g id="lion" transform="translate(375, 410)">
          <path
            d="M 30 0 L 25 15 Q 20 25, 25 35 L 30 45 Q 35 48, 40 45 L 48 30 L 52 40 L 58 35 L 55 25 Q 60 20, 55 10 L 50 0 Z"
            fill="url(#goldGradient)"
            stroke={colors.sable}
            strokeWidth="1.5"
          />
          {/* Coroa real no leão */}
          <circle cx="40" cy="-2" r="6" fill={colors.or} stroke={colors.sable} strokeWidth="1"/>
          <circle cx="35" cy="-4" r="2" fill="white"/>
          <circle cx="40" cy="-5" r="2" fill="white"/>
          <circle cx="45" cy="-4" r="2" fill="white"/>
        </g>

        {/* Cabeça de Mouro */}
        <g id="moor-head" transform="translate(280, 480)">
          <circle cx="0" cy="0" r="25" fill={colors.sable} stroke={colors.sable} strokeWidth="1"/>
          <ellipse cx="-8" cy="-5" rx="3" ry="4" fill="white"/>
          <ellipse cx="-8" cy="-5" rx="1.5" ry="2" fill={colors.sable}/>
          <path d="M -15 -18 Q 0 -25, 15 -18" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M -10 5 Q 0 8, -5 12" stroke="white" strokeWidth="1.5" fill="none"/>
        </g>
      </g>

      {/* ====== ELMO E COROA ====== */}
      {variant === 'full' && (
        <g id="helmet-and-crown">
          {/* Elmo de Cavaleiro */}
          <g id="helmet" transform="translate(400, 80)" filter="url(#emboss)">
            <ellipse cx="0" cy="0" rx="45" ry="35" fill="url(#silverGradient)" stroke={colors.sable} strokeWidth="2"/>
            {/* Viseira */}
            <rect x="-30" y="-5" width="60" height="3" fill={colors.sable}/>
            <rect x="-30" y="2" width="60" height="3" fill={colors.sable}/>
            <rect x="-30" y="9" width="60" height="3" fill={colors.sable}/>
          </g>

          {/* Coroa de Visconde */}
          <g id="crown" transform="translate(400, 40)">
            {/* Aro da coroa */}
            <ellipse cx="0" cy="0" rx="50" ry="8" fill="url(#goldGradient)" stroke={colors.sable} strokeWidth="1.5"/>
            {/* Pérolas */}
            <circle cx="-40" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
            <circle cx="-25" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
            <circle cx="-10" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
            <circle cx="5" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
            <circle cx="20" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
            <circle cx="35" cy="-2" r="5" fill="white" stroke={colors.or} strokeWidth="1"/>
          </g>
        </g>
      )}

      {/* ====== LISTEL (Faixa com lema) ====== */}
      {(variant === 'full' || variant === 'simplified') && (
        <g id="motto-ribbon">
          {/* Fita ondulante */}
          <path
            d="M 150 920 Q 200 900, 250 920 Q 350 950, 450 920 Q 550 890, 650 920
               L 650 950 Q 550 920, 450 950 Q 350 980, 250 950 Q 200 930, 150 950 Z"
            fill={colors.azure}
            stroke={colors.or}
            strokeWidth="2"
            filter="url(#shadow)"
          />

          {/* Texto do lema - Linha 1 */}
          <text
            x="400"
            y="935"
            fontSize="22"
            fontWeight="bold"
            fontFamily="serif"
            fill={colors.or}
            textAnchor="middle"
            letterSpacing="2"
          >
            FIDELIDADE E EXCELÊNCIA
          </text>

          {/* Texto do lema - Linha 2 */}
          <text
            x="400"
            y="960"
            fontSize="18"
            fontWeight="normal"
            fontFamily="serif"
            fill={colors.or}
            textAnchor="middle"
            letterSpacing="1"
          >
            Desde 1661
          </text>
        </g>
      )}
    </svg>
  )
}
