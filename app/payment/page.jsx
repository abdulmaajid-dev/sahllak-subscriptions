"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Flex,
  rem,
} from "@mantine/core";

export default function Payment() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const initialState = (
    <Card shadow="lg" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Please wait while we confirm your payment</Text>
        <Badge color="green">Pending</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>
    </Card>
  );
  const redirectState = (
    <div>
      Your on-boarding fee has been refunded, and you will be redirected to
      payment page.
    </div>
  );
  const successState = (
    <div>Your payment was successful, thank you for trusting Sahllak.</div>
  );

  const [ui, setUi] = useState(initialState);
  const [clientData, setClientData] = useState();

  const handleClient = async (id) => {
    const { data } = await supabase
      .from("clients")
      .select("id, onboarding_cost, is_refunded, client_card")
      .eq("order_id", id)
      .single();

    setClientData(data);

    const clientCard = data.client_card;

    if (clientCard) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setUi(successState);
      return;
    }

    setUi(redirectState);

    const response = await fetch("/api/paymob", {
      method: "POST",
      body: JSON.stringify({
        id: data.id,
        onboardingCost: parseInt(data.onboarding_cost),
      }),
    }).then((res) => {
      return res.json();
    });

    const { client_secret } = response;

    await new Promise((resolve) => setTimeout(resolve, 10000));

    window.location.replace(
      `https://oman.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
    );
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location.toString());

    const order_id = searchParams.get("order");

    console.log(order_id);

    handleClient(order_id);
  }, []);

  return (
    <>
      <Flex
        justify="center"
        align="center"
        direction="row"
        style={{ height: "100vh", width: "100vw" }}
      >
        <div>{ui}</div>
      </Flex>
    </>
  );
}
