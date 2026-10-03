// Per-locale UI chrome strings — everything on the page that is not the
// book's own prose: nav labels, breadcrumbs, picker labels, pagination,
// footer text.
//
// This exists because a reader who switches the language picker to, say,
// Welsh should not land on a chapter written in Welsh surrounded by English
// navigation. Chapter prose comes from the book's markdown (`#lib/server/book.js`);
// everything else comes from here, keyed by the same locale slugs as `LOCALES`
// in `#lib/book.js`.
//
// English variants (`en-gb`, `en-gb-oxendict`, `en-us`, `en-001`) differ only
// in spelling convention, matching the house style each variant uses for its
// chapter prose (see `spec/index.md` §4 upstream). `cy-001` reuses `cy-gb`'s
// strings verbatim — the same decision the book repo made for chapter prose,
// since the register difference between Welsh (Wales) and World Welsh is
// negligible for this formal content. `es-001` (World/neutral Spanish),
// `fr-001` (World/neutral French), `de-de` (German, Germany), `zh-cn`
// (Mainland China, Simplified script), `ar-001` (World/neutral Arabic),
// `hi-in` (Hindi, India), `ja-jp` (Japanese, Japan), and `ru-ru` (Russian, Russia) each get their own
// strings, in the same neutral register their chapter prose uses. `ar-001`
// needs no separate `dir`
// handling here — the Lily locale picker sets `dir="rtl"` on the document
// itself for any locale whose base language subtag is in its own RTL list,
// which already includes `ar` (see `isRtlLocale` in
// `@lilydesignsystem/svelte-locale-picker`).

import { resolveLocale } from '#lib/book.js';

export type UiStrings = {
  /** The site's own name, as shown in the header brand and used in page titles. */
  siteTitle: string;
  skipToContent: string;
  nav: { contents: string; glossary: string; index: string; source: string };
  breadcrumb: { home: string; contents: string };
  picker: { theme: string; locale: string; textSize: string; share: string };
  share: {
    emailLink: string;
    shareOnLinkedIn: string;
    shareOnReddit: string;
    shareOnBluesky: string;
    shareOnMastodon: string;
    copyLink: string;
    copied: string;
    copyFailed: string;
  };
  contents: {
    pageTitle: string;
    lead: string;
    readingIn: (label: string) => string;
    frontMatter: string;
    part: (n: number) => string;
    reference: string;
  };
  chapter: {
    chapterEyebrow: (n: string) => string;
    paginationLabel: string;
    onThisPage: string;
    previous: string;
    next: string;
  };
  footer: {
    tagline: string;
    sourceAndContributions: string;
    builtWith: string;
    ledBy: string;
  };
};

const en: UiStrings = {
  siteTitle: 'Public Value Guide',
  skipToContent: 'Skip to main content',
  nav: { contents: 'Contents', glossary: 'Glossary', index: 'Index', source: 'Source' },
  breadcrumb: { home: 'Home', contents: 'Contents' },
  picker: { theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' },
  share: {
    emailLink: 'Email Link',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareOnReddit: 'Share on Reddit',
    shareOnBluesky: 'Share on Bluesky',
    shareOnMastodon: 'Share on Mastodon',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    copyFailed: 'Copy failed — copy the address bar instead'
  },
  contents: {
    pageTitle: 'Contents',
    lead: 'Every chapter is self-contained. Read straight through for a course in public value, or go directly to the chapter that matches the decision in front of you.',
    readingIn: (label) => `Reading in ${label}. Switch language from the header picker.`,
    frontMatter: 'Front matter',
    part: (n) => `Part ${n}`,
    reference: 'Reference'
  },
  chapter: {
    chapterEyebrow: (n) => `Chapter ${n}`,
    paginationLabel: 'Chapter',
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next'
  },
  footer: {
    tagline:
      'a practical handbook of best practices for creating public value in government and the social sector, worldwide in scope.',
    sourceAndContributions: 'Source and contributions:',
    builtWith: 'Built with the',
    ledBy: 'Led by'
  }
};

// en-us differs from en-gb only in spelling; none of this chrome text
// contains a British/American spelling divergence, so it is identical to
// `en`. Kept as its own entry, rather than aliased, so a future chrome string
// that does diverge (e.g. "-ize"/"-ise") has an obvious place to change.
const enUs: UiStrings = en;

const enGb: UiStrings = en;

const enGbOxendict: UiStrings = en;

const en001: UiStrings = en;

const cyGb: UiStrings = {
  siteTitle: 'Canllaw Gwerth Cyhoeddus',
  skipToContent: 'Neidio i’r prif gynnwys',
  nav: { contents: 'Cynnwys', glossary: 'Geirfa', index: 'Mynegai', source: 'Ffynhonnell' },
  breadcrumb: { home: 'Hafan', contents: 'Cynnwys' },
  picker: { theme: 'Thema', locale: 'Iaith', textSize: 'Maint testun', share: 'Rhannu' },
  share: {
    emailLink: 'E-bostio’r Ddolen',
    shareOnLinkedIn: 'Rhannu ar LinkedIn',
    shareOnReddit: 'Rhannu ar Reddit',
    shareOnBluesky: 'Rhannu ar Bluesky',
    shareOnMastodon: 'Rhannu ar Mastodon',
    copyLink: 'Copïo’r Ddolen',
    copied: 'Wedi copïo!',
    copyFailed: 'Methodd y copïo — copïwch far y cyfeiriad yn lle hynny'
  },
  contents: {
    pageTitle: 'Cynnwys',
    lead: 'Mae pob pennod yn hunangynhwysol. Darllenwch drwyddo am gwrs mewn gwerth cyhoeddus, neu ewch yn syth i’r bennod sy’n cyfateb â’r penderfyniad o’ch blaen.',
    readingIn: (label) => `Yn darllen yn ${label}. Newidiwch iaith o’r dewisydd yn y pennawd.`,
    frontMatter: 'Deunydd blaen',
    part: (n) => `Rhan ${n}`,
    reference: 'Cyfeirnod'
  },
  chapter: {
    chapterEyebrow: (n) => `Pennod ${n}`,
    paginationLabel: 'Pennod',
    onThisPage: 'Ar y dudalen hon',
    previous: 'Blaenorol',
    next: 'Nesaf'
  },
  footer: {
    tagline:
      'llawlyfr ymarferol o arferion gorau ar gyfer creu gwerth cyhoeddus mewn llywodraeth a’r sector cymdeithasol, byd-eang ei gwmpas.',
    sourceAndContributions: 'Ffynhonnell a chyfraniadau:',
    builtWith: 'Wedi’i adeiladu â’r',
    ledBy: 'Dan arweiniad'
  }
};

// cy-001 reuses cy-gb's chrome strings verbatim, matching the book repo's own
// decision to reuse cy-gb prose for cy-001 (see spec/index.md upstream).
const cy001: UiStrings = cyGb;

const es001: UiStrings = {
  siteTitle: 'Guía de Valor Público',
  skipToContent: 'Saltar al contenido principal',
  nav: { contents: 'Contenido', glossary: 'Glosario', index: 'Índice', source: 'Fuente' },
  breadcrumb: { home: 'Inicio', contents: 'Contenido' },
  picker: { theme: 'Tema', locale: 'Idioma', textSize: 'Tamaño del texto', share: 'Compartir' },
  share: {
    emailLink: 'Enviar enlace por correo',
    shareOnLinkedIn: 'Compartir en LinkedIn',
    shareOnReddit: 'Compartir en Reddit',
    shareOnBluesky: 'Compartir en Bluesky',
    shareOnMastodon: 'Compartir en Mastodon',
    copyLink: 'Copiar enlace',
    copied: '¡Copiado!',
    copyFailed: 'Error al copiar — copie la barra de direcciones en su lugar'
  },
  contents: {
    pageTitle: 'Contenido',
    lead: 'Cada capítulo es autónomo. Léalo de principio a fin como un curso sobre valor público, o vaya directamente al capítulo que corresponda a la decisión que tiene ante usted.',
    readingIn: (label) => `Leyendo en ${label}. Cambie de idioma desde el selector del encabezado.`,
    frontMatter: 'Preliminares',
    part: (n) => `Parte ${n}`,
    reference: 'Referencia'
  },
  chapter: {
    chapterEyebrow: (n) => `Capítulo ${n}`,
    paginationLabel: 'Capítulo',
    onThisPage: 'En esta página',
    previous: 'Anterior',
    next: 'Siguiente'
  },
  footer: {
    tagline:
      'un manual práctico de buenas prácticas para crear valor público en el gobierno y el sector social, de alcance mundial.',
    sourceAndContributions: 'Fuente y contribuciones:',
    builtWith: 'Creado con el',
    ledBy: 'Dirigido por'
  }
};

const fr001: UiStrings = {
  siteTitle: 'Guide de la Valeur Publique',
  skipToContent: 'Passer au contenu principal',
  nav: { contents: 'Contenu', glossary: 'Glossaire', index: 'Index', source: 'Source' },
  breadcrumb: { home: 'Accueil', contents: 'Contenu' },
  picker: { theme: 'Thème', locale: 'Langue', textSize: 'Taille du texte', share: 'Partager' },
  share: {
    emailLink: 'Envoyer le lien par courriel',
    shareOnLinkedIn: 'Partager sur LinkedIn',
    shareOnReddit: 'Partager sur Reddit',
    shareOnBluesky: 'Partager sur Bluesky',
    shareOnMastodon: 'Partager sur Mastodon',
    copyLink: 'Copier le lien',
    copied: 'Copié !',
    copyFailed: 'Échec de la copie — copiez plutôt la barre d’adresse'
  },
  contents: {
    pageTitle: 'Contenu',
    lead: 'Chaque chapitre est autonome. Lisez-le d’un bout à l’autre comme un cours sur la valeur publique, ou allez directement au chapitre qui correspond à la décision qui vous occupe.',
    readingIn: (label) => `Lecture en ${label}. Changez de langue depuis le sélecteur d’en-tête.`,
    frontMatter: 'Matière liminaire',
    part: (n) => `Partie ${n}`,
    reference: 'Référence'
  },
  chapter: {
    chapterEyebrow: (n) => `Chapitre ${n}`,
    paginationLabel: 'Chapitre',
    onThisPage: 'Sur cette page',
    previous: 'Précédent',
    next: 'Suivant'
  },
  footer: {
    tagline:
      'un guide pratique des meilleures pratiques pour créer de la valeur publique dans le gouvernement et le secteur social, de portée mondiale.',
    sourceAndContributions: 'Source et contributions :',
    builtWith: 'Construit avec le',
    ledBy: 'Dirigé par'
  }
};

const deDe: UiStrings = {
  siteTitle: 'Leitfaden für öffentlichen Wert',
  skipToContent: 'Zum Hauptinhalt springen',
  nav: { contents: 'Inhalt', glossary: 'Glossar', index: 'Index', source: 'Quelle' },
  breadcrumb: { home: 'Start', contents: 'Inhalt' },
  picker: { theme: 'Thema', locale: 'Sprache', textSize: 'Textgröße', share: 'Teilen' },
  share: {
    emailLink: 'Link per E-Mail senden',
    shareOnLinkedIn: 'Auf LinkedIn teilen',
    shareOnReddit: 'Auf Reddit teilen',
    shareOnBluesky: 'Auf Bluesky teilen',
    shareOnMastodon: 'Auf Mastodon teilen',
    copyLink: 'Link kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Kopieren fehlgeschlagen — kopieren Sie stattdessen die Adressleiste'
  },
  contents: {
    pageTitle: 'Inhalt',
    lead: 'Jedes Kapitel ist eigenständig. Lesen Sie durchgehend für einen Kurs zu öffentlichem Wert, oder gehen Sie direkt zum Kapitel, das zur vor Ihnen liegenden Entscheidung passt.',
    readingIn: (label) => `Sie lesen auf ${label}. Sprache über die Kopfzeilenauswahl wechseln.`,
    frontMatter: 'Einleitende Seiten',
    part: (n) => `Teil ${n}`,
    reference: 'Referenz'
  },
  chapter: {
    chapterEyebrow: (n) => `Kapitel ${n}`,
    paginationLabel: 'Kapitel',
    onThisPage: 'Auf dieser Seite',
    previous: 'Zurück',
    next: 'Weiter'
  },
  footer: {
    tagline:
      'ein praktischer Leitfaden bewährter Praktiken zur Schaffung öffentlichen Wertes in Regierung und sozialem Sektor, weltweit angelegt.',
    sourceAndContributions: 'Quelle und Beiträge:',
    builtWith: 'Erstellt mit dem',
    ledBy: 'Geleitet von'
  }
};

const zhCn: UiStrings = {
  siteTitle: '公共价值指南',
  skipToContent: '跳转到主要内容',
  nav: { contents: '目录', glossary: '术语表', index: '索引', source: '源代码' },
  breadcrumb: { home: '首页', contents: '目录' },
  picker: { theme: '主题', locale: '语言', textSize: '字体大小', share: '分享' },
  share: {
    emailLink: '通过电子邮件发送链接',
    shareOnLinkedIn: '分享到 LinkedIn',
    shareOnReddit: '分享到 Reddit',
    shareOnBluesky: '分享到 Bluesky',
    shareOnMastodon: '分享到 Mastodon',
    copyLink: '复制链接',
    copied: '已复制!',
    copyFailed: '复制失败——请改为复制地址栏内容'
  },
  contents: {
    pageTitle: '目录',
    lead: '每一章都是独立完整的。可以从头到尾通读,作为一门关于公共价值的课程,也可以直接跳转到与你眼下的决策相匹配的那一章。',
    readingIn: (label) => `正在以${label}阅读。可从页眉的选择器切换语言。`,
    frontMatter: '前言部分',
    part: (n) => `第 ${n} 部分`,
    reference: '参考资料'
  },
  chapter: {
    chapterEyebrow: (n) => `第 ${n} 章`,
    paginationLabel: '章节',
    onThisPage: '本页内容',
    previous: '上一章',
    next: '下一章'
  },
  footer: {
    tagline: '一部面向全球的、关于在政府与社会部门中创造公共价值的最佳实践实用手册。',
    sourceAndContributions: '源代码与贡献:',
    builtWith: '构建工具:',
    ledBy: '负责人:'
  }
};

const ar001: UiStrings = {
  siteTitle: 'دليل القيمة العامة',
  skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  nav: { contents: 'المحتويات', glossary: 'المسرد', index: 'الفهرس', source: 'المصدر' },
  breadcrumb: { home: 'الرئيسية', contents: 'المحتويات' },
  picker: { theme: 'السمة', locale: 'اللغة', textSize: 'حجم النص', share: 'مشاركة' },
  share: {
    emailLink: 'إرسال الرابط بالبريد الإلكتروني',
    shareOnLinkedIn: 'مشاركة على LinkedIn',
    shareOnReddit: 'مشاركة على Reddit',
    shareOnBluesky: 'مشاركة على Bluesky',
    shareOnMastodon: 'مشاركة على Mastodon',
    copyLink: 'نسخ الرابط',
    copied: 'تم النسخ!',
    copyFailed: 'فشل النسخ — يُرجى نسخ شريط العنوان بدلًا من ذلك'
  },
  contents: {
    pageTitle: 'المحتويات',
    lead: 'كل فصل قائم بذاته. اقرأ الكتاب من البداية إلى النهاية كدورة في القيمة العامة، أو انتقل مباشرة إلى الفصل الذي يناسب القرار الذي أمامك.',
    readingIn: (label) => `تقرأ الآن بـ${label}. غيّر اللغة من منتقي الترويسة.`,
    frontMatter: 'المادة الاستهلالية',
    part: (n) => `الجزء ${n}`,
    reference: 'مرجع'
  },
  chapter: {
    chapterEyebrow: (n) => `الفصل ${n}`,
    paginationLabel: 'الفصل',
    onThisPage: 'في هذه الصفحة',
    previous: 'السابق',
    next: 'التالي'
  },
  footer: {
    tagline:
      'دليل عملي لأفضل الممارسات في خلق القيمة العامة داخل الحكومة والقطاع الاجتماعي، بنطاق عالمي.',
    sourceAndContributions: 'المصدر والمساهمات:',
    builtWith: 'بُني باستخدام',
    ledBy: 'بقيادة'
  }
};

const hiIn: UiStrings = {
  siteTitle: 'लोक मूल्य मार्गदर्शिका',
  skipToContent: 'मुख्य सामग्री पर जाएँ',
  nav: { contents: 'विषय-सूची', glossary: 'शब्दावली', index: 'अनुक्रमणिका', source: 'स्रोत' },
  breadcrumb: { home: 'मुखपृष्ठ', contents: 'विषय-सूची' },
  picker: { theme: 'थीम', locale: 'भाषा', textSize: 'पाठ का आकार', share: 'साझा करें' },
  share: {
    emailLink: 'ईमेल लिंक',
    shareOnLinkedIn: 'LinkedIn पर साझा करें',
    shareOnReddit: 'Reddit पर साझा करें',
    shareOnBluesky: 'Bluesky पर साझा करें',
    shareOnMastodon: 'Mastodon पर साझा करें',
    copyLink: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया!',
    copyFailed: 'कॉपी विफल — इसके बजाय पता बार से कॉपी करें'
  },
  contents: {
    pageTitle: 'विषय-सूची',
    lead: 'हर अध्याय स्वयं में पूर्ण है। लोक मूल्य पर एक पाठ्यक्रम के रूप में शुरू से अंत तक पढ़ें, या सीधे उस अध्याय पर जाएँ जो आपके सामने के निर्णय से मेल खाता है।',
    readingIn: (label) => `${label} में पढ़ रहे हैं। शीर्षलेख के चयनकर्ता से भाषा बदलें।`,
    frontMatter: 'प्रारंभिक सामग्री',
    part: (n) => `भाग ${n}`,
    reference: 'संदर्भ'
  },
  chapter: {
    chapterEyebrow: (n) => `अध्याय ${n}`,
    paginationLabel: 'अध्याय',
    onThisPage: 'इस पृष्ठ पर',
    previous: 'पिछला',
    next: 'अगला'
  },
  footer: {
    tagline:
      'सरकार और सामाजिक क्षेत्र में लोक मूल्य बनाने के लिए श्रेष्ठ व्यवहारों की एक व्यावहारिक पुस्तिका, विश्वव्यापी दायरे में।',
    sourceAndContributions: 'स्रोत और योगदान:',
    builtWith: 'इसके साथ बनाया गया',
    ledBy: 'नेतृत्व:'
  }
};

const jaJp: UiStrings = {
  siteTitle: '公共価値ガイド',
  skipToContent: 'メインコンテンツへスキップ',
  nav: { contents: '目次', glossary: '用語集', index: '索引', source: 'ソース' },
  breadcrumb: { home: 'ホーム', contents: '目次' },
  picker: { theme: 'テーマ', locale: '言語', textSize: '文字サイズ', share: '共有' },
  share: {
    emailLink: 'リンクをメールで送る',
    shareOnLinkedIn: 'LinkedInで共有',
    shareOnReddit: 'Redditで共有',
    shareOnBluesky: 'Blueskyで共有',
    shareOnMastodon: 'Mastodonで共有',
    copyLink: 'リンクをコピー',
    copied: 'コピーしました!',
    copyFailed: 'コピーに失敗しました — 代わりにアドレスバーからコピーしてください'
  },
  contents: {
    pageTitle: '目次',
    lead: '各章は独立して読めます。公共価値についての講座として最初から通読するか、目の前の決定に対応する章に直接進んでください。',
    readingIn: (label) => `${label}で読んでいます。ヘッダーの選択メニューから言語を切り替えられます。`,
    frontMatter: '前付け',
    part: (n) => `第${n}部`,
    reference: '参考資料'
  },
  chapter: {
    chapterEyebrow: (n) => `第${n}章`,
    paginationLabel: '章',
    onThisPage: 'このページの内容',
    previous: '前へ',
    next: '次へ'
  },
  footer: {
    tagline:
      '政府と社会セクターにおける公共価値の創出のための実践的なベストプラクティスの手引き。世界規模を範囲とする。',
    sourceAndContributions: 'ソースと貢献:',
    builtWith: '構築に使用:',
    ledBy: '主導:'
  }
};

const ruRu: UiStrings = {
  siteTitle: 'Руководство по общественной ценности',
  skipToContent: 'Перейти к основному содержимому',
  nav: { contents: 'Содержание', glossary: 'Глоссарий', index: 'Указатель', source: 'Исходный код' },
  breadcrumb: { home: 'Главная', contents: 'Содержание' },
  picker: { theme: 'Тема', locale: 'Язык', textSize: 'Размер текста', share: 'Поделиться' },
  share: {
    emailLink: 'Отправить ссылку по почте',
    shareOnLinkedIn: 'Поделиться в LinkedIn',
    shareOnReddit: 'Поделиться в Reddit',
    shareOnBluesky: 'Поделиться в Bluesky',
    shareOnMastodon: 'Поделиться в Mastodon',
    copyLink: 'Скопировать ссылку',
    copied: 'Скопировано!',
    copyFailed: 'Не удалось скопировать — скопируйте адрес из адресной строки'
  },
  contents: {
    pageTitle: 'Содержание',
    lead: 'Каждая глава самостоятельна. Читайте подряд, как курс по общественной ценности, или переходите сразу к главе, соответствующей решению, которое стоит перед вами.',
    readingIn: (label) => `Вы читаете на языке: ${label}. Язык можно сменить в переключателе в шапке сайта.`,
    frontMatter: 'Вступительные материалы',
    part: (n) => `Часть ${n}`,
    reference: 'Справочные материалы'
  },
  chapter: {
    chapterEyebrow: (n) => `Глава ${n}`,
    paginationLabel: 'Глава',
    onThisPage: 'На этой странице',
    previous: 'Назад',
    next: 'Далее'
  },
  footer: {
    tagline:
      'практическое руководство по лучшим практикам создания общественной ценности в государственном и социальном секторах, мировое по охвату.',
    sourceAndContributions: 'Исходный код и участие:',
    builtWith: 'Создано с помощью',
    ledBy: 'Руководитель проекта:'
  }
};

const STRINGS: Record<string, UiStrings> = {
  'en-gb-oxendict': enGbOxendict,
  'en-gb': enGb,
  'en-us': enUs,
  'en-001': en001,
  'cy-gb': cyGb,
  'cy-001': cy001,
  'es-001': es001,
  'fr-001': fr001,
  'de-de': deDe,
  'zh-cn': zhCn,
  'ar-001': ar001,
  'hi-in': hiIn,
  'ja-jp': jaJp,
  'ru-ru': ruRu
};

/** UI chrome strings for `locale`, falling back to English if the locale is unknown. */
export function ui(locale: string | undefined): UiStrings {
  return (locale && STRINGS[resolveLocale(locale)]) || en;
}
