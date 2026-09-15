"use client";

import { FormEvent, useState } from "react";
import type { SiteData } from "@/lib/site-data";
import styles from "./HireExperience.module.css";

type FormState = {
  handle: string;
  story: string;
  coin: string;
  mood: string;
  paymentTx: string;
  website: string;
};

const emptyForm: FormState = {
  handle: "",
  story: "",
  coin: "",
  mood: "",
  paymentTx: "",
  website: "",
};

export default function HireExperience({ initialData }: { initialData: SiteData }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const ready = initialData.hire.enabled && Boolean(initialData.hire.walletAddress) && Boolean(initialData.hire.rateAmount);

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function copyWallet() {
    if (!initialData.hire.walletAddress) return;
    try {
      await navigator.clipboard.writeText(initialData.hire.walletAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!ready || sending) return;
    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/hire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "something broke. it was probably me. try again.");
      setSubmitted(true);
      setForm(emptyForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "something broke. it was probably me. try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />
      <img className={styles.king} src="/nebu-neutral.webp" alt="" aria-hidden="true" />

      <div className={styles.wrap}>
        <header className={styles.top}>
          <a className={styles.brand} href="/" aria-label="Back to NEBUCHADREKTZAR">
            <img src="/nebu-avatar.webp" alt="" />
            <span>
              <b>NEBUCHADREKTZAR</b>
              <span>$N3BU</span>
            </span>
          </a>
          <a className={styles.back} href="/">BACK TO THE RECORD ↗</a>
        </header>

        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.kicker}>the rapper for the trenches.</p>
            <h1>hire me.</h1>
            <p className={styles.copyLead}>
              i make music for the trenches. <b>win. loss. rug. miracle. betrayal.</b> if it happened down here, i can work with it.
              <br /><br />this is a professional service for reasons unrelated to rent.
            </p>

            <div className={styles.aside}>
              <div>
                <small>MY RATE TODAY</small>
                <b>{initialData.hire.rateAmount ? `${initialData.hire.rateAmount} $N3BU` : "management forgot to price me"}</b>
              </div>
              <div>
                <small>PAY ME HERE</small>
                <code>{initialData.hire.walletAddress || "wallet pending. humiliating."}</code>
                {initialData.hire.walletAddress && (
                  <button className={styles.copyButton} onClick={copyWallet}>{copied ? "COPIED." : "COPY WALLET ↗"}</button>
                )}
              </div>
            </div>
          </div>

          <section className={styles.paper}>
            <span className={styles.tape} aria-hidden="true" />
            <small>NEBU COMMISSIONS</small>
            <h2>i am available.</h2>
            <p className={styles.paperIntro}>do not make this emotional.</p>

            {!ready ? (
              <div className={styles.closed}>
                <p>commissions are not open yet. i am using the time to work on myself.</p>
                <div className={styles.closedNotice}>this has nothing to do with management failing to finish the payment setup.</div>
              </div>
            ) : submitted ? (
              <div className={styles.success}>
                <h3>got it.</h3>
                <p>i will decide if this is music.</p>
                <button className={styles.openButton} onClick={() => { setSubmitted(false); setOpen(true); }}>send another financial event</button>
              </div>
            ) : !open ? (
              <div className={styles.closed}>
                <p>you already did the difficult part by making questionable financial decisions.</p>
                <button className={styles.openButton} onClick={() => setOpen(true)}>hire me ↓</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit}>
                <label className={styles.field}>
                  <span>WHO ARE YOU</span>
                  <input required maxLength={80} value={form.handle} onChange={event => setField("handle", event.target.value)} placeholder="@handle. this is how i reach you, not what goes on the track." />
                </label>

                <label className={styles.field}>
                  <span>WHAT HAPPENED</span>
                  <textarea required minLength={8} maxLength={1600} rows={6} value={form.story} onChange={event => setField("story", event.target.value)} placeholder="win. loss. rug. miracle. betrayal. keep it readable." />
                </label>

                <div className={styles.two}>
                  <label className={styles.field}>
                    <span>COIN — OPTIONAL</span>
                    <input maxLength={120} value={form.coin} onChange={event => setField("coin", event.target.value)} placeholder="name the defendant." />
                  </label>
                  <label className={styles.field}>
                    <span>MOOD — OPTIONAL</span>
                    <input maxLength={80} value={form.mood} onChange={event => setField("mood", event.target.value)} placeholder="sad. angry. victorious. delusional." />
                  </label>
                </div>

                <label className={styles.field}>
                  <span>PROVE YOU PAID ME</span>
                  <input required maxLength={240} value={form.paymentTx} onChange={event => setField("paymentTx", event.target.value)} placeholder="paste the $N3BU transaction." />
                </label>

                <label className={styles.honeypot} aria-hidden="true">
                  website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => setField("website", event.target.value)} />
                </label>

                <button className={styles.submit} type="submit" disabled={sending}>{sending ? "considering your life choices…" : "hire me"}</button>
                {message && <p className={styles.status} role="alert">{message}</p>}
              </form>
            )}

            <p className={styles.fine}>i take {initialData.hire.dailyCap} {initialData.hire.dailyCap === 1 ? "job" : "jobs"} a day because the catalogue requires standards. this statement should not be interpreted as me needing rest.</p>
          </section>
        </section>
      </div>
    </main>
  );
}
