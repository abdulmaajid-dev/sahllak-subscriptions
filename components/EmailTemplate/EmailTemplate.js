import React from "react";
import {
  Html,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
} from "@react-email/components";

import Image from "next/image";

export default function PaymentReceiptEmail(props) {
  const startDate = new Date(props.subscriptionDate);
  const nextDate = new Date(startDate.getDate() + 30);

  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with logo */}
          <Section style={styles.logoSection}>
            <img
              src="http://erp.sahllak.co/files/TIEMS.jpg"
              alt="Sahllak"
              style={styles.logo}
            />
          </Section>

          {/* Main heading */}
          <Section>
            <Heading style={styles.heading}>
              Monthly subscription charged successfully
            </Heading>
          </Section>

          {/* Customer details section */}
          <Section>
            <Heading style={styles.subHeading}>Customer details</Heading>
            <Text style={styles.details}>
              <strong>Customer name:</strong> {props.clientName}
            </Text>
            <Text style={styles.details}>
              <strong>Present profile status:</strong> Active
            </Text>
          </Section>

          {/* Subscription details section */}
          <Section>
            <Heading style={styles.subHeading}>Subscription details</Heading>
            <Text style={styles.details}>
              <strong>Subscription charged on:</strong>{" "}
              {startDate.toUTCString()}
            </Text>
            <Text style={styles.details}>
              <strong>Amount charged:</strong> {props.subscriptionCost} OMR
            </Text>
            <Text style={styles.details}>
              <strong>Your monthly subscription package:</strong>{" "}
              {props.subscriptionCost} OMR
            </Text>
            <Text style={styles.details}>
              <strong>Next payment due:</strong> {nextDate.toUTCString()}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footerSection}>
            <Text>SAHLLAK INNOVATIONS</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "100px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#003087",
    marginBottom: "10px",
  },
  date: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "10px",
  },
  transactionId: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "20px",
  },
  link: {
    color: "#003087",
    textDecoration: "none",
  },
  paymentReceived: {
    fontSize: "16px",
    color: "#333333",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#003087",
    marginBottom: "10px",
  },
  details: {
    fontSize: "14px",
    color: "#333333",
    marginBottom: "10px",
  },
  footerSection: {
    textAlign: "center",
    marginTop: "40px",
  },
  footerLogo: {
    width: "80px",
  },
};
