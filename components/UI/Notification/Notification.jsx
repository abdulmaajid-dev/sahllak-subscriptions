import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function Notification(props) {
  const icon = <IconInfoCircle />;
  return (
    <Alert variant="light" color="green" title={props.title} icon={icon}>
      {props.description}
    </Alert>
  );
}
