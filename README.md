# Time Grid Calendar Card

FullCalendar **time-grid day** view for Home Assistant's `calendar.*` entities. Pulls events via HA's REST API so your data stays inside HA. Overlapping events render exactly like Google Calendar.

![screenshot](./docs/screenshot.png)

## Features
- Time-grid day view with **overlap** handling (FullCalendar).
- **Multiple calendars** merged into one view.
- Per-calendar **color** mapping.
- **Locale**, **timezone**, and **RTL** respected from HA.
- Performance: **in-memory cache** for 5–15 min (configurable), in-flight dedupe.
- Optional **filters** per calendar (allow/block by regex) and **duplicate suppression**.
- **Today-only mode** to restrict navigation and focus on current day events only.
- Click an event to open **more-info** for its calendar entity.

## Quick start

### HACS (recommended)
1. Go to **HACS → Frontend → ⋮ → Custom repositories**.
2. Add this repo URL. Category: **Lovelace**.
3. Install **Time Grid Calendar Card** and **reload** resources.
4. Add to a dashboard as **Manual** card:

```yaml
type: custom:TimeGridCalendarCard
entities:
  - calendar.personal
  - calendar.family
  - calendar.work
colors:
  calendar.personal: '#81C784'
  calendar.family: '#9575CD'
  calendar.work: '#7986CB'
minTime: '06:00:00'
maxTime: '22:00:00'
slotDuration: '00:30:00'
nowIndicator: true
scrollTime: '07:00:00'
todayOnly: false
```

### Manual install

1. Download `dist/TimeGridCalendarCard.js` from the latest release.
2. Copy it to `/config/www/TimeGridCalendarCard.js`.
3. Add a Lovelace **resource**: `url: /local/TimeGridCalendarCard.js`, `type: module`.
4. Use the YAML above to add the card.

## Configuration

| Option               | Type       | Default      | Description                                                                            |
| -------------------- | ---------- | ------------ | -------------------------------------------------------------------------------------- |
| `entities`           | `string[]` | **required** | List of `calendar.*` entity IDs.                                                       |
| `colors`             | `object`   | –            | Map of `entity_id → hex color`.                                                        |
| `minTime`            | `string`   | `06:00:00`   | Earliest slot to show.                                                                 |
| `maxTime`            | `string`   | `22:00:00`   | Latest slot to show.                                                                   |
| `slotDuration`       | `string`   | `00:30:00`   | Slot size.                                                                             |
| `scrollTime`         | `string`   | `07:00:00`   | Initial vertical scroll.                                                               |
| `nowIndicator`       | `boolean`  | `true`       | Show "now" line.                                                                       |
| `slotEventOverlap`   | `boolean`  | `true`       | Allow overlap stacking.                                                                |
| `cacheMinutes`       | `number`   | `10`         | Cache TTL for the requested window.                                                    |
| `suppressDuplicates` | `boolean`  | `true`       | Remove duplicate events returned by multiple calendars.                                |
| `todayOnly`          | `boolean`  | `false`      | Restrict view to today only (prevents navigation to other days).                       |
| `filters`            | `object`   | –            | Per-calendar `{ allow?: string[]; block?: string[] }` regexes matched against `title`. |

### Notes

- Events are fetched via `GET /api/calendars/{entity_id}?start=…&end=…` using `hass.callApi`. We pass FullCalendar's requested window directly.
- Locale and timezone are taken from `hass.locale` and `hass.config.time_zone`; direction (RTL/LTR) uses the document's `dir` attribute.
- **Privacy**: All calendar data stays within your Home Assistant instance. No external network requests are made.

## Development

```bash
pnpm i  # or npm i / yarn
npm run build
npm run dev   # watch mode
```

The bundle is emitted to `dist/TimeGridCalendarCard.js`.

## Ship via HACS

- Ensure `hacs.json` matches the built filename and HA version.
- Tag a release; HACS can track the `dist/` JS file.

## Acknowledgements

- [Calendar Card Pro](https://github.com/alexpfau/calendar-card-pro)
- [Atomic Calendar Revive](https://github.com/totaldebug/atomic-calendar-revive)
- [FullCalendar](https://fullcalendar.io/)

## Troubleshooting

- If you see a blank area, check the **browser console** for errors.
- Verify the Lovelace **resource** path and that `dist/TimeGridCalendarCard.js` is present.
- Make sure your `calendar.*` entities are providing events for the requested window.

````

---

## Example Lovelace YAML (copy/paste)

```yaml
type: custom:TimeGridCalendarCard
entities:
  - calendar.personal
  - calendar.family
  - calendar.work
colors:
  calendar.personal: '#81C784'
  calendar.family: '#9575CD'
  calendar.work: '#7986CB'
minTime: '06:00:00'
maxTime: '22:00:00'
slotDuration: '00:30:00'
nowIndicator: true
scrollTime: '07:00:00'
slotEventOverlap: true
cacheMinutes: 10
suppressDuplicates: true
todayOnly: false
filters:
  calendar.personal:
    block: ['Private']
  calendar.family:
    allow: ['.*']
````
