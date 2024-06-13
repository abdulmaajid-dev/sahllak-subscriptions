"use client";
import axios from "axios";
import {
  Title,
  Text,
  Group,
  Paper,
  ThemeIcon,
  Table,
  ScrollArea,
  Card,
  Button,
  rem,
} from "@mantine/core";

import { useClipboard } from "@mantine/hooks";

import ActiveSubscriptionsSkeleton from "../../../components/UI/Skeleton/ActiveSubscriptionsSkeleton";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";

import { IconCopy, IconCheck } from "@tabler/icons-react";

export default function Subscriptions() {
  const clipboard = useClipboard();

  const getAuthorizationToken = async () => {
    setLoading(true);

    const response = await fetch("http://localhost:3000/api/client", {
      method: "GET",
    }).then((res) => {
      return res.json();
    });

    console.log(response);

    setRowData(response.data);

    setLoading(false);
  };

  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getAuthorizationToken();
  }, []);

  const getPaymentLink = async (id, oc) => {
    const response = await fetch("http://localhost:3000/api/paymob", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        onboardingCost: oc,
      }),
    }).then((res) => {
      return res.json();
    });

    const { client_secret } = response;

    clipboard.copy(
      `https://oman.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
    );
  };

  return (
    <>
      <Title ml={50} mt={50} style={{ fontWeight: 800 }}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "purple", to: "yellow" }}
        >
          Active Subscription Plans
        </Text>
      </Title>
      <Paper withBorder p="md" radius="md" mt={50} ml={50} w={500}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              Total
            </Text>
            <Text fw={700} fz="xl">
              3
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color: "var(--mantine-color-teal-6)",
            }}
            size={38}
            radius="md"
          >
            <IconArrowUpRight size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={5 > 0 ? "teal" : "red"} fw={700}>
            5%
          </Text>{" "}
          {5 > 0 ? "increase" : "decrease"} compared to last month
        </Text>
      </Paper>

      <Card
        shadow="lg"
        padding="md"
        radius="md"
        withBorder
        w={rem(1200)}
        ml={50}
        mt={50}
      >
        {loading == true ? (
          <ActiveSubscriptionsSkeleton />
        ) : (
          <ScrollArea
            h={rem(500)}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table miw={500} w={rem(1000)}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Client Name</Table.Th>
                  <Table.Th>Company Name</Table.Th>
                  <Table.Th>Onboarding Cost</Table.Th>
                  <Table.Th>Subscription Cost</Table.Th>
                  <Table.Th>Initial Action</Table.Th>
                  <Table.Th>Initial Action Success</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rowData.length !== 0 &&
                  rowData.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>{row.client_name}</Table.Td>
                      <Table.Td>{row.client_company_name}</Table.Td>
                      <Table.Td>{row.onboarding_cost / 1000} OMR</Table.Td>
                      <Table.Td>{row.subscription_cost / 1000} OMR</Table.Td>
                      <Table.Td>
                        <Button
                          size="sm"
                          radius="l"
                          onClick={() => {
                            getPaymentLink(row.id, row.onboarding_cost);
                          }}
                          rightSection={
                            clipboard.copied ? (
                              <IconCheck
                                style={{ width: rem(20), height: rem(20) }}
                                stroke={1.5}
                              />
                            ) : (
                              <IconCopy
                                style={{ width: rem(20), height: rem(20) }}
                                stroke={1.5}
                              />
                            )
                          }
                        >
                          Create payment
                        </Button>
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </>
  );
}
