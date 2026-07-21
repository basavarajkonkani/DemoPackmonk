# PacMonk Full Audit + Refactor — Progress Tracker

## Architecture decision
Repository pattern: `src/services/repositories/*.ts` (mobile) hold seed data + async
CRUD functions persisted to AsyncStorage. Redux slices use createAsyncThunk to call
repositories — no more hardcoded mock arrays in components/screens. Swapping
AsyncStorage for real `fetch()` calls later is a one-file change per domain.
Same pattern for admin-web using localStorage.

## Mobile app (src/) — DONE
- [x] Phase A: Service/repository layer (14 repositories in src/services/repositories/)
- [x] Phase B: Redux slices refactored to use repositories (thunks) — 14 slices rewritten/added
- [x] Phase C: Critical navigation fixes
  - [x] Register AdminTabNavigator in RootNavigator + all 13 admin screens reachable
        (5 tabs + 8 pushed via Dashboard quick actions)
  - [x] Register DesignStudio, AppSelection, AdminLogin, Products routes
  - [x] Remove plaintext admin creds from UI (still hardcoded in code w/ comment flagging it — no backend to auth against yet)
  - [x] Admin entry point wired into AccountScreen via AdminAccessCard
- [x] Phase D: Missing CRUD completed (wishlist toggle+list, saved designs dup/delete,
      addresses CRUD, team CRUD, tickets create, profile edit, order cancel (buyer+admin),
      inventory restock/add/delete, customer edit form, pricing rules CRUD, banners CRUD,
      promotions/users real prompts instead of "coming soon")
- [x] Phase E: Dead code removed (PouchConfiguratorScreen dup, Onboarding/Splash screens,
      old adminSlice.ts/productsSlice.ts deleted)
- [x] Verification: tsc --noEmit error count went from 248 (baseline) to 244 (after) —
      zero new type regressions introduced, confirmed via diff against pre-refactor baseline.
- [ ] Phase F: Design consistency pass (NOT done — deferred, see below)

Remaining known gaps (not blocking, lower priority):
- No design-token/theme consolidation pass done on mobile (uses src/theme/ + inline hex,
  reasonably consistent already since it's one codebase, unlike admin-web)
- DesignStudio Dieline/3D Preview tabs still static "Coming Soon" placeholders (self-labeled
  future feature, left as-is per original scope)

## admin-web
- [ ] Critical: bannersSlice registered in store (currently missing entirely)
- [ ] localStorage-backed repository layer
- [ ] Inventory CRUD (restock UI)
- [ ] Customers edit form (real, not alert)
- [ ] Pricing page real CRUD
- [ ] Settings page functional
- [ ] Remove displayed login credentials
- [ ] Shared Table/Modal/PageHeader components + color tokens

## Verification
- [ ] npx tsc --noEmit clean on mobile app
- [ ] admin-web build clean
