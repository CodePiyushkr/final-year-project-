import { useState } from "react";

export default function Hero({ data, onUpdate, isEditing }) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-theme">
      <div className="container mx-auto px-6 text-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {isEditing ? (
            <h1
              className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleChange("title", e.target.innerText)}
            >
              {localData.title}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
              {localData.title}
            </h1>
          )}

          {isEditing ? (
            <p
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleChange("subtitle", e.target.innerText)}
            >
              {localData.subtitle}
            </p>
          ) : (
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              {localData.subtitle}
            </p>
          )}

          <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl">
            {isEditing ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChange("buttonText", e.target.innerText)}
              >
                {localData.buttonText || "Get Started"}
              </span>
            ) : (
              localData.buttonText || "Get Started"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
