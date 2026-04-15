import _ from "lodash";
import React from "react";

import { Role } from "~/core/roles";

import Item from "./Item";

export default function (): JSX.Element {
  return (
    <div className="vstack gap-3 bg-light p-3 h-100">
      {_.map(Role, (role) => (
        <Item key={role} role={role} />
      ))}
    </div>
  );
}
