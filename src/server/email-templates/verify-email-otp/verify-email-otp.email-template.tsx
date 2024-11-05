"use server";
import { EmailTemplate } from "..";
import {
  Container,
  Footer,
  Greeting,
  Header,
  List,
  Text,
} from "../components";


type VerifyEmailOtpEmailTemplateType = EmailTemplate<{
  key?: React.Key;
  otp: string;
}>;

const VerifyEmailOtpEmailTemplate: VerifyEmailOtpEmailTemplateType = ({
  otp,
}: {
  otp: string;
}) => {
  return (
    <Container>
      <Header
        // logo={EmailTemplateConstants.image.logo}
        title="Welcome to 2FA Demo"
      />
      <Container style={{ padding: "20px" }}>
        <Greeting name="Welcome to 2FA Demo" />
        <Text>
          {`You're all set to start using 2FA Demo - your AI-powered PR
          assistant. Here's what to do next:`}
        </Text>

        <List
          items={[
            "Verify your email below.",
            "Connect your email - Please make sure to connect the same email that you've used to signup to expert request platforms. If you haven't signed up to any, you can opt for us to get you started when you begin the signup process. Just click the checkbox, and we'll get you going with the same email you've used to sign up to 2FA Demo.",
            "Follow the step-by-step guide in the 2FA Demo application. It's really the easiest way to get connected and get going with your PR.",
          ]}
        />

        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          Your Verification Code:
        </Text>
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ff4444",
            backgroundColor: "#f8f8f8",
            padding: "10px",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          {otp}
        </Text>

        <Text>{`That's it! See you on the inside,`}</Text>
        <Text style={{ fontWeight: "bold" }}>The 2FA Demo Team</Text>
      </Container>
      <Footer
        text="© 2024 2FA Demo. All rights reserved."
        links={[
          { href: "https://echojockey.com/privacy-policy/", text: "Privacy Policy" },
          { href: "https://echojockey.com/tos/", text: "Terms of Service" },
        ]}
      />
    </Container>
  );
};

VerifyEmailOtpEmailTemplate.subject =
  "Welcome to 2FA Demo! Verify your email";

export default VerifyEmailOtpEmailTemplate;
