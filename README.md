# ConcussionEval Dashboard

A professional clinical dashboard for concussion evaluation data entry, visualization, and patient reporting. Built for clinicians who need to capture structured assessment data and communicate findings clearly to both practitioners and athletes/patients.

---

## Features

- **Multi-step data entry** — guided form covering Athlete Details, Symptoms, VOMS, and Exertional Testing
- **Auto-calculated scores** — symptom severity categories, VOMS provocation flags, exertional tolerance ratings
- **Practitioner view** — detailed clinical summary with flagged findings, charts, and tables
- **Patient view** — plain-language summary written for the athlete, with emoji indicators and supportive explanations
- **Overview dashboard** — all evaluations at a glance with automatic flagging of high-risk presentations
- **Print / export** — print any report using the browser's native print dialog (sidebar hides automatically)
- **Sample data** — three pre-loaded evaluations demonstrating mild, moderate, and severe presentations
- **Persistent storage** — evaluations saved in browser localStorage; survive page refreshes

---

## Evaluation Domains

### 1. Symptoms
22-item symptom checklist (0–6 severity per item, matching SCAT format).
- **Total Symptom Count** — number of symptoms rated > 0
- **Total Severity Score** — sum of all ratings (max 132)
- **Severity Category** — None / Mild (≤20) / Moderate (21–40) / Severe (>40)

### 2. VOMS — Vestibular/Oculomotor Motor Screening
7 tests: Smooth Pursuit, Horizontal Saccades, Vertical Saccades, Near Point of Convergence (NPC), Horizontal VOR, Vertical VOR, Visual Motion Sensitivity.
- Baseline and post-test symptom scores (0–10) per test
- **Change score ≥ 2** = clinically provoked (displayed as 🚩 Provoked)
- **NPC distance > 5 cm** = flagged (normal < 5 cm)
- Overall VOMS flag: Pass / Caution (1–2 provoked) / Flag (3+ provoked)

### 3. Multimodal Exertional Testing
Stage-by-stage data entry based on the Buffalo Concussion Treadmill Test (BCTT) protocol.
- Heart rate, RPE (Borg 6–20), and symptom score (0–10) per stage
- Auto-detects **symptom threshold heart rate** (first stage with symptom increase)
- **Exertional Tolerance**: Full / Symptom-limited / Unable to complete
- Stop reason: Symptom provocation / Volitional fatigue / Protocol complete / Physician stopped

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Recharts | Charts |
| React Hook Form | Form state |
| Zustand | Global state |
| localStorage (via Zustand persist) | Data persistence |

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on v24)
- npm 9+

### Installation

```bash
git clone https://github.com/HutchM/concussion-eval-dashboard.git
cd concussion-eval-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  page.tsx              # Overview dashboard
  enter/page.tsx        # Multi-step data entry form
  report/[id]/page.tsx  # Individual evaluation report
  athletes/page.tsx     # Athlete cards listing
  layout.tsx            # Root layout with sidebar
components/
  charts/               # Recharts chart components
  entry/                # Data entry form sub-components
  layout/               # Sidebar and top bar
  report/               # Report section components
  ui/                   # Reusable UI primitives (Card, Badge, StatCard…)
data/
  sampleData.ts         # Three pre-loaded demo evaluations
lib/
  scoring.ts            # Score calculation functions
  insights.ts           # Auto-generated clinical and patient insights
store/
  evaluationStore.ts    # Zustand store with localStorage persistence
types/
  index.ts              # All TypeScript types and constants
```

---

## Clinical Notes & Assumptions

- Symptom severity cut-offs (Mild/Moderate/Severe) are illustrative and should be reviewed against your clinical protocol.
- VOMS provocation threshold of ≥2-point change is based on the published VOMS normative literature (Mucha et al., 2014).
- NPC flagging threshold of >5 cm is based on published norms (normal = 5 cm or less).
- Exertional testing protocol defaults assume a BCTT-style incremental treadmill test. Speed/incline values can be left blank if using a different protocol.
- The dashboard does **not** diagnose concussion or provide return-to-sport clearance. All output is intended to support, not replace, individualized clinical judgment.

---

## Disclaimer

> This dashboard is intended to support clinical interpretation and patient communication. It does not provide a medical diagnosis or replace individualized clinical judgment. Always consult with a qualified healthcare professional before making return-to-activity decisions.
