import { Alert, rem } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { Transition } from "@mantine/core";

export default function Notification(props) {
  const icon = <IconInfoCircle />;
  return (
    <Transition
      mounted={props.opened}
      transition="fade"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <Alert
          variant="light"
          color={props.color}
          title={props.title}
          icon={icon}
          mt={rem(20)}
        >
          {props.description}
        </Alert>
      )}
    </Transition>
  );
}
