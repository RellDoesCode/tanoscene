import React, { useState } from "react";
import Navbar from "../components/navbar.jsx";

const FAQ_ITEM = ({ question, answer }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className={`faq-box ${open ? "" : "closed"}`}>
      <h3 className="faq-question">{question}</h3>
      {open && <p className="faq-answer">{answer}</p>}
      <button className="toggle" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Open"}
      </button>
    </section>
  );
};

export default function FAQ() {
  return (
    <>
      <main className="home-container">
        <h2>FAQ</h2>

        <FAQ_ITEM
          question="How do I make an account?"
          answer={<span>Please head to the sign-up page <a href="/signup">here</a> and fill out the required forms.</span>}
        />

        <FAQ_ITEM
          question="What is the meaning of life?"
          answer="N/A."
        />

        <FAQ_ITEM
          question="Are there rules to site usage?"
          answer="Yes, but only we know them."
        />
      </main>

      <footer>
        <p>© 2025 TanoScene</p>
      </footer>
    </>
  );
}
