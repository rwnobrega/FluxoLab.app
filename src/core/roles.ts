import { Position } from "reactflow";

import colors from "~/utils/colors";
import palette from "~/utils/palette";

export enum Role {
  Start = "start",
  Read = "read",
  Write = "write",
  Assign = "assign",
  Conditional = "conditional",
  End = "end",
}

export interface BoxStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius?: string;
  clipPath?: string;
  clipPathBorder?: string;
}

const ROLES_BOX_STYLES: Record<Role, BoxStyle> = {
  start: {
    backgroundColor: colors.brighter(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
  read: {
    backgroundColor: colors.brighter(palette.blue),
    textColor: "white",
    clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
    clipPathBorder:
      "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
  },
  write: {
    backgroundColor: colors.brighter(palette.green),
    textColor: "white",
    clipPath: "polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
    clipPathBorder:
      "polygon(20px 0, calc(100% + 1px) 0, calc(100% - 21px) 100%, -1px calc(100% - 1px))",
  },
  assign: {
    backgroundColor: colors.brighter(palette.orange),
    textColor: "white",
  },
  conditional: {
    backgroundColor: colors.brighter(palette.red),
    textColor: "white",
    clipPath:
      "polygon(20px 0, 0 50%, 20px 100%, calc(100% - 20px) 100%, 100% 50%, calc(100% - 20px) 0)",
  },
  end: {
    backgroundColor: colors.brighter(palette.purple),
    textColor: "white",
    borderRadius: "15px",
  },
};

export function getRoleBoxStyle(role: Role): BoxStyle {
  return ROLES_BOX_STYLES[role];
}

interface RoleHandles {
  id: string;
  position: Position;
  label?: string;
}

const ROLES_HANDLES: Record<Role, RoleHandles[]> = {
  start: [{ id: "out", position: Position.Bottom }],
  read: [{ id: "out", position: Position.Bottom }],
  write: [{ id: "out", position: Position.Bottom }],
  assign: [{ id: "out", position: Position.Bottom }],
  conditional: [
    { id: "true", position: Position.Bottom, label: "T" },
    { id: "false", position: Position.Right, label: "F" },
  ],
  end: [],
};

export function getRoleHandles(role: Role): RoleHandles[] {
  return ROLES_HANDLES[role];
}
