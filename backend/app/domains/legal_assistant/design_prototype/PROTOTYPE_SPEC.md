# 🎨 Legal Assistant - Design Prototype & Wireframe Spec

> **Glassmorphism UI/UX Architecture & Stanford 2026 Interactive Debugger Interface**

---

## 💎 Design System & Palette

The Legal Assistant UI follows OmniAgent Studio's **Aegis Glassmorphism Design System**:

- **Background Canvas**: Deep Midnight `#0b0f19` to Indigo Navy `#111827` gradient.
- **Glass Panel Surface**: `rgba(255, 255, 255, 0.04)` with `backdrop-filter: blur(16px)` and `1px solid rgba(255, 255, 255, 0.08)`.
- **Primary Accent**: Judicial Violet `#8b5cf6` & Cyber Cyan `#06b6d4`.
- **Status Indicator Colors**:
  - `Correct / Verified`: Emerald `#10b981`
  - `Reflexion / Self-Correction`: Amber `#f59e0b`
  - `Violation / Warning`: Rose `#f43f5e`
  - `Info / Precedent Match`: Sapphire `#3b82f6`

---

## 📐 Layout Wireframe & Navigation Architecture

The interface features a 3-tab layout:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ⚡ OMNIAGENT STUDIO  │  ⚖️ Legal Intelligence Workbench  │  🧠 Stanford 2026 Debugger  │  📜 Docs & Roadmap│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  ┌─────────────────────────────┐  ┌───────────────────────────────────────────────────────────┐  │
│  │  LEFT PANEL:               │  │  RIGHT PANEL:                                             │  │
│  │  - Case Selector           │  │  - Evidence Matrix & Probative Value Table                │  │
│  │  - Persona Picker          │  │  - Precedent Matching Score & Case Summaries              │  │
│  │  - Dossier Input Sandbox   │  │  - Prosecution Report / Defense Strategy Draft             │  │
│  │  - Process Trigger Button  │  │  - Stanford 2026 Reflexion Trace & Grounding Rating       │  │
│  └─────────────────────────────┘  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Stanford 2026 Agent Debugger Component Spec

The Stanford 2026 Debugger visualizes the 13-step loop:

1. **Step Trace Visualizer**: Vertical stepper displaying active execution phase (Steps 1 to 13).
2. **Grounding & Verification Meter**: Progress radial bar showing `citation_grounding_score` (Target \(\ge 85\%\)).
3. **Reflexion Log Drawer**: Displays any self-corrections triggered during Step 8 (Reflect) & Step 9 (Replan).
4. **Episodic Attorney Feedback Modal**: Allows human lawyers to rate outputs, submit corrections, and trigger Step 12 (Store Experience) & Step 13 (Improve Agent).
