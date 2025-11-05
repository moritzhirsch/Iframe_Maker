"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import tagsNlRaw from "../../../content/bijloketags/tags_bijloke_nl.json";
import tagsEnRaw from "../../../content/bijloketags/tags_bijloke_en.json";
import tagsMobilityRaw from "../../../content/bijloketags/tags_bijloke_mobility.json";

type TagItem = {
  title?: string | null;
  defaultSid?: string | null;
  navigationEnabled?: boolean | null;
};

export default function AdminLinksPage() {
  const allNl = useMemo(() => {
    const arr = (tagsNlRaw as unknown as TagItem[]) || [];
    return arr.filter(
      (t) => t && t.title && t.defaultSid && t.navigationEnabled !== false
    ) as Required<TagItem>[];
  }, []);

  const allEn = useMemo(() => {
    const arr = (tagsEnRaw as unknown as TagItem[]) || [];
    return arr.filter(
      (t) => t && t.title && t.defaultSid && t.navigationEnabled !== false
    ) as Required<TagItem>[];
  }, []);

  const allMobility = useMemo(() => {
    const arr = (tagsMobilityRaw as unknown as TagItem[]) || [];
    return arr.filter(
      (t) => t && t.title && t.defaultSid && t.navigationEnabled !== false
    ) as Required<TagItem>[];
  }, []);

  type Mode = "nl" | "en" | "mobility";
  const [lang, setLang] = useState<Mode>("nl");
  const tags = lang === "nl" ? allNl : lang === "en" ? allEn : allMobility;

  const collator = useMemo(
    () =>
      new Intl.Collator(lang === "mobility" ? "nl" : lang, {
        sensitivity: "base",
        numeric: true,
        ignorePunctuation: true,
      }),
    [lang]
  );

  const tagsSorted = useMemo(() => {
    return [...tags].sort((a, b) => collator.compare(String(a.title), String(b.title)));
  }, [tags, collator]);

  const [fromSid, setFromSid] = useState<string>(tagsSorted[0]?.defaultSid ?? "");
  const [toSid, setToSid] = useState<string>(tagsSorted[1]?.defaultSid ?? "");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sids = new Set(tagsSorted.map((t) => t.defaultSid));
    setFromSid((prev) => (prev && sids.has(prev) ? prev : tagsSorted[0]?.defaultSid ?? ""));
    setToSid((prev) => (prev && sids.has(prev) ? prev : tagsSorted[1]?.defaultSid ?? ""));
    setCopied(false);
  }, [lang, tagsSorted]);

  const base = lang === "nl" ? "bijlokesite-0835a9f2" : lang === "en" ? "bijlokesite-99387259" : "bijlokesite-216d964f";
  const generated = useMemo(() => {
    if (!fromSid || !toSid) return "";
    return `https://3d.staghill.be/tour/${base}?start=${fromSid}&target=${toSid}`;
  }, [base, fromSid, toSid]);

  const filteredFrom = useMemo(() => {
    const q = fromQuery.trim().toLowerCase();
    if (!q) return tagsSorted;
    return tagsSorted.filter((t) => String(t.title).toLowerCase().includes(q));
  }, [tagsSorted, fromQuery]);

  const filteredTo = useMemo(() => {
    const q = toQuery.trim().toLowerCase();
    if (!q) return tagsSorted;
    return tagsSorted.filter((t) => String(t.title).toLowerCase().includes(q));
  }, [tagsSorted, toQuery]);

  const swap = () => {
    setFromSid((prevFrom) => {
      const newFrom = toSid;
      setToSid(prevFrom);
      return newFrom;
    });
    setCopied(false);
  };

  const resetSelections = () => {
    setFromSid(tagsSorted[0]?.defaultSid ?? "");
    setToSid(tagsSorted[1]?.defaultSid ?? "");
    setFromQuery("");
    setToQuery("");
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Create Link</h1>
          <div className={styles.langToggle}>
            <button
              className={`${styles.langBtn} ${lang === "nl" ? styles.active : ""}`}
              onClick={() => setLang("nl")}
            >
              Dutch
            </button>
            <button
              className={`${styles.langBtn} ${lang === "en" ? styles.active : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
            <button
              className={`${styles.langBtn} ${lang === "mobility" ? styles.active : ""}`}
              onClick={() => setLang("mobility")}
              title="Mobility"
            >
              ♿ Mobility
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          <span>{tagsSorted.length} destinations</span>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>From</label>
          <div className={styles.fieldGroup}>
            <input
              className={styles.input}
              placeholder="Search from..."
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
            />
            <select
              className={styles.select}
              value={fromSid}
              onChange={(e) => setFromSid(e.target.value)}
            >
              {filteredFrom.map((t) => (
                <option key={`${t.defaultSid}`} value={t.defaultSid!}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>To</label>
          <div className={styles.fieldGroup}>
            <input
              className={styles.input}
              placeholder="Search to..."
              value={toQuery}
              onChange={(e) => setToQuery(e.target.value)}
            />
            <select
              className={styles.select}
              value={toSid}
              onChange={(e) => setToSid(e.target.value)}
            >
              {filteredTo.map((t) => (
                <option key={`${t.defaultSid}`} value={t.defaultSid!}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.secondary} onClick={swap} title="Swap From/To">
            Swap
          </button>
          <button className={styles.subtle} onClick={resetSelections}>
            Reset
          </button>
        </div>

        <div className={styles.linkBox}>
          <div className={styles.link} title={generated}>
            {generated || "Select both destinations to generate a link"}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              onClick={copyToClipboard}
              disabled={!generated}
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              className={styles.secondary}
              href={generated || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!generated}
              onClick={(e) => {
                if (!generated) e.preventDefault();
              }}
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
