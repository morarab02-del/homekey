/* Inline SVG sprite for listing photos / gallery images.
   Injected into every page before cards render, so <use href="#art-*"> works offline. */
window.ZILLOW_SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="art-classic" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="var(--art-sky)"/>
    <rect y="238" width="400" height="62" fill="var(--art-lawn)"/>
    <circle cx="344" cy="58" r="30" fill="#ffffff" opacity=".7"/>
    <rect x="52" y="196" width="12" height="46" fill="#8a6a4c"/>
    <circle cx="58" cy="180" r="34" fill="var(--art-tree)"/>
    <circle cx="36" cy="200" r="22" fill="var(--art-tree-dark)"/>
    <path d="M84,138 L200,66 L316,138 Z" fill="var(--art-roof)"/>
    <rect x="96" y="138" width="208" height="104" fill="var(--art-wall)"/>
    <rect x="270" y="88" width="20" height="36" fill="var(--art-roof)"/>
    <rect x="180" y="176" width="40" height="66" rx="2" fill="var(--art-door)"/>
    <circle cx="212" cy="208" r="3" fill="#ffffff" opacity=".85"/>
    <g fill="var(--art-window)">
      <rect x="116" y="158" width="50" height="44" rx="2"/>
      <rect x="234" y="158" width="50" height="44" rx="2"/>
    </g>
    <g stroke="#ffffff" stroke-width="3" opacity=".8">
      <path d="M141,158 V202"/><path d="M116,180 H166"/>
      <path d="M259,158 V202"/><path d="M234,180 H284"/>
    </g>
    <path d="M186,242 L214,242 L250,300 L146,300 Z" fill="#d8dde4"/>
  </symbol>

  <symbol id="art-modern" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="var(--art-sky)"/>
    <rect y="238" width="400" height="62" fill="var(--art-lawn)"/>
    <circle cx="60" cy="54" r="28" fill="#ffffff" opacity=".7"/>
    <rect x="70" y="118" width="258" height="124" fill="var(--art-wall)"/>
    <path d="M62,118 L199,72 L336,118 Z" fill="var(--art-roof)"/>
    <rect x="70" y="118" width="258" height="8" fill="#00000010"/>
    <g fill="var(--art-window)">
      <rect x="94" y="140" width="86" height="76" rx="2"/>
      <rect x="196" y="140" width="110" height="76" rx="2"/>
    </g>
    <g stroke="#ffffff" stroke-width="3" opacity=".7">
      <path d="M137,140 V216"/><path d="M196,178 H306"/>
    </g>
    <rect x="330" y="150" width="34" height="92" fill="var(--art-wall)"/>
    <rect x="336" y="160" width="22" height="70" fill="var(--art-window)"/>
    <rect x="308" y="196" width="14" height="46" fill="var(--art-door)"/>
    <path d="M92,242 L112,242 L128,300 L74,300 Z" fill="#d8dde4"/>
  </symbol>

  <symbol id="art-townhouse" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="var(--art-sky)"/>
    <rect y="238" width="400" height="62" fill="var(--art-lawn)"/>
    <g>
      <rect x="96" y="112" width="92" height="130" fill="var(--art-wall)"/>
      <path d="M88,112 L142,66 L196,112 Z" fill="var(--art-roof)"/>
      <rect x="114" y="136" width="26" height="30" fill="var(--art-window)"/>
      <rect x="146" y="136" width="26" height="30" fill="var(--art-window)"/>
      <rect x="114" y="182" width="26" height="30" fill="var(--art-window)"/>
      <rect x="146" y="182" width="26" height="30" fill="var(--art-window)"/>
      <rect x="130" y="212" width="24" height="30" fill="var(--art-door)"/>
    </g>
    <g>
      <rect x="212" y="112" width="92" height="130" fill="var(--art-wall)"/>
      <path d="M204,112 L258,66 L312,112 Z" fill="var(--art-roof)"/>
      <rect x="230" y="136" width="26" height="30" fill="var(--art-window)"/>
      <rect x="262" y="136" width="26" height="30" fill="var(--art-window)"/>
      <rect x="230" y="182" width="26" height="30" fill="var(--art-window)"/>
      <rect x="262" y="182" width="26" height="30" fill="var(--art-window)"/>
      <rect x="246" y="212" width="24" height="30" fill="var(--art-door)"/>
    </g>
    <g stroke="#ffffff" stroke-width="2.5" opacity=".7">
      <path d="M127,136 V166"/><path d="M159,136 V166"/><path d="M243,136 V166"/><path d="M275,136 V166"/>
    </g>
    <path d="M132,242 L154,242 L162,300 L126,300 Z" fill="#d8dde4"/>
    <path d="M248,242 L270,242 L278,300 L242,300 Z" fill="#d8dde4"/>
  </symbol>

  <symbol id="art-apartment" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="var(--art-sky)"/>
    <rect y="238" width="400" height="62" fill="var(--art-lawn)"/>
    <rect x="88" y="52" width="224" height="190" fill="var(--art-wall)"/>
    <rect x="88" y="52" width="224" height="10" fill="var(--art-roof)"/>
    <g fill="var(--art-window)">
      <rect x="110" y="80" width="42" height="30"/>
      <rect x="180" y="80" width="42" height="30"/>
      <rect x="250" y="80" width="42" height="30"/>
      <rect x="110" y="128" width="42" height="30"/>
      <rect x="180" y="128" width="42" height="30"/>
      <rect x="250" y="128" width="42" height="30"/>
      <rect x="110" y="176" width="42" height="30"/>
      <rect x="180" y="176" width="42" height="30"/>
      <rect x="250" y="176" width="42" height="30"/>
    </g>
    <g fill="var(--art-balcony)" opacity=".9">
      <rect x="102" y="112" width="58" height="6"/>
      <rect x="172" y="112" width="58" height="6"/>
      <rect x="242" y="112" width="58" height="6"/>
      <rect x="102" y="160" width="58" height="6"/>
      <rect x="172" y="160" width="58" height="6"/>
      <rect x="242" y="160" width="58" height="6"/>
    </g>
    <rect x="192" y="214" width="34" height="28" fill="var(--art-door)"/>
    <rect x="100" y="222" width="80" height="20" fill="#00000012"/>
    <rect x="228" y="222" width="80" height="20" fill="#00000012"/>
  </symbol>

  <symbol id="art-condo" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="var(--art-sky)"/>
    <rect y="238" width="400" height="62" fill="var(--art-lawn)"/>
    <circle cx="342" cy="56" r="26" fill="#ffffff" opacity=".7"/>
    <rect x="118" y="94" width="164" height="148" fill="var(--art-wall)"/>
    <path d="M110,94 L200,50 L290,94 Z" fill="var(--art-roof)"/>
    <g fill="var(--art-window)">
      <rect x="140" y="118" width="52" height="36" rx="2"/>
      <rect x="210" y="118" width="52" height="36" rx="2"/>
      <rect x="140" y="172" width="52" height="36" rx="2"/>
      <rect x="210" y="172" width="52" height="36" rx="2"/>
    </g>
    <g stroke="#ffffff" stroke-width="3" opacity=".7">
      <path d="M166,118 V154"/><path d="M140,136 H192"/>
      <path d="M236,118 V154"/><path d="M210,136 H262"/>
      <path d="M166,172 V208"/><path d="M140,190 H192"/>
      <path d="M236,172 V208"/><path d="M210,190 H262"/>
    </g>
    <rect x="186" y="212" width="30" height="30" fill="var(--art-door)"/>
    <path d="M186,242 L216,242 L244,300 L160,300 Z" fill="#d8dde4"/>
    <rect x="40" y="196" width="10" height="48" fill="#8a6a4c"/>
    <circle cx="45" cy="184" r="28" fill="var(--art-tree)"/>
  </symbol>
</svg>`;
