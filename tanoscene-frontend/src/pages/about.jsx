import React from "react";
import Navbar from "../components/navbar.jsx";

export default function About() {
  return (
    <>
      <main className="home-container">
        <h2>About</h2>

        <section className="about-box">
          <h3>What <i>is</i> TanoScene?</h3>
          <p>
            TanoScene is a social media site with an emphasis on forming short-lived discussion without user responsibility of maintaining communities.
          </p>
          <p>This is all still a bit abstract but below we've included a few ideals we have in mind going forward</p>

          <ul>
            <li>A site for fun discussions</li>
            <li>A way to quickly find your scene</li>
            <li>A zone of personalized digital identity</li>
          </ul>
        </section>

        <section className="about-box">
          <h3>Our Team</h3>
          <p>Front End</p>
          <p>We make-a the html</p>
          <ul>
            <li>Fallon Katz</li>
            <li>Nick Arellano</li>
          </ul>

          <p>Back End</p>
          <p>We make-a the database</p>

          <ul>
            <li>Rell Beasley</li>
            <li>Brian Nchoutpouen</li>
            <li>Lara Mousa</li>
          </ul>
        </section>
      </main>
    </>
  );
}
