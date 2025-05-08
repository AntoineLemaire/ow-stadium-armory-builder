import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  console.log("Current language:", i18n.language);
  return (
    <div>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
    </div>
  );
};

export default LanguageSwitcher;
