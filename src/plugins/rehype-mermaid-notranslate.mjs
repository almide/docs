import { visit } from 'unist-util-visit';

/**
 * Mark mermaid blocks as untranslatable.
 *
 * A mermaid diagram is shipped as its *source text* inside `<pre class="mermaid">`
 * and parsed in the browser. Chrome's auto-translate rewrites that text first, so
 * a Japanese reader gets `グラフTD` instead of `graph TD` and mermaid fails with
 * "No diagram type detected". `translate="no"` plus the `notranslate` class is the
 * combination Chrome honours.
 */
export function rehypeMermaidNoTranslate() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;
      const className = node.properties?.className;
      const classes = Array.isArray(className) ? className : className ? [className] : [];
      if (!classes.includes('mermaid')) return;
      node.properties.translate = 'no';
      node.properties.className = [...classes, 'notranslate'];
    });
  };
}

export default rehypeMermaidNoTranslate;
