import _ from "lodash";
import React from "react";

import { blockTypeIds } from "~/core/blockTypes";

import Item from "./Item";

export default function (): JSX.Element {
  return (
    <div className="vstack gap-3">
      {_.map(blockTypeIds, (blockTypeId) => (
        <Item key={blockTypeId} blockTypeId={blockTypeId} />
      ))}
    </div>
  );
}
