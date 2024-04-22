import _ from "lodash";
import React from "react";

import blocks from "~/core/blocks";

import Item from "./Item";

export default function (): JSX.Element {
  return (
    <div className="vstack gap-3">
      {_.map(blocks, ({ type, title, boxStyle }) => (
        <Item key={type} type={type} title={title} boxStyle={boxStyle} />
      ))}
    </div>
  );
}
