import { useState } from "react";

export default function Features({ data, onUpdate, isEditing }) {
  const [localData, setLocalData] = useState(data);

  const handleTitleChange = (value) => {
    const updated = { ...localData, title: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...localData.items];
    if (typeof updatedItems[index] === "string") {
      updatedItems[index] = { title: value, description: "", icon: "⭐" };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    const updated = { ...localData, items: updatedItems };
    setLocalData(updated);
    onUpdate(updated);
  };

  const items = localData.items || [];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-theme">
      <div className="container mx-auto px-6">
        {isEditing ? (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-white"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleTitleChange(e.target.innerText)}
          >
            {localData.title || "Our Features"}
          </h2>
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-white">
            {localData.title || "Our Features"}
          </h2>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const itemData = typeof item === "string" 
              ? { title: item, description: "", icon: "⭐" } 
              : item;

            return (
              <div
                key={index}
                className="group p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {isEditing ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleItemChange(index, "icon", e.target.innerText)}
                    >
                      {itemData.icon || "⭐"}
                    </span>
                  ) : (
                    itemData.icon || "⭐"
                  )}
                </div>
                
                {isEditing ? (
                  <h3
                    className="text-xl font-semibold mb-3 text-slate-800 dark:text-white"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemChange(index, "title", e.target.innerText)}
                  >
                    {itemData.title}
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-white">
                    {itemData.title}
                  </h3>
                )}

                {isEditing ? (
                  <p
                    className="text-slate-600 dark:text-slate-400"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleItemChange(index, "description", e.target.innerText)}
                  >
                    {itemData.description || "Click to add description"}
                  </p>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {itemData.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
