# Tasks: Quantity Validation for Orders ≥ 5,000 Units

## Overview

This document outlines the implementation tasks for the quantity validation feature. Tasks are organized by phase and include acceptance criteria references from the requirements document.

**Estimated Timeline**: 2 weeks (10 business days)  
**Team Size**: 1-2 developers + 1 QA engineer

---

## Phase 1: Core Validation Logic (Days 1-3)

### 1.1 Add Configuration Constants

**Description**: Add quantity validation constants to the constants file

**Acceptance Criteria**: FR-1 (AC-1.5), FR-2 (AC-2.6), FR-3 (AC-3.5), FR-5 (AC-5.6), NFR-7 (AC-7.1 through AC-7.5)

**File**: `src/constants/index.ts`

**Tasks**:
- [x] Add `BULK_ORDER_THRESHOLD = 5000`
- [x] Add `QUANTITY_OPTIONS = [100, 200, 300, 500, 1000, 3000, 5000]`
- [x] Add `MINIMUM_ORDER_QUANTITY = 100`
- [x] Add `BULK_ORDER_CONTACT_PHONE = '+91 98765 43210'`
- [x] Add `BULK_ORDER_CONTACT_EMAIL = 'admin@packmonk.com'`
- [x] Add `BULK_ORDER_MESSAGE` constant with message text
- [x] Add JSDoc comments explaining each constant

**Estimated Time**: 0.5 hours

**Dependencies**: None

---

### 1.2 Create Type Definitions

**Description**: Create TypeScript interfaces for validation types

**Acceptance Criteria**: FR-6 (AC-6.1 through AC-6.4)

**File**: `src/types/validation.ts` (new file)

**Tasks**:
- [x] Define `ValidationResult` interface
- [x] Define `QuantityOptions` interface
- [x] Define `BulkOrderMessage` interface
- [x] Define `ContactInfo` interface
- [x] Define `QuantityChangeEvent` interface (for future analytics)
- [x] Export all interfaces

**Estimated Time**: 1 hour

**Dependencies**: None

---

### 1.3 Implement QuantityValidator Core Logic

**Description**: Create the main validation service with all validation methods

**Acceptance Criteria**: FR-7, FR-8, FR-9, FR-10, NFR-1, NFR-2

**File**: `src/utils/quantityValidator.ts` (new file)

**Tasks**:
- [ ] Create `QuantityValidator` class
- [~] Implement `validateQuantityIncrement()` method

  - Input: currentQuantity, options
  - Output: ValidationResult
  - Logic: Find next step, check bulk threshold
- [~] Implement `validateQuantityDecrement()` method
  - Input: currentQuantity, options
  - Output: ValidationResult
  - Logic: Find previous step, check MOQ
- [~] Implement `validateQuantityInput()` method (optional for manual input)
  - Input: inputQuantity, options
  - Output: ValidationResult
  - Logic: Check bounds, find nearest step
- [~] Implement `findNearestQuantityStep()` helper function
  - Input: inputQuantity, quantitySteps
  - Output: nearest step value
  - Logic: Minimize distance to input
- [~] Implement `getBulkOrderMessage()` method
  - Returns formatted bulk order message with contact info
- [~] Add comprehensive JSDoc comments
- [~] Add precondition/postcondition assertions (development mode)

**Estimated Time**: 4 hours

**Dependencies**: 1.2 (type definitions)

---

### 1.4 Write Unit Tests for Validator

**Description**: Comprehensive unit tests for all validation functions

**Acceptance Criteria**: NFR-5 (AC-5.1), NFR-3 (AC-3.4)

**File**: `src/utils/__tests__/quantityValidator.test.ts` (new file)

**Tasks**:
- [~] Set up test configuration and mocks
- [ ] Test `validateQuantityIncrement()`:
  - [~] Increment from 1000 → 3000 (valid)
  - [~] Increment from 3000 → 5000 (blocked)
  - [~] Increment from non-step value (e.g., 250)
  - [~] Increment from 0 (edge case)
  - [~] Increment when already at last valid step
- [ ] Test `validateQuantityDecrement()`:
  - [~] Decrement from 500 → 300 (valid)
  - [~] Decrement from 100 → below MOQ (blocked)
  - [~] Decrement from non-step value
  - [~] Decrement when at first step
- [ ] Test `validateQuantityInput()`:
  - [~] Valid input in step list (e.g., 1000)
  - [~] Input >= 5000 (blocked)
  - [~] Input < 100 (clamped to 100)
  - [~] Input between steps (rounded to nearest)
  - [~] Negative input (rejected)
  - [~] Zero input (rejected)
  - [~] NaN input (rejected)
- [ ] Test `findNearestQuantityStep()`:
  - [~] Exact match returns same value
  - [~] Value between steps returns nearest
  - [~] Value below all steps returns first step
  - [~] Value above all steps returns last step
- [ ] Test edge cases:
  - [~] Empty quantity steps array (error)
  - [~] Negative threshold (error)
  - [~] Very large numbers (safe integer check)
- [~] Verify test coverage >= 95%

**Estimated Time**: 4 hours

**Dependencies**: 1.3 (validator implementation)

---

### 1.5 Write Property-Based Tests

**Description**: Generative tests to verify mathematical properties

**Acceptance Criteria**: NFR-5 (AC-5.3), Design properties 1-7

**File**: `src/utils/__tests__/quantityValidator.properties.test.ts` (new file)

**Tasks**:
- [~] Install and configure fast-check library
- [ ] Test Property 1: Bulk threshold enforcement
  - [~] ∀ qty >= 5000: increment/input returns invalid
- [ ] Test Property 2: Minimum enforcement
  - [~] ∀ qty < 100: decrement/input returns invalid
- [ ] Test Property 3: Step consistency
  - [~] ∀ valid result: newQuantity ∈ quantitySteps
- [ ] Test Property 4: Monotonic increment/decrement
  - [~] ∀ valid increment: newQuantity > currentQuantity
  - [~] ∀ valid decrement: newQuantity < currentQuantity
- [ ] Test Property 5: Alert consistency
  - [~] ∀ invalid result: shouldShowAlert = true AND message ≠ null
- [ ] Test Property 6: Idempotence
  - [~] ∀ inputs: repeated calls produce identical results
- [ ] Test Property 7: Nearest step optimality
  - [~] ∀ input: result minimizes distance to all steps
- [~] Configure fast-check with appropriate input ranges
- [~] Run 1000+ iterations per property

**Estimated Time**: 3 hours

**Dependencies**: 1.3 (validator implementation), 1.4 (unit tests passing)

---

## Phase 2: UI Integration (Days 4-6)

### 2.1 Integrate Validator into PouchConfiguratorScreen

**Description**: Replace inline validation logic with validator service

**Acceptance Criteria**: FR-4 (AC-4.1), FR-1, FR-2, FR-5

**File**: `src/screens/PouchConfiguratorScreen.tsx`

**Tasks**:
- [~] Import QuantityValidator and types
- [~] Import constants (BULK_ORDER_THRESHOLD, QUANTITY_OPTIONS, etc.)
- [~] Create validator instance
- [ ] Refactor `incrementQty()` function:
  - [~] Call validator.validateQuantityIncrement()
  - [~] Handle ValidationResult
  - [~] Show alert if shouldShowAlert is true
  - [~] Update quantity only if isValid is true
- [ ] Refactor `decrementQty()` function:
  - [~] Call validator.validateQuantityDecrement()
  - [ ] Handle ValidationResult
  - [~] Show alert with Cancel/Remove options for min_order
- [~] Remove old inline validation logic
- [~] Update alert messages to use validator's messages
- [~] Add loading/disabled state during validation (if needed)
- [~] Test manually on simulator/device

**Estimated Time**: 2 hours

**Dependencies**: 1.3 (validator implementation)

---

### 2.2 Integrate Validator into CartModal

**Description**: Replace inline validation logic with validator service

**Acceptance Criteria**: FR-4 (AC-4.2 through AC-4.5), FR-1, FR-2, FR-5

**File**: `src/components/CartModal.tsx`

**Tasks**:
- [ ] Import QuantityValidator and types
- [~] Import constants
- [ ] Create validator instance
- [ ] Refactor `handleQty()` function:
  - [~] Add direction parameter handling ('inc' | 'dec')
  - [~] Call appropriate validator method based on direction
  - [~] Handle ValidationResult for pouch items
  - [~] Handle ValidationResult for non-pouch items
  - [~] Show alerts based on alertType
  - [~] Update cart state only if isValid is true
- [~] Ensure Remove button functionality works for min_order alerts
- [ ] Remove old inline validation logic
- [~] Test manually with different item types

**Estimated Time**: 2 hours

**Dependencies**: 1.3 (validator implementation)

---

### 2.3 Create Reusable QuantityControl Component (Optional)

**Description**: Extract quantity controls into reusable component

**Acceptance Criteria**: FR-4 (AC-4.3), NFR-3 (AC-3.3)

**File**: `src/components/QuantityControl.tsx` (new file)

**Tasks**:
- [~] Create QuantityControl component with props:
  - currentQuantity
  - quantityOptions
  - minimumOrderQuantity
  - onQuantityChange
  - onValidationError
  - disabled
- [~] Implement increment button with validation
- [~] Implement decrement button with validation
- [~] Implement optional manual input with validation
- [~] Add loading/disabled states
- [~] Add accessibility labels (aria-label, accessibilityLabel)
- [~] Style to match existing design
- [~] Write component tests

**Estimated Time**: 4 hours (OPTIONAL - can be deferred to future iteration)

**Dependencies**: 1.3 (validator implementation)

---

### 2.4 Write Integration Tests for PouchConfiguratorScreen

**Description**: Test validation integration in configurator screen

**Acceptance Criteria**: NFR-5 (AC-5.2)

**File**: `src/screens/__tests__/PouchConfiguratorScreen.validation.test.tsx` (new file)

**Tasks**:
- [~] Set up test environment with mocked Redux store
- [~] Mock Alert.alert
- [ ] Test increment at 3000:
  - [~] Click increment button
  - [~] Verify Alert.alert called with bulk order message
  - [~] Verify quantity remains 3000
- [ ] Test increment at 1000:
  - [ ] Click increment button
  - [~] Verify quantity updates to 3000
  - [~] Verify no alert shown
- [ ] Test decrement at 100:
  - [~] Click decrement button
  - [~] Verify Alert.alert called with min order message
  - [~] Verify quantity remains 100
- [ ] Test decrement at 500:
  - [ ] Click decrement button
  - [~] Verify quantity updates to 300
- [ ] Test summary screen with 3000 quantity:
  - [~] Navigate to summary
  - [~] Verify increment still blocked in summary
- [~] Verify state consistency after validation failures

**Estimated Time**: 3 hours

**Dependencies**: 2.1 (configurator integration)

---

### 2.5 Write Integration Tests for CartModal

**Description**: Test validation integration in cart modal

**Acceptance Criteria**: NFR-5 (AC-5.2)

**File**: `src/components/__tests__/CartModal.validation.test.tsx` (new file)

**Tasks**:
- [ ] Set up test environment with mocked Redux store
- [ ] Mock Alert.alert
- [~] Create test cart items with different quantities
- [ ] Test increment at 3000 in cart:
  - [ ] Click increment button
  - [~] Verify Alert.alert called
  - [~] Verify cart item quantity unchanged
- [ ] Test decrement at 100 in cart:
  - [ ] Click decrement button
  - [~] Verify Alert.alert with Remove option called
  - [~] Simulate Remove button press
  - [~] Verify item removed from cart
- [ ] Test multiple items in cart:
  - [~] Verify each item validates independently
- [ ] Test pouch items vs non-pouch items:
  - [~] Verify both use same validation logic

**Estimated Time**: 3 hours

**Dependencies**: 2.2 (cart modal integration)

---

## Phase 3: Testing & Refinement (Days 7-8)

### 3.1 Manual Cross-Platform Testing

**Description**: Thorough manual testing on iOS and Android

**Acceptance Criteria**: NFR-2 (AC-2.3), NFR-7 (M-7)

**Tasks**:
- [ ] iOS Testing (iPhone simulator + physical device):
  - [~] Test PouchConfiguratorScreen increment/decrement
  - [~] Test CartModal increment/decrement
  - [~] Test alerts display correctly (iOS style)
  - [~] Test button states and responsiveness
  - [~] Test with VoiceOver (accessibility)
  - [~] Test on different iOS versions (14, 15, 16+)
- [ ] Android Testing (Android emulator + physical device):
  - [ ] Test PouchConfiguratorScreen increment/decrement
  - [ ] Test CartModal increment/decrement
  - [~] Test alerts display correctly (Android style)
  - [ ] Test button states and responsiveness
  - [~] Test with TalkBack (accessibility)
  - [~] Test on different Android versions (10, 11, 12+)
- [~] Document any platform-specific issues
- [~] Create bug tickets for issues found
- [~] Verify fixes on both platforms

**Estimated Time**: 4 hours

**Dependencies**: 2.1, 2.2 (UI integration complete)

---

### 3.2 Accessibility Testing

**Description**: Ensure validation is accessible to all users

**Acceptance Criteria**: NFR-4 (AC-4.5), RC-1, M-10

**Tasks**:
- [~] Run automated accessibility audit (axe, React Native Accessibility)
- [ ] Test with iOS VoiceOver:
  - [~] Verify buttons have descriptive labels
  - [~] Verify alerts are announced
  - [~] Verify quantity values are announced
- [ ] Test with Android TalkBack:
  - [~] Same as VoiceOver tests
- [~] Test keyboard navigation (if applicable)
- [~] Verify color contrast meets WCAG 2.1 AA standards
- [~] Fix any accessibility violations found
- [~] Document accessibility test results

**Estimated Time**: 2 hours

**Dependencies**: 2.1, 2.2 (UI integration complete)

---

### 3.3 Performance Testing

**Description**: Verify validation performs efficiently

**Acceptance Criteria**: NFR-1 (AC-1.1 through AC-1.4), M-6

**Tasks**:
- [~] Add performance.now() profiling to validation functions
- [ ] Test single validation call:
  - [~] Measure execution time
  - [~] Verify < 1ms average
- [ ] Test rapid button clicks (stress test):
  - [~] Click increment 20 times rapidly
  - [~] Verify no performance degradation
  - [~] Verify no race conditions
  - [~] Verify UI remains responsive
- [~] Profile with React Native Performance Monitor
- [~] Test on low-end devices (if available)
- [~] Document performance metrics
- [~] Optimize if any issues found (memoization, debouncing)

**Estimated Time**: 2 hours

**Dependencies**: 2.1, 2.2 (UI integration complete)

---

### 3.4 Edge Case Testing

**Description**: Test uncommon scenarios and edge cases

**Acceptance Criteria**: NFR-2 (AC-2.4)

**Tasks**:
- [~] Test with quantity = 0 (should not occur, but handle gracefully)
- [~] Test with negative quantities (should not occur, but handle gracefully)
- [~] Test with very large numbers (> Number.MAX_SAFE_INTEGER)
- [~] Test with NaN or undefined quantities
- [~] Test with empty cart
- [~] Test with invalid configuration (empty steps array, negative threshold)
- [~] Test rapid navigation (switching screens during validation)
- [~] Test with slow network (Redux state updates delayed)
- [~] Test app backgrounding/foregrounding during operation
- [~] Document expected behavior for each edge case
- [~] Add error boundaries or guards if needed

**Estimated Time**: 2 hours

**Dependencies**: 2.1, 2.2 (UI integration complete)

---

### 3.5 User Acceptance Testing (UAT)

**Description**: Have stakeholders test the feature

**Acceptance Criteria**: M-9

**Tasks**:
- [~] Prepare UAT test script with scenarios
- [~] Deploy to staging environment
- [~] Conduct UAT session with product owner
- [~] Conduct UAT session with sales team representative
- [~] Gather feedback on error messages
- [~] Gather feedback on user flow
- [~] Prioritize feedback items (must-fix vs. nice-to-have)
- [~] Implement critical feedback
- [~] Get sign-off from stakeholders

**Estimated Time**: 4 hours (includes feedback implementation)

**Dependencies**: 3.1 (cross-platform testing complete)

---

## Phase 4: Documentation & Deployment (Days 9-10)

### 4.1 Code Documentation

**Description**: Ensure all code is well-documented

**Acceptance Criteria**: NFR-3 (AC-3.1, AC-3.2)

**Tasks**:
- [~] Add JSDoc comments to all public methods
- [~] Add inline comments for complex logic
- [~] Update README with validation feature overview
- [~] Create architecture decision record (ADR) for validation approach
- [~] Document configuration constants
- [~] Add usage examples in code comments
- [~] Generate API documentation (if using tool like TypeDoc)

**Estimated Time**: 2 hours

**Dependencies**: All implementation tasks complete

---

### 4.2 Update Test Documentation

**Description**: Document testing approach and results

**Acceptance Criteria**: NFR-5

**Tasks**:
- [~] Create test plan document
- [~] Document test coverage metrics
- [~] Document property-based test results
- [~] Document manual test results
- [~] Document known limitations or issues
- [~] Create regression test suite checklist
- [~] Update CI/CD pipeline to run new tests

**Estimated Time**: 1 hour

**Dependencies**: All testing tasks complete

---

### 4.3 Create User-Facing Documentation

**Description**: Help articles for end users

**Acceptance Criteria**: FR-5, NFR-4

**Tasks**:
- [~] Create FAQ entry: "Why can't I order 5,000+ units?"
- [~] Create help article: "How to contact sales for bulk orders"
- [~] Update ordering guide with quantity limits
- [~] Add bulk order information to product pages (if applicable)
- [~] Review documentation with support team
- [~] Publish to help center or knowledge base

**Estimated Time**: 2 hours

**Dependencies**: UAT complete

---

### 4.4 Pre-Deployment Checklist

**Description**: Final verification before production deployment

**Acceptance Criteria**: All functional and non-functional requirements

**Tasks**:
- [~] Run full test suite (unit + integration + property-based)
- [~] Verify all tests passing
- [~] Run accessibility audit
- [~] Run performance profiling
- [~] Code review completed and approved
- [~] Verify constants are correct in production config
- [~] Verify backend validation is prioritized in roadmap (even if not implemented yet)
- [~] Create rollback plan
- [~] Prepare monitoring/alerting for production
- [~] Get final sign-off from product owner
- [~] Schedule deployment window

**Estimated Time**: 2 hours

**Dependencies**: All prior tasks complete

---

### 4.5 Deployment

**Description**: Deploy to production and monitor

**Acceptance Criteria**: M-1 through M-13

**Tasks**:
- [ ] Deploy to staging environment
- [~] Smoke test on staging (iOS + Android)
- [~] Deploy to production (gradual rollout if possible)
- [~] Monitor error logs for first 24 hours
- [~] Monitor support tickets for validation-related issues
- [~] Monitor sales inquiry volume
- [~] Verify no orders >= 5000 processed
- [~] Collect initial metrics (M-1 through M-13)
- [~] Schedule post-deployment review meeting
- [~] Document lessons learned

**Estimated Time**: 4 hours (includes monitoring)

**Dependencies**: 4.4 (pre-deployment checklist complete)

---

### 4.6 Post-Deployment Monitoring (Days 11-15)

**Description**: Monitor feature in production for first week

**Acceptance Criteria**: M-5, M-8, M-11, M-12, M-13

**Tasks**:
- [~] Monitor error rates daily
- [~] Monitor support ticket volume
- [~] Track bulk order inquiry conversions
- [~] Review sales team feedback
- [~] Analyze user behavior (if analytics available)
- [~] Identify any unexpected issues
- [~] Create follow-up tickets for improvements
- [~] Update documentation based on real-world usage
- [~] Conduct post-mortem meeting
- [~] Plan next iteration enhancements

**Estimated Time**: 1 hour/day for 5 days

**Dependencies**: 4.5 (deployment complete)

---

## Task Summary

### By Phase

**Phase 1** (Days 1-3): 5 tasks, ~12.5 hours  
**Phase 2** (Days 4-6): 5 tasks, ~14 hours  
**Phase 3** (Days 7-8): 5 tasks, ~14 hours  
**Phase 4** (Days 9-10): 6 tasks, ~11 hours + 5 hours monitoring

**Total Estimated Time**: ~56.5 hours (includes monitoring)

### Critical Path

1. 1.1 → 1.2 → 1.3 → 1.4 (Core logic and unit tests)
2. 1.5 (Property tests, parallel with next phase)
3. 2.1, 2.2 (UI integration)
4. 2.4, 2.5 (Integration tests)
5. 3.1 (Manual testing)
6. 3.5 (UAT and sign-off)
7. 4.4, 4.5 (Deployment)

### Resource Allocation

**Developer 1**: Tasks 1.1-1.5, 2.1, 2.4, 4.1-4.2  
**Developer 2** (optional): Tasks 2.2, 2.3, 2.5, 4.3  
**QA Engineer**: Tasks 3.1-3.4, 4.4  
**Product Owner**: Tasks 3.5, 4.6

---

## Notes

- Task 2.3 (Reusable QuantityControl component) is marked optional and can be deferred
- Property-based tests (1.5) can run in parallel with Phase 2
- Manual testing (3.1) should involve actual devices, not just simulators
- Backend validation should be prioritized in roadmap immediately after this feature
- Consider adding analytics tracking in a follow-up iteration
