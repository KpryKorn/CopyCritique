import React, { useMemo } from "react";
import { KEYWORDS } from "../data/keywords";

interface ContentAnalysisProps {
  text: string;
  contentType: string;
}

export const ContentAnalysis: React.FC<ContentAnalysisProps> = ({
  text,
  contentType,
}) => {
  const analysis = useMemo(() => {
    if (!text.trim()) {
      return {
        avgSentenceLength: 0,
        complexWords: 0,
        actionVerbs: 0,
        tone: "neutre",
        emotionalRatio: 0,
        rationalRatio: 0,
      };
    }

    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // Longueur moyenne des phrases
    const avgSentenceLength =
      sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

    // Compter les mots compliqués
    const complexWords = words.filter(
      (word) =>
        KEYWORDS.COMPLEX_WORDS.some((complex) => word.includes(complex)) ||
        word.length > 12
    ).length;

    // Compter les verbes d'action
    const actionVerbs = words.filter((word) =>
      KEYWORDS.ACTION_VERBS.some((action) => word.includes(action))
    ).length;

    // Analyser le ton
    const formalCount = words.filter((word) =>
      KEYWORDS.FORMAL_INDICATORS.some((formal) => word.includes(formal))
    ).length;
    const informalCount = words.filter((word) =>
      KEYWORDS.INFORMAL_INDICATORS.some((informal) => word.includes(informal))
    ).length;

    let tone = "neutre";
    if (formalCount > informalCount) tone = "formel";
    if (informalCount > formalCount) tone = "informel";

    // Calculer les ratios émotionnel/rationnel
    const emotionalCount = words.filter((word) =>
      KEYWORDS.EMOTIONAL_WORDS.some((emotional) => word.includes(emotional))
    ).length;
    const rationalCount = words.filter((word) =>
      KEYWORDS.RATIONAL_WORDS.some((rational) => word.includes(rational))
    ).length;

    const totalRelevantWords = emotionalCount + rationalCount;
    const emotionalRatio =
      totalRelevantWords > 0
        ? Math.round((emotionalCount / totalRelevantWords) * 100)
        : 0;
    const rationalRatio =
      totalRelevantWords > 0
        ? Math.round((rationalCount / totalRelevantWords) * 100)
        : 0;

    return {
      avgSentenceLength,
      complexWords,
      actionVerbs,
      tone,
      emotionalRatio,
      rationalRatio,
    };
  }, [text]);

  const getScoreColor = (value: number, good: number, bad: number) => {
    if (value <= good) return "text-green-600 bg-green-50";
    if (value >= bad) return "text-red-600 bg-red-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "formel":
        return "text-blue-600 bg-blue-50";
      case "informel":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Analyse instantanée
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Longueur des phrases */}
        <div className="text-center">
          <div
            className={`rounded-lg p-3 ${getScoreColor(
              analysis.avgSentenceLength,
              15,
              25
            )}`}
          >
            <div className="text-2xl font-bold">
              {analysis.avgSentenceLength}
            </div>
            <div className="text-xs font-medium">Mots/phrase</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Idéal: 10-15 mots</p>
        </div>

        {/* Mots compliqués */}
        <div className="text-center">
          <div
            className={`rounded-lg p-3 ${getScoreColor(
              analysis.complexWords,
              2,
              8
            )}`}
          >
            <div className="text-2xl font-bold">{analysis.complexWords}</div>
            <div className="text-xs font-medium">Mots compliqués</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Moins = mieux</p>
        </div>

        {/* Verbes d'action */}
        <div className="text-center">
          <div
            className={`rounded-lg p-3 ${
              analysis.actionVerbs >= 2
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            <div className="text-2xl font-bold">{analysis.actionVerbs}</div>
            <div className="text-xs font-medium">Verbes d'action</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Plus = mieux</p>
        </div>

        {/* Ton */}
        <div className="text-center">
          <div className={`rounded-lg p-3 ${getToneColor(analysis.tone)}`}>
            <div className="text-lg font-bold capitalize">{analysis.tone}</div>
            <div className="text-xs font-medium">Ton détecté</div>
          </div>
        </div>

        {/* Ratio émotionnel */}
        <div className="text-center">
          <div className="rounded-lg p-3 bg-pink-50 text-pink-600">
            <div className="text-2xl font-bold">{analysis.emotionalRatio}%</div>
            <div className="text-xs font-medium">Émotionnel</div>
          </div>
        </div>

        {/* Ratio rationnel */}
        <div className="text-center">
          <div className="rounded-lg p-3 bg-indigo-50 text-indigo-600">
            <div className="text-2xl font-bold">{analysis.rationalRatio}%</div>
            <div className="text-xs font-medium">Rationnel</div>
          </div>
        </div>
      </div>

      {/* Recommandations basées sur le type de contenu */}
      {contentType === "cta" && analysis.actionVerbs === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 Ajoutez des verbes d'action pour un CTA plus efficace
          </p>
        </div>
      )}

      {contentType === "email" && analysis.tone === "formel" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Un ton plus personnel pourrait améliorer l'engagement
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentAnalysis;
