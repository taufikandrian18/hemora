# HEMORA Website Copy Overhaul Deck

Use this document as the temporary copy-editing source until a CMS exists.
Editors should replace text in the `New copy` column and leave field IDs intact.

## Editing Rules

- Keep each line close to the current length unless a redesign is approved.
- Do not edit route slugs: `/lereng`, `/sriti`, `stay`, `dining`, `wellness`, `journal`.
- Do not edit image paths in this document. Image changes need a separate asset pass.
- Keep CTA labels short enough for one line.
- Send the completed document back to the developer for implementation in `app/property-data.ts`, `app/property-pages.tsx`, and `app/layout.tsx`.

## Global Copy

| Field ID | Where it appears | Current copy | New copy |
|---|---|---|---|
| global.meta.title | Browser title | HEMORA — Lereng Senja Ciwidey & Sriti Palu |  |
| global.meta.description | Search/social description | A calm, image-led hospitality homepage for HEMORA's two-property ecosystem in Ciwidey and Palu. |  |
| home.kicker | Home selector | Two Sanctuaries · One Standard of Stillness |  |
| home.lereng.description | Home Lereng card | Highland retreat above tea slopes |  |
| home.sriti.description | Home Sriti card | Warm city hotel with an atrium heart |  |
| home.cue | Home bottom cue | Choose your escape |  |
| nav.stay | Property nav | Stay |  |
| nav.dining | Property nav | Dining |  |
| nav.wellness | Property nav | Wellness |  |
| nav.journal | Property nav | Journal |  |
| nav.reserve | Property nav CTA | Reserve |  |
| booking.form.arrival | Booking form | Arrival |  |
| booking.form.departure | Booking form | Departure |  |
| booking.form.guests | Booking form | Guests |  |
| booking.form.room | Booking form | Room |  |
| booking.form.action | Booking CTA | Check Availability |  |
| footer.rights | Footer | © 2026 Hemora · All rights reserved |  |

## Lereng Senja

| Field ID | Where it appears | Current copy | New copy |
|---|---|---|---|
| lereng.title | Brand/property name | Lereng Senja, Ciwidey |  |
| lereng.shortTitle | Short property name | Lereng Senja |  |
| lereng.location | Location | Ciwidey, West Java |  |
| lereng.tone | Property tone | Highland Retreat |  |
| lereng.heroKicker | Hero kicker | Ciwidey, West Java · 1,450m above sea level |  |
| lereng.heroTitle | Hero headline line 1 | Highland rooms |  |
| lereng.heroEmphasis | Hero headline line 2 | held by the mist. |  |
| lereng.intro | Hero intro | Lereng Senja is shaped around cool air, tea-slope mornings, warm timber rooms, and slow dining that follows the weather rather than the clock. |  |
| lereng.primaryAction | Hero CTA | Reserve the Highland Stay |  |
| lereng.philosophyLabel | Intro label | § 01 — Philosophy |  |
| lereng.philosophyTitle | Intro headline | A retreat composed around cool air and unhurried mornings. |  |
| lereng.philosophyLead | Intro lead | The highlands set the pace here. Mornings begin softly, afternoons gather around warm lounges, and evenings return guests to rooms that feel sheltered from the valley weather. |  |
| lereng.philosophyBody | Intro body | The page keeps the reference draft's generous rhythm: a full cinematic hero, editorial intro, horizontal offers, alternating image blocks, guest note, direct booking cue, and a footer built for practical contact. |  |
| lereng.offersTitle | Offers headline | Reasons to arrive sooner rather than later. |  |
| lereng.offersIntro | Offers intro | Each offer is built around the weather: mist, warm meals, family time, and a slower Ciwidey morning. |  |
| lereng.quote | Quote band | Lereng Senja works because it lets the mountain lead. Nothing feels rushed, and the rooms keep the highland quiet close. |  |
| lereng.quoteSource | Quote source | Guest note · Ciwidey stay |  |
| lereng.bookingTitle | Booking headline | Your highland room is waiting. |  |
| lereng.bookingLead | Booking body | Write to the host team with your dates and preferred room. We will answer with availability and the simplest booking path. |  |
| lereng.address | Footer address | Ciwidey, Bandung Regency, West Java |  |
| lereng.email | Footer email | hello@hemora.co |  |
| lereng.phone | Footer phone | +62 812 3456 7890 |  |

### Lereng Offers

| Field ID | Current copy | New copy |
|---|---|---|
| lereng.offer.1.name | The Mist Weekend |  |
| lereng.offer.1.meta | 03 nights · Fri-Sun |  |
| lereng.offer.1.description | A room, breakfast, and a late checkout for guests who want the highlands without rushing back. |  |
| lereng.offer.1.rate | From IDR 1.850K |  |
| lereng.offer.2.name | Family Above the Slopes |  |
| lereng.offer.2.meta | 02 nights · Family |  |
| lereng.offer.2.description | Flexible rooms, playground access, and a breakfast table held for slower family mornings. |  |
| lereng.offer.2.rate | From IDR 2.950K |  |
| lereng.offer.3.name | Work From the Valley |  |
| lereng.offer.3.meta | 04 nights · Weekday |  |
| lereng.offer.3.description | A quieter weekday stay with work tables, warm drinks, and tea-slope walks between calls. |  |
| lereng.offer.3.rate | From IDR 2.450K |  |

### Lereng Menu Pages

| Field ID | Current copy | New copy |
|---|---|---|
| lereng.stay.eyebrow | § 02 — Stay |  |
| lereng.stay.title | Rooms that keep the mountain air close. |  |
| lereng.stay.body | The rooms use timber, soft textiles, and wide openings to make the highland temperature feel considered rather than cold. |  |
| lereng.stay.secondary | Choose a room close to the garden, the covered corridors, or the quieter lounge edge. |  |
| lereng.stay.caption | Suite Senja · tea-view room |  |
| lereng.stay.meta | Rooms from 36-78 m2 |  |
| lereng.dining.eyebrow | § 03 — Dining |  |
| lereng.dining.title | A breakfast room that follows the weather. |  |
| lereng.dining.body | Dining starts with the light over the tea slopes: warm bread, local fruit, highland vegetables, and tables arranged for unhurried starts. |  |
| lereng.dining.secondary | The menu stays simple because Ciwidey mornings already do most of the work. |  |
| lereng.dining.caption | Breakfast room · morning service |  |
| lereng.dining.meta | Daily breakfast and group tables |  |
| lereng.wellness.eyebrow | § 04 — Wellness |  |
| lereng.wellness.title | A long pause after the rain moves through. |  |
| lereng.wellness.body | Wellness at Lereng is practical: warm lounges, open-air corners, slow walks, and spaces that let families reset without scheduling too much. |  |
| lereng.wellness.secondary | No complicated program. Just cooler air, soft seating, and a property planned around slower movement. |  |
| lereng.wellness.caption | Lounge edge · after-rain hour |  |
| lereng.wellness.meta | Warm drinks, garden walks, family corners |  |
| lereng.journal.eyebrow | § 05 — Journal |  |
| lereng.journal.title | Notes from the slope, the corridor, and the table. |  |
| lereng.journal.body | The Lereng journal is a practical guide to the highland stay: what to pack, when to walk, where to sit, and how the weather changes the day. |  |
| lereng.journal.secondary | Use it before arrival, then ignore it once the mist starts doing the planning for you. |  |
| lereng.journal.caption | Arrival bridge · late afternoon |  |
| lereng.journal.meta | Weather notes, family tips, dining rhythm |  |

## Sriti Palu

| Field ID | Where it appears | Current copy | New copy |
|---|---|---|---|
| sriti.title | Brand/property name | Sriti Palu |  |
| sriti.shortTitle | Short property name | Sriti Palu |  |
| sriti.location | Location | Palu, Central Sulawesi |  |
| sriti.tone | Property tone | City Hospitality |  |
| sriti.heroKicker | Hero kicker | Palu, Central Sulawesi · City hospitality |  |
| sriti.heroTitle | Hero headline line 1 | A warmer city |  |
| sriti.heroEmphasis | Hero headline line 2 | with an atrium heart. |  |
| sriti.intro | Hero intro | Sriti Palu turns a city stay into a calmer ritual: arched corridors, warm rooms, generous dining, and a clear sense of arrival. |  |
| sriti.primaryAction | Hero CTA | Reserve the City Stay |  |
| sriti.philosophyLabel | Intro label | § 01 — Philosophy |  |
| sriti.philosophyTitle | Intro headline | A city hotel with a slower pulse and a clear sense of arrival. |  |
| sriti.philosophyLead | Intro lead | Sriti Palu is built around the feeling of stepping in from the city and immediately slowing down. The atrium gives the page its center; the rooms give guests their quiet. |  |
| sriti.philosophyBody | Intro body | The reference layout becomes a hospitality page here, but the palette stays HEMORA: deep forest, ivory, wood, umber, and restrained gold instead of a new cream-and-terracotta scheme. |  |
| sriti.offersTitle | Offers headline | Ways to make a Palu stay feel easier. |  |
| sriti.offersIntro | Offers intro | Direct arrival, warmer rooms, and dining that works for meetings, family visits, and late returns. |  |
| sriti.quote | Quote band | Sriti Palu feels composed. It is close to the city, but the atrium and rooms make the pace easier to hold. |  |
| sriti.quoteSource | Quote source | Guest note · Palu stay |  |
| sriti.bookingTitle | Booking headline | Your city room is waiting. |  |
| sriti.bookingLead | Booking body | Send the host team your dates, guest count, and arrival time. We will confirm the most practical room and dining plan. |  |
| sriti.address | Footer address | Palu, Central Sulawesi |  |
| sriti.email | Footer email | hello@hemora.co |  |
| sriti.phone | Footer phone | +62 812 3456 7890 |  |

### Sriti Offers

| Field ID | Current copy | New copy |
|---|---|---|
| sriti.offer.1.name | Atrium Arrival |  |
| sriti.offer.1.meta | 01 night · City |  |
| sriti.offer.1.description | A room, early coffee, and a calm arrival sequence for short city stays. |  |
| sriti.offer.1.rate | From IDR 950K |  |
| sriti.offer.2.name | Meeting Morning |  |
| sriti.offer.2.meta | 02 nights · Business |  |
| sriti.offer.2.description | Breakfast table support, direct check-out, and a quieter room after meetings. |  |
| sriti.offer.2.rate | From IDR 1.350K |  |
| sriti.offer.3.name | Family Visit |  |
| sriti.offer.3.meta | 03 nights · Family |  |
| sriti.offer.3.description | A softer suite setup for guests using Palu as a family base. |  |
| sriti.offer.3.rate | From IDR 1.650K |  |

### Sriti Menu Pages

| Field ID | Current copy | New copy |
|---|---|---|
| sriti.stay.eyebrow | § 02 — Stay |  |
| sriti.stay.title | Rooms that soften the return from the city. |  |
| sriti.stay.body | The rooms are compact, polished, and warm, with enough room to work, rest, and return without feeling rushed. |  |
| sriti.stay.secondary | Choose atrium access for convenience or corridor rooms for a quieter edge. |  |
| sriti.stay.caption | Signature room · city view |  |
| sriti.stay.meta | Rooms from 34-48 m2 |  |
| sriti.dining.eyebrow | § 03 — Dining |  |
| sriti.dining.title | A dining room for breakfast, meetings, and late returns. |  |
| sriti.dining.body | Sriti's dining spaces are bright in the morning and warmer at night, built for guests moving between work, family, and the city. |  |
| sriti.dining.secondary | The strongest table is the one that lets the day continue without friction. |  |
| sriti.dining.caption | Dining room · morning service |  |
| sriti.dining.meta | Breakfast, meeting tables, late meals |  |
| sriti.wellness.eyebrow | § 04 — Wellness |  |
| sriti.wellness.title | City reset, kept simple. |  |
| sriti.wellness.body | Wellness at Sriti is about reducing the city pace: a quieter corridor, a better room reset, and the small rituals that make a business trip easier. |  |
| sriti.wellness.secondary | No oversized spa promise. The useful thing is a stay that helps you sleep before tomorrow. |  |
| sriti.wellness.caption | Arched corridor · quiet hour |  |
| sriti.wellness.meta | Room reset, quiet floors, warm lighting |  |
| sriti.journal.eyebrow | § 05 — Journal |  |
| sriti.journal.title | Notes for a calmer Palu stay. |  |
| sriti.journal.body | The Sriti journal is built for practical movement: arrival timing, meeting mornings, quiet corridor rooms, and where to sit when the city day runs long. |  |
| sriti.journal.secondary | Read it before arrival so the hotel can do less explaining when you get here. |  |
| sriti.journal.caption | Corridor route · afternoon light |  |
| sriti.journal.meta | Arrival notes, meeting tips, quiet rooms |  |

## Developer Implementation Checklist

1. Apply edited fields to `app/property-data.ts`.
2. Apply global/home/nav edits to `app/layout.tsx` and `app/property-pages.tsx`.
3. Run `npm test`.
4. Run `npm run lint`.
5. Deploy a Vercel preview from the branch or run `vercel` from the project root.
