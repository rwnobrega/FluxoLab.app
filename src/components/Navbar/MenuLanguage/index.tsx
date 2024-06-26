import _ from "lodash";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Tooltip from "~/components/General/Tooltip";
import useStoreEphemeral from "~/store/useStoreEphemeral";
import useStoreStrings from "~/store/useStoreStrings";

export default function (): JSX.Element {
  const {
    getString,
    language: currentLanguage,
    setLanguage,
  } = useStoreStrings();
  const { triggerToast } = useStoreEphemeral();

  const languages: Record<string, string> = {
    en: "English",
    "pt-BR": "Português (BR)",
  };
  const handleClick = (language: string) => {
    setLanguage(language);
    triggerToast({
      message: getString("ToastMessage_LanguageChanged", {
        language: languages[language],
      }),
      icon: "bi-check2-circle",
      background: "success",
    });
  };

  return (
    <Dropdown align="end">
      <Tooltip text={getString("MenuLanguage_Tooltip")}>
        <Dropdown.Toggle>
          <i className="bi bi-globe" />
        </Dropdown.Toggle>
      </Tooltip>
      <Dropdown.Menu>
        {_.map(languages, (label, language) => (
          <Dropdown.Item key={language} onClick={() => handleClick(language)}>
            {language === currentLanguage ? (
              <i className="bi bi-check2" />
            ) : null}{" "}
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
