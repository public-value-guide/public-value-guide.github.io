// Shared book types and the part manifest.
//
// This module holds no topic prose — only the small metadata that both the
// server load functions and the Svelte components need, so it is safe to import
// from either side. The prose lives in `#lib/server/book.ts`, which is
// server-only and therefore never reaches a client bundle.

/** One entry in the table of contents. */
export type TopicRef = {
  /** URL slug, e.g. `1-1-introduction-to-public-value` or `preface`. */
  slug: string;
  /** Topic number as printed, e.g. `1.1`. Empty for front matter. */
  number: string;
  /** Topic title without the `Topic N.N — ` prefix. */
  title: string;
  /** Part number this topic belongs to; 0 for front matter. */
  part: number;
};

/** One of the book's five parts. */
export type Part = {
  number: number;
  title: string;
  /** The one-line framing shown under the part title. */
  tagline: string;
};

/** One locale the book is written in, per `locales/<slug>/topics/` upstream. */
export type Locale = {
  /** URL slug and directory name, e.g. `en-gb`. Matches the source repo's `locales/<slug>/`. */
  slug: string;
  /** Reader-facing label for the locale picker. */
  label: string;
};

/**
 * The book's locales. Kept in sync by hand with the source repo's `locales/`
 * directory (see spec/index.md §4a upstream). Add a locale here, and to
 * `#lib/i18n`'s `STRINGS`, only once `scripts/sync-content.sh` reports every
 * topic synced for it — an incomplete locale would otherwise offer a
 * picker option that 404s on whichever topic has no translation yet.
 *
 * Labels follow the book's own endonym-first convention: the language name
 * in its own language (its endonym), then a hyphen-separated region and, if
 * applicable, script/spelling variant, each also given in that language
 * (mirroring the English rows' "Great Britain", "Oxford", and so on). The
 * bare endonym with no suffix marks the CLDR "World" (`-001`) variant of a
 * language, matching the existing `en-001` row.
 */
export const LOCALES: Locale[] = [
  { slug: 'en-gb-oxendict', label: 'English - Great Britain - Oxford' },
  { slug: 'en-gb', label: 'English - Great Britain' },
  { slug: 'en-us', label: 'English - United States' },
  { slug: 'en-001', label: 'English' },
  { slug: 'cy-gb', label: 'Cymraeg - Cymru' },
  { slug: 'cy-001', label: 'Cymraeg' },
  { slug: 'es-001', label: 'Español' },
  { slug: 'fr-001', label: 'Français' },
  { slug: 'de-de', label: 'Deutsch - Deutschland' },
  { slug: 'zh-cn', label: '中文 - 中国大陆 - 简体' },
  { slug: 'ar-001', label: 'العربية' },
  { slug: 'hi-in', label: 'हिन्दी - भारत' },
  { slug: 'ja-jp', label: '日本語 - 日本' },
  { slug: 'ru-ru', label: 'Русский - Россия' },
  { slug: 'ko-kr', label: '한국어 - 대한민국' }
];

/**
 * Locale slugs, sorted by code, for validating a route param against the
 * known set and for the header picker's ordering. Sorting by code (rather
 * than keeping `LOCALES`' declared order) means a `-001` "world" variant
 * always sorts immediately before its regional siblings, since `-001` sorts
 * before any letter-starting suffix — e.g. `en-001` before `en-gb`.
 */
export const LOCALE_SLUGS: string[] = LOCALES.map((locale) => locale.slug).sort();

/**
 * The locale served at unprefixed reference pages (glossary, index) and used
 * for "browse the topics" links from locale-neutral pages. Oxford spelling
 * is the book's own house style (`spec/oxford-spelling.md` upstream) and its
 * canonical/source-of-truth locale (`spec/index.md` §4a), so it is the
 * natural default.
 */
export const DEFAULT_LOCALE = 'en-gb-oxendict';

/** Is `value` one of the book's known locale slugs? */
export function isLocale(value: string): boolean {
  return LOCALE_SLUGS.includes(value);
}

/**
 * The locale route that best matches a browser language tag, or `undefined`
 * when the book has nothing for that language.
 *
 * Tags are BCP 47 as browsers report them (`cy-GB`, `zh-Hans-CN`, `en_AU`):
 * case and `_` are normalized and a script subtag is dropped. An exact slug
 * wins (`cy-GB` -> `cy-gb`, `en-GB` -> `en-gb`). Otherwise the language's
 * international World locale is used (`en-AU` -> `en-001`, `fr-CA` ->
 * `fr-001`). With no World locale, the first locale in that language stands
 * in (`de-AT` -> `de-de`).
 */
export function localeForLanguageTag(tag: string): string | undefined {
  const parts = tag
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .split('-')
    .filter((part, index) => !(index > 0 && /^[a-z]{4}$/.test(part)));
  const [language, region] = parts;
  if (!language) return undefined;
  if (region && isLocale(`${language}-${region}`)) return `${language}-${region}`;
  if (isLocale(`${language}-001`)) return `${language}-001`;
  return LOCALE_SLUGS.find((slug) => slug.startsWith(`${language}-`));
}

/**
 * `LOCALES`, ordered for display: the default locale first, then grouped by
 * language (the locale slug's primary subtag, e.g. `en` in `en-gb-oxendict`),
 * with a `-001` "world" variant sorted before its regional siblings within
 * each group, then alphabetically by label. Grouping by slug rather than by
 * parsing the label text keeps this correct regardless of how a label is
 * worded. This does not fall out of a plain alphabetical sort on its own —
 * "English" (en-001) would sort before "English - Great Britain" (en-gb)
 * alphabetically, which is the wrong order for a "world" variant among its
 * regional siblings in the other direction — so the `-001` check is explicit.
 */
export function sortedLocales(locales: Locale[] = LOCALES): Locale[] {
  const languageOf = (locale: Locale) => locale.slug.split('-')[0];
  const [defaults, rest] = [
    locales.filter((locale) => locale.slug === DEFAULT_LOCALE),
    locales.filter((locale) => locale.slug !== DEFAULT_LOCALE)
  ];
  rest.sort((a, b) => {
    const language = languageOf(a).localeCompare(languageOf(b));
    if (language !== 0) return language;
    const aIsWorld = a.slug.endsWith('-001');
    const bIsWorld = b.slug.endsWith('-001');
    if (aIsWorld !== bIsWorld) return aIsWorld ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
  return [...defaults, ...rest];
}

/**
 * The five parts, in reading order. Kept in sync by hand with the source repo's
 * README — the topic files themselves record only their own number, not the
 * part groupings or taglines.
 */
export const PARTS: Part[] = [
  {
    number: 1,
    title: 'Foundations',
    tagline:
      'why public value is different from market value or democratic mandate alone, and the models that explain it'
  },
  {
    number: 2,
    title: 'Evaluation and Evidence',
    tagline: "the analyst's toolkit: valuing outcomes, building the case, testing claims"
  },
  {
    number: 3,
    title: 'Systems, Governance and Priorities',
    tagline: 'how public and social-sector organizations are structured, funded, and held accountable'
  },
  {
    number: 4,
    title: 'Global and Societal Issues',
    tagline:
      'public value beyond one institution: behaviour, trust, the planet, and the public conversation'
  },
  {
    number: 5,
    title: 'Digital, Software, and Technology',
    tagline:
      'the public value of technology: digital government, artificial intelligence, software, data, and cybersecurity'
  }
];

/**
 * `PARTS`' title and tagline, translated per locale. Keyed by part number.
 * English variants share the canonical English wording (`PARTS` itself);
 * only locales whose topic prose is actually translated get an entry here.
 * `cy-001` reuses `cy-gb`'s wording, matching the book repo's own decision to
 * reuse `cy-gb` prose for `cy-001` (see spec/index.md upstream).
 */
const PART_TRANSLATIONS: Record<string, Record<number, { title: string; tagline: string }>> = {
  'cy-gb': {
    1: {
      title: 'Sylfeini',
      tagline:
        "pam mae gwerth cyhoeddus yn wahanol i werth marchnad neu fandad democrataidd yn unig, a'r modelau sy'n ei egluro"
    },
    2: {
      title: 'Gwerthuso a Thystiolaeth',
      tagline: "pecyn offer y dadansoddwr: prisio canlyniadau, adeiladu'r achos, profi honiadau"
    },
    3: {
      title: 'Systemau, Llywodraethiant a Blaenoriaethau',
      tagline:
        "sut mae sefydliadau cyhoeddus a sector-cymdeithasol wedi'u strwythuro, eu hariannu, a'u dal yn atebol"
    },
    4: {
      title: 'Materion Byd-eang a Chymdeithasol',
      tagline:
        "gwerth cyhoeddus y tu hwnt i un sefydliad: ymddygiad, ymddiriedaeth, y blaned, a'r sgwrs gyhoeddus"
    },
    5: {
      title: 'Digidol, Meddalwedd, a Thechnoleg',
      tagline:
        "gwerth cyhoeddus technoleg: llywodraeth ddigidol, deallusrwydd artiffisial, meddalwedd, data, a seiberddiogelwch"
    }
  },
  'es-001': {
    1: {
      title: 'Fundamentos',
      tagline:
        'por qué el valor público difiere del valor de mercado o de un mandato democrático por sí solos, y los modelos que lo explican'
    },
    2: {
      title: 'Evaluación y Evidencia',
      tagline:
        'el conjunto de herramientas del analista: valorar los resultados, construir el caso, poner a prueba las afirmaciones'
    },
    3: {
      title: 'Sistemas, Gobernanza y Prioridades',
      tagline:
        'cómo se estructuran, financian y responsabilizan las organizaciones públicas y del sector social'
    },
    4: {
      title: 'Cuestiones Globales y Sociales',
      tagline:
        'el valor público más allá de una sola institución: el comportamiento, la confianza, el planeta y la conversación pública'
    },
    5: {
      title: 'Digital, Software y Tecnología',
      tagline:
        'el valor público de la tecnología: gobierno digital, inteligencia artificial, software, datos y ciberseguridad'
    }
  },
  'fr-001': {
    1: {
      title: 'Fondements',
      tagline:
        'pourquoi la valeur publique diffère de la seule valeur marchande ou du seul mandat démocratique, et les modèles qui l\'expliquent'
    },
    2: {
      title: 'Évaluation et données probantes',
      tagline:
        "la boîte à outils de l'analyste : valoriser les résultats, construire l'argumentaire, mettre les affirmations à l'épreuve"
    },
    3: {
      title: 'Systèmes, gouvernance et priorités',
      tagline:
        'comment les organisations publiques et du secteur social sont structurées, financées, et tenues responsables'
    },
    4: {
      title: 'Enjeux mondiaux et sociétaux',
      tagline:
        "la valeur publique au-delà d'une seule institution : comportement, confiance, la planète, et le débat public"
    },
    5: {
      title: 'Numérique, logiciels et technologie',
      tagline:
        "la valeur publique de la technologie : gouvernement numérique, intelligence artificielle, logiciels, données, et cybersécurité"
    }
  },
  'de-de': {
    1: {
      title: 'Grundlagen',
      tagline:
        'warum sich öffentlicher Wert von reinem Marktwert oder demokratischem Mandat unterscheidet, und die Modelle, die das erklären'
    },
    2: {
      title: 'Evaluation und Evidenz',
      tagline:
        'der Werkzeugkasten der Analystin: Ergebnisse bewerten, den Fall aufbauen, Behauptungen prüfen'
    },
    3: {
      title: 'Systeme, Governance, und Prioritäten',
      tagline:
        'wie öffentliche und Sozialsektor-Organisationen strukturiert, finanziert, und zur Rechenschaft gezogen werden'
    },
    4: {
      title: 'Globale und gesellschaftliche Fragen',
      tagline:
        'öffentlicher Wert jenseits einer Institution: Verhalten, Vertrauen, der Planet, und das öffentliche Gespräch'
    },
    5: {
      title: 'Digitales, Software, und Technologie',
      tagline:
        'der öffentliche Wert von Technologie: digitale Verwaltung, künstliche Intelligenz, Software, Daten, und Cybersicherheit'
    }
  },
  'zh-cn': {
    1: {
      title: '基础',
      tagline: '为什么公共价值不同于单纯的市场价值或民主授权,以及解释这一点的各种模型'
    },
    2: {
      title: '评估与证据',
      tagline: '分析者的工具箱:为成果估值、构建论证、检验主张'
    },
    3: {
      title: '体系、治理与优先事项',
      tagline: '公共与社会部门组织是如何被构建、被资助,并被追究责任的'
    },
    4: {
      title: '全球与社会议题',
      tagline: '超越单一机构的公共价值:行为、信任、地球,以及公共对话'
    },
    5: {
      title: '数字、软件与技术',
      tagline: '技术的公共价值:数字政府、人工智能、软件、数据与网络安全'
    }
  },
  'ar-001': {
    1: {
      title: 'الأسس',
      tagline: 'لماذا تختلف القيمة العامة عن قيمة السوق أو التفويض الديمقراطي وحدهما، والنماذج التي تفسر ذلك'
    },
    2: {
      title: 'التقييم والأدلة',
      tagline: 'مجموعة أدوات المحلل: تقدير قيمة النتائج، وبناء الحجة، واختبار الادعاءات'
    },
    3: {
      title: 'الأنظمة والحوكمة والأولويات',
      tagline: 'كيف تُبنى منظمات القطاعين العام والاجتماعي فعليًا، وكيف تُموَّل، وكيف تُساءَل'
    },
    4: {
      title: 'القضايا العالمية والمجتمعية',
      tagline: 'القيمة العامة بما يتجاوز مؤسسة واحدة: السلوك، والثقة، والكوكب، والحوار العام'
    },
    5: {
      title: 'الرقمنة والبرمجيات والتكنولوجيا',
      tagline:
        'القيمة العامة للتكنولوجيا: الحكومة الرقمية، والذكاء الاصطناعي، والبرمجيات، والبيانات، والأمن السيبراني'
    }
  },
  'hi-in': {
    1: {
      title: 'आधार',
      tagline: 'लोक मूल्य बाज़ार मूल्य या केवल लोकतांत्रिक जनादेश से अलग क्यों है, और वे मॉडल जो इसे स्पष्ट करते हैं'
    },
    2: {
      title: 'मूल्यांकन और साक्ष्य',
      tagline: 'विश्लेषक की उपकरण-पेटी: परिणामों का मूल्यांकन, मामले का निर्माण, दावों की परीक्षा'
    },
    3: {
      title: 'प्रणालियाँ, शासन और प्राथमिकताएँ',
      tagline: 'लोक और सामाजिक-क्षेत्र संस्थाएँ कैसे संरचित, वित्तपोषित, और जवाबदेह बनाई जाती हैं'
    },
    4: {
      title: 'वैश्विक और सामाजिक मुद्दे',
      tagline: 'एक संस्था से परे लोक मूल्य: व्यवहार, विश्वास, ग्रह, और लोक संवाद'
    },
    5: {
      title: 'डिजिटल, सॉफ़्टवेयर, और प्रौद्योगिकी',
      tagline: 'प्रौद्योगिकी का लोक मूल्य: डिजिटल सरकार, कृत्रिम बुद्धिमत्ता, सॉफ़्टवेयर, डेटा, और साइबर सुरक्षा'
    }
  },
  'ja-jp': {
    1: {
      title: '基礎',
      tagline: 'なぜ公共価値は市場価値や民主的負託だけとは異なるのか、そしてそれを説明するモデル'
    },
    2: {
      title: '評価とエビデンス',
      tagline: '成果を評価し、論拠を組み立て、主張を検証するための分析者の道具箱'
    },
    3: {
      title: 'システム、ガバナンス、優先順位',
      tagline: '公共・社会セクターの組織がどう構造化され、資金供給され、説明責任を果たしているか'
    },
    4: {
      title: 'グローバルかつ社会的な課題',
      tagline: '単一の組織を超えた公共価値:行動、信頼、地球、そして公共的言説'
    },
    5: {
      title: 'デジタル、ソフトウェア、テクノロジー',
      tagline: '技術の公共価値:デジタル政府、人工知能、ソフトウェア、データ、サイバーセキュリティ'
    }
  },
  'ru-ru': {
    1: {
      title: 'Основы',
      tagline:
        'чем общественная ценность отличается от рыночной стоимости или одного лишь демократического мандата и какие модели это объясняют'
    },
    2: {
      title: 'Оценка и доказательства',
      tagline:
        'инструментарий аналитика: оценка результатов, построение обоснования, проверка утверждений'
    },
    3: {
      title: 'Системы, управление и приоритеты',
      tagline:
        'как устроены, финансируются и подотчётны организации государственного и социального секторов'
    },
    4: {
      title: 'Глобальные и общественные вопросы',
      tagline:
        'общественная ценность за пределами одной организации: поведение, доверие, планета и публичный диалог'
    },
    5: {
      title: 'Цифровые технологии, программное обеспечение и технологии',
      tagline:
        'общественная ценность технологий: цифровое государство, искусственный интеллект, программное обеспечение, данные и кибербезопасность'
    }
  },
  'ko-kr': {
    1: {
      title: '기초',
      tagline: '공공가치가 시장 가치나 민주적 위임만으로와 어떻게 다른지, 그리고 이를 설명하는 모형'
    },
    2: {
      title: '평가와 증거',
      tagline: '분석가의 도구 상자: 성과의 가치 평가, 논거 구축, 주장 검증'
    },
    3: {
      title: '체제, 거버넌스, 우선순위',
      tagline: '공공 및 사회 부문 조직이 어떻게 구조화되고, 재원을 받고, 책임을 지는가'
    },
    4: {
      title: '글로벌 및 사회적 쟁점',
      tagline: '한 기관을 넘어선 공공가치: 행동, 신뢰, 지구, 공적 대화'
    },
    5: {
      title: '디지털, 소프트웨어, 기술',
      tagline: '기술의 공공가치: 디지털 정부, 인공지능, 소프트웨어, 데이터, 사이버 보안'
    }
  }
};
PART_TRANSLATIONS['cy-001'] = PART_TRANSLATIONS['cy-gb'];

/** `PARTS`, translated for `locale` where a translation exists, English otherwise. */
export function partsFor(locale: string): Part[] {
  const translation = PART_TRANSLATIONS[locale];
  if (!translation) return PARTS;
  return PARTS.map((part) => ({ ...part, ...(translation[part.number] ?? {}) }));
}

/** The site's public origin, for canonical URLs and the sitemap. */
export const SITE_URL = 'https://public-value-guide.github.io';

/** Where the book's source lives, for "edit this page" and provenance links. */
export const SOURCE_REPO = 'https://github.com/public-value-guide/public-value-guide';

/** Where the Claude Code skills for this guide live, in the source repo. */
export const SKILLS_REPO = `${SOURCE_REPO}/tree/main/skills`;
