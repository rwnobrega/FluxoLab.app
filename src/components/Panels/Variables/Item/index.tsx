import React from "react";

import ItemName from "./Name";
import ItemRemove from "./Remove";
import ItemType from "./Type";
import ItemValue from "./Value";

export interface Props {
  id: string;
  type: string;
  disabled: boolean;
}

export default function (props: Props): JSX.Element {
  return (
    <tr key={props.id}>
      <td>
        <ItemName {...props} />
      </td>
      <td>
        <ItemType {...props} />
      </td>
      <td className="w-100">
        <ItemValue {...props} />
      </td>
      <td>
        <ItemRemove {...props} />
      </td>
    </tr>
  );
}
