"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  Text,
  Badge,
  Stack,
  Group,
  Flex,
  rem,
  Title,
} from "@mantine/core";
import Image from "next/image";

//lottie animations
import Lottie from "lottie-react";
import cardAnimation from "../assets/card-animation.json";
import cardNotSaved from "../assets/card-not-saved-animation.json";
import cardSaved from "../assets/card-saved-animation.json";
import checkboxAnimation from "../assets/checkbox-animation.json";

export default function Payment() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const initialState = (
    <Card shadow="lg" padding="lg" radius="md" withBorder>
      <Group justify="center" mt="md" mb="xs">
        <Badge color="green" size="lg">
          Please wait while we confirm your payment
        </Badge>
      </Group>
      <Card.Section>
        <Lottie animationData={cardAnimation} loop />
      </Card.Section>
    </Card>
  );
  const redirectState = (
    <Card w={rem(500)} shadow="lg" padding="lg" radius="md" withBorder>
      <Group justify="center">
        <Badge color="green" size="lg">
          You will be redirected shortly
        </Badge>
      </Group>
      <Card.Section>
        <Stack justify="center" align="center">
          <Lottie animationData={cardNotSaved} loop />
          <Text fw={700}>
            The payment has been reversed back to your account.
          </Text>
          <Text fw={700}>
            Kindly ensure your card has been saved as shown below.
          </Text>
          <Group
            justify="center"
            style={{
              boxShadow:
                "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
            }}
            w={rem(400)}
            gap="xs"
          >
            <Lottie
              animationData={checkboxAnimation}
              loop
              style={{ height: 100, width: 100 }}
            />
            <Text ml={rem(-33)} style={{ zIndex: 5 }}>
              Save card for future payments.
            </Text>
          </Group>
        </Stack>
      </Card.Section>

      <Group justify="center" mt="md" mb="xs" ml="md" mr="md">
        <Badge color="red" size="lg">
          Please do not close this tab
        </Badge>
      </Group>
    </Card>
  );
  const successState = (
    <Card shadow="lg" padding="lg" radius="md" withBorder w={rem(500)}>
      <Group justify="center" mt="sm" mb="xs">
        <Badge color="green" size="lg">
          Your payment was successful!
        </Badge>
      </Group>
      <Card.Section>
        <Lottie animationData={cardSaved} loop />
      </Card.Section>
    </Card>
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

    // window.location.replace(
    //   `https://oman.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
    // );
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
