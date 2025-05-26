import React, { useMemo } from "react";

interface SuggestionsPanelProps {
  text: string;
  contentType: string;
}

interface Suggestion {
  tag: string;
  message: string;
  type: "error" | "warning" | "info";
}

const WEAK_WORDS = ["peut-être", "probablement", "essayer", "penser", "croire"];
const PASSIVE_INDICATORS = ["est fait", "a été", "sera fait", "être"];
const VAGUE_WORDS = ["chose", "truc", "beaucoup", "plusieurs", "certains"];
const FILLER_WORDS = ["vraiment", "très", "assez", "plutôt", "quelque peu"];

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  text,
  contentType,
}) => {
  const suggestions = useMemo(() => {
    const suggestions: Suggestion[] = [];

    if (!text.trim()) return suggestions;

    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // Phrases trop longues
    const longSentences = sentences.filter(
      (s) => s.trim().split(/\s+/).length > 25
    );
    if (longSentences.length > 0) {
      suggestions.push({
        tag: "Phrases trop longues",
        message: `${longSentences.length} phrase(s) dépassent 25 mots. Divisez-les.`,
        type: "warning",
      });
    }

    // Langage faible
    const weakWordsFound = words.filter((word) =>
      WEAK_WORDS.some((weak) => word.includes(weak))
    );
    if (weakWordsFound.length > 0) {
      suggestions.push({
        tag: "Langage faible",
        message: `Évitez: ${weakWordsFound
          .slice(0, 3)
          .join(", ")}. Soyez plus affirmatif.`,
        type: "warning",
      });
    }

    // Voix passive
    const hasPassive = PASSIVE_INDICATORS.some((indicator) =>
      text.toLowerCase().includes(indicator)
    );
    if (hasPassive) {
      suggestions.push({
        tag: "Trop passif",
        message: "Utilisez la voix active pour plus d'impact.",
        type: "error",
      });
    }

    // Mots vagues
    const vagueWordsFound = words.filter((word) =>
      VAGUE_WORDS.some((vague) => word.includes(vague))
    );
    if (vagueWordsFound.length > 1) {
      suggestions.push({
        tag: "Trop vague",
        message: "Soyez plus spécifique dans vos formulations.",
        type: "warning",
      });
    }

    // Mots de remplissage
    const fillerWordsFound = words.filter((word) =>
      FILLER_WORDS.some((filler) => word.includes(filler))
    );
    if (fillerWordsFound.length > 2) {
      suggestions.push({
        tag: "Mots inutiles",
        message: `Supprimez les mots de remplissage: ${fillerWordsFound
          .slice(0, 3)
          .join(", ")}.`,
        type: "info",
      });
    }

    // Suggestions par type de contenu
    if (contentType === "cta") {
      if (text.length < 10) {
        suggestions.push({
          tag: "CTA trop court",
          message: "Ajoutez une valeur ou un bénéfice à votre CTA.",
          type: "info",
        });
      }

      const genericCTA = ["cliquez ici", "en savoir plus", "voir plus"];
      const hasGenericCTA = genericCTA.some((cta) =>
        text.toLowerCase().includes(cta)
      );
      if (hasGenericCTA) {
        suggestions.push({
          tag: "CTA générique",
          message: "Votre CTA manque de spécificité. Soyez plus précis.",
          type: "error",
        });
      }
    }

    if (contentType === "email") {
      if (!text.toLowerCase().includes("vous")) {
        suggestions.push({
          tag: "Manque de personnalisation",
          message: "Utilisez 'vous' pour créer une connexion personnelle.",
          type: "warning",
        });
      }

      const questionMarks = (text.match(/\?/g) || []).length;
      if (questionMarks === 0 && text.length > 50) {
        suggestions.push({
          tag: "Manque d'engagement",
          message: "Posez des questions pour engager votre lecteur.",
          type: "info",
        });
      }
    }

    if (contentType === "social-ad") {
      if (text.length > 125) {
        suggestions.push({
          tag: "Trop long",
          message: "Les publications courtes performent mieux sur les réseaux.",
          type: "warning",
        });
      }

      const hasHashtags = text.includes("#");
      if (!hasHashtags && text.length > 20) {
        suggestions.push({
          tag: "Missing hashtags",
          message: "Ajoutez des hashtags pour améliorer la visibilité.",
          type: "info",
        });
      }
    }

    if (contentType === "landing-page") {
      const hasNumbers = /\d/.test(text);
      if (!hasNumbers) {
        suggestions.push({
          tag: "Manque de preuves",
          message: "Ajoutez des chiffres pour renforcer votre crédibilité.",
          type: "info",
        });
      }

      if (text.length < 100) {
        suggestions.push({
          tag: "Contenu insuffisant",
          message: "Une landing page nécessite plus de contenu.",
          type: "warning",
        });
      }
    }

    return suggestions;
  }, [text, contentType]);

  const getTagColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Suggestions d'amélioration
      </h3>

      {suggestions.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <span className="text-2xl mb-2 block">✅</span>
          <p className="text-sm">Aucune amélioration détectée !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="space-y-2">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(
                  suggestion.type
                )}`}
              >
                {suggestion.tag}
              </div>
              <p className="text-sm text-gray-700 pl-1">{suggestion.message}</p>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            💡 Concentrez-vous d'abord sur les suggestions rouges, puis jaunes.
          </p>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
