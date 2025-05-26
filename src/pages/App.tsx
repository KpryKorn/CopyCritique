import { useState } from "react";
import TextEditor from "../components/TextEditor.tsx";
import ContentAnalysis from "../components/ContentAnalysis.tsx";
import SuggestionsPanel from "../components/SuggestionsPanel.tsx";

export default function App() {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("email");

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Copy Critique
        </h1>
        <p className="text-gray-600">Analysez et améliorez votre contenu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TextEditor
            onTextChange={setText}
            onContentTypeChange={setContentType}
          />
        </div>

        <div className="lg:col-span-1">
          <ContentAnalysis text={text} contentType={contentType} />
          <SuggestionsPanel text={text} contentType={contentType} />
        </div>
      </div>
    </div>
  );
}
