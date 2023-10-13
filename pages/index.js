import Head from "next/head";
import { Inter } from "@next/font/google";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/constants";
const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import Container from "@mui/material/Container";

export default function Home() {

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
      // sx={{ bgcolor: "background.default", color: "text.primary" }}
      component="main"
      maxWidth="xs"
    >
      <Image
          width="400"
          height="400"
          style={{
            marginTop: "2rem",
            marginBottom: "0.5rem",
          }}
          src="/logo.JPEG"
          alt="LOGO"
        />
      
    </Container>
    </>
   
  );
}
