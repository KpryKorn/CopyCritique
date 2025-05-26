import React, { useState, useCallback } from "react";
import CustomDropdown from "./CustomDropdown";

interface TextEditorProps {
  onTextChange?: (text: string) => void;
  onContentTypeChange?: (type: string) => void;
}

const CONTENT_TYPES = [
  { value: "email", label: "Email" },
  { value: "cta", label: "CTA" },
  { value: "landing-page", label: "Texte de landing page" },
  { value: "social-ad", label: "Publicité réseaux sociaux" },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  onTextChange,
  onContentTypeChange,
}) => {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("email");

  const countWords = useCallback((text: string): number => {
    return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  }, []);

  const countCharacters = useCallback((text: string): number => {
    return text.length;
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  };

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    onContentTypeChange?.(type);
  };

  const wordCount = countWords(text);
  const characterCount = countCharacters(text);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
        <div className="w-full sm:w-64">
          <CustomDropdown
            options={CONTENT_TYPES}
            value={contentType}
            onChange={handleContentTypeChange}
            label="Type de contenu"
          />
        </div>

        {/* Statistiques */}
        <div className="flex gap-6 text-sm text-gray-500">
          <span>{wordCount} mots</span>
          <span>{characterCount} caractères</span>
        </div>
      </div>

      {/* Zone de texte */}
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Commencez à écrire..."
        rows={20}
        className="w-full p-4 border border-gray-200 rounded-md resize-y focus:outline-none focus:border-gray-400 placeholder-gray-400 text-gray-900 leading-relaxed transition-colors"
      />
    </>
  );
};

export default TextEditor;
