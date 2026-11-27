/*
 * WCAG Success Criteria data.
 *
 * - window.wcagData     Language-neutral records, one per success criterion. Only "names" is translated.
 *                       Add a language by adding a key to each record's "names" (falls back to "en" if missing).
 *                       If a translation ever uses a different URL slug for an SC, add an optional
 *                       "slugs": {"xx": "..."} override to that record.
 * - window.wcagSources  Per-language URL configuration for the two linked documents:
 *                         normative:      normativeBase + "#" + slug
 *                         understanding:  understandingBase + slug + understandingSuffix
 *                       Languages without an entry fall back to the English (W3C) sources.
 *
 * UI text lives in i18n.js.
 */

window.wcagSources = {
    "en": {
        "normativeBase": "https://www.w3.org/TR/WCAG22/",
        "understandingBase": "https://www.w3.org/WAI/WCAG22/Understanding/",
        "understandingSuffix": ".html"
    },
    "ja": {
        // Japanese translation by WAIC (Web Accessibility Infrastructure Committee)
        "normativeBase": "https://waic.jp/translations/WCAG22/",
        "understandingBase": "https://waic.jp/translations/WCAG22/Understanding/",
        "understandingSuffix": ""
    }
};

window.wcagData = [
    {"num": "1.1.1", "slug": "non-text-content", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Non-text Content", "ja": "非テキストコンテンツ"}},
    {"num": "1.2.1", "slug": "audio-only-and-video-only-prerecorded", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Audio-only and Video-only (Prerecorded)", "ja": "音声だけ及び映像だけ (収録済み)"}},
    {"num": "1.2.2", "slug": "captions-prerecorded", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Captions (Prerecorded)", "ja": "キャプション (収録済み)"}},
    {"num": "1.2.3", "slug": "audio-description-or-media-alternative-prerecorded", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Audio Description or Media Alternative (Prerecorded)", "ja": "音声解説、又はメディアに対する代替 (収録済み)"}},
    {"num": "1.2.4", "slug": "captions-live", "level": "AA", "version": "2.0", "category": "Perceivable", "names": {"en": "Captions (Live)", "ja": "キャプション (ライブ)"}},
    {"num": "1.2.5", "slug": "audio-description-prerecorded", "level": "AA", "version": "2.0", "category": "Perceivable", "names": {"en": "Audio Description (Prerecorded)", "ja": "音声解説 (収録済み)"}},
    {"num": "1.2.6", "slug": "sign-language-prerecorded", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Sign Language (Prerecorded)", "ja": "手話 (収録済み)"}},
    {"num": "1.2.7", "slug": "extended-audio-description-prerecorded", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Extended Audio Description (Prerecorded)", "ja": "拡張音声解説 (収録済み)"}},
    {"num": "1.2.8", "slug": "media-alternative-prerecorded", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Media Alternative (Prerecorded)", "ja": "メディアに対する代替 (収録済み)"}},
    {"num": "1.2.9", "slug": "audio-only-live", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Audio-only (Live)", "ja": "音声だけ (ライブ)"}},
    {"num": "1.3.1", "slug": "info-and-relationships", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Info and Relationships", "ja": "情報及び関係性"}},
    {"num": "1.3.2", "slug": "meaningful-sequence", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Meaningful Sequence", "ja": "意味をなすシーケンス"}},
    {"num": "1.3.3", "slug": "sensory-characteristics", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Sensory Characteristics", "ja": "感覚による特性"}},
    {"num": "1.3.4", "slug": "orientation", "level": "AA", "version": "2.1", "category": "Perceivable", "names": {"en": "Orientation", "ja": "向き (orientation)"}},
    {"num": "1.3.5", "slug": "identify-input-purpose", "level": "AA", "version": "2.1", "category": "Perceivable", "names": {"en": "Identify Input Purpose", "ja": "入力目的の特定"}},
    {"num": "1.3.6", "slug": "identify-purpose", "level": "AAA", "version": "2.1", "category": "Perceivable", "names": {"en": "Identify Purpose", "ja": "目的の特定"}},
    {"num": "1.4.1", "slug": "use-of-color", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Use of Color", "ja": "色の用途"}},
    {"num": "1.4.2", "slug": "audio-control", "level": "A", "version": "2.0", "category": "Perceivable", "names": {"en": "Audio Control", "ja": "音声の制御"}},
    {"num": "1.4.3", "slug": "contrast-minimum", "level": "AA", "version": "2.0", "category": "Perceivable", "names": {"en": "Contrast (Minimum)", "ja": "コントラスト (最低限)"}},
    {"num": "1.4.4", "slug": "resize-text", "level": "AA", "version": "2.0", "category": "Perceivable", "names": {"en": "Resize Text", "ja": "テキストのサイズ変更"}},
    {"num": "1.4.5", "slug": "images-of-text", "level": "AA", "version": "2.0", "category": "Perceivable", "names": {"en": "Images of Text", "ja": "文字画像"}},
    {"num": "1.4.6", "slug": "contrast-enhanced", "level": "AAA", "version": "2.1", "category": "Perceivable", "names": {"en": "Contrast (Enhanced)", "ja": "コントラスト (高度)"}},
    {"num": "1.4.7", "slug": "low-or-no-background-audio", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Low or No Background Audio", "ja": "背景音の小さい又はない音声"}},
    {"num": "1.4.8", "slug": "visual-presentation", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Visual Presentation", "ja": "視覚的提示"}},
    {"num": "1.4.9", "slug": "images-of-text-no-exception", "level": "AAA", "version": "2.0", "category": "Perceivable", "names": {"en": "Images of Text (No Exception)", "ja": "文字画像 (例外なし)"}},
    {"num": "1.4.10", "slug": "reflow", "level": "AA", "version": "2.1", "category": "Perceivable", "names": {"en": "Reflow", "ja": "リフロー"}},
    {"num": "1.4.11", "slug": "non-text-contrast", "level": "AA", "version": "2.1", "category": "Perceivable", "names": {"en": "Non-text Contrast", "ja": "非テキストのコントラスト"}},
    {"num": "1.4.12", "slug": "text-spacing", "level": "AA", "version": "2.1", "category": "Perceivable", "names": {"en": "Text Spacing", "ja": "テキストの間隔"}},
    {"num": "1.4.13", "slug": "content-on-hover-or-focus", "level": "AA", "version": "2.1", "category": "Operable", "names": {"en": "Content on Hover or Focus", "ja": "ホバー時又はフォーカス時のコンテンツ"}},
    {"num": "2.1.1", "slug": "keyboard", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Keyboard", "ja": "キーボード"}},
    {"num": "2.1.2", "slug": "no-keyboard-trap", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "No Keyboard Trap", "ja": "キーボードトラップなし"}},
    {"num": "2.1.3", "slug": "keyboard-no-exception", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Keyboard (No Exception)", "ja": "キーボード (例外なし)"}},
    {"num": "2.1.4", "slug": "character-key-shortcuts", "level": "A", "version": "2.1", "category": "Operable", "names": {"en": "Character Key Shortcuts", "ja": "文字キーによるショートカット"}},
    {"num": "2.2.1", "slug": "timing-adjustable", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Timing Adjustable", "ja": "期限調節可能"}},
    {"num": "2.2.2", "slug": "pause-stop-hide", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Pause, Stop, Hide", "ja": "一時停止・停止・非表示"}},
    {"num": "2.2.3", "slug": "no-timing", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "No Timing", "ja": "期限なし"}},
    {"num": "2.2.4", "slug": "interruptions", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Interruptions", "ja": "割込み"}},
    {"num": "2.2.5", "slug": "re-authenticating", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Re-authenticating", "ja": "再認証"}},
    {"num": "2.2.6", "slug": "timeouts", "level": "AAA", "version": "2.1", "category": "Operable", "names": {"en": "Timeouts", "ja": "タイムアウト"}},
    {"num": "2.3.1", "slug": "three-flashes-or-below-threshold", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Three Flashes or Below Threshold", "ja": "3 回の閃光、又は閾値以下"}},
    {"num": "2.3.2", "slug": "three-flashes", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Three Flashes", "ja": "3 回の閃光"}},
    {"num": "2.3.3", "slug": "animation-from-interactions", "level": "AAA", "version": "2.1", "category": "Operable", "names": {"en": "Animation from Interactions", "ja": "インタラクションによるアニメーション"}},
    {"num": "2.4.1", "slug": "bypass-blocks", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Bypass Blocks", "ja": "ブロックのバイパス"}},
    {"num": "2.4.2", "slug": "page-titled", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Page Titled", "ja": "ページタイトル"}},
    {"num": "2.4.3", "slug": "focus-order", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Focus Order", "ja": "フォーカス順序"}},
    {"num": "2.4.4", "slug": "link-purpose-in-context", "level": "A", "version": "2.0", "category": "Operable", "names": {"en": "Link Purpose (In Context)", "ja": "リンクの目的 (文脈内)"}},
    {"num": "2.4.5", "slug": "multiple-ways", "level": "AA", "version": "2.0", "category": "Operable", "names": {"en": "Multiple Ways", "ja": "複数の経路"}},
    {"num": "2.4.6", "slug": "headings-and-labels", "level": "AA", "version": "2.0", "category": "Operable", "names": {"en": "Headings and Labels", "ja": "見出し及びラベル"}},
    {"num": "2.4.7", "slug": "focus-visible", "level": "AA", "version": "2.0", "category": "Operable", "names": {"en": "Focus Visible", "ja": "フォーカスの可視化"}},
    {"num": "2.4.8", "slug": "location", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Location", "ja": "現在位置"}},
    {"num": "2.4.9", "slug": "link-purpose-link-only", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Link Purpose (Link Only)", "ja": "リンクの目的 (リンクだけ)"}},
    {"num": "2.4.10", "slug": "section-headings", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Section Headings", "ja": "セクション見出し"}},
    {"num": "2.4.11", "slug": "focus-not-obscured-minimum", "level": "AA", "version": "2.0", "category": "Operable", "names": {"en": "Focus Not Obscured (Minimum)", "ja": "隠されないフォーカス (最低限)"}},
    {"num": "2.4.12", "slug": "focus-not-obscured-enhanced", "level": "AA", "version": "2.0", "category": "Operable", "names": {"en": "Focus Not Obscured (Enhanced)", "ja": "隠されないフォーカス (高度)"}},
    {"num": "2.4.13", "slug": "focus-appearance", "level": "AAA", "version": "2.0", "category": "Operable", "names": {"en": "Focus Appearance", "ja": "フォーカスの外観"}},
    {"num": "2.5.1", "slug": "pointer-gestures", "level": "A", "version": "2.2", "category": "Operable", "names": {"en": "Pointer Gestures", "ja": "ポインタジェスチャ"}},
    {"num": "2.5.2", "slug": "pointer-cancellation", "level": "A", "version": "2.2", "category": "Operable", "names": {"en": "Pointer Cancellation", "ja": "ポインタキャンセル"}},
    {"num": "2.5.3", "slug": "label-in-name", "level": "A", "version": "2.2", "category": "Operable", "names": {"en": "Label in Name", "ja": "ラベルを含む名前 (name)"}},
    {"num": "2.5.4", "slug": "motion-actuation", "level": "A", "version": "2.1", "category": "Operable", "names": {"en": "Motion Actuation", "ja": "動きによる起動"}},
    {"num": "2.5.5", "slug": "target-size-enhanced", "level": "AAA", "version": "2.1", "category": "Operable", "names": {"en": "Target Size (Enhanced)", "ja": "ターゲットのサイズ (高度)"}},
    {"num": "2.5.6", "slug": "concurrent-input-mechanisms", "level": "AAA", "version": "2.1", "category": "Operable", "names": {"en": "Concurrent Input Mechanisms", "ja": "入力メカニズムの共存"}},
    {"num": "2.5.7", "slug": "dragging-movements", "level": "AA", "version": "2.2", "category": "Operable", "names": {"en": "Dragging Movements", "ja": "ドラッグ動作"}},
    {"num": "2.5.8", "slug": "target-size-minimum", "level": "AA", "version": "2.2", "category": "Operable", "names": {"en": "Target Size (Minimum)", "ja": "ターゲットのサイズ (最低限)"}},
    {"num": "3.1.1", "slug": "language-of-page", "level": "A", "version": "2.1", "category": "Understandable", "names": {"en": "Language of Page", "ja": "ページの言語"}},
    {"num": "3.1.2", "slug": "language-of-parts", "level": "AA", "version": "2.1", "category": "Understandable", "names": {"en": "Language of Parts", "ja": "一部分の言語"}},
    {"num": "3.1.3", "slug": "unusual-words", "level": "AAA", "version": "2.1", "category": "Understandable", "names": {"en": "Unusual Words", "ja": "一般的ではない用語"}},
    {"num": "3.1.4", "slug": "abbreviations", "level": "AAA", "version": "2.2", "category": "Understandable", "names": {"en": "Abbreviations", "ja": "略語"}},
    {"num": "3.1.5", "slug": "reading-level", "level": "AAA", "version": "2.2", "category": "Understandable", "names": {"en": "Reading Level", "ja": "読解レベル"}},
    {"num": "3.1.6", "slug": "pronunciation", "level": "AAA", "version": "2.0", "category": "Understandable", "names": {"en": "Pronunciation", "ja": "発音"}},
    {"num": "3.2.1", "slug": "on-focus", "level": "A", "version": "2.0", "category": "Understandable", "names": {"en": "On Focus", "ja": "フォーカス時"}},
    {"num": "3.2.2", "slug": "on-input", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "On Input", "ja": "入力時"}},
    {"num": "3.2.3", "slug": "consistent-navigation", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "Consistent Navigation", "ja": "一貫したナビゲーション"}},
    {"num": "3.2.4", "slug": "consistent-identification", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "Consistent Identification", "ja": "一貫した識別性"}},
    {"num": "3.2.5", "slug": "change-on-request", "level": "AAA", "version": "2.0", "category": "Understandable", "names": {"en": "Change on Request", "ja": "要求による変化"}},
    {"num": "3.2.6", "slug": "consistent-help", "level": "A", "version": "2.2", "category": "Understandable", "names": {"en": "Consistent Help", "ja": "一貫したヘルプ"}},
    {"num": "3.3.1", "slug": "error-identification", "level": "A", "version": "2.0", "category": "Understandable", "names": {"en": "Error Identification", "ja": "エラーの特定"}},
    {"num": "3.3.2", "slug": "labels-or-instructions", "level": "A", "version": "2.0", "category": "Understandable", "names": {"en": "Labels or Instructions", "ja": "ラベル又は指示"}},
    {"num": "3.3.3", "slug": "error-suggestion", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "Error Suggestion", "ja": "エラーの修正提案"}},
    {"num": "3.3.4", "slug": "error-prevention-legal-financial-data", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "Error Prevention (Legal, Financial, Data)", "ja": "誤り防止 (法的・金融・データ)"}},
    {"num": "3.3.5", "slug": "help", "level": "AAA", "version": "2.0", "category": "Understandable", "names": {"en": "Help", "ja": "ヘルプ"}},
    {"num": "3.3.6", "slug": "error-prevention-all", "level": "AAA", "version": "2.2", "category": "Understandable", "names": {"en": "Error Prevention (All)", "ja": "誤り防止 (全て)"}},
    {"num": "3.3.7", "slug": "redundant-entry", "level": "A", "version": "2.0", "category": "Understandable", "names": {"en": "Redundant Entry", "ja": "冗長な入力項目"}},
    {"num": "3.3.8", "slug": "accessible-authentication-minimum", "level": "AA", "version": "2.0", "category": "Understandable", "names": {"en": "Accessible Authentication (Minimum)", "ja": "アクセシブルな認証 (最低限)"}},
    {"num": "3.3.9", "slug": "accessible-authentication-enhanced", "level": "AAA", "version": "2.1", "category": "Understandable", "names": {"en": "Accessible Authentication (Enhanced)", "ja": "アクセシブルな認証 (高度)"}},
    {"num": "4.1.1", "slug": "parsing", "level": "A", "version": "2.0", "category": "Robust", "names": {"en": "Parsing", "ja": "構文解析 (廃止及び削除)"}},
    {"num": "4.1.2", "slug": "name-role-value", "level": "A", "version": "2.0", "category": "Robust", "names": {"en": "Name, Role, Value", "ja": "名前 (name)・役割 (role)・値 (value)"}},
    {"num": "4.1.3", "slug": "status-messages", "level": "AA", "version": "2.0", "category": "Robust", "names": {"en": "Status Messages", "ja": "ステータスメッセージ"}}
];
