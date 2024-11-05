import React, { ReactNode, CSSProperties } from "react";

// Utility type for components that accept style prop
type WithStyle = {
  style?: CSSProperties;
};

// Basic Components

type ContainerProps = WithStyle & {
  children: ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children, style }) => (
  <table
    cellPadding="0"
    cellSpacing="0"
    width="100%"
    style={{ maxWidth: "600px", margin: "0 auto", ...style }}
  >
    <tr>
      <td>{children}</td>
    </tr>
  </table>
);

type TextProps = WithStyle & {
  children: ReactNode;
};

const Text: React.FC<TextProps> = ({ children, style }) => (
  <p
    style={{
      margin: "0 0 10px",
      fontSize: "16px",
      lineHeight: 1.5,
      color: "#333",
      ...style,
    }}
  >
    {children}
  </p>
);

type HeadingProps = WithStyle & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
};

const Heading: React.FC<HeadingProps> = ({ level = 1, children, style }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const baseStyle = { margin: "0 0 10px", lineHeight: 1.2, color: "#333" };
  const sizes = {
    1: "24px",
    2: "20px",
    3: "18px",
    4: "16px",
    5: "14px",
    6: "12px",
  };

  return (
    <Tag style={{ ...baseStyle, fontSize: sizes[level], ...style }}>
      {children}
    </Tag>
  );
};

type ListProps = WithStyle & {
  items: ReactNode[];
  ordered?: boolean;
};

const List: React.FC<ListProps> = ({ items, ordered = false, style }) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag style={{ paddingLeft: "20px", margin: "0 0 10px", ...style }}>
      {items.map((item, index) => (
        <li key={index} style={{ margin: "0 0 5px" }}>
          {item}
        </li>
      ))}
    </Tag>
  );
};

type ImageProps = WithStyle & {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
};

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  style,
}) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    style={{ display: "block", maxWidth: "100%", ...style }}
  />
);

type LinkProps = WithStyle & {
  href: string;
  children: ReactNode;
};

const Link: React.FC<LinkProps> = ({ href, children, style }) => (
  <a href={href} style={{ color: "#007bff", ...style }}>
    {children}
  </a>
);

type ButtonProps = WithStyle & {
  href: string;
  text: string;
};

const Button: React.FC<ButtonProps> = ({ href, text, style }) => (
  <a
    href={href}
    style={{
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "16px",
      textAlign: "center",
      ...style,
    }}
  >
    {text}
  </a>
);

type DividerProps = WithStyle;

const Divider: React.FC<DividerProps> = ({ style }) => (
  <hr
    style={{
      border: "none",
      borderTop: "1px solid #e0e0e0",
      margin: "20px 0",
      ...style,
    }}
  />
);

// Complex Components

type HeaderProps = WithStyle & {
  logo?: string;
  title: string;
};

const Header: React.FC<HeaderProps> = ({ logo, title, style }) => (
  <Container style={{ backgroundColor: "#f8f8f8", padding: "20px", ...style }}>
    {logo && (
      <Image
        src={logo}
        alt="Logo"
        style={{ maxHeight: "50px", marginBottom: "10px" }}
      />
    )}
    <Heading level={1}>{title}</Heading>
  </Container>
);

type GreetingProps = WithStyle & {
  name: string;
};

const Greeting: React.FC<GreetingProps> = ({ name, style }) => (
  <Text style={{ fontSize: "18px", fontWeight: "bold", ...style }}>
    Dear {name},
  </Text>
);

type SignOffProps = WithStyle & {
  name: string;
  title?: string;
  company?: string;
};

const SignOff: React.FC<SignOffProps> = ({ name, title, company, style }) => (
  <div style={{ marginTop: "20px", ...style }}>
    <Text>Best regards,</Text>
    <Text style={{ fontWeight: "bold", marginBottom: "0" }}>{name}</Text>
    {title && <Text style={{ marginTop: "0" }}>{title}</Text>}
    {company && <Text style={{ marginTop: "0" }}>{company}</Text>}
  </div>
);

type FooterLink = {
  href: string;
  text: string;
};

type FooterProps = WithStyle & {
  text: string;
  links?: FooterLink[];
};

const Footer: React.FC<FooterProps> = ({ text, links, style }) => (
  <Container
    style={{
      backgroundColor: "#f8f8f8",
      padding: "20px",
      textAlign: "center",
      ...style,
    }}
  >
    <Text style={{ fontSize: "14px", color: "#666" }}>{text}</Text>
    {links && (
      <div style={{ marginTop: "10px" }}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            style={{ color: "#666", marginRight: "10px", fontSize: "14px" }}
          >
            {link.text}
          </a>
        ))}
      </div>
    )}
  </Container>
);

export {
  Container,
  Text,
  Heading,
  List,
  Image,
  Link,
  Button,
  Divider,
  Header,
  Greeting,
  SignOff,
  Footer,
};
