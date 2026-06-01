// Token + conditional rendering. No dependencies.
//
// Supported syntax (see ../TOKENS.md):
//   {{TOKEN}}                         → replaced from the token map
//   {{#if NAME == VALUE}}…{{/if}}      → kept if condition true, else removed
//   {{#if NAME != VALUE}}…{{/if}}
// Conditionals are not nested. Unknown tokens are left intact.

const COND_RE =
  /\{\{#if\s+(\w+)\s*(==|!=)\s*([^}]+?)\s*\}\}\r?\n?([\s\S]*?)\r?\n?\{\{\/if\}\}\r?\n?/g;

const TOKEN_RE = /\{\{(\w+)\}\}/g;

export function evalConditionals(text, tokens) {
  return text.replace(COND_RE, (_m, name, op, value, body) => {
    const actual = tokens[name];
    const matches = String(actual) === String(value);
    const keep = op === '==' ? matches : !matches;
    return keep ? body + '\n' : '';
  });
}

export function replaceTokens(text, tokens) {
  return text.replace(TOKEN_RE, (m, name) =>
    Object.prototype.hasOwnProperty.call(tokens, name) ? String(tokens[name]) : m
  );
}

export function render(text, tokens) {
  return replaceTokens(evalConditionals(text, tokens), tokens);
}
