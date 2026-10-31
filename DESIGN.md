---
name: NoteMD
description: A minimalist, functional clinician workspace.
colors:
  primary: "#235bce"
  primary-hover: "#194aaf"
  primary-soft: "#edf3ff"
  ink: "#252b36"
  muted: "#667080"
  canvas: "#ffffff"
  faint: "#f7f8fa"
  navigation: "#f8f9fb"
  divider: "#e8ebf0"
  field-border: "#d9dee7"
  field-hover: "#acb6c5"
  secondary-border: "#dce1e9"
  secondary-ink: "#394251"
  secondary-hover: "#f5f7fa"
  active-navigation: "#eaf0fc"
  active-navigation-ink: "#2355b7"
  neutral-status: "#f1f3f6"
  neutral-status-ink: "#616d80"
  positive-status: "#eaf4ee"
  positive-status-ink: "#427759"
  draft-status: "#faf2e3"
  draft-status-ink: "#8c6825"
  danger: "#aa3434"
  record-surface: "#f8f9fc"
typography:
  headline:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  title:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.012em"
  body:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "13px"
    fontWeight: 500
  metadata:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "12px"
    fontWeight: 400
  note-body:
    fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  badge: "4px"
  control: "6px"
  record: "8px"
  dialog: "12px"
spacing:
  inline: "8px"
  actions: "10px"
  related: "12px"
  group: "20px"
  section: "24px"
  major: "30px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  button-text:
    textColor: "{colors.primary}"
    padding: "4px 0"
  field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
  navigation-active:
    backgroundColor: "{colors.active-navigation}"
    textColor: "{colors.active-navigation-ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  badge-draft:
    backgroundColor: "{colors.draft-status}"
    textColor: "{colors.draft-status-ink}"
    rounded: "{rounded.badge}"
    padding: "3px 7px"
  record-details:
    backgroundColor: "{colors.record-surface}"
    rounded: "{rounded.record}"
    padding: "21px"
---

# Design System: NoteMD

## Overview

**Creative North Star: "The clinician workspace"**

NoteMD is minimalist, functional, and simple. White working areas, quiet gray navigation, and one blue action accent let patient records and clinical writing carry the interface. This language records the implemented clinician application and the user's confirmed direction.

Compact rows and fine dividers provide structure without decorative dashboard cards or charts. Segoe UI keeps the workspace familiar. Patient context accompanies the note editor, with a compact context strip replacing the desktop side panel on smaller screens.

**Key Characteristics:**

- White working surfaces and subdued gray navigation.
- Blue for actions, focus, links, and selection.
- Compact lists separated by fine dividers.
- Familiar controls with gently curved corners.
- Patient context beside or above clinical writing.

Source evidence: `frontend/app/src/styles.css`, `shared.tsx`, `App.tsx`, `pages.tsx`, `PatientPage.tsx`, and `NoteEditor.tsx`. Final rendered evidence is in `.impeccable/review`; the main validation pass reports four passing end-to-end suites covering accessibility, overflow, keyboard operation, and motion.

## Colors

The palette is quiet and neutral, with blue marking interaction and restrained semantic colors marking record state. Frontmatter owns the exact color values.

### Primary

- **Workspace Blue:** primary buttons, links, caret, active tabs, and keyboard focus.
- **Deep Action Blue:** primary button hover.
- **Soft Blue:** gentle confirmation and contextual emphasis.
- **Selected Navigation Blue:** a pale selected background with darker blue text.

### Neutral

- **Clinical Ink:** default content text.
- **Muted Slate:** metadata, descriptions, and secondary labels.
- **White Canvas:** the main workspace and form controls.
- **Navigation Gray:** the persistent navigation surface.
- **Fine Divider:** list boundaries, section separators, and shell edges.
- **Field Gray:** input borders; the darker hover border signals interactivity.
- **Record Gray:** the patient details container.

Green, amber, and red are semantic state colors, not additional brand accents. Draft, signed, appointment, and medication states retain written labels so color does not carry their meaning alone. Initial avatars also use quiet categorical tints.

**The Action Blue Rule.** Use blue to identify an action, selection, or focus state.

## Typography

**Display Font:** No separate display face.
**Body Font:** Segoe UI, followed by the implemented platform sans-serif fallbacks.

**Character:** Familiar, compact, and readable. Headings use modest size and stronger weight; metadata uses smaller text and muted color. The user-pinned Segoe UI direction is an explicit project constraint.

### Hierarchy

- **Headline:** page headings; patient and editor headings use compact variants. Mobile page headings step down to fit.
- **Title:** section headings.
- **Body:** the base document size; dense record rows usually use label or metadata sizes.
- **Label:** form labels and row titles.
- **Metadata:** secondary patient details, dates, descriptions, and links. Status badges and tertiary details use a smaller compact size.
- **Note body:** multiline editor text uses generous leading; signed text increases leading and is constrained to a readable measure (75ch).

**The Content Hierarchy Rule.** Establish hierarchy with size, weight, spacing, and muted metadata before adding another visual device.

## Layout

Desktop uses a fixed left sidebar (216px), a compact header (73px), and a centered main working area with a maximum width (1500px). Default main padding is spacious enough to separate task groups (40px 42px 26px) while list rows remain compact. Standard forms use paired columns and a shared action footer; narrow form pages cap their width (700px).

At the medium desktop breakpoint (1250px), the sidebar and main padding contract. At the tablet breakpoint (1000px), supporting columns stack. The note editor replaces its side context with a compact patient strip that includes patient name, allergies, and conditions. At the mobile breakpoint (760px), the sidebar becomes top navigation, content spans the viewport, and toolbars wrap. The patient table becomes two fixed-layout columns: Patient (58%) and Conditions (42%). Text wraps; last-note, next-appointment, and separate open-record columns are hidden, with those details available inside the patient record. The smallest breakpoint (380px) stacks form columns and supporting areas. Wide screens (1550px and above) gain space between work areas.

Spacing follows the relationships in the source rather than a strict arithmetic scale: small inline gaps, medium action groups, and larger section boundaries. Primary actions sit near the current task.

## Elevation & Depth

The workspace is mostly flat. Dividers and surface tone establish grouping. The selected segmented filter has a subtle shadow; dialogs use a larger soft shadow and a translucent backdrop. Do not turn these exceptions into resting shadows for every record row.

### Shadow Vocabulary

- **Selected filter:** `0 1px 3px rgba(27, 42, 66, 0.08)`.
- **Dialog:** `0 18px 65px rgba(24, 37, 61, 0.18)`.

**The Divider First Rule.** Separate ordinary clinical rows and sections with fine dividers; reserve elevation for the implemented selected filter and modal overlay.

## Shapes

Controls use gently curved corners. Badges use tighter corners, patient details use a slightly softer container, and dialogs use the largest radius. Initial avatars are circular. Borders are thin and subdued. These differences distinguish controls, statuses, and overlays without elaborate ornament.

## Components

### Buttons

Task actions are compact and direct. Primary buttons use blue with white text; secondary buttons use white with a thin border. Both share the control radius and compact padding. Text actions use blue and underline on hover. Icon buttons remain quiet until hover.

Primary buttons have a minimum height (38px); small buttons use a shorter variant (32px). Background-color feedback lasts 120ms. For pointer input with no reduced-motion preference, enabled buttons press to scale(0.98) with a 120ms transform transition using cubic-bezier(0.23, 1, 0.32, 1). Keyboard input removes button transitions and the press transform. Keyboard focus uses a blue outline (2px) with visible offset (3px). Disabled controls lower opacity and change the cursor.

### Chips

Status badges are compact written labels with tinted backgrounds and tighter corners. Drafts use amber, active or checked-in records use green, and cancelled or discontinued records use neutral gray. They describe state rather than acting as general decoration.

### Cards / Containers

Ordinary records are rows, not floating cards. Patient details are the recurring tonal container, with the record radius and internal padding. Context panels use a divider along their leading edge. Dialogs have their own overlay depth and larger radius.

Native dialogs open immediately for keyboard input. Pointer-triggered dialogs arrive over 200ms with opacity and scale(0.97) to scale(1), using the same ease-out curve as button presses. Reduced-motion pointer input uses a 100ms opacity-only arrival. Closing is immediate and returns focus to the connected triggering element. The loading skeleton pulse is removed under reduced motion.

### Inputs / Fields

Fields use white backgrounds, thin gray borders, the control radius, and compact padding. Labels sit above fields. Hover darkens the border; keyboard focus receives the common visible outline. Search wraps an unbordered input inside a bordered container and uses a focus-within outline. Textareas resize vertically.

### Navigation

Desktop navigation is a vertical stack on a pale gray sidebar. Active destinations receive a pale blue fill and blue text. Hover adds a neutral fill. Mobile navigation moves to a horizontal row at the top; counts and secondary clinician information are hidden to preserve space.

### Clinical Note Editor

SOAP sections use explicit labels and small letter markers. Each writing field is full width with generous leading. Patient context remains visible beside the editor on desktop and in a strip above the form on smaller screens. Save feedback and signing confirmation use plain text and restrained state surfaces. Signed note content preserves line breaks.

## Do's and Don'ts

### Do:

- **Do** use blue for actions, selection, links, and keyboard focus.
- **Do** group ordinary records with fine dividers.
- **Do** keep patient context with the clinical note editor at every layout size.
- **Do** retain written labels for every status.
- **Do** honor input modality and reduced motion: keyboard interactions are immediate, reduced motion removes CSS animation and transitions, and pointer-triggered dialogs use only a short opacity arrival.

### Don't:

- **Don't** add decorative dashboard cards or charts to this minimalist workspace.
- **Don't** replace the confirmed Segoe UI stack with an unrelated display typeface.
- **Don't** use color alone to communicate clinical record state.
- **Don't** apply modal shadows to ordinary list rows.

Not canonized: no new visual defects are promoted into reusable rules. Browser, accessibility, overflow, keyboard, and motion checks are reported by the separate validation pass; the documented motion remains limited to brief interaction feedback.
