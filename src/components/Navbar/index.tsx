import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Stack from "react-bootstrap/Stack";

import Brand from "./Brand";
import MenuFlowchart from "./MenuFlowchart";
import MenuHelp from "./MenuHelp";
import MenuLanguage from "./MenuLanguage";
import Title from "./Title";

export default function (): JSX.Element {
  return (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Stack direction="horizontal" gap={3} className="flex-fill mx-3">
        <Brand />
        <Title />
        <MenuFlowchart />
        <MenuLanguage />
        <MenuHelp />
      </Stack>
    </Navbar>
  );
}
