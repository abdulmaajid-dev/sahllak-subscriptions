"use client";
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
  Badge,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { render } from "@react-email/components";
import AWS from "../../../aws-config";

import ActiveSubscriptionsSkeleton from "../../../components/UI/Skeleton/ActiveSubscriptionsSkeleton";
import EmailTemplate from "../../../components/EmailTemplate/EmailTemplate";
import { useState, useEffect } from "react";

//Icons
import { IconUnlink } from "@tabler/icons-react";
import { IconBan } from "@tabler/icons-react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconTrashX } from "@tabler/icons-react";
import { IconExclamationCircle } from "@tabler/icons-react";
import { IconCreditCardPay } from "@tabler/icons-react";
import { IconDeviceFloppy } from "@tabler/icons-react";

//styles
import classes from "./subscriptions.module.css";

export default function Subscriptions() {
  //States of the page start here
  const clipboard = useClipboard();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [success, setSuccess] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  //Row Editing States
  const [rowId, setRowId] = useState(null);
  const [editedData, setEditedData] = useState({
    clientName: "",
    clientEmail: "",
    clientOnboardingCost: 0,
    clientSubscriptionCost: 0,
  });

  //Functions of the page start here
  const getAuthorizationToken = async () => {
    setLoading(true);

    const response = await fetch("/api/client", {
      method: "GET",
    }).then((res) => {
      return res.json();
    });

    console.log(response);

    setRowData(response.data);

    setLoading(false);
  };

  useEffect(() => {
    getAuthorizationToken();
  }, []);

  const getPaymentLink = async (id, oc, name, email, phone) => {
    setLinkLoading(true);
    const response = await fetch("/api/paymob", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        onboardingCost: oc,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
      }),
    }).then((res) => {
      return res.json();
    });

    const { client_secret } = response;

    clipboard.copy(
      `https://oman.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
    );

    notifications.show({
      title: "Payment Link Created!",
      color: "green",
      message:
        "The payment link has been created and has been copied to your clipboard!",
      icon: <IconUnlink />,
    });

    setLinkLoading(false);
  };

  const handleChargeClient = async (id, sc, sd) => {
    const startDate = new Date(sd);
    const endDate = new Date();

    // const difference = Math.floor(
    //   (endDate - startDate) / (1000 * 60 * 60 * 24)
    // );

    // if (difference < 30) {
    //   return notifications.show({
    //     title: "Action not Allowed",
    //     message: "It hasn't been 30 days since the last charge!",
    //     color: "red",
    //     radius: "sm",
    //     bg: "#d63031",
    //     withBorder: true,
    //     icon: <IconExclamationCircle />,
    //     classNames: classes,
    //   });
    // }

    setButtonDisabled(true);
    setLinkLoading(true);
    const response = await fetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify({
        id: id,
        subscriptionCost: sc,
      }),
    }).then((res) => {
      return res.json();
    });
    notifications.show({
      title: "Subscription Charged Successfully",
      color: "green",
      message: "The client has been charged!",
      icon: <IconCreditCardPay />,
      bg: "#55efc4",
    });
    setLinkLoading(false);
    setButtonDisabled(false);
    getAuthorizationToken();
  };

  const sendEmail = async (clientName, clientEmail, sd, sc) => {
    const startDate = new Date(sd);
    const paymentDueDate = startDate.getDate() + 30;

    const body = render(
      <EmailTemplate
        clientName={clientName}
        subscriptionCost={sc}
        clientEmail={clientEmail}
        subscriptionDate={sd}
      />
    );

    const params = {
      Destination: {
        ToAddresses: [clientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Monthly Payment Charge",
        },
      },
      Source: "payments@sahllak.com",
    };

    const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();

    sendPromise.then((data) => {
      console.log(data.MessageId);
      return new Response("Email sent successfully", { status: 200 });
    });
  };

  const setRowEditing = (id, name, email, oc, sc) => {
    if (!id) {
      setEditedData({
        clientName: "",
        clientEmail: "",
        clientOnboardingCost: "",
        clientSubscriptionCost: "",
      });
      return setRowId(null);
    }
    setRowId(id);

    setEditedData({
      clientName: name,
      clientEmail: email,
      clientOnboardingCost: oc / 1000,
      clientSubscriptionCost: sc / 1000,
    });
  };

  const handleEditChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setLoading(true);
    const response = await fetch("/api/client", {
      method: "PUT",
      body: JSON.stringify({
        id: rowId,
        clientName: editedData.clientName,
        clientEmail: editedData.clientEmail,
        clientOC: parseFloat(editedData.clientOnboardingCost) * 1000,
        clientSC: parseFloat(editedData.clientSubscriptionCost) * 1000,
      }),
    });
    getAuthorizationToken();

    notifications.show({
      title: "Client Details Updated",
      color: "green",
      message: "The new client details, have been updated and saved.",
      icon: <IconUnlink />,
    });

    setRowId(null);
    setEditedData({
      clientName: "",
      clientEmail: "",
      clientOnboardingCost: "",
      clientSubscriptionCost: "",
    });
  };

  const handleRowDelete = async () => {
    notifications.show({
      title: "Deleting functionality coming soon!",
      color: "blue",
      message: "You will be able to delete clients in the next update!",
      icon: <IconUnlink />,
    });
  };

  //UI of the page starts here
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

      <Group>
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
      </Group>

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
            <Table w={rem(1200)}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Actions</Table.Th>
                  <Table.Th>Client Name</Table.Th>
                  <Table.Th>Client Email</Table.Th>
                  <Table.Th>Company Name</Table.Th>
                  <Table.Th>Onboarding Cost</Table.Th>
                  <Table.Th>Subscription Cost</Table.Th>
                  <Table.Th>Initial Action</Table.Th>
                  <Table.Th>Initial Action Success</Table.Th>
                  <Table.Th>Attempts Failed</Table.Th>
                  <Table.Th>Subscription Action</Table.Th>
                  <Table.Th>Subscription Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rowData.length !== 0 &&
                  rowData.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>
                        {rowId == row.id ? (
                          <ActionIcon
                            variant="transparent"
                            size="xl"
                            onClick={() => {
                              setRowEditing();
                            }}
                          >
                            <IconBan stroke={1.5} color="red" />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            variant="transparent"
                            size="xl"
                            onClick={() => {
                              setRowEditing(
                                row.id,
                                row.client_name,
                                row.email,
                                row.onboarding_cost,
                                row.subscription_cost
                              );
                            }}
                          >
                            <IconEdit stroke={1.5} />
                          </ActionIcon>
                        )}
                        {rowId == row.id ? (
                          <ActionIcon
                            variant="default"
                            size="xl"
                            onClick={handleEditSave}
                          >
                            <IconDeviceFloppy stroke={1.5} color="green" />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            variant="default"
                            size="xl"
                            onClick={handleRowDelete}
                          >
                            <IconTrashX stroke={1.5} color="red" />
                          </ActionIcon>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {rowId == row.id ? (
                          <TextInput
                            variant="filled"
                            placeholder="Client name"
                            name="clientName"
                            value={editedData.clientName}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.client_name
                        )}
                      </Table.Td>
                      <Table.Td>
                        {rowId == row.id ? (
                          <TextInput
                            variant="filled"
                            placeholder="Email"
                            name="clientEmail"
                            value={editedData.clientEmail}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.email
                        )}
                      </Table.Td>
                      <Table.Td>{row.client_company_name}</Table.Td>
                      <Table.Td>
                        {rowId == row.id ? (
                          <TextInput
                            variant="filled"
                            placeholder="Onboarding Cost"
                            name="clientOnboardingCost"
                            type="number"
                            value={editedData.clientOnboardingCost}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <Group justify="center" mt="sm" mb="xs">
                            <Badge color="green" size="lg">
                              {row.onboarding_cost / 1000} OMR
                            </Badge>
                          </Group>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {rowId == row.id ? (
                          <TextInput
                            variant="filled"
                            placeholder="Subscription Cost"
                            name="clientSubscriptionCost"
                            type="number"
                            value={editedData.clientSubscriptionCost}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <Group justify="center" mt="sm" mb="xs">
                            <Badge color="cyan" size="lg">
                              {row.subscription_cost / 1000} OMR
                            </Badge>
                          </Group>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="sm"
                          radius="l"
                          disabled={row.client_card ? true : false}
                          loading={linkLoading}
                          onClick={() => {
                            getPaymentLink(
                              row.id,
                              row.onboarding_cost,
                              row.client_name,
                              row.email,
                              row.client_phone
                            );
                          }}
                        >
                          Create payment
                        </Button>
                      </Table.Td>
                      <Table.Td>
                        {row.client_card ? (
                          <Group justify="center" mt="sm" mb="xs">
                            <Badge color="green" size="lg">
                              Success
                            </Badge>
                          </Group>
                        ) : (
                          <Group justify="center" mt="sm" mb="xs">
                            <Badge color="red" size="lg">
                              Unsuccessful
                            </Badge>
                          </Group>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group justify="center" mt="sm" mb="xs">
                          <Badge color="indigo" size="lg">
                            {row.failed_attempts}
                          </Badge>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="sm"
                          radius="l"
                          disabled={row.client_card ? false : true}
                          loading={linkLoading}
                          onClick={() => {
                            handleChargeClient(
                              row.id,
                              row.subscription_cost,
                              row.sub_date_start
                            );
                            // sendEmail(
                            //   row.client_name,
                            //   row.email,
                            //   row.sub_date_start,
                            //   row.subscription_cost
                            // );
                          }}
                        >
                          Charge Client
                        </Button>
                      </Table.Td>
                      <Table.Td>
                        {row.sub_date_start ? row.sub_date_start : ""}
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
