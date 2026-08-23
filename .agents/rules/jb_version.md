# Rule: Phiên bản JB (JB Version)

This workspace is configured with **Phiên bản JB** (JB Version) for the KOL Tracking application.

## 1. Aesthetic Guidelines
- **Theme**: "Serene Lavender & Linen Minimalism".
- **Primary Color**: Pastel Lavender Lilac (`--accent: #8A7BFF`) with very soft lilac wash highlights.
- **Background**: Soft pearled cream-lilac (`#F5F3FA`) with a subtle textured paper grain (`opacity: 0.015`).
- **Cards & Buttons**: Bo bo rounded corners (`16px`/`12px`), thin borders (`#E4E1EE`), and no retro offsets/shadows.
- **Font**: **Plus Jakarta Sans** for both headers and body text.
- **Excluded Elements**: Never add floating background blobs, harsh borders, or any other color palettes (like mint green or pink).

## 2. Feature Scope
- **Views**: Only three tabs must remain: **Bảng (Table)**, **Kanban**, and **Lịch (Calendar)**.
- **Insights & Timeline**: The Insights view, glossary cards, custom notes, and the Activity log sidebar are permanently removed. Do not re-add them.

## 3. Data Parsing & Merging
- **KOL Matching**: Case-insensitive and alias-matched header parsing for KOL names so that any user uploads work seamlessly.
- **File Type Classification**:
  - `EXECUTION` (`internal`/`execution`): Only merge execution progress; protect valid URL links.
  - `PERFORMANCE` (`grid`/`test am_grid`): Merge views/conversions results.
  - `BUDGET_REF` (`[avnxtcv]`/`external`): Merge costs; do not clear performance metrics.

## 4. Brand & Campaign Sanitization
- All default campaigns in the interface dropdown must be generic (without AM, AX display abbreviations):
  - `AM` $\rightarrow$ `Campaign A`
  - `AX` $\rightarrow$ `Campaign B`
  - `Vinegar` $\rightarrow$ `Campaign C`
  - `MSG` $\rightarrow$ `Campaign D`
  - `Blendy` $\rightarrow$ `Campaign E`
- No real product names, brand campaign names, or internal project codes should be shown on the public UI.
- The `normalizeCampaignKey` must still map both original names (like "mayo", "giấm", "msg") and generic names (like "Campaign A", "Campaign B") to these keys so that old user files import correctly.
- Default SEED_DATA must contain only generic demo rows ("Demo KOL A", "Demo KOL B").
