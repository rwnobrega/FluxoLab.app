import React from "react";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import Stack from "react-bootstrap/Stack";

import Logo from "/FluxoLab.svg";

export default function (): JSX.Element {
  return (
    <Stack direction="horizontal" className="flex-fill" gap={2}>
      <Image src={Logo} alt="Logo" width="24" height="24" />
      <Navbar.Brand>FluxoLab</Navbar.Brand>
    </Stack>
  );
}
