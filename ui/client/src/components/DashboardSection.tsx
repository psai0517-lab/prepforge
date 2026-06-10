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

const radarData = [
  { subject: "Coding", score: 4.2, fullMark: 5 },
  { subject: "System Design", score: 3.1, fullMark: 5 },
  { subject: "Domain Depth", score: 3.8, fullMark: 5 },
  { subject: "Behavioral", score: 4.5, fullMark: 5 },
  { subject: "Culture Fit", score: 4.0, fullMark: 5 },
];

const trendData = [
  { session: "W1", mock: 2.5, design: 2.0, behavioral: 3.0 },
  { session: "W2", mock: 3.0, design: 2.5, behavioral: 3.2 },
  { session: "W3", mock: 3.2, design: 3.0, behavioral: 3.5 },
  { session: "W4", mock: 3.8, design: 3.2, behavioral: 4.0 },
  { session: "W5", mock: 4.0, design: 3.5, behavioral: 4.2 },
  { session: "W6", mock: 4.2, design: 3.8, behavioral: 4.5 },
];

const layoutSections = [
  { name: "Dashboard (Home)", purpose: "High-level overview of progress and next steps", key: "Study plan progress, session scores, gap alerts" },
  { name: "Profile & Resume", purpose: "Management of user background and targets", key: "Form fields, resume upload, skills visualization" },
  { name: "Study Plan", purpose: "Visual representation of the generated roadmap", key: "Timeline view, week-by-week breakdown, resources" },
  { name: "Practice Hub", purpose: "Launchpad for various mock sessions", key: "Mode selectors, domain/company configuration" },
  { name: "History & Debrief", purpose: "Review of past performance and trends", key: "Trend graphs, session transcripts, weak areas" },
];

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 bg-muted/30 relative">
      <div className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-accent">
            02 — Dashboard & Layout
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-3">
            Core UI <span className="italic">Layout</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            The UI is structured as a comprehensive dashboard, allowing users to navigate
            seamlessly between preparation, active practice, and review.
          </p>
        </motion.div>

        {/* Dashboard mockup image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 rounded-lg overflow-hidden border border-border shadow-md"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663489379363/aoaSqExMPNHViFhDQ4c4fJ/section-dashboard-QzY3eDFe9YDVi9tRYFDj4Q.webp"
            alt="Dashboard UI mockup showing radar chart, trend lines, and study plan timeline"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Navigation structure table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="text-base font-semibold">Navigation Structure</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-foreground">Section</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground">Purpose</th>
                      <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">Key Elements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layoutSections.map((section, i) => (
                      <tr key={section.name} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                        <td className="px-4 py-3 font-mono text-xs text-accent">{section.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{section.purpose}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{section.key}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive chart demos */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Skills Radar — Debrief Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Radar charts provide an immediate visual representation of strengths and weaknesses
                  across core preparation pillars.
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(0.88 0.01 85)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: "oklch(0.45 0.02 255)" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 5]}
                      tick={{ fontSize: 10, fill: "oklch(0.55 0.02 255)" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="oklch(0.55 0.15 175)"
                      fill="oklch(0.55 0.15 175)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Score Trends — Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Line graphs show score progression over time for different domains, making
                  improvement (or stagnation) immediately visible.
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 85)" />
                    <XAxis
                      dataKey="session"
                      tick={{ fontSize: 11, fill: "oklch(0.45 0.02 255)" }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fontSize: 11, fill: "oklch(0.45 0.02 255)" }}
                    />
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
                      dataKey="mock"
                      stroke="oklch(0.55 0.15 175)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Mock"
                    />
                    <Line
                      type="monotone"
                      dataKey="design"
                      stroke="oklch(0.22 0.03 255)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="System Design"
                    />
                    <Line
                      type="monotone"
                      dataKey="behavioral"
                      stroke="oklch(0.65 0.12 175)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Behavioral"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
