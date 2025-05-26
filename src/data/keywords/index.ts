import actionVerbs from "./actionVerbs.json";
import emotionalWords from "./emotionalWords.json";
import rationalWords from "./rationalWords.json";
import complexWords from "./complexWords.json";
import formalIndicators from "./formalIndicators.json";
import informalIndicators from "./informalIndicators.json";

export const KEYWORDS = {
  ACTION_VERBS: actionVerbs,
  EMOTIONAL_WORDS: emotionalWords,
  RATIONAL_WORDS: rationalWords,
  COMPLEX_WORDS: complexWords,
  FORMAL_INDICATORS: formalIndicators,
  INFORMAL_INDICATORS: informalIndicators,
} as const;

export type KeywordCategory = keyof typeof KEYWORDS;
