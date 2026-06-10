import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const MODES = [
  {
    id: "mock",
    label: "Mock Interview",
    description: "SQL, coding, or domain-specific technical round. Timed, scored.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    duration: "45 min",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    description: "STAR+R practice. Apple values framing, ownership, horizontal impact.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    duration: "45 min",
  },
  {
    id: "system-design",
    label: "System Design",
    description: "Design a data system at Apple scale. Privacy-first, petabyte framing.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    duration: "60 min",
  },
];

const COMPANIES = [
  { id: "apple", label: "Apple" },
  { id: "netflix", label: "Netflix" },
  { id: "amazon", label: "Amazon" },
  { id: "google", label: "Google" },
];

const DOMAINS: Record<string, { id: string; label: string }[]> = {
  mock: [
    { id: "sql", label: "SQL" },
    { id: "spark", label: "Spark Internals" },
    { id: "kafka", label: "Kafka" },
    { id: "dsa", label: "DSA (Python)" },
    { id: "data-modeling", label: "Data Modeling" },
  ],
  behavioral: [],
  "system-design": [
    { id: "device-telemetry", label: "Device Telemetry Pipeline" },
    { id: "data-deletion", label: "Data Deletion at Scale" },
    { id: "app-store-analytics", label: "App Store Analytics" },
    { id: "ml-feature-store", label: "Petabyte Lakehouse / Feature Store" },
    { id: "cdc-pipeline", label: "Cross-Region CDC Pipeline" },
  ],
};

export function PracticeSection() {
  const [, navigate] = useLocation();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState("apple");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const mode = MODES.find((m) => m.id === selectedMode);
  const domains = selectedMode ? DOMAINS[selectedMode] : [];
  const needsDomain = selectedMode === "mock";
  const needsTopic = selectedMode === "system-design";
  const canStart =
    selectedMode &&
    selectedCompany &&
    (!needsDomain || selectedDomain) &&
    (!needsTopic || selectedDomain || customTopic.trim());

  function handleStart() {
    if (!canStart) return;
    const topic = needsTopic ? (selectedDomain || customTopic.trim()) : "";
    const domain = needsDomain ? selectedDomain : "";
    navigate(`/session?mode=${selectedMode}&company=${selectedCompany}&domain=${domain}&topic=${topic}`);
  }

  return (
    <section id="practice" className="py-20 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-accent">
            03 — Practice
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
            Start a <span className="italic">Session</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Choose a mode, configure your target, and drop into a live interview with your Apple ICT5 interviewer.
          </p>
        </motion.div>

        {/* Step 1 — Mode */}
        <div className="mb-8">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            01 · Select mode
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {MODES.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => {
                  setSelectedMode(m.id);
                  setSelectedDomain("");
                  setCustomTopic("");
                }}
                className={`text-left p-5 rounded-lg border-2 transition-all duration-150 ${
                  selectedMode === m.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
                }`}
              >
                <div className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${
                  selectedMode === m.id
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {m.icon}
                </div>
                <div className="font-medium text-sm text-foreground mb-1">{m.label}</div>
                <div className="text-xs text-muted-foreground leading-snug mb-2">{m.description}</div>
                <div className="text-xs font-mono text-accent">{m.duration}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Step 2 — Config (only shown after mode selected) */}
        {selectedMode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 mb-8"
          >
            {/* Company */}
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                02 · Company
              </p>
              <div className="flex flex-wrap gap-2">
                {COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompany(c.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150 ${
                      selectedCompany === c.id
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain (mock only) */}
            {needsDomain && (
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  03 · Domain
                </p>
                <div className="flex flex-wrap gap-2">
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDomain(d.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150 ${
                        selectedDomain === d.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Topic (system-design only) */}
            {needsTopic && (
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  03 · Topic
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { setSelectedDomain(d.id); setCustomTopic(""); }}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150 ${
                        selectedDomain === d.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => { setCustomTopic(e.target.value); setSelectedDomain(""); }}
                  placeholder="Or type a custom topic…"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {/* Session summary + Start */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {mode && (
                  <span>
                    <span className="text-foreground font-medium">{mode.label}</span>
                    {" · "}
                    {COMPANIES.find((c) => c.id === selectedCompany)?.label}
                    {(selectedDomain || customTopic) && (
                      <> · <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {selectedDomain || customTopic}
                      </span></>
                    )}
                    {" · "}{mode.duration}
                  </span>
                )}
              </div>
              <button
                onClick={handleStart}
                disabled={!canStart}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
              >
                Start Session
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
