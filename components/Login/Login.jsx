"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, TextInput, PasswordInput, Button, Title } from "@mantine/core";
import classes from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (username === "sahllak-admin") {
      if (password === "7878Proj") {
        await fetch("/api/authentication", {
          method: "POST",
        });
        router.push("/dashboard/subscriptions");
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome to Sahllak Subscriptions!
        </Title>
        <TextInput
          label="Username"
          placeholder="admin"
          size="md"
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          value={password}
          placeholder="Your password"
          mt="md"
          size="md"
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Button fullWidth mt="xl" size="md" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </div>
  );
}
