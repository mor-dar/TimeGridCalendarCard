# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Install dependencies
npm install

# Build the bundle (outputs to dist/TimeGridCalendarCard.js)
npm run build

# Development mode with file watching
npm run dev
# or
npm run watch
```

## Architecture Overview

This is a **Home Assistant Lovelace custom card** that provides a FullCalendar time-grid day view for calendar entities. The card is built as a web component using:

- **LitElement** for the custom element framework
- **FullCalendar** (timegrid plugin) for calendar rendering  
- **TypeScript** for type safety
- **esbuild** for bundling

### Key Components

1. **Main Card Component** (`src/TimeGridCalendarCard.ts`):
   - Custom element registered as `<time-grid-calendar-card>`
   - Fetches events from Home Assistant's REST API via `hass.callApi()`
   - Implements caching (5-15 min configurable) with in-flight request deduplication
   - Handles event overlap rendering, locale/timezone from HA config, and RTL support
   - Uses light DOM (no shadow DOM) to allow FullCalendar CSS to apply

2. **Event Fetching Strategy**:
   - Pulls events via `GET /api/calendars/{entity_id}?start=...&end=...`
   - Merges multiple calendar entities into single view
   - Applies per-calendar color mapping and regex filters (allow/block)
   - Implements duplicate suppression across calendars
   - All data stays within Home Assistant (no external requests)

3. **Configuration** (`types.ts`):
   - Required: `entities` array of calendar entity IDs
   - Optional: colors, time range (minTime/maxTime), slot duration, filters
   - Special `todayOnly` mode restricts navigation to current day

4. **Build Output**:
   - Single bundled file: `dist/TimeGridCalendarCard.js`
   - Minified ESM module format
   - External CSS dependencies handled inline

## HACS Integration

The card is distributed via HACS (Home Assistant Community Store). The `hacs.json` file specifies:
- Bundle location: `dist/TimeGridCalendarCard.js`
- Minimum HA version: 2024.12.0

## Testing

No test framework is currently configured. Manual testing is done via Home Assistant dashboard after building.

## Important Implementation Notes

- The card uses **light DOM** instead of shadow DOM to ensure FullCalendar styles work correctly
- **ResizeObserver** is used to handle container size changes and trigger calendar updates
- Events are cached with a hash key based on time window and entity list
- The card respects Home Assistant's locale, timezone, and RTL settings automatically