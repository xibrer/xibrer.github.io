export interface LocaleMessages {
  common: {
    all: string;
    copy: string;
    copied: string;
    copyToClipboard: string;
    viewProject: string;
    backToPublications: string;
  };
  navigation: {
    openMainMenu: string;
  };
  /** Short mono "eyebrow" labels that qualify a section without repeating its title. */
  sections: {
    profile: string;
    peerReviewed: string;
    openSource: string;
    updates: string;
  };
  theme: {
    system: string;
    light: string;
    dark: string;
    currentTheme: string;
    cycleTheme: string;
  };
  profile: {
    email: string;
    location: string;
    workAddress: string;
    click: string;
    googleMap: string;
    send: string;
    sendEmail: string;
    researchInterests: string;
    like: string;
    liked: string;
    thanks: string;
  };
  home: {
    about: string;
    news: string;
    selectedPublications: string;
    viewAll: string;
  };
  publications: {
    searchPlaceholder: string;
    filters: string;
    year: string;
    type: string;
    noResults: string;
    abstract: string;
    bibtex: string;
    code: string;
    pdf: string;
  };
  footer: {
    lastUpdated: string;
    builtWithPrism: string;
    contact: string;
    quickLinks: string;
  };
}

const en: LocaleMessages = {
  common: {
    all: 'All',
    copy: 'Copy',
    copied: 'Copied',
    copyToClipboard: 'Copy to clipboard',
    viewProject: 'View Project',
    backToPublications: 'Back to Publications',
  },
  navigation: {
    openMainMenu: 'Open main menu',
  },
  sections: {
    profile: 'Profile',
    peerReviewed: 'Peer-reviewed',
    openSource: 'Open source',
    updates: 'Updates',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    currentTheme: 'Current theme',
    cycleTheme: 'Click to cycle theme',
  },
  profile: {
    email: 'Email',
    location: 'Location',
    workAddress: 'Work Address',
    click: 'Click',
    googleMap: 'Google Map',
    send: 'Send',
    sendEmail: 'Send Email',
    researchInterests: 'Research Interests',
    like: 'Like',
    liked: 'Liked',
    thanks: 'Thanks!',
  },
  home: {
    about: 'About',
    news: 'News',
    selectedPublications: 'Selected Publications',
    viewAll: 'View All',
  },
  publications: {
    searchPlaceholder: 'Search publications...',
    filters: 'Filters',
    year: 'Year',
    type: 'Type',
    noResults: 'No publications found matching your criteria.',
    abstract: 'Abstract',
    bibtex: 'BibTeX',
    code: 'Code',
    pdf: 'PDF',
  },
  footer: {
    lastUpdated: 'Last updated',
    builtWithPrism: 'Built with PRISM',
    contact: 'Contact',
    quickLinks: 'Quick links',
  },
};

const zh: LocaleMessages = {
  common: {
    all: '全部',
    copy: '复制',
    copied: '已复制',
    copyToClipboard: '复制到剪贴板',
    viewProject: '查看项目',
    backToPublications: '返回论文列表',
  },
  navigation: {
    openMainMenu: '打开主菜单',
  },
  sections: {
    profile: '个人简介',
    peerReviewed: '同行评审',
    openSource: '开源',
    updates: '动态',
  },
  theme: {
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
    currentTheme: '当前主题',
    cycleTheme: '点击切换主题',
  },
  profile: {
    email: '邮箱',
    location: '地址',
    workAddress: '办公地址',
    click: '点击',
    googleMap: '谷歌地图',
    send: '发送',
    sendEmail: '发送邮件',
    researchInterests: '研究兴趣',
    like: '点赞',
    liked: '已点赞',
    thanks: '感谢支持！',
  },
  home: {
    about: '关于我',
    news: '动态',
    selectedPublications: '精选论文',
    viewAll: '查看全部',
  },
  publications: {
    searchPlaceholder: '搜索论文...',
    filters: '筛选',
    year: '年份',
    type: '类型',
    noResults: '没有找到符合条件的论文。',
    abstract: '摘要',
    bibtex: 'BibTeX',
    code: '代码',
    pdf: 'PDF',
  },
  footer: {
    lastUpdated: '最近更新',
    builtWithPrism: '由 PRISM 构建',
    contact: '联系方式',
    quickLinks: '快速导航',
  },
};

export const messages: Record<string, LocaleMessages> = {
  en,
  zh,
};

export function getMessages(locale: string): LocaleMessages {
  return messages[locale] || en;
}
