"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* Usage: <WhatWeDo /> in an app with Tailwind CSS and framer-motion installed.
 * Edit PORTFOLIO_CATEGORIES below. Each item may also have image, imageAlt,
 * description, features (string[]), and demoUrl (https://...) properties.
 * No screenshots or live project links are invented for these concept entries.
 */
const makeItems = (titles, descriptions) => titles.map((title, index) => ({
  id: `project-${index + 1}`,
  title,
  description: descriptions[index],
  image: null,
  demoUrl: null,
}));

export const PORTFOLIO_CATEGORIES = [
  {
    id: "website", number: "01", title: "Website", accent: "#41776B", secondary: "#153F3A", icon: "website",
    description: "Thoughtful digital experiences, from your first impression to your next big launch.",
    items: makeItems([
      "SaaS Landing Page Demo", "E-Commerce Showcase", "Agency Portfolio Demo", "Web3 / Interactive App",
      "Corporate Web Platform", "Content & Blog Hub", "Custom Web App Demo",
    ], [
      "A product-focused landing page concept with clear benefits, feature sections, and a sign-up journey.",
      "A storefront concept exploring product discovery, collection filters, and a considered shopping experience.",
      "A portfolio concept that brings services, selected projects, and a clear inquiry journey together.",
      "An interactive interface concept for exploring connected experiences and user-driven actions.",
      "A structured business website concept with service information and intuitive navigation.",
      "An editorial concept built around readable articles, topic navigation, and content discovery.",
      "A tailored application concept demonstrating a focused user workflow and useful interface feedback.",
    ]),
  },
  {
    id: "automation", number: "02", title: "Automation", accent: "#658238", secondary: "#47602B", icon: "automation",
    description: "Practical workflows that connect conversations, follow-ups, and everyday tasks.",
    items: makeItems([
      "WhatsApp Automation", "AI Chatbot Agent", "Lead Nurturing Workflows", "E-Commerce Order Tracking",
      "CRM Synchronization", "Custom API Workflows", "Automated Email Sequences",
    ], [
      "A conversation workflow concept for customer inquiries, lead collection, and relevant follow-ups.",
      "A chatbot concept exploring guided answers and escalation to a human when needed.",
      "A workflow concept for organizing new inquiries and planning timely follow-up steps.",
      "An order-status workflow concept connecting purchase events with customer updates.",
      "A workflow concept for keeping customer information consistent across connected tools.",
      "A custom workflow concept linking events and actions through API connections.",
      "A sequence concept for relevant emails triggered by customer actions or lifecycle stages.",
    ]),
  },
  {
    id: "integration", number: "03", title: "Integration", accent: "#598176", secondary: "#355F55", icon: "integration",
    description: "Bring your tools together so information moves where your business needs it.",
    items: makeItems([
      "Payment Gateway Setup", "Custom Webhook Pipeline", "Third-Party API Connectors", "Zapier / Make Integration",
      "Database & Cloud Sync", "Analytics & Event Tracking", "Auth & Identity Systems",
    ], [
      "A checkout integration concept exploring payment steps, status feedback, and error handling.",
      "An event pipeline concept connecting incoming notifications to appropriate downstream actions.",
      "A connector concept for moving relevant data between a website and external services.",
      "A connected workflow concept built around triggers, conditions, and actions across business tools.",
      "A synchronization concept exploring how records stay aligned across data sources.",
      "A measurement concept for tracking meaningful user events and reviewing customer journeys.",
      "An identity experience concept exploring sign-in, account access, and session feedback.",
    ]),
  },
  {
    id: "creative", number: "04", title: "Creative & Visual Services", accent: "#E7BB58", secondary: "#8C7227", icon: "creative",
    description: "Distinctive visuals and stories that help your brand show up with consistency.",
    items: makeItems([
      "Illustration", "Social Media Posts", "AI Video", "AI Movie Production", "AI Static Posts",
      "Branding & Identity", "UI/UX Designing", "Logo Design", "Posters & Print", "Instagram Posts & Reels",
    ], [
      "An illustration concept exploring character, composition, and a consistent visual language.",
      "A social creative concept balancing clear messaging with a recognizable brand style.",
      "An AI-assisted video concept exploring visual storytelling and shot continuity.",
      "An AI-assisted film concept exploring characters, scene planning, and cinematic storytelling.",
      "An AI-assisted static creative concept with deliberate art direction and brand-aware composition.",
      "A brand identity concept bringing color, typography, and visual elements into one coherent system.",
      "An interface design concept focused on understandable journeys and useful interaction feedback.",
      "A logo concept exploring recognizable shapes and practical brand applications.",
      "A print design concept exploring hierarchy, composition, and readable information.",
      "An Instagram content concept pairing visual consistency with platform-appropriate layouts.",
    ]),
  },
];

// Inline SVGs keep the component independent of icon libraries.
function Icon({ type, className = "h-6 w-6" }) {
  const paths = {
    website: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 13l-2 2 2 2m8-4 2 2-2 2m-3-5-2 6" /></>,
    automation: <><path d="m13 2-8 11h6l-1 9 9-12h-6l1-8Z" /></>,
    integration: <><rect x="2" y="4" width="7" height="7" rx="2" /><rect x="15" y="13" width="7" height="7" rx="2" /><path d="M9 7h6a3 3 0 0 1 3 3v3M6 11v3a3 3 0 0 0 3 3h6" /></>,
    creative: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM19 2v4m-2-2h4" /></>,
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    back: <path d="m10 5-7 7 7 7M3 12h18" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type] || paths.website}</svg>;
}

const readableAccent = category => ({ website: '#153f3a', automation: '#47602b', integration: '#355f55', creative: '#806522' }[category.id] || '#153f3a');

const focusStyle = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6ee]";

// An abstract preview fills empty artwork slots without implying real client work.
function ProjectArtwork({ category, item }) {
  if (item.image) return <img src={item.image} alt={item.imageAlt || `${item.title} preview`} loading="lazy" className="h-full w-full object-contain p-3" />;
  return (
    <div aria-hidden="true" className="relative flex h-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(ellipse at 50% 110%, ${category.accent}66, transparent 70%)` }} />
      <div className="relative w-3/4 rounded-xl border border-slate-900/15 bg-white/85 p-4 shadow-2xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none">
        <div className="mb-4 flex items-center gap-1.5 border-b border-[#d6dfd5] pb-3">{[0,1,2].map(n => <span key={n} className="h-1.5 w-1.5 rounded-full bg-slate-900/25" />)}<span className="ml-auto h-1 w-8 rounded bg-slate-900/15" /></div>
        <div className="flex items-center gap-4"><span className="rounded-xl border p-3" style={{ color: readableAccent(category), borderColor: `${category.accent}55`, backgroundColor: `${category.accent}12` }}><Icon type={category.icon} /></span><div className="flex-1 space-y-2"><div className="h-2 w-4/5 rounded" style={{ backgroundColor: `${category.accent}99` }} /><div className="h-1.5 w-full rounded bg-slate-900/15" /><div className="h-1.5 w-2/3 rounded bg-slate-900/10" /></div></div>
        <div className="mt-5 grid grid-cols-3 gap-2">{[0,1,2].map(n => <div key={n} className="h-7 rounded border border-[#d6dfd5] bg-slate-900/[0.03]" />)}</div>
      </div>
    </div>
  );
}

export default function WhatWeDo({ categories = PORTFOLIO_CATEGORIES, onProjectSelect, initialCategory = null, className = "" }) {
  const [activeId, setActiveId] = useState(initialCategory);
  const [selected, setSelected] = useState(null);
  const reducedMotion = useReducedMotion();
  const headingRef = useRef(null);
  const dialogRef = useRef(null);
  const previousTrigger = useRef(null);
  const dialogTitleId = useId();
  const headingId = useId();
  const active = categories.find(category => category.id === activeId);

  function switchCategory(id) {
    setActiveId(id);
    // Keep the context announcement within the section rather than moving the page.
    headingRef.current?.focus({ preventScroll: true });
  }

  function openProject(category, item, event) {
    previousTrigger.current = event.currentTarget;
    setSelected({ category, item });
    onProjectSelect?.(item, category);
  }

  // Native dialog provides keyboard focus containment and Escape behavior.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selected || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousTrigger.current?.isConnected) previousTrigger.current.focus({ preventScroll: true });
    };
  }, [selected]);

  return (
    <section aria-labelledby={headingId} className={`relative isolate overflow-hidden bg-[#f7f6ee] px-5 py-8 text-slate-900 sm:px-8 sm:py-12 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" style={{ background: `radial-gradient(ellipse at 80% 0%, ${active ? active.accent + "12" : "#41776B0C"}, transparent 65%)` }} />
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl"><p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-600">01 / What we do</p><h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-3xl font-medium leading-tight tracking-tight outline-none sm:text-5xl">Good ideas.<br /><span className="text-slate-600">Made interactive.</span></h2></div>
          <p className="max-w-sm text-sm leading-7 text-slate-600">Explore the possibilities across websites, connected workflows, and creative experiences. Choose a category to take a closer look.</p>
        </header>

        <div className="mb-7 flex flex-col gap-4 border-y border-[#d6dfd5] py-4 sm:flex-row sm:items-center">
          <button type="button" onClick={() => switchCategory(null)} aria-label="Back to service overview" title="Back to service overview" aria-pressed={!active} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm transition-colors motion-reduce:transition-none ${active ? "bg-teal-950/5 text-slate-700 hover:bg-teal-950/10" : "bg-[#153f3a] text-white"} ${focusStyle}`}><Icon type="back" className="h-4 w-4" /></button>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Portfolio categories">
            {categories.map(category => <button key={category.id} type="button" onClick={() => switchCategory(category.id)} aria-pressed={activeId === category.id} className={`min-h-11 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-teal-950/5 motion-reduce:transition-none ${focusStyle}`} style={{ borderColor: activeId === category.id ? `${category.accent}99` : "transparent", backgroundColor: activeId === category.id ? `${category.accent}16` : undefined, color: activeId === category.id ? readableAccent(category) : "#475569" }}>{category.number} / {category.title}</button>)}
          </div>
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{active ? active.title : "Services overview"}</p>

        
          <div key={active?.id || "overview"}>
            {active ? (
              <div>
                <div className="mb-7 flex items-start gap-4"><span className="rounded-xl border p-3" style={{ color: readableAccent(active), borderColor: `${active.accent}55`, background: `${active.accent}12` }}><Icon type={active.icon} /></span><div><h3 className="text-xl font-medium sm:text-2xl">{active.number} / {active.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{active.description}</p></div></div>
                <motion.div initial={false} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {active.items.map((item, index) => <motion.button key={item.id} type="button" onClick={event => openProject(active, item, event)} whileHover={reducedMotion ? undefined : { y: -5, scale: 1.015 }} whileTap={reducedMotion ? undefined : { scale: 0.985 }} transition={{ duration: 0.2 }} className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d6dfd5] bg-[#fffef8] text-left transition-colors hover:border-[#8ca88d] hover:bg-[#f0f3e4] motion-reduce:transition-none ${focusStyle}`}>
                    <div className="relative h-44 w-full overflow-hidden border-b border-[#d6dfd5] bg-[#eef2e8]"><ProjectArtwork category={active} item={item} /><span className="absolute left-3 top-3 rounded-full border border-[#d6dfd5] bg-white/95 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-700">Concept project</span></div>
                    <div className="flex flex-1 flex-col p-5"><span className="mb-3 text-[10px] uppercase tracking-widest text-slate-600">{active.number}.{String(index + 1).padStart(2, "0")}</span><span className="text-base font-medium leading-6">{item.title}</span><span className="mt-3 flex-1 text-xs leading-6 text-slate-600">{item.description}</span><span className="mt-6 flex items-center justify-between text-xs" style={{ color: readableAccent(active) }}>View concept<Icon type="arrow" className="h-4 w-4" /></span></div>
                  </motion.button>)}
                </motion.div>
              </div>
            ) : (
              <motion.div initial={false} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {categories.map(category => <motion.button key={category.id} type="button" onClick={() => switchCategory(category.id)} whileHover={reducedMotion ? undefined : { y: -6, scale: 1.015 }} whileTap={reducedMotion ? undefined : { scale: 0.985 }} className={`group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-[#d6dfd5] bg-[#fffef8] p-6 text-left transition-colors hover:border-[#8ca88d] motion-reduce:transition-none ${focusStyle}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" style={{ background: `radial-gradient(ellipse at 0% 0%, ${category.accent}22, transparent 65%)` }} />
                  <span className="relative mb-5 flex items-center justify-between"><span className="rounded-xl border p-3" style={{ color: readableAccent(category), borderColor: `${category.accent}55`, backgroundColor: `${category.accent}12` }}><Icon type={category.icon} /></span></span>
                  <span className="relative mb-3 text-[11px] uppercase tracking-widest" style={{ color: readableAccent(category) }}>{category.number} / {category.title}</span><span className="relative flex-1 text-sm leading-7 text-slate-600">{category.description}</span><span className="relative mt-5 flex items-center justify-between border-t border-[#d6dfd5] pt-4 text-xs text-slate-800">Explore category<Icon type="arrow" className="h-4 w-4" /></span>
                </motion.button>)}
              </motion.div>
            )}
          </div>
      </div>

      <dialog ref={dialogRef} aria-labelledby={dialogTitleId} onCancel={event => { event.preventDefault(); setSelected(null); }} onClose={() => { if (!dialogRef.current?.open) setSelected(null); }} onClick={event => {
        // Only backdrop clicks close the dialog; clicks on its padding do not.
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) setSelected(null);
      }} className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-slate-900/15 bg-[#fffef8] p-0 text-slate-900 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
        {selected && <div className="relative p-6 sm:p-9"><button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Close project details" className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dfd5] bg-[#fffef8] transition-colors hover:bg-teal-950/5 ${focusStyle}`}><Icon type="close" className="h-5 w-5" /></button><p className="mb-5 pr-12 text-xs uppercase tracking-widest" style={{ color: readableAccent(selected.category) }}>{selected.category.title} / Concept project</p><div className="mb-6 h-56 overflow-hidden rounded-xl border border-[#d6dfd5] bg-[#eef2e8]"><ProjectArtwork category={selected.category} item={selected.item} /></div><h3 id={dialogTitleId} className="text-2xl font-medium leading-tight sm:text-3xl">{selected.item.title}</h3><p className="mt-4 text-sm leading-7 text-slate-700">{selected.item.description}</p>{selected.item.features?.length > 0 && <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-700">{selected.item.features.map(feature => <li key={feature}>{feature}</li>)}</ul>}<p className="mt-6 text-xs leading-6 text-slate-600">This entry describes a portfolio concept. Add your own screenshots and a working demo link to showcase completed work.</p><div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => setSelected(null)} className={`min-h-11 rounded-lg border border-slate-900/15 px-4 py-3 text-sm transition-colors hover:bg-teal-950/5 ${focusStyle}`}>Back to projects</button>{/^https?:\/\//i.test(selected.item.demoUrl || "") && <a href={selected.item.demoUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-950 hover:bg-teal-800 ${focusStyle}`}>Open live demo<Icon type="arrow" className="h-4 w-4" /><span className="sr-only"> (opens a new tab)</span></a>}</div></div>}
      </dialog>
    </section>
  );
}
