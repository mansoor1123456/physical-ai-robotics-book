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
        {/* Left: Text */}
        <div
          className="md:w-1/2 text-center md:text-left space-y-6"
          style={{
            marginTop: "-200px",
            marginLeft: "0px",
            marginRight: "350px",
          }}
        >
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link
              className={`button button--lg ${styles.startButton}`}
              to="/docs/intro"
            >
              Start Reading 📚
            </Link>
          </div>
        </div>

        {/* Right: Robot Image */}
        <div style={{ position: "relative", width: "100%" }}>
          <img
            src="/img/robot.png"
            alt="Physical AI Robot"
            style={{
              width: "400px",
              height: "auto",
              maxWidth: "100%",
              position: "absolute",
              right: "0",
              top: "-300px",
            }}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
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

      {/* -------------------- CUSTOM FOOTER -------------------- */}
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
