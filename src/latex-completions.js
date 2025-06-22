export const myCompletions = [
  { label: "\\alpha", type: "keyword"},
  { label: "\\beta", type: "keyword"},
  { label: "\\gamma", type: "keyword"},
  { label: "\\delta", type: "keyword"},
    { label: "\\epsilon", type: "keyword"},
    { label: "\\zeta", type: "keyword"},
    { label: "\\eta", type: "keyword"},
    { label: "\\theta", type: "keyword"},
    { label: "\\iota", type: "keyword"},
    { label: "\\kappa", type: "keyword"},
    { label: "\\lambda", type: "keyword"},
    { label: "\\mu", type: "keyword"},
    { label: "\\nu", type: "keyword"},
    { label: "\\xi", type: "keyword"},
    { label: "\\pi", type: "keyword"},
    { label: "\\rho", type: "keyword"},
    { label: "\\sigma", type: "keyword"},
    { label: "\\tau", type: "keyword"},
    { label: "\\upsilon", type: "keyword"},
    { label: "\\phi", type: "keyword"},
    { label: "\\chi", type: "keyword"},
    { label: "\\psi", type: "keyword"},
    { label: "\\omega", type: "keyword"},
    // capital letters
    { label: "\\Alpha", type: "keyword"},
    { label: "\\Beta", type: "keyword"},
    { label: "\\Gamma", type: "keyword"},
    { label: "\\Delta", type: "keyword"},
    { label: "\\Epsilon", type: "keyword"},
    { label: "\\Zeta", type: "keyword"},
    { label: "\\Eta", type: "keyword"},
    { label: "\\Theta", type: "keyword"},
    { label: "\\Iota", type: "keyword"},
    { label: "\\Kappa", type: "keyword"},
    { label: "\\Lambda", type: "keyword"},
    { label: "\\Mu", type: "keyword"},
    { label: "\\Nu", type: "keyword"},
    { label: "\\Xi", type: "keyword"},
    { label: "\\Pi", type: "keyword"},
    { label: "\\Rho", type: "keyword"},
    { label: "\\Sigma", type: "keyword"},
    { label: "\\Tau", type: "keyword"},
    { label: "\\Upsilon", type: "keyword"},
    { label: "\\Phi", type: "keyword"},
    { label: "\\Chi", type: "keyword"},
    { label: "\\Psi", type: "keyword"},
    { label: "\\Omega", type: "keyword"},

];

// auto-completion source
export const myCompletionSource = (context) => {
  let word = context.matchBefore(/\w*/);
  if (!word) return null;
  return {
    from: word.from,
    options: myCompletions,
  };
};