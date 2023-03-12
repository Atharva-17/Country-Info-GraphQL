import Head from "next/head";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import Fuse from "fuse.js";
import { useState } from "react";

export default function Home({ countries }) {
  const [query, setQuery] = useState("");
  const fuse = new Fuse(countries, {
    keys: ["name", "code"],
    threshold: 0.3,
  });

  const result = fuse.search(query);
  const countriesResult = query
    ? result.map((result) => result.item)
    : countries;

  function handleOnSearch({ currentTarget = {} }) {
    const { value } = currentTarget;
    setQuery(value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Country Info</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Country Info</h1>

        <p className={styles.description}>Get information about countries</p>

        <p className={styles.description}>
          <input
            className={styles.input}
            value={query}
            onChange={handleOnSearch}
            type="text"
            placeholder="Search countries"
          />
        </p>

        <div className={styles.grid}>
          {countriesResult.length ? (
            countriesResult.map((index) => {
              return (
                <a key={index.id} className={styles.card}>
                  <h3>
                    {" "}
                    {index.name} {index.emoji}
                  </h3>
                  <p>
                    <strong>Region:</strong> {index.continent.name}
                  </p>
                  <p>
                    <strong>Capital:</strong> {index.capital}
                  </p>
                  <p>
                    <strong>Currency:</strong> {index.currency}
                  </p>
                  <p>
                    <strong>Phone Code:</strong> {index.phone}
                  </p>
                  <p>
                    <strong>Country Code:</strong> {index.code}
                  </p>
                  <p>
                    <strong>Language Spoken: </strong>
                    {index.languages.map((e) => {
                      return `${e.name} `;
                    })}
                  </p>
                </a>
              );
            })
          ) : (
            <p>No results found!</p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://countries.trevorblades.com//graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetCountries {
        countries {
          code
          continent {
            name
          }
          name
          capital
          emoji
          currency
          phone
          languages {
            name
          }
        }
      }
    `,
  });

  return {
    props: {
      countries: data.countries,
    },
  };
}
