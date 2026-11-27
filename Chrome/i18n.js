/*
 * Internationalisation for the WCAG lookup UI.
 *
 * Exposes window.i18n:
 *   languages                 registry of supported languages (see below)
 *   defaultLanguage           fallback language code ("en")
 *   supported()               array of supported language codes
 *   detectLanguage()          best supported match for the browser/computer locale
 *   resolveLanguage(pref)     "auto" -> detectLanguage(); a supported code -> itself
 *   getPreference()           Promise<"auto" | language code>   (stored choice)
 *   setPreference(pref)       Promise<boolean>                   (persists the choice)
 *   t(lang, key, params)      translated string, {placeholders} filled from params
 *
 * To add a language (e.g. French):
 *   1. Add an "fr" entry to `languages` below (nativeName + strings). Any key you
 *      leave out falls back to English.
 *   2. Add an "fr" name to each record in data-source.js ("names"), and an "fr"
 *      entry in window.wcagSources there if the language has its own WCAG
 *      translation to link to (otherwise the W3C English documents are used).
 *   3. Optionally add _locales/fr/messages.json for the extension name/description.
 */
window.i18n = (function () {
  'use strict';

  const DEFAULT_LANGUAGE = 'en';
  const AUTO = 'auto';
  const STORAGE_KEY = 'lookupWcagLanguage';

  const languages = {
    en: {
      nativeName: 'English',
      strings: {
        pageTitle: 'Look up WCAG SCs (WCAG Success Criteria)',
        title: 'Look up WCAG Success Criteria',
        language: 'Language',
        languageAuto: 'Automatic ({language})',
        searchPlaceholder: 'Type to search/filter (e.g., "images", "keyboard", "1.1.1")...',
        filtersHint: 'Filters for WCAG level and version are above this input',
        filtersLabel: 'Filter by level/version',
        levelLegend: 'Level:',
        versionLegend: 'Version:',
        all: 'All',
        listLabel: 'WCAG Success Criteria',
        noResults: 'No WCAG SC found that matches this filtering',
        selected: 'Selected:',
        levelBadge: '(Level {level})',
        'category.Perceivable': 'Perceivable',
        'category.Operable': 'Operable',
        'category.Understandable': 'Understandable',
        'category.Robust': 'Robust',
        // {num} = SC number, {name} = SC name in this language
        scTitle: 'WCAG 2.2 Success Criterion {num} {name}',
        scLabel: 'SC {num} {name}',
        understandingLabel: 'Understanding {sc}',
        normativeLegend: 'Normative docs:',
        understandingLegend: 'Understanding docs:',
        // {key} = keyboard shortcut
        copyMarkdown: 'Copy Markdown [{key}]',
        copyHtml: 'Copy HTML [{key}]',
        goToPage: 'Go to page ({key})',
        copyNormativeMarkdownLong: 'Copy Normative doc as Markdown Link ({key})',
        copyNormativeHtmlLong: 'Copy Normative doc as HTML Link ({key})',
        goToNormativeLong: 'Go to Normative doc ({key})',
        copyUnderstandingMarkdownLong: 'Copy Understanding doc as Markdown Link ({key})',
        copyUnderstandingHtmlLong: 'Copy Understanding doc as HTML Link ({key})',
        goToUnderstandingLong: 'Go to Understanding doc ({key})',
        close: 'Close (Escape)',
        startAgain: 'Start again',
        copied: 'Copied to clipboard!',
        copyFailed: 'Could not copy to clipboard',
        copyFailedDetail: 'Details pasted to console'
      }
    },

    ja: {
      nativeName: '日本語',
      strings: {
        pageTitle: 'WCAG 達成基準の検索 (Look up WCAG SCs)',
        title: 'WCAG 達成基準を検索',
        language: '言語',
        languageAuto: '自動 ({language})',
        searchPlaceholder: '検索・絞り込み (例: "画像", "キーボード", "1.1.1")...',
        filtersHint: 'WCAG のレベルとバージョンの絞り込みは、この入力欄の上にあります',
        filtersLabel: 'レベル・バージョンで絞り込み',
        levelLegend: 'レベル:',
        versionLegend: 'バージョン:',
        all: 'すべて',
        listLabel: 'WCAG 達成基準',
        noResults: '条件に一致する WCAG 達成基準は見つかりませんでした',
        selected: '選択中:',
        levelBadge: '(レベル {level})',
        'category.Perceivable': '知覚可能',
        'category.Operable': '操作可能',
        'category.Understandable': '理解可能',
        'category.Robust': '堅牢',
        scTitle: 'WCAG 2.2 達成基準 {num} {name}',
        scLabel: '達成基準 {num} {name}',
        understandingLabel: '{sc}を理解する',
        normativeLegend: '規範文書 (WCAG 本文):',
        understandingLegend: 'Understanding 文書:',
        copyMarkdown: 'Markdown をコピー [{key}]',
        copyHtml: 'HTML をコピー [{key}]',
        goToPage: 'ページを開く ({key})',
        copyNormativeMarkdownLong: '規範文書のリンクを Markdown 形式でコピー ({key})',
        copyNormativeHtmlLong: '規範文書のリンクを HTML 形式でコピー ({key})',
        goToNormativeLong: '規範文書を開く ({key})',
        copyUnderstandingMarkdownLong: 'Understanding 文書のリンクを Markdown 形式でコピー ({key})',
        copyUnderstandingHtmlLong: 'Understanding 文書のリンクを HTML 形式でコピー ({key})',
        goToUnderstandingLong: 'Understanding 文書を開く ({key})',
        close: '閉じる (Escape)',
        startAgain: 'やり直す',
        copied: 'クリップボードにコピーしました',
        copyFailed: 'クリップボードにコピーできませんでした',
        copyFailedDetail: '内容をコンソールに出力しました'
      }
    }
  };

  // --- Browser extension API (Firefox: `browser`, Chrome: `chrome`) ---------------
  function extensionApi() {
    try {
      if (typeof browser !== 'undefined' && browser.runtime) return browser;
      if (typeof chrome !== 'undefined' && chrome.runtime) return chrome;
    } catch (e) { /* ignore */ }
    return null;
  }

  function supported() {
    return Object.keys(languages);
  }

  // --- Locale detection --------------------------------------------------------
  // Order: the browser's UI language, then the user's preferred languages, then the
  // runtime default locale. The first one whose primary subtag we support wins
  // ("ja-JP" -> "ja").
  function candidateLocales() {
    const list = [];
    try {
      const api = extensionApi();
      if (api && api.i18n && api.i18n.getUILanguage) list.push(api.i18n.getUILanguage());
    } catch (e) { /* ignore */ }
    try { if (navigator.languages) list.push.apply(list, navigator.languages); } catch (e) { /* ignore */ }
    try { if (navigator.language) list.push(navigator.language); } catch (e) { /* ignore */ }
    try { list.push(Intl.DateTimeFormat().resolvedOptions().locale); } catch (e) { /* ignore */ }
    return list.filter(Boolean);
  }

  function detectLanguage() {
    const codes = supported();
    const candidates = candidateLocales();
    for (let i = 0; i < candidates.length; i++) {
      const primary = String(candidates[i]).toLowerCase().split(/[-_]/)[0];
      if (codes.indexOf(primary) !== -1) return primary;
    }
    return DEFAULT_LANGUAGE;
  }

  function isValidPreference(value) {
    return value === AUTO || supported().indexOf(value) !== -1;
  }

  function resolveLanguage(preference) {
    return preference && preference !== AUTO && languages[preference] ? preference : detectLanguage();
  }

  // --- Persisting the manual choice ----------------------------------------------
  // Uses the extension's storage (shared by every page, unlike the page's own
  // localStorage, which the Firefox content script would otherwise see per-site).
  function storageArea() {
    const api = extensionApi();
    return api && api.storage && api.storage.local ? api.storage.local : null;
  }

  async function getPreference() {
    try {
      const area = storageArea();
      let value;
      if (area) {
        const result = await area.get(STORAGE_KEY);
        value = result && result[STORAGE_KEY];
      } else {
        value = window.localStorage.getItem(STORAGE_KEY);
      }
      return isValidPreference(value) ? value : AUTO;
    } catch (e) {
      return AUTO;
    }
  }

  async function setPreference(preference) {
    if (!isValidPreference(preference)) return false;
    try {
      const area = storageArea();
      if (area) {
        await area.set({ [STORAGE_KEY]: preference });
      } else {
        window.localStorage.setItem(STORAGE_KEY, preference);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Translation lookup --------------------------------------------------------
  function t(lang, key, params) {
    const entry = languages[lang] || languages[DEFAULT_LANGUAGE];
    let text = entry.strings[key];
    if (text === undefined) text = languages[DEFAULT_LANGUAGE].strings[key];
    if (text === undefined) return key;
    if (params) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return params[name] !== undefined ? params[name] : match;
      });
    }
    return text;
  }

  return {
    languages: languages,
    defaultLanguage: DEFAULT_LANGUAGE,
    supported: supported,
    detectLanguage: detectLanguage,
    resolveLanguage: resolveLanguage,
    getPreference: getPreference,
    setPreference: setPreference,
    t: t
  };
})();
