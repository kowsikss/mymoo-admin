import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./LanguageSwitcher.css";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

function LanguageSwitcher() {
  const location = useLocation();
  const [language, setLanguage] = useState(() => (
    localStorage.getItem("homeLanguage") || "en"
  ));

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "hi,ta,te,kn,ml",
        autoDisplay: false,
      }, "google_translate_element");
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      if (languages.some((option) => option.code === event.detail)) {
        setLanguage(event.detail);
      }
    };

    window.addEventListener("app-language-change", handleLanguageChange);
    return () => window.removeEventListener("app-language-change", handleLanguageChange);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") return undefined;

    const timer = window.setTimeout(() => {
      const translateSelect = document.querySelector(".goog-te-combo");
      if (!translateSelect) return;
      translateSelect.value = language === "en" ? "" : language;
      translateSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [language, location.pathname]);

  const changeLanguage = (event) => {
    const nextLanguage = event.target.value;
    localStorage.setItem("homeLanguage", nextLanguage);
    setLanguage(nextLanguage);

    if (nextLanguage === "en") {
      const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
      document.cookie = `${expired}; path=/`;
      document.cookie = `${expired}; path=${location.pathname}`;

      const translateSelect = document.querySelector(".goog-te-combo");
      if (translateSelect) {
        translateSelect.value = "";
        translateSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else {
      document.cookie = `googtrans=/en/${nextLanguage}; path=/`;
      const translateSelect = document.querySelector(".goog-te-combo");
      if (translateSelect) {
        translateSelect.value = nextLanguage;
        translateSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    window.setTimeout(() => window.location.reload(), 250);
  };

  if (location.pathname === "/") return <div id="google_translate_element" className="google-translate-hidden" />;

  return (
    <>
      <div id="google_translate_element" className="google-translate-hidden" />
      <label className="app-language-switcher">
        <span aria-hidden="true">文</span>
        <select
          aria-label="Choose page language"
          title="Translation is provided by Google Translate."
          value={language}
          onChange={changeLanguage}
        >
          {languages.map((option) => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
      </label>
    </>
  );
}

export default LanguageSwitcher;