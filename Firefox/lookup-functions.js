// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleDialog") {
    openDialog().catch(console.error);
  }
});

// Main function that creates or toggles the dialog
async function openDialog() {
  console.clear();
  if (!window.wcagData || !window.i18n) {
    console.error('WCAG data not loaded. Make sure i18n.js and data-source.js are included before this script.');
    alert('WCAG data not available. Please ensure the extension is properly installed.');
    return;
  }

  const wcagData = window.wcagData;

  // "auto" (follow the computer/browser locale) or a language code chosen by the user.
  // Loaded before anything else touches the page so the dialog is built in one go.
  let languagePreference = await i18n.getPreference();

  // Check for and remove existing dialog
  const existingShadowHost = document.getElementById('a11y-tools-shadow-host');
  if (existingShadowHost) {
    // Clean up existing dialog
    const elementsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
    elementsWithAriaHidden.forEach(element => {
      if (element !== existingShadowHost) {
        element.removeAttribute('aria-hidden');
      }
    });
    
    // Restore tabindex for elements that were made non-focusable
    const elementsWithNegativeTabindex = document.querySelectorAll('[tabindex="-1"]');
    elementsWithNegativeTabindex.forEach(element => {
      element.removeAttribute('tabindex');
    });
    
    // Remove the existing shadow host
    document.body.removeChild(existingShadowHost);
  }

  // Hard code view for now - change to a preferences option later
  let compactView = true;

  //remember element with focus
  const currentFocus = document.activeElement;

  let selectedItem = null;
  let currentSelection = -1;
  let notificationTimeout = null; // Store timeout for notification

  // Create shadow host element
  const shadowHost = document.createElement('div');
  shadowHost.setAttribute('id', 'a11y-tools-shadow-host');
  shadowHost.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
  `;

  // Create shadow root
  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  let sideBarOverrides='';
  let isFullPage = false;
  if (typeof openInSidebar !== 'undefined' && openInSidebar) {
    isFullPage = true;
    sideBarOverrides = `#a11y-tools-data-lookup {
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      top:0;
      bottom:0;
      outline:0;
      border:0;
    }
    #data-list {
      max-height: 70vh;
    }
  `;
  }

  // Add comprehensive reset styles to shadow DOM
  const shadowStyles = document.createElement('style');
  shadowStyles.textContent = `
    /* Reset all default styles */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      vertical-align: baseline;
      box-sizing: border-box;
      line-height: 1;
    }

    /* Basic styling for all elements */
    * {
      font-family: Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", Meiryo, sans-serif;
      color: inherit;
      background: transparent;
      text-decoration: none;
      list-style: none;
    }

    /* Specific component styles */
    #a11y-tools-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      pointer-events: all;
    }

    #a11y-tools-data-lookup {
      background: white;
      background: #dff3f3;
      color: black;
      position: fixed;
      top: 2em;
      left: 50%;
      transform: translate(-50%, 0);
      border: 2px solid #333;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 90vw;
      width: 60em;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      pointer-events: all;
    }

    #a11y-tools-data-lookup h1 {
      margin: 0;
      color: #333;
      font-size: 20px;
      font-weight: bold;
      line-height: 1.2;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px 20px;
      flex-wrap: wrap;
      margin: 0 0 15px 0;
    }

    .language-picker {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .language-picker label {
      font-weight: bold;
    }

    #a11y-tools-data-lookup select {
      background: white;
      color: black;
      border: 2px solid #007cba;
      border-radius: 5px;
      padding: 6px;
      font-size: 14px;
    }

    #a11y-tools-data-lookup select:focus {
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    #a11y-tools-data-lookup input[type="text"] {
      background: white;
      color: black;
      width: 100%;
      padding: 12px;
      border: 2px solid #007cba;
      font-size: 16px;
      margin-bottom: 16px;
      box-sizing: border-box;
      border-radius: 5px;
    }

    #a11y-tools-data-lookup input[type="text"]:focus {
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    #a11y-tools-data-lookup button {
      border-radius: 5px;
    }

    #a11y-tools-data-lookup button:focus {
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    #a11y-tools-data-lookup input[type="radio"]:focus {
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    .search-hint {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .filters-disclosure summary {
      outline:1px solid black;
      display:inline-block;
      padding:0.3em;
      border-radius:5px;
    }

    .filters-disclosure summary:focus {
      background:white;
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    .filters-disclosure {
      margin:1em 0;
      font-weight:bold;
    }

    .filters-icon {
      height:1em;
      display:inline-block;
      margin-right:0.5em;
    }

    .filters-label {
      font-size:1.2em;
    }

    .filters-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      padding:1em 0;
    }

    .filter-fieldset {
      border: 1px solid #ccc;
      padding: 10px;
      margin: 0;
      border-radius: 3px;
    }

    .filter-legend {
      font-weight: bold;
      padding: 0 5px;
    }

    .filter-label {
      display: inline-block;
      margin-right: 15px;
      cursor: pointer;
      line-height: 1.4;
    }

    .filter-radio {
      margin-right: 5px;
    }

    #data-list:empty {
      display:none!important;
    }
    #data-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #ccc;
      margin: 0 0 15px 0;
      padding: 0;
      list-style: none;
      background: #f9f9f9;
    }

    #data-list li {
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      background: white;
      line-height: 1.4;
    }

    #data-list li:hover,
    #data-list li.hover {
      background: #007cba;
    }

    #data-list li:hover *,
    #data-list li.hover * {
      color: white!important;
    }

    #selection-made {
      border: 1px solid #007cba;
      padding: 10px;
      margin-bottom: 15px;
      background: #f0f8ff;
      display: none;
      border-radius: 3px;
    }

    #selection-made strong {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .selection-text {
      font-family: monospace;
      font-size: 14px;
      line-height: 1.3;
    }

    #selection-made:focus {
      outline: 3px solid #007cba;
      outline-offset: 3px;
    }

    .buttons-container {
      display: none;
      gap: 10px;
      flex-wrap: wrap;
    }

    .buttons-container legend {
      font-weight: bold;
    }

    .action-button {
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 14px;
      margin: 5px 5px 5px 0;
      border-radius: 3px;
    }

    .normative {
      background: #007cba;
    }

    .understanding {
      background: #342773;
    }

    #a11y-tools-data-lookup button.understanding:focus {
      outline-color: #342773;
    }

    .action-button:hover {
      background: #005a8a;
    }

    .secondary-button {
      background: #2a233a;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
      border-radius: 3px;
    }

    .secondary-button:hover {
      background: #444;
    }
    .version {
      font-weight:bold;
    }
    .category {
      color:white;
      background:gray;
      padding:0.2em;
      font-size:0.8em;
      border-radius:5px;
      outline:1px solid white;
    }
    .Perceivable {
      color:navy;
    }
    .Operable {
      color:#295f19;
    }
    .Understandable {
      color:purple;
    }
    .Robust {
      color:darkred;
    }
    .category.Perceivable {
      background:navy;
      color:white;
    }
    .category.Operable {
      background:#295f19;
      color:white;
    }
    .category.Understandable {
      background:purple;
      color:white;
    }
    .category.Robust {
      background:darkred;
      color:white;
    }

    /* Notification panel styles */
    #notification-panel {
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #162650;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      border: 2px solid #03a9f4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      width:calc(100%-40px);
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      opacity: 0;
      transform: translateX(100%);
      pointer-events: all;
    }

    #notification-panel.show {
      opacity: 1;
      transform: translateX(0);
    }

    #notification-panel .notification-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #babae4;
    }

    #notification-panel .notification-content {
      font-family: monospace;
      background: rgba(255,255,255,0.1);
      padding: 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.2);
      word-break: break-all;
    }

    ${sideBarOverrides}
  `;

  // Store elements that should be hidden from AT
  const elementsToHide = [];
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (child !== shadowHost) {
      elementsToHide.push({
        element: child,
        originalAriaHidden: child.getAttribute('aria-hidden')
      });
      child.setAttribute('aria-hidden', 'true');
    }
  });
  
  // Store elements that can receive focus
  const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
  const focusableElements = Array.from(document.querySelectorAll(focusableSelectors));
  
  // Store original tabindex values and make elements non-focusable
  const originalTabIndices = [];
  focusableElements.forEach(element => {
    originalTabIndices.push({
      element: element,
      originalTabIndex: element.getAttribute('tabindex')
    });
    element.setAttribute('tabindex', '-1');
  });
  // ---------------------------------------------------------------------------
  // Language state
  // ---------------------------------------------------------------------------
  let currentLang = i18n.resolveLanguage(languagePreference);
  const t = (key, params) => i18n.t(currentLang, key, params);

  // Text-setting callbacks. bind() runs the callback now and again whenever the
  // language changes, so every piece of UI text is defined in exactly one place.
  const bindings = [];
  function bind(fn) {
    bindings.push(fn);
    fn();
  }

  const normalise = (s) => String(s).normalize('NFKC').toLowerCase(); // NFKC: full-width "１.１.１" matches "1.1.1"
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Language-specific view of the data (names, titles and the links to that language's documents)
  function buildItems(lang) {
    const defaultLang = i18n.defaultLanguage;
    const sources = window.wcagSources || {};
    const source = sources[lang] || sources[defaultLang];
    return wcagData.map(sc => {
      const slug = (sc.slugs && sc.slugs[lang]) || sc.slug;
      const name = sc.names[lang] || sc.names[defaultLang];
      const title = i18n.t(lang, 'scTitle', { num: sc.num, name: name });
      const label = i18n.t(lang, 'scLabel', { num: sc.num, name: name });
      // Also match the English name when browsing in another language
      const searchText = lang === defaultLang ? title : title + ' ' + sc.names[defaultLang];
      return {
        id: sc.num,
        level: sc.level,
        version: sc.version,
        category: sc.category,
        shortTitle: sc.num + ' ' + name,
        title: title,
        label: label,
        understandingLabel: i18n.t(lang, 'understandingLabel', { sc: label }),
        url: source.normativeBase + '#' + slug,
        understandingUrl: source.understandingBase + slug + source.understandingSuffix,
        searchText: normalise(searchText)
      };
    });
  }

  let items = buildItems(currentLang);

  // Create modal backdrop inside shadow DOM
  const modalBackdrop = document.createElement('div');
  modalBackdrop.setAttribute('id', 'a11y-tools-modal-backdrop');
  
  const dialog = document.createElement('div');
  if (!isFullPage) {
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
  }
  dialog.setAttribute('id', 'a11y-tools-data-lookup');
  dialog.setAttribute('aria-labelledby', 'a11y-tools-lookup-dialog-header');
  bind(() => dialog.setAttribute('lang', currentLang)); // so screen readers/fonts use the right language

  // In the side panel we own the whole document, so keep its title and lang in step too.
  // (Never touch the host page's document when running as an overlay.)
  if (isFullPage) {
    bind(() => {
      document.documentElement.lang = currentLang;
      document.title = t('pageTitle');
    });
  }

  const header = document.createElement('div');
  header.className = 'dialog-header';

  const title = document.createElement('h1');
  title.setAttribute('id', 'a11y-tools-lookup-dialog-header');
  bind(() => { title.textContent = t('title'); });

  // Language switcher
  const languagePicker = document.createElement('div');
  languagePicker.className = 'language-picker';

  const languageLabel = document.createElement('label');
  languageLabel.setAttribute('for', 'language-select');
  bind(() => { languageLabel.textContent = t('language'); });

  const languageSelect = document.createElement('select');
  languageSelect.setAttribute('id', 'language-select');

  function nativeName(code) {
    return i18n.languages[code].nativeName;
  }

  // Rebuilt on every language change because the "Automatic (…)" label is itself translated
  function populateLanguageSelect() {
    languageSelect.innerHTML = '';
    const auto = document.createElement('option');
    auto.value = 'auto';
    auto.textContent = t('languageAuto', { language: nativeName(i18n.detectLanguage()) });
    auto.lang = currentLang;
    languageSelect.appendChild(auto);
    i18n.supported().forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = nativeName(code);
      option.lang = code; // each language name is shown in (and announced as) its own language
      languageSelect.appendChild(option);
    });
    languageSelect.value = languagePreference;
  }
  bind(populateLanguageSelect);

  languageSelect.addEventListener('change', async () => {
    languagePreference = languageSelect.value;
    applyLanguage();
    await i18n.setPreference(languagePreference);
  });

  languagePicker.appendChild(languageLabel);
  languagePicker.appendChild(languageSelect);
  header.appendChild(title);
  header.appendChild(languagePicker);

  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-labelledby', 'a11y-tools-lookup-dialog-header');
  input.setAttribute('aria-controls', 'data-list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-describedby', 'search-hint filters-hint');
  bind(() => { input.placeholder = t('searchPlaceholder'); });
  
  const filtersHint = document.createElement('div');
  filtersHint.setAttribute('id','filters-hint');
  filtersHint.setAttribute('hidden','hidden');
  bind(() => { filtersHint.textContent = t('filtersHint'); });
  
  const detailsEl = document.createElement('details');
  detailsEl.className = 'filters-disclosure';

  const summaryEl = document.createElement('summary');

  const filtersIcon = document.createElement('img');
  filtersIcon.setAttribute('src','filter.svg');
  filtersIcon.className = 'filters-icon';
  summaryEl.appendChild(filtersIcon);
  
  const filtersLabel = document.createElement('span');
  filtersLabel.className = 'filters-label';
  bind(() => { filtersLabel.textContent = t('filtersLabel'); });
  summaryEl.appendChild(filtersLabel);
  
  
  detailsEl.appendChild(summaryEl);

  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'filters-container';

  // Builds a fieldset of radio buttons; "All" is shown translated but keeps the value "All"
  function createFilterFieldset(legendKey, radioName, options) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'filter-fieldset';

    const legend = document.createElement('legend');
    legend.className = 'filter-legend';
    bind(() => { legend.textContent = t(legendKey); });
    fieldset.appendChild(legend);

    options.forEach(option => {
      const label = document.createElement('label');
      label.className = 'filter-label';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = radioName;
      radio.value = option;
      radio.checked = option === 'All';
      radio.className = 'filter-radio';
      radio.onchange = () => performSearch(input.value);

      const text = document.createTextNode('');
      bind(() => { text.nodeValue = option === 'All' ? t('all') : option; });

      label.appendChild(radio);
      label.appendChild(text);
      fieldset.appendChild(label);
    });
    return fieldset;
  }

  const levelFieldset = createFilterFieldset('levelLegend', 'level-filter', ['All', 'A', 'AA', 'AAA']);
  const versionFieldset = createFilterFieldset('versionLegend', 'version-filter', ['All', '2.0', '2.1', '2.2']);
  
  filtersContainer.appendChild(levelFieldset);
  filtersContainer.appendChild(versionFieldset);

  const results = document.createElement('ul');
  results.setAttribute('role', 'listbox');
  results.setAttribute('tabindex', '0');
  results.setAttribute('id', 'data-list');
  bind(() => { results.setAttribute('aria-label', t('listLabel')); });
  
  const selectionDiv = document.createElement('div');
  selectionDiv.setAttribute('id','selection-made');
  selectionDiv.setAttribute('tabindex','-1');
  
  const selectionTitle = document.createElement('strong');
  bind(() => { selectionTitle.textContent = t('selected'); });
  
  const selectionText = document.createElement('div');
  selectionText.className = 'selection-text';
  
  selectionDiv.appendChild(selectionTitle);
  selectionDiv.appendChild(selectionText);
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'buttons-container';

  // Create notification panel
  const notificationPanel = document.createElement('div');
  notificationPanel.setAttribute('id', 'notification-panel');
  notificationPanel.setAttribute('role', 'status');
  notificationPanel.setAttribute('aria-live', 'polite');
  bind(() => { notificationPanel.setAttribute('lang', currentLang); });
  
  const notificationTitle = document.createElement('div');
  notificationTitle.className = 'notification-title';
  
  const notificationContent = document.createElement('div');
  notificationContent.className = 'notification-content';
  
  notificationPanel.appendChild(notificationTitle);
  notificationPanel.appendChild(notificationContent);
  
  // Function to show notification
  function showNotification(title, content) {
    // Clear any existing timeout
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    
    // Set notification content
    notificationTitle.textContent = title;
    notificationContent.textContent = content;
    
    // Show notification with animation
    notificationPanel.classList.add('show');
    
    // Hide notification after 5 seconds
    notificationTimeout = setTimeout(() => {
      notificationPanel.classList.remove('show');
    }, 5000);
  }
  
  /* Action buttons */

  function createButton(btn) {
    const button = document.createElement('button');
    button.classList.add('action-button');
    button.classList.add(btn.class);
    button.onclick = () => copyContent(btn.action);
    bind(() => { button.textContent = t(btn.textKey, { key: btn.key }); });
    return button;
  }

  if (compactView) {

    const buttonsNormative = [
      { textKey: 'copyMarkdown', key: '1', action: 'copyNormativeMarkdownLink', class: 'normative' },
      { textKey: 'copyHtml', key: '2', action: 'copyNormativeHTMLLink', class: 'normative' },
      { textKey: 'goToPage', key: '3', action: 'goToNormativeDoc', class: 'normative' }
    ];

    const fieldsetNormative = document.createElement('fieldset');
    const legendNormative = document.createElement('legend');
    bind(() => { legendNormative.textContent = t('normativeLegend'); });
    fieldsetNormative.appendChild(legendNormative);
    buttonsDiv.appendChild(fieldsetNormative);

    buttonsNormative.forEach(btn => fieldsetNormative.appendChild(createButton(btn)));

    const buttonsUnderstanding = [
      { textKey: 'copyMarkdown', key: '4', action: 'copyUnderstandingMarkdownLink', class: 'understanding' },
      { textKey: 'copyHtml', key: '5', action: 'copyUnderstandingHTMLLink', class: 'understanding' },
      { textKey: 'goToPage', key: '6', action: 'goToUnderstandingDoc', class: 'understanding' },
    ];

    const fieldsetUnderstanding = document.createElement('fieldset');
    const legendUnderstanding = document.createElement('legend');
    bind(() => { legendUnderstanding.textContent = t('understandingLegend'); });
    fieldsetUnderstanding.appendChild(legendUnderstanding);
    buttonsDiv.appendChild(fieldsetUnderstanding);

    buttonsUnderstanding.forEach(btn => fieldsetUnderstanding.appendChild(createButton(btn)));

  } else {

    const buttons = [
      { textKey: 'copyNormativeMarkdownLong', key: '1', action: 'copyNormativeMarkdownLink', class: 'normative' },
      { textKey: 'copyNormativeHtmlLong', key: '2', action: 'copyNormativeHTMLLink', class: 'normative' },
      { textKey: 'goToNormativeLong', key: '3', action: 'goToNormativeDoc', class: 'normative' },
      { textKey: 'copyUnderstandingMarkdownLong', key: '4', action: 'copyUnderstandingMarkdownLink', class: 'understanding' },
      { textKey: 'copyUnderstandingHtmlLong', key: '5', action: 'copyUnderstandingHTMLLink', class: 'understanding' },
      { textKey: 'goToUnderstandingLong', key: '6', action: 'goToUnderstandingDoc', class: 'understanding' },
    ];
    
    buttons.forEach(btn => buttonsDiv.appendChild(createButton(btn)));

  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'secondary-button';
  bind(() => { closeBtn.textContent = t('close'); });

  const startAgainBtn = document.createElement('button');
  startAgainBtn.className = 'secondary-button';
  bind(() => { startAgainBtn.textContent = t('startAgain'); });
  
  function startAgain(){
    results.setAttribute('tabindex', '0');
    selectionDiv.style.display = 'none';
    buttonsDiv.style.display = 'none';
    startAgainBtn.style.display = 'none';
    input.value = '';
    selectedItem = null;
    currentSelection = -1;
    performSearch('');
    input.focus();
  }
  
  function closeDialog() {
    // Clear notification timeout if active
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    // Restore original `aria-hidden`` values
    elementsToHide.forEach(({element, originalAriaHidden}) => {
      if (originalAriaHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', originalAriaHidden);
      }
    });
    
    // Restore original `tabindex`` values
    originalTabIndices.forEach(({element, originalTabIndex}) => {
      if (originalTabIndex === null) {
        element.removeAttribute('tabindex');
      } else {
        element.setAttribute('tabindex', originalTabIndex);
      }
    });
    
    // Remove shadow host element
    document.body.removeChild(shadowHost);
    
    // Return focus to original element
    currentFocus.focus();
  }
  
  closeBtn.addEventListener('click', closeDialog);
  startAgainBtn.addEventListener('click', startAgain);
  
  // Close dialog when clicking backdrop
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeDialog();
    }
  });
  
  // Trap focus within dialog
  function trapFocus(e) {
    const focusableElements = dialog.querySelectorAll('input, select, button, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (shadowRoot.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (shadowRoot.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }
  
  function performSearch(query) {
    const selectedLevel = shadowRoot.querySelector('input[name="level-filter"]:checked')?.value || 'All';
    const selectedVersion = shadowRoot.querySelector('input[name="version-filter"]:checked')?.value || 'All';
    
    let filtered = items.filter(item => {
      // Enhanced search logic
      let matchesSearch = true;
      if (query.length > 0) {
        const searchQuery = normalise(query).trim();
        const itemTitle = item.searchText;
        
        // If it's an exact substring match (original behavior), return true immediately
        if (itemTitle.includes(searchQuery)) {
          matchesSearch = true;
        } else {
          // Split search query into individual words/terms
          const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);
          
          // If only one search term, check for partial matches within words
          if (searchTerms.length === 1) {
            const searchTerm = searchTerms[0];
            // Check if any word in the title contains the search term
            matchesSearch = itemTitle.split(/\s+/).some(word => word.includes(searchTerm));
          } else {
            // For multiple search terms, check if all terms can be found in the title
            // (regardless of order, and allowing partial matches within words)
            matchesSearch = searchTerms.every(searchTerm => {
              return itemTitle.split(/\s+/).some(word => word.includes(searchTerm));
            });
          }
        }
      }
      
      const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
      const matchesVersion = selectedVersion === 'All' || item.version === selectedVersion;
      
      return matchesSearch && matchesLevel && matchesVersion;
    });
    
    results.innerHTML = '';
    currentSelection = -1;
    
    input.setAttribute('aria-expanded', filtered.length > 0 ? 'true' : 'false');
    
    if (filtered.length === 0) {
      const noResults = document.createElement('li');
      noResults.textContent = t('noResults');
      noResults.style.cssText = 'padding: 10px; color: #666; font-style: italic;';
      results.appendChild(noResults);
      return;
    }
    
    filtered.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('id', `option-${index}`);
      const strClass = item.category;
      li.innerHTML = '<span style="font-weight:bold">' + escapeHtml(item.shortTitle) + '</span> <span>' + escapeHtml(t('levelBadge', { level: item.level })) + '</span> <span class="version ' + strClass + '">' + escapeHtml(item.version) + '</span> <span class="category ' + strClass + '">' + escapeHtml(t('category.' + item.category)) + '</span>';
      li.dataset.index = index;
      li.dataset.id = item.id;
      
      li.onmouseenter = () => {
        currentSelection = index;
        updateSelection();
      };
      
      li.onclick = () => showSelectedItem(item);
      
      results.appendChild(li);
    });
  }
  
  function updateSelection() {
    const options = results.querySelectorAll('li[role="option"]');
    options.forEach((option, index) => {
      if (index === currentSelection) {
        option.classList.add('hover');
        input.setAttribute('aria-activedescendant', option.id);
        
        option.scrollIntoView({
          block: 'nearest'
        });
      } else {
        option.classList.remove('hover');
      }
    });
  }
  
  function showSelectedItem(item) {
    results.setAttribute('tabindex', '-1');
    selectedItem = item;
    selectionText.textContent = item.title;
    selectionDiv.style.display = 'block';
    selectionDiv.focus();
    buttonsDiv.style.display = 'flex';
    startAgainBtn.style.display = 'block';
    input.value = item.title;
    results.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
  }

  // Re-render everything in the (possibly newly chosen) language, keeping the user's place
  function applyLanguage() {
    currentLang = i18n.resolveLanguage(languagePreference);
    items = buildItems(currentLang);
    bindings.forEach(fn => fn());

    if (selectedItem) {
      const sameItem = items.find(item => item.id === selectedItem.id);
      selectedItem = sameItem;
      selectionText.textContent = sameItem.title;
      input.value = sameItem.title;
    } else {
      performSearch(input.value);
    }
  }
  
  function copyContent(action) {
    if (!selectedItem) return;
    
    const label = selectedItem.label;
    const understandingLabel = selectedItem.understandingLabel;
    let content;
    
    switch(action) {
      case 'copyNormativeMarkdownLink':
        content = `[${label}](${selectedItem.url})`;
        break;
      case 'copyNormativeHTMLLink':
        content = `<a href="${selectedItem.url}">${label}</a>`;
        break;
      case 'goToNormativeDoc':
        window.open(selectedItem.url, '_blank');
        return;
      case 'copyUnderstandingMarkdownLink':
        content = `[${understandingLabel}](${selectedItem.understandingUrl})`;
        break;
      case 'copyUnderstandingHTMLLink':
        content = `<a href="${selectedItem.understandingUrl}">${understandingLabel}</a>`;
        break;
      case 'goToUnderstandingDoc':
        window.open(selectedItem.understandingUrl, '_blank');
        return;
    }
    
    navigator.clipboard.writeText(content).then(() => {
      showNotification(t('copied'), content);
    }).catch(() => {
      console.log(content);
      showNotification(t('copyFailed'), t('copyFailedDetail'));
    });
  }
  
  // Reset to initial state when new input is entered
  function resetToInitialState() {
    if (selectedItem) {
      selectedItem = null;
      currentSelection = -1;
      selectionDiv.style.display = 'none';
      buttonsDiv.style.display = 'none';
      startAgainBtn.style.display = 'none';
      results.setAttribute('tabindex', '0');
    }
  }
  
  input.oninput = (e) => {
    resetToInitialState();
    performSearch(e.target.value);
  };
  
  // Add focus event listener to select text when input receives focus after a selection
  input.onfocus = (e) => {
    if (selectedItem) {
      // Select all text in the input when returning focus after making a selection
      setTimeout(() => {
        input.select();
      }, 0);
    }
  };
  
  input.onkeydown = (e) => {
    trapFocus(e);
    
    const options = results.querySelectorAll('li[role="option"]');
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentSelection < options.length - 1) {
          currentSelection++;
          updateSelection();
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (currentSelection > 0) {
          currentSelection--;
          updateSelection();
        }
        break;
        
      case 'Enter':
        // Ignore Enter while an IME (e.g. Japanese input) is confirming a composition
        if (e.isComposing) break;
        e.preventDefault();
        if (currentSelection >= 0 && options[currentSelection]) {
          const option = options[currentSelection];
          const item = items.find(item => item.id === option.dataset.id);
          if (item) showSelectedItem(item);
        }
        break;
        
      case 'Escape':
        if (!isFullPage) {
          e.preventDefault();
          closeDialog();
        }
        break;
    }
  };
  
  // Add event listener to the dialog for focus trapping and number key handling
  dialog.addEventListener('keydown', (e) => {
    trapFocus(e);
    
    // Handle ESC key from anywhere in the dialog
    if (e.key === 'Escape') {
      if (!isFullPage) {
        e.preventDefault();
        closeDialog();
      }
    }
    
    // Only handle number keys 1-6 for button actions when:
    // 1. An item is selected
    // 2. Neither the input field nor the language selector has focus
    if (selectedItem && e.key >= '1' && e.key <= '6' && shadowRoot.activeElement !== input && shadowRoot.activeElement !== languageSelect) {
      e.preventDefault();
      const actions = ['copyNormativeMarkdownLink', 'copyNormativeHTMLLink', 'goToNormativeDoc', 'copyUnderstandingMarkdownLink', 'copyUnderstandingHTMLLink', 'goToUnderstandingDoc'];
      copyContent(actions[parseInt(e.key) - 1]);
    }
  });
  
  // Build the dialog
  dialog.appendChild(header);

  if (compactView) {
    dialog.appendChild(detailsEl);
    detailsEl.appendChild(filtersContainer);
  } else {
    dialog.appendChild(filtersContainer);
  }
  dialog.appendChild(input);
  dialog.appendChild(filtersHint);
  dialog.appendChild(results);
  dialog.appendChild(selectionDiv);
  dialog.appendChild(buttonsDiv);
  dialog.appendChild(startAgainBtn);
  startAgainBtn.style.display = 'none';

  if (typeof openInSidebar === 'undefined') {
    dialog.appendChild(closeBtn);
  }
  
  
  modalBackdrop.appendChild(dialog);
  modalBackdrop.appendChild(notificationPanel);
  
  // Add styles and content to shadow DOM
  shadowRoot.appendChild(shadowStyles);
  shadowRoot.appendChild(modalBackdrop);
  
  // Add shadow host to document
  document.body.appendChild(shadowHost);
  
  input.focus();
  performSearch('');
};