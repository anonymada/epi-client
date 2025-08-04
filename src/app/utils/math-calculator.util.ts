/**
 * Calculateur mathématique sécurisé pour remplacer eval()
 */
export class MathCalculator {
  private static readonly OPERATORS = ['+', '-', '*', '/'];
  private static readonly NUMBERS = /^[0-9.]+$/;

  /**
   * Évalue une expression mathématique de manière sécurisée
   * @param expression Expression mathématique à évaluer
   * @returns Résultat du calcul ou null si erreur
   */
  static evaluate(expression: string): number | null {
    try {
      // Nettoyer l'expression
      const cleanExpression = expression.replace(/\s/g, '');
      
      // Valider l'expression
      if (!this.isValidExpression(cleanExpression)) {
        return null;
      }

      // Parser et calculer
      return this.parseAndCalculate(cleanExpression);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      return null;
    }
  }

  private static isValidExpression(expression: string): boolean {
    // Vérifier que l'expression ne contient que des chiffres, points et opérateurs autorisés
    const validChars = /^[0-9+\-*/.]+$/;
    if (!validChars.test(expression)) {
      return false;
    }

    // Vérifier qu'elle ne commence/finit pas par un opérateur
    const firstChar = expression[0];
    const lastChar = expression[expression.length - 1];
    
    if (this.OPERATORS.includes(firstChar) || this.OPERATORS.includes(lastChar)) {
      return false;
    }

    // Vérifier qu'il n'y a pas d'opérateurs consécutifs
    for (let i = 0; i < expression.length - 1; i++) {
      if (this.OPERATORS.includes(expression[i]) && this.OPERATORS.includes(expression[i + 1])) {
        return false;
      }
    }

    return true;
  }

  private static parseAndCalculate(expression: string): number {
    // Diviser par les opérateurs en gardant les opérateurs
    const tokens = this.tokenize(expression);
    
    // Calculer selon l'ordre des opérations
    return this.calculateWithPrecedence(tokens);
  }

  private static tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let currentNumber = '';

    for (const char of expression) {
      if (this.OPERATORS.includes(char)) {
        if (currentNumber) {
          tokens.push(currentNumber);
          currentNumber = '';
        }
        tokens.push(char);
      } else {
        currentNumber += char;
      }
    }

    if (currentNumber) {
      tokens.push(currentNumber);
    }

    return tokens;
  }

  private static calculateWithPrecedence(tokens: string[]): number {
    // Première passe: multiplication et division
    let i = 1;
    while (i < tokens.length) {
      if (tokens[i] === '*' || tokens[i] === '/') {
        const left = parseFloat(tokens[i - 1]);
        const right = parseFloat(tokens[i + 1]);
        const operator = tokens[i];

        let result: number;
        if (operator === '*') {
          result = left * right;
        } else {
          if (right === 0) {
            throw new Error('Division par zéro');
          }
          result = left / right;
        }

        // Remplacer les 3 tokens par le résultat
        tokens.splice(i - 1, 3, result.toString());
      } else {
        i += 2;
      }
    }

    // Deuxième passe: addition et soustraction
    i = 1;
    while (i < tokens.length) {
      if (tokens[i] === '+' || tokens[i] === '-') {
        const left = parseFloat(tokens[i - 1]);
        const right = parseFloat(tokens[i + 1]);
        const operator = tokens[i];

        const result = operator === '+' ? left + right : left - right;

        // Remplacer les 3 tokens par le résultat
        tokens.splice(i - 1, 3, result.toString());
      } else {
        i += 2;
      }
    }

    return parseFloat(tokens[0]);
  }

  /**
   * Valide si une chaîne est un nombre valide
   */
  static isValidNumber(value: string): boolean {
    return this.NUMBERS.test(value) && !isNaN(parseFloat(value));
  }

  /**
   * Formate un nombre pour l'affichage
   */
  static formatNumber(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }
}