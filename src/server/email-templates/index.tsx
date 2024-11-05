"use server";
import React from "react";

export type EmailTemplateProps = {
  key?: React.Key;
};

export type EmailTemplate<T extends EmailTemplateProps> =
  React.ComponentType<T> & {
    subject: string;
  };

export const extractHtmlTemplate = async <T extends EmailTemplateProps>(
  Template: EmailTemplate<T>,
  props: T,
) => {
  const { renderToString } = await import("react-dom/server");
  const html = renderToString(<Template {...props} />);
  const subject = Template.subject;

  return { html, subject };
};
