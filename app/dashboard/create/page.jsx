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
import Notification from "../../../components/UI/Notification/Notification";

export default function Create() {
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm({
    initialValues: {
      clientName: "",
      email: "",
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
      !form.values.email
    ) {
      setError(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setError(false);
      return;
    }

    form.reset();

    await fetch("/api/client", {
      method: "POST",
      body: JSON.stringify({
        client_name: form.values.clientName,
        email: form.values.email,
        client_company: form.values.clientCompany,
        onboarding_cost: form.values.onboardingCost * 1000,
        subscription_cost: form.values.subscriptionCost * 1000,
      }),
    });
    notifications.show({
      title: "Default notification",
      message: "hello world!",
    });

    setOpened(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setOpened(false);
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
        <Notification
          opened={opened}
          color="green"
          title="User added"
          description="The subscription user has been added, Please head to the dashboard to view them."
        />
        <Notification
          opened={error}
          color="red"
          title="User Adding failed"
          description="Please ensure all the fields are filled."
        />
      </Paper>
    </>
  );
}
