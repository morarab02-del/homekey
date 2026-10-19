# HomeKey — Initial Website Content and Credibility Audit

**Date:** 2026-10-18  
**Project:** HomeKey (rental property marketplace for Texas, US)  
**Tech Stack:** React 18, TypeScript, Vite, React Router v7, Tailwind CSS v4, React Leaflet, Three.js (@react-three/fiber)

---

## 1. Executive Summary

HomeKey is a **single-landlord rental property demonstration project** featuring 20 hardcoded property listings across 5 Texas cities (Dallas, Houston, Austin, San Antonio, Fort Worth). The application is fully client-side with no backend, database, or API integration. All content, listings, photos, testimonials, and legal text are **sample/demo data** explicitly acknowledged in the Terms of Use.

**Key findings:**
- **20 mock property listings** with specific addresses, prices, fees, and amenities — none are real MLS listings
- **Single fictional landlord** (George Mark) with a Kenya-based WhatsApp number (+254 714 030 732) used across all 20 listings
- **All testimonials, partner logos, and reviews are fabricated** placeholder content
- **Booking/enquiry forms are UI-only** — they compose WhatsApp/email links but have no backend submission
- **3D tour infrastructure exists** but `propertyModels` registry is empty (no actual GLB files)
- **Legal pages correctly disclose** this is a demonstration project with sample data

The site is well-architected for a demo/prototype but **contains zero verifiable real-world rental data**. Any production deployment would require replacing every listing, the landlord identity, contact details, testimonials, partner claims, and connecting forms to a real backend.

---

## 2. Project Structure and Content Sources

### 2.1 Application Architecture

| Layer | Implementation |
|-------|----------------|
| **Framework** | React 18 + TypeScript + Vite |
| **Routing** | React Router v7 (declarative routes in `App.tsx`) |
| **State** | URL-based filters (`useSearchParams`), localStorage for favorites, React Context for theme |
| **Styling** | Tailwind CSS v4 (custom design system with CSS variables) |
| **Maps** | React Leaflet (OpenStreetMap) + Google Maps embed fallback |
| **3D** | @react-three/fiber + @react-three/drei (lazy-loaded, empty model registry) |
| **Data** | Static TypeScript files in `src/data/` — no CMS, no API |

### 2.2 Content Source Inventory

| Source File | Purpose | Content Type |
|-------------|---------|--------------|
| `src/config/site.ts` | Global site configuration | Brand, tagline, **single landlord identity**, WhatsApp/email/phone, service areas, booking fee defaults, legal entity |
| `src/data/properties.ts` | **20 hardcoded property listings** | All property data: addresses, prices, fees, amenities, descriptions, ratings, coordinates, availability |
| `src/data/testimonials.ts` | **4 fabricated testimonials** + team bio | Names, roles, cities, quotes, ratings, initials |
| `src/data/faqs.ts` | 7 FAQ entries | Questions/answers about booking, fees, pets, utilities, verification |
| `src/data/photoManifest.ts` | Auto-generated photo manifest | 172 photo entries with room labels (paths only — actual files in `public/photos/`) |
| `src/lib/booking.ts` | Booking calculation & enquiry link builders | Nightly quote math, validation, WhatsApp/email link generators |
| `src/lib/filtering.ts` | Client-side search/filter/sort logic | Filter state, matching, sorting, similar properties, stats |
| `src/lib/formatting.ts` | Display formatters | Currency, addresses, contact links, property URLs |
| `src/types/property.ts` | TypeScript interfaces | Property, Landlord, Address, Fees, Features, Photo, Availability types |

### 2.3 Page Routes (from `App.tsx`)

| Route | Page Component | Purpose |
|-------|----------------|---------|
| `/` | `Home.tsx` | Landing + search results + map + trust strips + testimonials + FAQ + landlord band |
| `/homes/:id` | `PropertyDetail.tsx` | Full listing detail: gallery/3D, facts, availability/fees, amenities, booking panel, landlord card, map, similar homes |
| `/saved` | `Saved.tsx` | User's favorited properties (localStorage) |
| `/about` | `About.tsx` | Story, values, verification process, service areas, CTA |
| `/contact` | `Contact.tsx` | Contact form (demo), landlord card, office hours, FAQ |
| `/terms` | `Terms.tsx` | Terms of use (12 sections) |
| `/privacy` | `Privacy.tsx` | Privacy policy (12 sections) |
| `*` | `NotFound.tsx` | 404 with WhatsApp CTA |

---

## 3. Complete Page and Route Inventory

### 3.1 Home Page (`/`) — `src/pages/Home.tsx`

**Components used:** `Hero`, `TrustStrip`, `FilterPanel`/`MobileFilterDrawer`, `MapView`, `HowItWorks`, `Testimonials`, `PartnerLogos`, `FAQ`, `LandlordBand`, `PropertyCard`

**Major sections:**
1. **Hero** — Headline, search bar, 3 stat cards (20 verified homes, 5 cities, rent from $1,350/mo)
2. **TrustStrip** — 4 benefit cards: Verified listings, One accountable landlord, No hidden fees, Replies in ~30 min
3. **Results grid** — Filterable, sortable property cards (desktop sidebar + mobile drawer)
4. **Empty state** — "No homes match those filters" with clear-all button
5. **MapView** — Leaflet map with price-pin markers
6. **HowItWorks** — 3-step process: Search → View → Book/Chat on WhatsApp
7. **Testimonials** — 4 cards with quotes, ratings, names, cities
8. **PartnerLogos** — 5 SVG "press wall" logos (Texas Renters, Dallas Living, Relocate Texas, Houston Home Guide, Lone Star Review)
9. **FAQ** — Accordion with 7 questions from `faqs.ts`
10. **LandlordBand** — George Mark card with verified badge, license, response time, WhatsApp/phone/email CTAs

**Content source:** Dynamic (filters via URL), but all underlying data from `properties.ts` and `site.ts`

**User actions:** Search, filter, sort, save/unsave (heart), view property, open map pins, request viewing via WhatsApp/email

---

### 3.2 Property Detail (`/homes/:id`) — `src/pages/PropertyDetail.tsx`

**Components used:** `Nav`, `ModelHero` (3D or Gallery), `FactsBar`, `AvailabilityPanel`, `Amenities`, `MiniMap`, `LandlordCard`, `BookingPanel`, `SimilarHomes`

**Major sections:**
1. **Header/Nav** — Breadcrumb, availability badge, property type badge, verified badge
2. **Title block** — Title, price, beds/baths/sqft, star rating + review count, full address
3. **Nightly hint** — Minimum stay + estimated total for minimum nights (nightly only)
4. **Actions** — Save/unsave, share (native share API + clipboard fallback), back to results
5. **ModelHero** — 3D viewer if model exists, otherwise photo gallery (lazy-loaded Three.js)
6. **FactsBar** — 7-8 fact chips: bedrooms, baths, sqft, year built, type, parking, furnished, min stay (nightly)
7. **AvailabilityPanel** — Status badge, available-from date, fee rows (security deposit, application fee, pet policy)
8. **Amenities** — Icon grid from `property.amenities` + features breakdown (cooling, heating, appliances, utilities)
9. **About this home** — Description + neighbourhood info + walk/transit score rings
10. **MiniMap** — Google Maps embed (primary) with OSM fallback + "Open in Google Maps" / "Get directions"
11. **Sidebar (sticky):** `LandlordCard` + `BookingPanel`
12. **SimilarHomes** — 3 algorithmically selected similar properties

**BookingPanel** (`src/components/property/BookingPanel.tsx:50-543`):
- **Monthly:** Tour request form (name, email, phone, move-in date, message) → success screen with WhatsApp/email send buttons
- **Nightly:** Booking request form (name, email, phone, check-in/out dates, guests) → live price breakdown → success screen
- **Leased:** Form disabled, shows waitlist message with WhatsApp CTA
- **Validation:** Client-side only; submits by opening WhatsApp/mailto links with composed message
- **No backend submission** — explicitly noted in success screen: "This is a request preview — no booking or inquiry has been transmitted until you send it on WhatsApp or by email."

---

### 3.3 Saved Page (`/saved`) — `src/pages/Saved.tsx`

**Content:** Grid of favorited properties (from localStorage `homekey:favorites`), "Clear all" button, empty state with illustration and "Browse homes" link.

---

### 3.4 About Page (`/about`) — `src/pages/About.tsx`

**Major sections:**
1. **Hero** — "Renting a Texas home, without the guesswork" + 3 stats (20 listings, 5 cities, 1 accountable landlord)
2. **Our story** — Explicitly states: *"The listings here are sample data, not affiliated with any MLS. The platform shows what a transparent, single-landlord rental marketplace can look like."* (lines 130-133)
3. **Values** — 4 cards: Verified listings, Real photos, No hidden fees, Fast replies
4. **Service areas** — 5 city cards with listing counts, links to filtered results
5. **Verification process** — 4-step numbered list: In-person inspection, Real photography, Pricing & fee check, Licensed & verified
6. **CTA band** — WhatsApp, phone, email buttons

---

### 3.5 Contact Page (`/contact`) — `src/pages/Contact.tsx`

**Major sections:**
1. **Header** — 3 contact cards: WhatsApp (fastest), Phone (office hours), Email (documents)
2. **Contact form** — Name, email, phone (optional), subject dropdown, message → validation → success screen with WhatsApp/email send buttons + "Write another"
3. **Sidebar:** Landlord card (George Mark, verified, license, response time) + Office hours table
4. **FAQ** — Same 7 accordion items from `faqs.ts`

**Form behavior:** Demo only — "Demo form — messages are kept on your device only" (line 316). Success screen composes WhatsApp/mailto links.

---

### 3.6 Terms Page (`/terms`) — `src/pages/Terms.tsx`

**12 sections:** Acceptance, Our role, Listing accuracy & demo data, Applications and tenancy, Deposits and fees, Nightly bookings and cancellation, Pets, Prohibited conduct, Limitation of liability, Fair housing, Changes, Contact.

**Critical disclosure (Section 3, lines 105-109):**
> "This is a demonstration project. The properties, photos, prices and reviews shown are **sample data** provided to illustrate the platform and are not affiliated with any MLS, brokerage or real owner. Nothing here is an offer, and no listing should be relied upon for a real transaction."

**Landlord identity:** George Mark, TX Real Estate License #701234, HomeKey Properties, Dallas, Texas

---

### 3.7 Privacy Page (`/privacy`) — `src/pages/Privacy.tsx`

**12 sections:** What we collect, How we use it, Legal basis, Sharing, Retention, Cookies and local storage, Your rights, Data security, Children's privacy, International transfers, Changes, Contact.

**Key points:**
- Collects only form submissions (name, email, phone, dates, message)
- No tracking cookies, no third-party analytics
- Local storage keys: `homekey:favorites`, `homekey:theme`
- Filter state in URL (shareable)
- "We never sell your personal information" — shared only with landlord and delivery tools (email/WhatsApp)
- Operations based in US; WhatsApp/email may transfer data internationally

---

### 3.8 404 Page (`*`) — `src/pages/NotFound.tsx`

404 illustration, "Back to home" link, "Chat on WhatsApp" button.

---

### 3.9 Shared Layout Components

| Component | File | Key Content |
|-----------|------|-------------|
| **Header** | `src/components/layout/Header.tsx` | Logo, nav (Home, Rentals, Saved, About, Contact), theme toggle, WhatsApp link, mobile drawer with "List Your Property (demo)" button |
| **Footer** | `src/components/layout/Footer.tsx` | Logo + tagline, 3 link groups (Explore, Company, Legal), Service areas (5 cities), Equal Housing Opportunity notice, copyright + "Demonstration listing data · Not affiliated with any MLS" |
| **Layout** | `src/components/layout/Layout.tsx` | Wraps pages with Header/Footer, scroll restoration |

---

## 4. Page-by-Page Content Findings

### 4.1 Home Page (`/`)

| Section | Finding | Evidence |
|---------|---------|----------|
| Hero stats | "20 verified listings", "5 Texas cities", "Rent from $1,350/mo" | Computed from `marketStats(properties)` in `Hero.tsx:19-24` — counts the 20 hardcoded entries |
| Search bar | Placeholder: "Search location or property term" | `SearchBar.tsx:72` |
| TrustStrip claims | "Every home is inspected and photographed in person", "George Mark owns every listing directly", "Replies in ~30 minutes" | `TrustStrip.tsx:6-25` — all derived from `site.ts` landlord config |
| Testimonials | 4 named people with specific quotes, roles, cities, 4-5 star ratings | `testimonials.ts:11-47` — **entirely fabricated** |
| PartnerLogos | 5 "recognized by" brands with SVG emblems | `PartnerLogos.tsx:5-60` — **fictional publications** (Texas Renters, Dallas Living, etc.) |
| FAQ answers | Reference George Mark by name, specific fee ranges, verification claims | `faqs.ts:6-46` — aligned with demo data |
| LandlordBand | George Mark, "Owner & licensed agent", license #701234, WhatsApp +254 714 030 732 | `site.ts:18-25`, `LandlordBand.tsx:22-96` |

---

### 4.2 Property Detail (`/homes/:id`)

| Section | Finding | Evidence |
|---------|---------|----------|
| All 20 listings | Specific addresses, prices, fees, amenities, descriptions, ratings, review counts | `properties.ts:49-1153` — **every field is hardcoded sample data** |
| Landlord | Identical across all 20: George Mark, +254 714 030 732, verified=true, license #701234 | `properties.ts:21-30` (landlord builder), `site.ts:18-25` |
| Ratings & reviews | 4.3–5.0 ratings, 9–46 review counts per property | `properties.ts` — e.g., hk-001: 4.9★, 34 reviews; hk-012: 4.3★, 9 reviews (leased) |
| Availability | 18 "available-now", 2 "available-later" (Feb/Mar 2026), 1 "leased" | `properties.ts` — `availability.status` field |
| Fees | Security deposit = 1× monthly rent (monthly) or $200–$500 (nightly); application fee $0–$60; pet fees $250–$500 | `properties.ts` per-listing `fees` objects |
| Walk/Transit scores | 38–97 walk, 35–82 transit | `properties.ts` — `walkScore`, `transitScore` fields |
| 3D tours | Infrastructure ready (`ModelViewer`, `DollhouseThumb`) but `propertyModels = {}` | `modelData.ts:17` — **no actual 3D models exist** |
| Photos | 172 manifest entries across 20 properties (8–10 photos each) | `photoManifest.ts` — paths reference `public/photos/` |
| Booking panel | Forms compose WhatsApp/email links; no API calls | `BookingPanel.tsx:96-133`, `booking.ts:114-141` |

---

### 4.3 About Page (`/about`)

| Section | Finding | Evidence |
|---------|---------|----------|
| Story | Explicitly admits "sample data, not affiliated with any MLS" | `About.tsx:130-133` |
| Stats | "20 Verified listings", "5 Texas cities", "1 Accountable landlord" | `About.tsx:74-78` — from `marketStats(properties)` |
| Verification process | 4 steps claiming in-person inspection, real photography, pricing check, licensed verification | `About.tsx:186-209` — **not backed by any actual process** |

---

### 4.4 Contact Page (`/contact`)

| Section | Finding | Evidence |
|---------|---------|----------|
| Form | Demo only — "Demo form — messages are kept on your device only" | `Contact.tsx:316` |
| Office hours | Mon-Fri 8am-7pm CT, Sat 9am-5pm CT, Sun by appointment | `Contact.tsx:20-24` — hardcoded constants |
| Landlord card | Same George Mark details as everywhere | `Contact.tsx:324-357` |

---

### 4.5 Terms Page (`/terms`)

| Section | Finding | Evidence |
|---------|---------|----------|
| Demo disclosure | Section 3: "This is a demonstration project... sample data... not affiliated with any MLS" | `Terms.tsx:105-109` |
| Landlord identity | George Mark, TX Real Estate License #701234, HomeKey Properties, Dallas, Texas | `Terms.tsx:88-92` |
| Fair housing | Standard equal opportunity language | `Terms.tsx:210-219` |
| Liability | "As a demonstration project, the content is illustrative and may contain inaccuracies" | `Terms.tsx:200-205` |

---

### 4.6 Privacy Page (`/privacy`)

| Section | Finding | Evidence |
|---------|---------|----------|
| Data collection | Only form inputs; no tracking cookies | `Privacy.tsx:75-84` |
| Local storage | `homekey:favorites`, `homekey:theme` | `Privacy.tsx:145-160` |
| Sharing | "We never sell your personal information" — only with landlord + delivery tools | `Privacy.tsx:116-121` |
| Security | "No method of transmission or storage is completely secure" | `Privacy.tsx:181-184` |

---

## 5. Mock Data and Unsupported Claims Register

### 5.1 Property Listings (20 entries) — **CLASSIFICATION: Rewrite / Verify**

| # | Property ID | Issue | File:Lines | Classification |
|---|-------------|-------|------------|----------------|
| 1–20 | All listings | **Entirely fabricated** — addresses, prices, fees, amenities, descriptions, ratings, review counts, coordinates, availability dates | `properties.ts:49-1153` | **Rewrite** (replace with real MLS/owner data) |
| 1–20 | Ratings & reviews | 4.3–5.0★ with 9–46 reviews each — no source, no dates, no verification | `properties.ts` (e.g., `rating: 4.9, reviewsCount: 34`) | **Remove** or **Verify** with real review system |
| 1–20 | Walk/Transit scores | Specific integers (38–97) with no attribution to Walk Score® API | `properties.ts` (`walkScore`, `transitScore`) | **Verify** (license Walk Score API) or **Remove** |
| hk-003, hk-019 | Future availability dates | "Available from Mar 1, 2026" / "Feb 1, 2026" — dates in the past relative to 2026-10-18 | `properties.ts:185`, `1065` | **Rewrite** (update or remove stale dates) |
| hk-012 | Status "leased" but still shows full detail | `availability: { status: "leased" }` with full pricing/amenities | `properties.ts:679` | **Keep** (waitlist pattern is valid UX) but **Verify** dates |

### 5.2 Landlord Identity — **CLASSIFICATION: Rewrite**

| Issue | File:Lines | Classification |
|-------|------------|----------------|
| Single fictional landlord "George Mark" used for all 20 properties | `site.ts:18-25`, `properties.ts:21-30` | **Rewrite** (real owner/agent per property or company) |
| Kenya phone number (+254) used for Texas rentals | `site.ts:11-13, 16` | **Rewrite** (must be US +1 number) |
| Email `homekey@gmail.com` — generic Gmail, not business domain | `site.ts:15` | **Rewrite** (professional domain email) |
| License #701234 — format plausible but unverified | `site.ts:24` | **Verify** (check TREC database) |
| "Usually replies within 30 minutes" — unverifiable claim | `site.ts:23` | **Verify** or **Rewrite** with measurable SLA |

### 5.3 Testimonials — **CLASSIFICATION: Remove**

| Testimonial | Issue | File:Lines | Classification |
|-------------|-------|------------|----------------|
| Alicia Romero | "Relocated from Chicago", specific quote about George on WhatsApp | `testimonials.ts:11-19` | **Remove** (fabricated) |
| Daniel Okafor | "Software engineer", quote about listing accuracy | `testimonials.ts:20-28` | **Remove** |
| Mei-Ling Chen | "Six-month contract", quote about furnished stay near Medical Center | `testimonials.ts:29-37` | **Remove** |
| Marcus Bell | "Family of four", quote about "verified listings, one landlord, no hidden fees" | `testimonials.ts:38-46` | **Remove** |

### 5.4 Partner Logos / "As featured in" — **CLASSIFICATION: Remove**

| Partner | Issue | File:Lines | Classification |
|---------|-------|------------|----------------|
| Texas Renters, Dallas Living, Relocate Texas, Houston Home Guide, Lone Star Review | Fictional publication names with custom SVG emblems; no real media relationships | `PartnerLogos.tsx:5-60` | **Remove** (misleading "press wall") |

### 5.5 Trust Strip Claims — **CLASSIFICATION: Verify / Rewrite**

| Claim | File:Lines | Classification |
|-------|------------|----------------|
| "Every home is inspected and photographed in person before it goes live" | `TrustStrip.tsx:7-9` | **Verify** (requires actual inspection process) |
| "George Mark owns every listing directly. No agents, no hand-offs" | `TrustStrip.tsx:11-14` | **Verify** (title/deed verification needed) |
| "Deposits, application fees and cleaning charges are shown up front on every single page" | `TrustStrip.tsx:16-18` | **Keep** (currently true in UI) |
| "Message on WhatsApp during business hours and typically get an answer within half an hour" | `TrustStrip.tsx:21-24` | **Verify** (requires SLA measurement) |

### 5.6 FAQ Claims — **CLASSIFICATION: Verify / Rewrite**

| FAQ | Claim | File:Lines | Classification |
|-----|-------|------------|----------------|
| "How are listings verified?" | "Every property is inspected and photographed before it goes live... verified badge with George Mark's Texas real estate licence number. Owners are single and accountable" | `faqs.ts:38-41` | **Verify** (no actual inspection process exists) |
| "What happens if a home is already leased?" | "Leased listings stay visible with a waitlist option... Filters let you hide leased homes" | `faqs.ts:43-46` | **Keep** (UI implements this correctly) |
| "What deposits and fees should I expect?" | Specific ranges: "$40–$60 per adult", "$200–$500 damage deposit" | `faqs.ts:13-16` | **Verify** against actual fee schedule |

### 5.7 Statistics & Counts — **CLASSIFICATION: Verify**

| Stat | Current Value | Source | Classification |
|------|---------------|--------|----------------|
| "20 verified listings" | 20 | `marketStats(properties)` | **Verify** (replace with real count) |
| "5 Texas cities" | 5 | `citiesIn(properties)` | **Verify** |
| "Rent from $1,350/mo" | $1,350 | `priceBounds(monthly)` min | **Verify** (lowest monthly is hk-011 at $1,495 — **discrepancy**) |
| Review counts per property | 9–46 | `properties.ts` | **Remove** (fabricated) |

> **Note:** Hero claims "Rent from $1,350/mo" but the cheapest monthly listing is hk-011 at $1,495/mo. The $1,350 figure appears to come from a nightly listing (hk-020 at $135/night ≈ $4,050/mo) or is simply incorrect.

### 5.8 Verification Badges — **CLASSIFICATION: Verify**

| Element | Issue | File:Lines | Classification |
|---------|-------|------------|----------------|
| `VerifiedBadge` component | Shows "Verified" with checkmark on every card and detail page | `Badge.tsx:26-38`, `PropertyCard.tsx:139-141` | **Verify** (what does "verified" mean? No third-party verification) |
| Landlord `verified: true` | Hardcoded true for all listings | `site.ts:22`, `properties.ts:26` | **Verify** (define verification criteria) |

### 5.9 3D Tour Claims — **CLASSIFICATION: Remove / Add**

| Element | Issue | File:Lines | Classification |
|---------|-------|------------|----------------|
| `ModelHero` component | Renders `ModelViewer` if `modelFor(property.id)` returns data | `PropertyDetail.tsx:312-328` | **Keep infrastructure** |
| `propertyModels` registry | **Empty object** — no GLB files exist for any property | `modelData.ts:17` | **Add** (needs photogrammetry) or **Remove** 3D UI until ready |
| PropertyCard "3D Tour" badge | Shows on cards where `modelFor(id)` exists (currently none) | `PropertyCard.tsx:104-115` | **Remove** badge until models exist |

### 5.10 Contact Details — **CLASSIFICATION: Rewrite**

| Detail | Current | File:Lines | Classification |
|--------|---------|------------|----------------|
| WhatsApp | +254 714 030 732 (Kenya) | `site.ts:11-13` | **Rewrite** (US number required) |
| Phone | +254 714 030 732 (same) | `site.ts:16` | **Rewrite** |
| Email | homekey@gmail.com | `site.ts:15` | **Rewrite** (professional domain) |
| Address | "Dallas, Texas, United States" | `site.ts:38` | **Verify** (specific address needed) |

### 5.11 Legal Entity — **CLASSIFICATION: Verify**

| Detail | Current | File:Lines | Classification |
|--------|---------|------------|----------------|
| Company | "HomeKey Properties" | `site.ts:37` | **Verify** (registered business?) |
| Address | "Dallas, Texas, United States" | `site.ts:38` | **Verify** (specific address) |

---

## 6. Implemented, Partial, Demo, and Planned Capabilities

| Capability | Status | Evidence | Notes |
|------------|--------|----------|-------|
| **Property search & filters** | **Implemented** | `useFilters.ts`, `filtering.ts`, `FilterPanel.tsx`, `SearchBar.tsx` | Full client-side filtering by city, rent type, price, beds, baths, type, availability, text query; URL-synced |
| **Property listing details** | **Implemented** | `PropertyDetail.tsx`, `Gallery.tsx`, `FactsBar.tsx`, `Amenities.tsx`, `AvailabilityPanel.tsx` | Complete detail view with all data fields |
| **Saved properties (favorites)** | **Implemented** | `FavoritesContext.tsx`, `Saved.tsx`, `PropertyCard.tsx` (heart button) | localStorage persistence (`homekey:favorites`) |
| **Enquiry/contact forms** | **UI-only / Demo** | `BookingPanel.tsx`, `Contact.tsx` | Forms validate client-side, compose WhatsApp/mailto links, **no backend submission** |
| **Booking/viewing requests** | **UI-only / Demo** | `BookingPanel.tsx:96-133`, `booking.ts:114-141` | Success screen explicitly states "no booking or inquiry has been transmitted until you send it on WhatsApp or by email" |
| **Property owner profiles** | **Demo** | `LandlordCard.tsx`, `site.ts` landlord config | Single fictional landlord for all properties |
| **360° tours / 3D environments** | **Infrastructure only** | `ModelViewer.tsx`, `DollhouseThumb.tsx`, `modelData.ts` | `propertyModels = {}` — **no actual models**; UI shows "3D Tour" badge only when model exists |
| **Room navigation / floor plans** | **Planned (types only)** | `ModelViewer.tsx:10-15` (`ModelRoom` interface with `hotspot`, `objectNames`) | Type definitions exist but no data |
| **Availability indicators** | **Implemented** | `AvailabilityPanel.tsx`, `PropertyCard.tsx` badges | Three states: available-now, available-later (with date), leased |
| **Authentication / user accounts** | **Not found** | — | No auth, no user accounts, no login |
| **Email notifications** | **Not found** | — | Only `mailto:` links |
| **Enquiry handling backend** | **Not found** | — | WhatsApp/mailto only |
| **Support services** | **Not found** | — | Only FAQ and contact form |
| **Payment flows** | **Not found** | — | Nightly quote calculator exists (`booking.ts`) but no payment integration |
| **Listing verification / owner screening** | **Not found** | — | Only UI badges ("Verified") with no process |
| **Map integration** | **Implemented** | `MapView.tsx` (Leaflet), `MiniMap.tsx` (Google embed + OSM fallback) | Working maps with price pins |
| **Photo galleries** | **Implemented** | `Gallery.tsx`, `photoManifest.ts`, `PropertyCard.tsx` carousel | 172 photos in manifest; lightbox with keyboard nav |
| **Responsive design** | **Implemented** | Mobile drawers for filters, navigation, mobile-first CSS | Tailwind breakpoints throughout |
| **Dark mode** | **Implemented** | `ThemeContext.tsx`, `Header.tsx` toggle | localStorage persistence (`homekey:theme`) |
| **Share functionality** | **Implemented** | `PropertyDetail.tsx:149-166` | Native Web Share API + clipboard fallback |

---

## 7. Renter Information Gaps

Based on inspecting the actual Property Detail page and Booking Panel, the following information a renter would need is **missing or unclear**:

| Information Need | Current State | Gap |
|------------------|---------------|-----|
| **Total move-in cost breakdown** | Monthly: security deposit + application fee shown; Nightly: cleaning + service fee shown | No **total move-in estimate** (deposit + first month + fees) for monthly rentals |
| **Lease term options** | Not specified anywhere | No mention of 6-month, 12-month, month-to-month options |
| **Pet policy details** | Boolean + fee amount only | No weight/breed restrictions, number of pets, pet deposit vs fee distinction |
| **Utility responsibility** | `utilitiesIncluded` array shown | No estimated monthly utility costs for tenant-paid utilities |
| **Parking details** | Count only (e.g., "2 spaces") | No info on garage vs driveway vs street, EV charging availability (only in amenities text) |
| **Application process steps** | FAQ mentions "application and screening review" | No details on required documents, income requirements, credit score threshold, timeline |
| **Who manages maintenance/repairs** | Not stated | Landlord is owner but no property management info |
| **Renter's insurance requirement** | Not mentioned | Standard lease requirement absent |
| **Move-in/move-out procedures** | Not described | No walkthrough, key handoff, condition report process |
| **Subletting / guest policy** | Not in Terms or listing | Terms §6 mentions "house rules on guests" for nightly only |
| **How to report inaccurate/suspicious listings** | Not provided | No "Report listing" button or process |
| **Verification evidence** | "Verified" badge only | No inspection report, photos of verification, third-party audit |
| **What happens after enquiry** | Success screen says "landlord confirms on WhatsApp" | No SLA, no confirmation flow, no tracking |
| **Viewing scheduling** | Form has date picker but no calendar integration | No available time slots, no confirmation |
| **Neighborhood safety/school data** | Walk/Transit scores only | No crime stats, school ratings, commute times |
| **Property condition disclosures** | Description text only | No standardized condition report, age of systems (HVAC, roof, water heater) |

---

## 8. Shared Components and Interface Copy

### 8.1 Navigation (Header.tsx)

| Element | Current Copy | Issue |
|---------|--------------|-------|
| Nav links | "Home", "Rentals", "Saved", "About", "Contact" | "Rentals" filters to `/?rentType=monthly` — unclear label |
| Theme toggle | "Light" / "Dark" with icons | Clear |
| WhatsApp link | "WhatsApp" with MessageCircle icon | Opens demo message |
| Mobile drawer button | "List Your Property (demo)" | **Explicitly labeled demo** — good |

### 8.2 Footer (Footer.tsx)

| Element | Current Copy | Issue |
|---------|--------------|-------|
| Tagline | "Homes for rent across Texas. Every listing is verified, photographed and managed by a single accountable landlord — George Mark." | Presents demo claims as fact |
| Explore links | "All rentals", "Homes for rent", "Nightly stays", "Saved homes", "How it works" | "How it works" links to `/about` |
| Company links | "About HomeKey", "Meet George Mark", "Contact us", "Reviews" | "Reviews" links to `/` (no reviews page) |
| Legal links | "Terms of use", "Privacy policy", "Fair housing" | "Fair housing" links to `/terms` anchor |
| Service areas | "Rentals in Dallas/Houston/Austin/San Antonio/Fort Worth" | Dynamic from data |
| Copyright | "© 2026 HomeKey Properties. Dallas, Texas, United States. TX Real Estate License #701234. Demonstration listing data · Not affiliated with any MLS" | **Good disclosure** |

### 8.3 PropertyCard (PropertyCard.tsx)

| Element | Copy | Notes |
|---------|------|-------|
| Location line | "Neighborhood, City" | e.g., "Highland Park, Dallas" |
| Title | Property title | e.g., "Modern 4BR Home in Highland Park" |
| Specs | "4 bd · 3.5 ba · 3,180 sqft" | Icons implicit |
| Price | "$4,250/mo" or "$189/night" | With rent type tag ("Long-term rental" / "Short stay") |
| Rating | ★ 4.9 (34) | **Fabricated review count** |
| CTA | "View property →" | Link to detail page |

### 8.4 BookingPanel (BookingPanel.tsx)

| State | Copy | Notes |
|-------|------|-------|
| Monthly submit | "Request a viewing" | Button text |
| Nightly submit | "Request to book" | Button text |
| Leased | "This home is currently leased... Join the waitlist — message George Mark on WhatsApp" | Clear |
| Success screen | "Your viewing request is ready / Your stay request is ready... Nothing has been sent yet. Pick a channel below and your request goes straight to George Mark." | **Honest about demo nature** |
| WhatsApp button | "Send on WhatsApp" | Opens composed message |
| Email button | "Email this request" | Opens mailto |
| Edit button | "Edit details" | Returns to form |
| Helper text (monthly) | "Viewings are free and usually confirmed within 30 minutes during business hours." | **Unverifiable claim** |
| Helper text (nightly) | "You won't be charged yet — this request reserves the dates and the landlord confirms on WhatsApp." | **Unverifiable claim** |

### 8.5 Forms — Validation Messages

| Field | Error Message | File |
|-------|---------------|------|
| Name | "Please enter your name." / "Please tell us your name." | `Contact.tsx:46`, `booking.ts:75` |
| Email | "Please enter your email address." / "Please enter a valid email address." | `Contact.tsx:48-49`, `booking.ts:76` |
| Phone | "Please enter a contact number." (min 7 digits) | `booking.ts:77-78` |
| Move-in date | "Choose a move-in date." | `booking.ts:79` |
| Check-in/out | "Select a check-in and check-out date." | `booking.ts:87` |
| Message | "Please enter a message." | `Contact.tsx:50` |
| Stay validation | "Minimum stay is X nights — add Y more night(s)." / "Check-out must be at least one night after check-in." | `BookingPanel.tsx:75-84` |

### 8.6 Empty States

| Page | Copy | File |
|------|------|------|
| Home (no filter results) | "No homes match those filters. Try widening the price range or clearing a chip — new listings land weekly." | `Home.tsx:92-96` |
| Saved (empty) | "No saved homes yet. Tap the heart on any listing to save it here. Your shortlist stays on this device so you can compare homes, prices and neighbourhoods side by side before you reach out." | `Saved.tsx:40-44` |
| Property not found | "Listing not found. This home may have been leased, the link may be mistyped, or the listing was removed. All 20 verified Texas homes are one click away." | `PropertyDetail.tsx:121-126` |
| 404 | "We couldn't find that page. The page you were looking for may have moved, been removed, or never existed." | `NotFound.tsx:47-52` |

### 8.7 Loading States

| Component | Loading Indicator |
|-----------|-------------------|
| ModelViewer | Skeleton bar: "h-1.5 w-32 overflow-hidden rounded-full bg-brass-100" with pulse animation | `ModelViewer.tsx:68-72` |
| DollhouseThumb | Shimmer: "animate-shimmer bg-brass-100" | `DollhouseThumb.tsx:32` |
| Gallery lightbox | No explicit loader (relies on SmartImage) | — |
| Page transitions | None (client-side routing instant) | — |

---

## 9. Legal, Privacy, Contact, and Support Content

### 9.1 Terms of Use (`/terms`) — Key Provisions

| Section | Summary | Demo-Specific Language |
|---------|---------|------------------------|
| 1. Acceptance | Standard browsewrap | — |
| 2. Our role | Single-landlord platform, not MLS | "We are **not** a multiple listing service (MLS) or a general marketplace where third-party owners list" |
| 3. Listing accuracy & demo data | **Explicit demo disclosure** | "This is a demonstration project. The properties, photos, prices and reviews shown are **sample data**... not affiliated with any MLS... Nothing here is an offer" |
| 4. Applications & tenancy | Lease required, screening criteria, tour requests | — |
| 5. Deposits & fees | Transparent, no admin/auction/listing fees | Monthly: 1 month rent + app fee; Nightly: damage deposit + cleaning + service fee |
| 6. Nightly bookings | Min stay, house rules, 48hr cancellation, damage deposit return | — |
| 7. Pets | Pet fee + profile; assistance animals accommodated per law | — |
| 8. Prohibited conduct | No false info, spam, scraping, unauthorized access, harassment | — |
| 9. Limitation of liability | "As is", demo project disclaimer | "As a demonstration project, the content is illustrative and may contain inaccuracies" |
| 10. Fair housing | Federal + Texas law compliance statement | — |
| 11. Changes | "Last updated" date governs | — |
| 12. Contact | Company, landlord, license, email/phone/WhatsApp, privacy policy link | — |

### 9.2 Privacy Policy (`/privacy`) — Key Provisions

| Section | Summary |
|---------|---------|
| 1. What we collect | Only form submissions (name, email, phone, dates, message); localStorage for preferences |
| 2. How we use it | Answer enquiries, arrange viewings/bookings, remember preferences |
| 3. Legal basis | Consent, contract performance, legitimate interests |
| 4. Sharing | **Never sell**; only with landlord + delivery tools (email/WhatsApp) |
| 5. Retention | Only as needed for response + follow-up; localStorage until cleared |
| 6. Cookies/local storage | No tracking cookies; `homekey:favorites`, `homekey:theme`; filters in URL |
| 7. Your rights | Access, correct, delete via email; clear localStorage anytime |
| 8. Security | "Reasonable measures... no method... completely secure... cannot guarantee absolute security" |
| 9. Children's privacy | Not directed to children; no knowing collection |
| 10. International transfers | US-based; WhatsApp/email may process internationally |
| 11. Changes | "Last updated" date |
| 12. Contact | Email, contact page, company address, terms link |

### 9.3 Contact & Support

- **No ticketing system, no help desk, no live chat** — only WhatsApp, phone, email, contact form
- **Office hours** defined in `Contact.tsx:20-24` (Mon-Fri 8-7 CT, Sat 9-5, Sun by appointment)
- **WhatsApp** is primary channel ("Fastest reply — message us any time")
- **Demo forms** explicitly state messages stay on device

---

## 10. Confirmed Findings, Needs Verification, and Unknowns

### 10.1 Confirmed Findings (Code Evidence)

| Finding | Evidence |
|---------|----------|
| All 20 properties are hardcoded sample data | `properties.ts:49-1153` |
| Single landlord (George Mark) for all listings | `site.ts:18-25`, `properties.ts:21-30` |
| Kenya WhatsApp number (+254) used for Texas rentals | `site.ts:11-13` |
| 4 testimonials are fabricated | `testimonials.ts:11-47` |
| 5 partner logos are fictional | `PartnerLogos.tsx:5-60` |
| No backend / API / database exists | Entire codebase is client-only; no server routes |
| Forms only compose WhatsApp/mailto links | `BookingPanel.tsx`, `Contact.tsx`, `booking.ts` |
| 3D model registry is empty | `modelData.ts:17` |
| Terms explicitly disclose demo nature | `Terms.tsx:105-109` |
| Footer includes "Demonstration listing data · Not affiliated with any MLS" | `Footer.tsx:147-148` |
| Review counts (9–46) and ratings (4.3–5.0) are hardcoded per property | `properties.ts` |
| Walk/Transit scores are hardcoded integers with no API attribution | `properties.ts` |
| Hero "Rent from $1,350/mo" contradicts actual minimum monthly rent ($1,495) | `Hero.tsx:23` vs `properties.ts:607` (hk-011) |

### 10.2 Needs Verification (Business Decision Required)

| Item | Question for Owner |
|------|-------------------|
| Landlord identity | Is "George Mark" a real person? Should each property have its own owner/agent? |
| Texas real estate license #701234 | Is this a valid, current TREC license? Whose name is it under? |
| Contact details | What are the real US phone number, business email, and physical address? |
| Company registration | Is "HomeKey Properties" a registered Texas LLC/corp? |
| Verification process | What actual inspection/verification steps will be used? |
| Fee schedule | Are the fee ranges in FAQs ($40–$60 app fee, $200–$500 damage deposit) accurate? |
| Response time SLA | Can "replies within 30 minutes" be guaranteed/measured? |
| Walk Score / Transit Score | Will you license Walk Score API or remove scores? |
| Review system | Will you implement real reviews? If so, from whom (tenants, applicants)? |
| Partner relationships | Are any of the 5 "featured in" brands real partners? |
| Photo sourcing | Are the 172 photos in `public/photos/` real property photos or stock/generated? |
| 3D tours | Is photogrammetry/3D capture planned? Budget/timeline? |
| Payment processing | Will nightly bookings use Stripe/other? Monthly lease payments? |
| Background screening | What screening criteria for applicants? |
| Fair housing compliance | Has legal counsel reviewed the Terms/Privacy for TX compliance? |

### 10.3 Unknowns (Cannot Determine from Code)

| Unknown | Why |
|---------|-----|
| Whether `public/photos/` contains real images | Only manifest paths visible; actual files not inspected |
| Whether any external services are configured (env vars) | `.env` files not in repo; no API keys in code |
| Deployment target / hosting | Not in codebase |
| Analytics / tracking | None in code (privacy policy confirms) |
| Error monitoring (Sentry, etc.) | Not present |
| CI/CD pipeline | Not visible |
| Accessibility audit status | ARIA labels present but no audit evidence |

---

## 11. Recommended Page-by-Page Audit Order

Based on the actual application structure and content density, the most logical audit sequence is:

| Priority | Page | Reason |
|----------|------|--------|
| **1** | **Property Detail (`/homes/:id`)** | **Highest content density** — every mock data field appears here: prices, fees, landlord, ratings, amenities, descriptions, booking flow. Fixing this page replaces the core product interface. |
| **2** | **Home (`/`)** | **Highest traffic page** — Hero stats, TrustStrip claims, Testimonials, PartnerLogos, FAQ, LandlordBand all pull from same mock sources. |
| **3** | **About (`/about`)** | **Credibility center** — Contains explicit demo disclosure but also makes verification claims that need real evidence. |
| **4** | **Contact (`/contact`)** | **Conversion point** — Form, office hours, landlord card all need real contact info and backend integration. |
| **5** | **Terms (`/terms`) & Privacy (`/privacy`)** | **Legal foundation** — Already have good demo disclosures; need real business details, license verification, compliance review. |
| **6** | **Saved (`/saved`)** | Low priority — mostly UI, minimal copy. |
| **7** | **404 / NotFound** | Low priority — minimal copy. |

**Why Property Detail first:** It is the **only page where a renter makes a decision**. Every mock field (price, deposit, pet fee, rating, review count, landlord contact, availability date, walk score, 3D tour badge) appears here. Replacing the data source for this page cascades to Home page cards, MapView pins, SimilarHomes, and filtering.

---

## 12. Files and Areas Not Fully Inspected

| Area | Reason |
|------|--------|
| `public/photos/` directory | Only manifest paths read; actual image files not verified for existence, quality, or authenticity |
| `public/3d/` directory | Referenced by `modelData.ts` but not inspected; likely empty |
| `scripts/fetch-photos.mjs` | Photo manifest generator — not read; may reveal photo sourcing method |
| Environment variables (`.env*`) | Not in repository; unknown if any API keys (Mapbox, Walk Score, email service) are configured |
| `vite.config.ts` | Only glanced; build config not fully analyzed |
| `tailwind.config.js` | Only glanced; design tokens not fully audited |
| `index.css` | Custom CSS variables / design system not fully reviewed for content-bearing values |
| `AGENTS.md`, `.kilo/` config | Not present in provided file tree |
| Accessibility (a11y) | ARIA labels present throughout but no formal audit performed |
| Performance / bundle size | Not measured |
| Cross-browser testing | Not evidenced |
| SEO metadata beyond title/description | Only basic meta description in `PropertyDetail.tsx:101-102`; no Open Graph, Twitter Cards, JSON-LD schema |

---

## Appendix: Key File Reference Map

```
src/
├── App.tsx                    → Routes definition
├── config/site.ts             → GLOBAL CONFIG (landlord, contact, fees, legal)
├── data/
│   ├── properties.ts          → 20 MOCK LISTINGS (primary audit target)
│   ├── testimonials.ts        → 4 FABRICATED TESTIMONIALS
│   ├── faqs.ts               → 7 FAQ entries
│   └── photoManifest.ts      → 172 photo entries (auto-generated)
├── pages/
│   ├── Home.tsx              → Landing + results + sections
│   ├── PropertyDetail.tsx    → Full listing (primary audit target)
│   ├── Saved.tsx             → Favorites
│   ├── About.tsx             → Story, values, verification, areas
│   ├── Contact.tsx           → Form + landlord + hours + FAQ
│   ├── Terms.tsx             → 12-section terms (with demo disclosure)
│   ├── Privacy.tsx           → 12-section privacy
│   └── NotFound.tsx          → 404
├── components/
│   ├── home/                 → Hero, TrustStrip, FilterPanel, MapView, HowItWorks, Testimonials, PartnerLogos, FAQ, LandlordBand, SearchBar
│   ├── property/             → BookingPanel, LandlordCard, Gallery, FactsBar, AvailabilityPanel, Amenities, MiniMap, SimilarHomes, Nav
│   ├── layout/               → Header, Footer, Layout, Logo
│   ├── ui/                   → Button, Badge, Input, Select, Slider, Section, SmartImage, StarRating
│   └── 3d/                   → ModelViewer, DollhouseThumb, modelData (EMPTY), ThreeScene, ThumbScene
├── lib/
│   ├── booking.ts            → Quote math, validation, WhatsApp/mailto composers
│   ├── filtering.ts          → Search/filter/sort/similar/stats
│   └── formatting.ts         → Currency, addresses, links, messages
├── context/
│   ├── FavoritesContext.tsx  → localStorage favorites
│   └── ThemeContext.tsx      → Dark mode
├── hooks/
│   ├── useFilters.ts         → URL-synced filter state
│   ├── useMediaQuery.ts      → Responsive breakpoints
│   └── useScrollReveal.ts    → IntersectionObserver animations
└── types/property.ts         → TypeScript interfaces
```

---

**End of Audit Report**

*This audit inspected only the provided codebase. No external verification of licenses, business registration, or data accuracy was performed. All classifications are based on code evidence alone.*