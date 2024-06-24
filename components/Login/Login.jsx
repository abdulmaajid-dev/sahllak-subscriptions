"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, TextInput, PasswordInput, Button, Title } from "@mantine/core";
import Notification from "../UI/Notification/Notification";
import classes from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setOpened(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOpened(false);
      return;
    }
    if (
      username == process.env.NEXT_PUBLIC_APP_USERNAME &&
      password == process.env.NEXT_PUBLIC_APP_PASSWORD
    ) {
      await fetch("/api/authentication", {
        method: "POST",
      });
      router.push("/dashboard/subscriptions");
    } else {
      setOpened(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setOpened(false);
      return;
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
        <Notification
          opened={opened}
          color="red"
          title="Incorrect Username/Password"
          description="If you have forgot your username or password, please notify the team."
        />
      </Paper>
    </div>
  );
}
