import { themes as prismThemes } from "prism-react-renderer";

const config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "The future of work with AI and robots",
  favicon: "img/favicon.ico",

  future: { v4: true },

  url: "https://physical-ai-robotics-book-z76b-mr0rtsdnr.vercel.app",
  baseUrl: "/",
  organizationName: "mansoor1123456",
  projectName: "physical-ai-robotics-book",

  markdown: { hooks: { onBrokenMarkdownLinks: "ignore" } },
  onBrokenLinks: "ignore",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: undefined,
        },
        theme: { customCss: require.resolve("./src/css/custom.css") },
      },
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: { respectPrefersColorScheme: true },

    navbar: {
      title: "Physical AI & Humanoid Robotics",
      logo: {
        alt: "Physical AI Logo",
        src: "/img/ai.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Chapters",
        },
      ],
    },

    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
};

export default config;
