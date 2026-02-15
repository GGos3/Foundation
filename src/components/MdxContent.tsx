import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { CodeBlock } from "./CodeBlock";
import type { ComponentPropsWithoutRef } from "react";

const components = {
  pre: (props: ComponentPropsWithoutRef<"pre">) => <CodeBlock {...props} />,
};

interface MdxContentProps {
  source: string;
}

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-pre:my-0 dark:prose-invert">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
