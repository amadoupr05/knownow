export const MATH_SYMBOLS = [
  {
    name: 'Opérations',
    symbols: [
      { label: '+', value: '+', latex: '+' },
      { label: '−', value: '-', latex: '-' },
      { label: '×', value: '\\times', latex: '\\times' },
      { label: '÷', value: '\\div', latex: '\\div' },
      { label: '±', value: '\\pm', latex: '\\pm' },
      { label: 'Fraction', value: '\\frac{a}{b}', latex: '\\frac{a}{b}' },
    ]
  },
  {
    name: 'Exposants & Racines',
    symbols: [
      { label: 'x²', value: 'x^2', latex: 'x^2' },
      { label: 'x³', value: 'x^3', latex: 'x^3' },
      { label: 'xⁿ', value: 'x^n', latex: 'x^n' },
      { label: 'Indice', value: 'x_i', latex: 'x_i' },
      { label: '√', value: '\\sqrt{x}', latex: '\\sqrt{x}' },
      { label: 'ⁿ√', value: '\\sqrt[n]{x}', latex: '\\sqrt[n]{x}' },
    ]
  },
  {
    name: 'Calcul',
    symbols: [
      { label: '∫', value: '\\int_{a}^{b}', latex: '\\int_{a}^{b}' },
      { label: '∬', value: '\\iint_{D}', latex: '\\iint_{D}' },
      { label: '∭', value: '\\iiint_{E}', latex: '\\iiint_{E}' },
      { label: '∑', value: '\\sum_{i=1}^{n}', latex: '\\sum_{i=1}^{n}' },
      { label: '∏', value: '\\prod_{i=1}^{n}', latex: '\\prod_{i=1}^{n}' },
      { label: 'lim', value: '\\lim_{x \\to \\infty}', latex: '\\lim_{x \\to \\infty}' },
      { label: 'd/dx', value: '\\frac{d}{dx}', latex: '\\frac{d}{dx}' },
      { label: '∂/∂x', value: '\\frac{\\partial}{\\partial x}', latex: '\\frac{\\partial}{\\partial x}' },
    ]
  },
  {
    name: 'Relations',
    symbols: [
      { label: '=', value: '=', latex: '=' },
      { label: '≈', value: '\\approx', latex: '\\approx' },
      { label: '≠', value: '\\neq', latex: '\\neq' },
      { label: '<', value: '<', latex: '<' },
      { label: '>', value: '>', latex: '>' },
      { label: '≤', value: '\\leq', latex: '\\leq' },
      { label: '≥', value: '\\geq', latex: '\\geq' },
      { label: '≡', value: '\\equiv', latex: '\\equiv' },
    ]
  },
  {
    name: 'Systèmes & Matrices',
    symbols: [
      { label: 'Système 2 lignes', value: '\\begin{cases} x^2-1, & x>0 \\\\ x+2, & x<0 \\end{cases}', latex: '\\begin{cases} x^2-1, & x>0 \\\\ x+2, & x<0 \\end{cases}' },
      { label: 'Système 3 lignes', value: '\\begin{cases} x+y+z=6 \\\\ 2x-y+z=3 \\\\ x+2y-z=1 \\end{cases}', latex: '\\begin{cases} x+y+z=6 \\\\ 2x-y+z=3 \\\\ x+2y-z=1 \\end{cases}' },
      { label: 'Matrice 2×2', value: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
      { label: 'Matrice 3×3', value: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
      { label: 'Déterminant 2×2', value: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
      { label: 'Vecteur', value: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}', latex: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}' },
    ]
  },
  {
    name: 'Ensembles',
    symbols: [
      { label: 'ℝ', value: '\\mathbb{R}', latex: '\\mathbb{R}' },
      { label: 'ℕ', value: '\\mathbb{N}', latex: '\\mathbb{N}' },
      { label: 'ℤ', value: '\\mathbb{Z}', latex: '\\mathbb{Z}' },
      { label: 'ℚ', value: '\\mathbb{Q}', latex: '\\mathbb{Q}' },
      { label: 'ℂ', value: '\\mathbb{C}', latex: '\\mathbb{C}' },
      { label: '∈', value: '\\in', latex: '\\in' },
      { label: '∉', value: '\\notin', latex: '\\notin' },
      { label: '∪', value: '\\cup', latex: '\\cup' },
      { label: '∩', value: '\\cap', latex: '\\cap' },
      { label: '∅', value: '\\emptyset', latex: '\\emptyset' },
      { label: '⊂', value: '\\subset', latex: '\\subset' },
      { label: '⊆', value: '\\subseteq', latex: '\\subseteq' },
    ]
  },
  {
    name: 'Lettres grecques',
    symbols: [
      { label: 'α', value: '\\alpha', latex: '\\alpha' },
      { label: 'β', value: '\\beta', latex: '\\beta' },
      { label: 'γ', value: '\\gamma', latex: '\\gamma' },
      { label: 'δ', value: '\\delta', latex: '\\delta' },
      { label: 'ε', value: '\\epsilon', latex: '\\epsilon' },
      { label: 'θ', value: '\\theta', latex: '\\theta' },
      { label: 'λ', value: '\\lambda', latex: '\\lambda' },
      { label: 'μ', value: '\\mu', latex: '\\mu' },
      { label: 'π', value: '\\pi', latex: '\\pi' },
      { label: 'σ', value: '\\sigma', latex: '\\sigma' },
      { label: 'φ', value: '\\phi', latex: '\\phi' },
      { label: 'ω', value: '\\omega', latex: '\\omega' },
    ]
  },
  {
    name: 'Fonctions',
    symbols: [
      { label: 'sin', value: '\\sin', latex: '\\sin(x)' },
      { label: 'cos', value: '\\cos', latex: '\\cos(x)' },
      { label: 'tan', value: '\\tan', latex: '\\tan(x)' },
      { label: 'log', value: '\\log', latex: '\\log(x)' },
      { label: 'ln', value: '\\ln', latex: '\\ln(x)' },
      { label: 'exp', value: 'e^{x}', latex: 'e^{x}' },
      { label: 'Binôme', value: '\\binom{n}{k}', latex: '\\binom{n}{k}' },
      { label: '|x|', value: '|x|', latex: '|x|' },
    ]
  },
  {
    name: 'Flèches',
    symbols: [
      { label: '→', value: '\\rightarrow', latex: '\\rightarrow' },
      { label: '←', value: '\\leftarrow', latex: '\\leftarrow' },
      { label: '↔', value: '\\leftrightarrow', latex: '\\leftrightarrow' },
      { label: '⇒', value: '\\Rightarrow', latex: '\\Rightarrow' },
      { label: '⇐', value: '\\Leftarrow', latex: '\\Leftarrow' },
      { label: '⇔', value: '\\Leftrightarrow', latex: '\\Leftrightarrow' },
    ]
  }
];