import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import FloatingChatbot from "../components/FloatingChatbot";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container flex flex-col md:flex-row items-center justify-between">
        {/* LEFT TEXT AREA */}
        <div
          className="md:w-1/2 text-center md:text-left space-y-6 px-4"
          style={{
            marginTop: "-200px",
            marginLeft: "0px",
            marginRight: "350px",
          }}
        >
          {/* MAIN HEADING */}
          <Heading
            as="h1"
            className="hero__title text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight break-words"
            style={{
              maxWidth: "100%",
            }}
          >
            {siteConfig.title}
          </Heading>

          {/* SUB HEADING */}
          <p
            className="hero__subtitle text-base sm:text-lg md:text-xl lg:text-2xl leading-snug break-words"
            style={{
              maxWidth: "100%",
            }}
          >
            {siteConfig.tagline}
          </p>

          {/* BUTTON */}
          <div className="mt-4 flex justify-center md:justify-start">
            <Link
              className={`button button--lg ${styles.startButton}`}
              to="/docs/intro"
            >
              Start Reading 📚
            </Link>
          </div>
        </div>

        {/* RIGHT: ROBOT IMAGE */}
        <div className="w-full md:w-1/2 mt-8 md:mt-0 relative flex justify-center md:justify-end">
          <img
            src="/img/robot.png"
            alt="Physical AI Robot"
            className="object-contain drop-shadow-2xl"
            style={{
              width: "400px",
              maxWidth: "100%",
              height: "auto",
              position: "absolute",
              right: "80px",
              top: "55px",
            }}
          />
        </div>
      </div>

      {/* MOBILE RESPONSIVE OVERRIDES */}
      <style>
        {`
          @media (max-width: 854px) {
            .hero__title, .hero__subtitle {
              text-align: center !important;
            }
            .container > div:first-child {
              margin-top: 0 !important;
              margin-right: 0 !important;
            }
            .container > div:last-child img {
              position: relative !important;
              right: auto !important;
              top: 0 !important;
              margin: 0 auto !important;
            }
          }
          @media (max-width: 480px) {
            .hero__title {
              font-size: 2rem !important;
            }
            .hero__subtitle {
              font-size: 1rem !important;
            }
          }
        `}
      </style>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Learn Physical AI & Humanoid Robotics"
    >
      <HomepageHeader />

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "var(--ifm-background-color)",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <p
          style={{
            color: "var(--ifm-color-emphasis-900)",
            margin: 0,
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          © {new Date().getFullYear()} Physical AI & Humanoid Robotics.{" "}
          Reference Book:{" "}
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ifm-link-color)",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Foundations of Robotics
          </a>
        </p>
      </footer>

      {/* Floating RAG Chatbot */}
      <FloatingChatbot />
    </Layout>
  );
}
