import { useState } from "react";

export default function Pricing({ data, onUpdate, isEditing }) {
  const [localData, setLocalData] = useState(data);

  const handleTitleChange = (value) => {
    const updated = { ...localData, title: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...localData.plans];
    if (typeof updatedPlans[index] === "string") {
      updatedPlans[index] = { name: value, price: "$0", features: [] };
    } else {
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    }
    const updated = { ...localData, plans: updatedPlans };
    setLocalData(updated);
    onUpdate(updated);
  };

  const plans = localData.plans || [];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-theme">
      <div className="container mx-auto px-6">
        {isEditing ? (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800 dark:text-white"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleTitleChange(e.target.innerText)}
          >
            {localData.title || "Pricing Plans"}
          </h2>
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800 dark:text-white">
            {localData.title || "Pricing Plans"}
          </h2>
        )}
        
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your needs
        </p>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const planData = typeof plan === "string"
              ? { name: plan, price: "$0", features: [] }
              : plan;
            
            const isPopular = index === 1;

            return (
              <div
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  isPopular
                    ? "bg-primary-600 text-white shadow-2xl shadow-primary-500/30 scale-105"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-xl"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                {isEditing ? (
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isPopular ? "text-white" : "text-slate-800 dark:text-white"
                    }`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handlePlanChange(index, "name", e.target.innerText)}
                  >
                    {planData.name}
                  </h3>
                ) : (
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isPopular ? "text-white" : "text-slate-800 dark:text-white"
                    }`}
                  >
                    {planData.name}
                  </h3>
                )}

                {isEditing ? (
                  <div
                    className={`text-4xl font-extrabold mb-6 ${
                      isPopular ? "text-white" : "text-primary-600 dark:text-primary-400"
                    }`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handlePlanChange(index, "price", e.target.innerText)}
                  >
                    {planData.price}
                  </div>
                ) : (
                  <div
                    className={`text-4xl font-extrabold mb-6 ${
                      isPopular ? "text-white" : "text-primary-600 dark:text-primary-400"
                    }`}
                  >
                    {planData.price}
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {(planData.features || []).map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className={`flex items-center ${
                        isPopular
                          ? "text-primary-100"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 mr-3 ${
                          isPopular ? "text-white" : "text-green-500"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {isEditing ? (
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const features = [...planData.features];
                            features[fIndex] = e.target.innerText;
                            handlePlanChange(index, "features", features);
                          }}
                        >
                          {feature}
                        </span>
                      ) : (
                        feature
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isPopular
                      ? "bg-white text-primary-600 hover:bg-primary-50"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
