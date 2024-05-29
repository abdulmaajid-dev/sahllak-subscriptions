"use client";
import axios from "axios";
import {
  Title,
  Text,
  Button,
  rem,
  Flex,
  Group,
  Paper,
  ThemeIcon,
  Table,
  ScrollArea,
  Card,
} from "@mantine/core";

//Icons
import { IconUserPlus } from "@tabler/icons-react";

export default function Create() {
  return (
    <>
      <Flex
        mih={50}
        gap="xl"
        justify="flex-start"
        align="center"
        direction="row"
      >
        <Title ml={50} mt={50} style={{ fontWeight: 800 }}>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: "purple", to: "yellow" }}
          >
            Create Subscriptions
          </Text>
        </Title>
        <Button
          mt={50}
          variant="light"
          rightSection={
            <IconUserPlus
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          }
          radius="xl"
          size="md"
          styles={
            {
              // root: { paddingRight: rem(14), height: rem(48) },
              // section: { marginLeft: rem(22) },
            }
          }
          onClick={() => console.log("Opened Modal")}
        >
          Create a new Subscription
        </Button>
      </Flex>
    </>
  );
}
