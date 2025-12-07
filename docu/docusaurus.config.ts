import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "The future of work with AI and robots",
  favicon: "img/favicon.ico",

  future: { v4: true },

  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",
  organizationName: "facebook",
  projectName: "docusaurus",
  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: { type: ["rss", "atom"], xslt: true },
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: { respectPrefersColorScheme: true },

    navbar: {
      title: "Physical AI & Humanoids",
      // logo removed
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Chapters",
        },
        { to: "/blog", position: "left" },
      ],
    },

    footer: {
      style: "light", // white background
      links: [
        {
          html: `
        <div style="text-align: center; width: 100%;">
          <strong>Documentation</strong>
          <div style="
            display: flex;
            justify-content: center;
            gap: 4rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
          ">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span>Chapter 1: Introduction</span>
              <span>Chapter 2: Ros2 Basics of Robotics</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <span>Chapter 3: Digital Twin</span>
              <span>Chapter 4: Simulation</span>
            </div>
          </div>
        </div>
      `,
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. All rights reserved.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
