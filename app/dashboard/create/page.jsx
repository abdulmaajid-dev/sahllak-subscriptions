"use client";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  NumberInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Flex,
  Title,
  rem,
} from "@mantine/core";

//Icons
import { IconUserPlus } from "@tabler/icons-react";

export default function Create() {
  const form = useForm({
    initialValues: {
      clientName: "",
      clientCompany: "",
      onboardingCost: "",
      subscriptionCost: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form.values.clientName);
    console.log(form.values.clientCompany);
    console.log(form.values.onboardingCost);
    console.log(form.values.subscriptionCost);

    form.reset();

    await fetch("http://localhost:3000/api/client", {
      method: "POST",
      body: JSON.stringify({
        client_name: form.values.clientName,
        client_company: form.values.clientCompany,
        onboarding_cost: form.values.onboardingCost,
        subscription_cost: form.values.subscriptionCost,
      }),
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
              label="Organization name"
              placeholder="Mehdi Ahmed"
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
              placeholder="Enter value in 1000s (For eg: 1000 = 1 OMR)"
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
              placeholder="Enter value in 1000s (For eg: 1000 = 1 OMR)"
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
