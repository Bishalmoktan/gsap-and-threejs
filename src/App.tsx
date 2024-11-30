import Features from "./components/features";
import Hero from "./components/hero";
import Highlights from "./components/highlights";
import Model from "./components/model";
import Navbar from "./components/navbar";
import * as Sentry from "@sentry/react";

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
    </main>
  );
}

export default Sentry.withProfiler(App);
