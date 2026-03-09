import { useState } from "react";

export default function Contact({ data, onUpdate, isEditing }) {
  const [localData, setLocalData] = useState(data);

  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-theme">
      <div className="container mx-auto px-6">
        {isEditing ? (
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800 dark:text-white"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleChange("title", e.target.innerText)}
          >
            {localData.title || "Contact Us"}
          </h2>
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800 dark:text-white">
            {localData.title || "Contact Us"}
          </h2>
        )}
        
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          We'd love to hear from you. Get in touch with us!
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Email</h3>
                {isEditing ? (
                  <p
                    className="text-slate-600 dark:text-slate-400"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("email", e.target.innerText)}
                  >
                    {localData.email || "contact@example.com"}
                  </p>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {localData.email || "contact@example.com"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Phone</h3>
                {isEditing ? (
                  <p
                    className="text-slate-600 dark:text-slate-400"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("phone", e.target.innerText)}
                  >
                    {localData.phone || "+1 234 567 890"}
                  </p>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {localData.phone || "+1 234 567 890"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Address</h3>
                {isEditing ? (
                  <p
                    className="text-slate-600 dark:text-slate-400"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleChange("address", e.target.innerText)}
                  >
                    {localData.address || "123 Street, City"}
                  </p>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {localData.address || "123 Street, City"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
