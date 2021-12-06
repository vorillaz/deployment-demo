import Head from "next/head";
import Image from "next/image";
import useSWR, { useSWRConfig } from "swr";
import styles from "../styles/Home.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home({ subdomain }) {
  const { data, error } = useSWR("/myapi", fetcher);
  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the IOT Dashboard</h1>
        <h2>{subdomain}</h2>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

Home.getInitialProps = async ({ req }) => {
  const subdomain = req.headers.host.split(".")[0];
  return { subdomain };
};
