import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────

interface Session {
  date: string;
  mode: string;
  domain: string;
  topic: string;
  score: number;
  outOf: number;
  weakAreas: string;
  notes: string;
}

interface Profile {
  candidate?: { name?: string; current_title?: string; current_company?: string };
  target?: { companies?: { name: string; role: string; level_universal: string }[] };
  strengths?: string[];
  gaps?: string[];
}

// ── Domain label map ────────────────────────────────────────────────────────

const DOMAIN_LABELS: Record<string, string> = {
  sql: "SQL",
  spark: "Spark",
  kafka: "Kafka",
  dsa: "DSA",
  "data-modeling": "Data Modeling",
  "spark-internals": "Spark",
  mock: "Mock",
  behavioral: "Behavioral",
  "system-design": "System Design",
};

function label(d: string) {
  return DOMAIN_LABELS[d.toLowerCase()] ?? d;
}

// ── Derive radar data from sessions ────────────────────────────────────────

function toRadar(sessions: Session[]) {
  const buckets: Record<string, number[]> = {};
  for (const s of sessions) {
    const normalized = (s.score / s.outOf) * 10;
    const key = label(s.domain);
    (buckets[key] ??= []).push(normalized);
  }
  return Object.entries(buckets).map(([subject, scores]) => ({
    subject,
    score: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
    fullMark: 10,
  }));
}

// ── Derive trend data from sessions ────────────────────────────────────────

function toTrend(sessions: Session[]) {
  return sessions.map((s, i) => ({
    label: s.date.slice(5) || `S${i + 1}`,
    score: parseFloat(((s.score / s.outOf) * 10).toFixed(1)),
    mode: label(s.mode),
  }));
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyDashboard({ profile }: { profile: Profile | null }) {
  const primary = profile?.target?.companies?.[0];
  const gaps = profile?.gaps ?? [];
  const strengths = profile?.strengths ?? [];

  return (
    <div className="space-y-8">
      {/* Target banner */}
      {primary && (
        <div className="p-5 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-1">Primary Target</p>
            <p className="text-lg font-medium text-foreground">
              {primary.name} · {primary.role}
            </p>
            <p className="text-sm text-muted-foreground">{primary.level_universal} level</p>
          </div>
          <div className="sm:ml-auto text-right">
            <p className="text-xs font-mono text-muted-foreground">Sessions logged</p>
            <p className="text-3xl font-serif italic text-muted-foreground/60">0</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gaps */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-rose-600">
              Areas to Close
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No gaps recorded in profile.</p>
            ) : (
              gaps.map((g) => (
                <div key={g} className="flex items-start gap-2 text-sm">
                  <span className="text-rose-400 mt-0.5">▸</span>
                  <span className="text-foreground">{g}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-600">
              Confirmed Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {strengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">No strengths recorded in profile.</p>
            ) : (
              strengths.map((s) => (
                <div key={s} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-foreground">{s}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="p-6 rounded-lg border-2 border-dashed border-border text-center">
        <p className="text-muted-foreground text-sm mb-3">
          No sessions logged yet. Charts and trends will appear after your first drill or mock session.
        </p>
        <a
          href="#drills"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start a Drill Session ↓
        </a>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function DashboardSection() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tracker").then((r) => r.json()).catch(() => []),
      fetch("/api/profile").then((r) => r.json()).catch(() => null),
    ]).then(([s, p]) => {
      setSessions(s ?? []);
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const hasSessions = sessions.length > 0;
  const radarData = toRadar(sessions);
  const trendData = toTrend(sessions);
  const avgScore = hasSessions
    ? ((sessions.reduce((a, s) => a + s.score / s.outOf, 0) / sessions.length) * 10).toFixed(1)
    : null;
  const weakDomain = hasSessions
    ? radarData.sort((a, b) => a.score - b.score)[0]?.subject
    : null;
  const recentSessions = [...sessions].reverse().slice(0, 5);

  return (
    <section id="dashboard" className="py-20 bg-muted/30 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-accent">
            02 — Dashboard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3 leading-tight">
            Your <span className="italic">Progress</span>
          </h2>
          {profile?.candidate && (
            <p className="text-muted-foreground mt-2">
              {profile.candidate.name} · {profile.candidate.current_title} @ {profile.candidate.current_company}
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Loading…
          </div>
        ) : !hasSessions ? (
          <EmptyDashboard profile={profile} />
        ) : (
          <div className="space-y-6">
            {/* Stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Sessions", value: sessions.length },
                { label: "Avg Score", value: `${avgScore}/10` },
                { label: "Weakest Area", value: weakDomain ?? "—" },
                {
                  label: "Best Score",
                  value: `${Math.max(...sessions.map((s) => Math.round((s.score / s.outOf) * 10)))}/10`,
                },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-lg border border-border bg-card text-center">
                  <p className="text-xs font-mono text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-serif italic text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Domain Scores (avg /10)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.88 0.01 85)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "oklch(0.45 0.02 255)" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
                      <Radar
                        dataKey="score"
                        stroke="oklch(0.55 0.15 175)"
                        fill="oklch(0.55 0.15 175)"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 85)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid oklch(0.88 0.01 85)",
                          borderRadius: "6px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="oklch(0.55 0.15 175)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent sessions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Mode</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Domain</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Score</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell">Weak Areas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessions.map((s, i) => {
                        const pct = Math.round((s.score / s.outOf) * 100);
                        return (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.date}</td>
                            <td className="px-4 py-2.5 text-foreground">{label(s.mode)}</td>
                            <td className="px-4 py-2.5 text-foreground">{label(s.domain)}</td>
                            <td className="px-4 py-2.5">
                              <span className={`font-medium ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-rose-500"}`}>
                                {s.score}/{s.outOf}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground text-xs hidden md:table-cell">{s.weakAreas || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Next action */}
            {weakDomain && (
              <div className="p-5 rounded-lg border border-amber-200 bg-amber-50 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-amber-600 mb-1">Recommended next session</p>
                  <p className="text-sm font-medium text-foreground">
                    Your weakest area is <strong>{weakDomain}</strong> — run a drill or learn session on it.
                  </p>
                </div>
                <a
                  href="#drills"
                  className="shrink-0 px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Drill {weakDomain} ↓
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
