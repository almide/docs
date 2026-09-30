/**
 * The playground editor's colour scheme, expressed as a Shiki theme.
 *
 * Both sides draw from the tokyo-night palette, but they had different
 * scope→colour maps: the playground's CodeMirror highlighter paints every
 * capitalised word as a type and every call-position name as a function, while
 * stock tokyo-night leaves both at the plain foreground. Running the two
 * side by side (a static sample that becomes a live editor on click) made the
 * mismatch obvious, so the docs preview uses these values instead.
 *
 * Keep in sync with `almideHighlight` in the playground's `web/editor.js`.
 */
export const playgroundTheme = {
  name: 'almide-playground',
  type: 'dark' as const,
  colors: {
    'editor.background': '#0b1420',
    'editor.foreground': '#f4f7f8',
  },
  settings: [
    { settings: { background: '#0b1420', foreground: '#f4f7f8' } },
    {
      scope: ['keyword', 'keyword.control', 'keyword.declaration', 'storage', 'storage.modifier'],
      settings: { foreground: '#bb9af7', fontStyle: '' },
    },
    {
      scope: ['string', 'string.quoted', 'constant.character.escape'],
      settings: { foreground: '#9ece6a' },
    },
    {
      scope: ['comment'],
      settings: { foreground: '#565f89', fontStyle: 'italic' },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'variable.language'],
      settings: { foreground: '#ff9e64' },
    },
    {
      scope: ['entity.name.type', 'support.type', 'support.type.builtin'],
      settings: { foreground: '#2ac3de' },
    },
    {
      scope: ['support.function.builtin', 'support.module'],
      settings: { foreground: '#7aa2f7' },
    },
    {
      scope: ['entity.name.function', 'meta.function'],
      settings: { foreground: '#7dcfff' },
    },
    {
      scope: ['variable', 'variable.other', 'meta.interpolation'],
      settings: { foreground: '#c0caf5' },
    },
    {
      scope: ['keyword.operator', 'punctuation'],
      settings: { foreground: '#89ddff' },
    },
  ],
};

export default playgroundTheme;
