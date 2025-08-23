export interface GrammarIssue {
  index: number;
  message: string;
}

/**
 * Simple helper that checks basic German grammar.
 * Currently verifies that sentences start with an uppercase letter.
 */
export class GermanGrammarAssistant {
  /**
   * Analyze the given text and return an array of grammar issues.
   * @param text German text containing one or more sentences separated by '.'
   */
  check(text: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    const sentences = text.split(/\./);
    sentences.forEach((sentence, idx) => {
      const trimmed = sentence.trim();
      if (!trimmed) return;
      const first = trimmed[0];
      if (first && first === first.toLowerCase()) {
        issues.push({
          index: idx,
          message: 'Sentence should start with an uppercase letter',
        });
      }
    });
    return issues;
  }
}

export default GermanGrammarAssistant;
