"use client";
import { useState } from "react";
import Link from "next/link";

import { Group, Code } from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconUserCircle,
  IconClipboardPlus,
} from "@tabler/icons-react";
import classes from "./sidebar.module.css";

const data = [
  {
    link: "/dashboard/subscriptions",
    label: "Subscriptions",
    icon: IconReceipt2,
  },
  {
    link: "/dashboard/create",
    label: "Create a subscription plan",
    icon: IconClipboardPlus,
  },
];

export default function Sidebar() {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <IconUserCircle size={28} color="white" />
          <Code fw={700} className={classes.version}>
            v3.1.2
          </Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
