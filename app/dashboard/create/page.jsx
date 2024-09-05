"use client";
import { useState } from "react";
import { useToggle, upperFirst } from "@mantine/hooks";
import { hasLength, useForm } from "@mantine/form";
import {
  TextInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Stack,
  Flex,
  Title,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

//Icons
import { IconUserPlus } from "@tabler/icons-react";
import { IconExclamationCircle } from "@tabler/icons-react";
import { IconUserUp } from "@tabler/icons-react";

//styles
import classes from "../subscriptions/subscriptions.module.css";

export default function Create() {
  const form = useForm({
    initialValues: {
      clientName: "",
      email: "",
      phoneNumber: "",
      clientCompany: "",
      onboardingCost: "",
      subscriptionCost: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.values.clientCompany ||
      !form.values.clientName ||
      !form.values.onboardingCost ||
      !form.values.subscriptionCost ||
      !form.values.email ||
      !form.values.phoneNumber
    ) {
      return notifications.show({
        title: "Error Submitting",
        message: "Please fill in all the client details!",
        color: "red",
        radius: "sm",
        bg: "#d63031",
        withBorder: true,
        icon: <IconExclamationCircle />,
        classNames: classes,
      });
    }

    form.reset();

    await fetch("/api/client", {
      method: "POST",
      body: JSON.stringify({
        client_name: form.values.clientName,
        email: form.values.email,
        client_phone: form.values.phoneNumber,
        client_company: form.values.clientCompany,
        onboarding_cost: form.values.onboardingCost * 1000,
        subscription_cost: form.values.subscriptionCost * 1000,
      }),
    });
    notifications.show({
      title: "Client Successfully Added",
      color: "green",
      message: "The client details have been added to the database",
      icon: <IconUserUp />,
      bg: "#55efc4",
    });
  };

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
      <Paper ml={50} mt={50} radius="md" p="xl" w={rem(800)} withBorder>
        <Text size="lg" fw={500}>
          Please fill in the Client details
        </Text>
        <Divider my="lg" />

        <form>
          <Stack>
            <TextInput
              required
              label="Client Name"
              placeholder="Mehdi Ahmed"
              value={form.values.clientName}
              onChange={(event) =>
                form.setFieldValue("clientName", event.currentTarget.value)
              }
              radius="md"
            />
            <TextInput
              required
              label="Client Email"
              placeholder="mehdi@sahllak.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              radius="md"
            />
            <TextInput
              required
              label="Client Phone"
              placeholder="78784037"
              value={form.values.phoneNumber}
              onChange={(event) =>
                form.setFieldValue("phoneNumber", event.currentTarget.value)
              }
              radius="md"
            />
            <TextInput
              required
              label="Organization name"
              placeholder="Sahllak Innovations LLC."
              value={form.values.clientCompany}
              onChange={(event) =>
                form.setFieldValue("clientCompany", event.currentTarget.value)
              }
              radius="md"
            />
            <TextInput
              type="number"
              required
              label="Onboarding Cost"
              placeholder="Example: 1, 5, 10"
              value={form.values.onboardingCost}
              onChange={(event) =>
                form.setFieldValue("onboardingCost", event.currentTarget.value)
              }
              radius="md"
            />
            <TextInput
              type="number"
              required
              label="Subscription Cost"
              placeholder="Example: 50, 100, 200"
              value={form.values.subscriptionCost}
              onChange={(event) =>
                form.setFieldValue(
                  "subscriptionCost",
                  event.currentTarget.value
                )
              }
              radius="md"
            />
          </Stack>
          <Group justify="flex-end" mt="xl">
            <Button radius="l" onClick={handleSubmit}>
              Add Client
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
}
