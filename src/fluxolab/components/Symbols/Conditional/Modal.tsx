import React from "react";

import useStoreStrings from "stores/useStoreStrings";

import SymbolModal from "../SymbolModal";
import { ModalProps } from "..";

export default function (otherProps: ModalProps): JSX.Element {
  const { getString } = useStoreStrings();
  return (
    <SymbolModal
      title={getString("Symbol_Conditional")}
      matchStartRule="Expression"
      placeholder={getString("Symbol_ConditionalPlaceholder")}
      {...otherProps}
    />
  );
}
