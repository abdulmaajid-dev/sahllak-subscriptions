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

import ActiveSubscriptionsSkeleton from "../../../components/UI/Skeleton/ActiveSubscriptionsSkeleton";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function Subscriptions() {
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

    // const key = process.env.NEXT_PUBLIC_PAYMOB_API_KEY;

    // const data = {
    //   api_key: key,
    // };

    // const response = await axios
    //   .post("https://oman.paymob.com/api/auth/tokens", data)
    //   .then((res) => {
    //     return res.data.token;
    //   });

    // console.log("Response:", response);

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: response,
    //   },
    // };

    // const activeSubscriptions = await axios
    //   .get("https://oman.paymob.com/api/acceptance/subscription-plans", config)
    //   .then((res) => {
    //     return res.data;
    //   });

    // console.log("Active Subscriptions: ", activeSubscriptions);
  };

  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getAuthorizationToken();
  }, []);

  const getPaymentLink = async () => {
    const response = await fetch("http://localhost:3000/api/paymob", {
      method: "POST",
    }).then((res) => {
      return res.json();
    });

    console.log(response);
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
        w={rem(1500)}
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
            <Table miw={500}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Client Name</Table.Th>
                  <Table.Th>Company Name</Table.Th>
                  <Table.Th>Client Secret</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rowData.length !== 0 &&
                  rowData.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>{row.client_name}</Table.Td>
                      <Table.Td>{row.client_company_name}</Table.Td>
                      <Table.Td>{row.client_secret}</Table.Td>
                      <Table.Td>
                        <Button radius="l" onClick={getPaymentLink}>
                          Generate Payment Link
                        </Button>
                      </Table.Td>
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
