import _ from "lodash";
import React from "react";

import blockTypes from "~/core/blockTypes";

import Item from "./Item";

export default function (): JSX.Element {
  return (
    <div className="vstack gap-3">
      {_.map(blockTypes, ({ id, title, boxStyle }) => (
        <Item key={id} typeId={id} title={title} boxStyle={boxStyle} />
      ))}
    </div>
  );
}
