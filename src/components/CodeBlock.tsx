"use client";

import { Children, isValidElement } from "react";
import { CodeCopyButton } from "./CodeCopyButton";

interface CodeBlockProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }

    if (isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      return extractText(props.children);
    }

    return "";
  };

  const code = Children.toArray(children).map(extractText).join("");

  return (
    <div className="group relative">
      <pre {...props}>
        {children}
      </pre>
      <CodeCopyButton code={code} />
    </div>
  );
}
