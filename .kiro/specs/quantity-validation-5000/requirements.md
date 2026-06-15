# Requirements Document: Quantity Validation for Orders ≥ 5,000 Units

## Feature Overview

Implement consistent quantity validation across all order entry points to enforce the business rule that orders of 5,000 units or more require manual processing by the sales team. When users attempt to order 5,000+ units, they will see a clear message directing them to contact sales for special pricing and arrangements.

## Business Context

**Problem**: Currently, the application has inconsistent quantity validation logic scattered across PouchConfiguratorScreen and CartModal. This creates maintenance challenges and potential gaps in enforcement of the bulk order business rule.

**Solution**: Centralize quantity validation logic in a reusable service that enforces business rules consistently across all order entry points while providing clear user feedback.

**Business Value**:
- Ensures bulk orders (5,000+ units) are properly routed to sales team
- Prevents standard e-commerce flow from processing orders it cannot handle
- Maintains self-service experience for standard quantities
- Reduces support burden from incorrectly placed large orders

## Functional Requirements

### FR-1: Bulk Order Threshold Enforcement

**ID**: FR-1  
**Priority**: High  
**Status**: Required

**Description**: The system shall prevent users from ordering 5,000 units or more through the standard e-commerce flow.

**Acceptance Criteria**:
- AC-1.1: When a user attempts to increment quantity from 3,000 to 5,000 or higher, the system shall block the operation
- AC-1.2: When a user manually enters a quantity >= 5,000, the system shall reject the input
- AC-1.3: The system shall display a message: "For orders of 5,000 units and above, please contact our sales team for special pricing and arrangements."
- AC-1.4: After blocking the operation, the quantity shall remain at the previous valid value
- AC-1.5: The threshold value (5,000) shall be configurable via a constant

**Rationale**: Large orders require manual processing, custom pricing negotiation, and special fulfillment arrangements that cannot be automated through the standard flow.

### FR-2: Minimum Order Quantity Enforcement

**ID**: FR-2  
**Priority**: High  
**Status**: Required


**Description**: The system shall enforce a minimum order quantity (MOQ) of 100 units for all products.

**Acceptance Criteria**:
- AC-2.1: When a user attempts to decrement quantity below 100 units, the system shall block the operation
- AC-2.2: When a user manually enters a quantity < 100, the system shall reject or clamp the input to 100
- AC-2.3: When decrementing would go below MOQ in the cart, the system shall show an alert with "Cancel" and "Remove" options
- AC-2.4: Selecting "Remove" shall remove the item from the cart
- AC-2.5: Selecting "Cancel" shall keep the item at the current quantity
- AC-2.6: The MOQ value (100) shall be configurable via a constant

**Rationale**: Production economics require minimum batch sizes. Orders below MOQ are not viable for manufacturing.

### FR-3: Quantity Step Constraints

**ID**: FR-3  
**Priority**: High  
**Status**: Required

**Description**: The system shall constrain all quantities to predefined steps: [100, 200, 300, 500, 1000, 3000, 5000].

**Acceptance Criteria**:
- AC-3.1: Increment operations shall move to the next step in the sequence
- AC-3.2: Decrement operations shall move to the previous step in the sequence
- AC-3.3: Manual input of quantities not in the step list shall be rounded to the nearest step
- AC-3.4: All quantities displayed and stored shall be from the step list
- AC-3.5: The quantity steps shall be configurable via a constant array

**Rationale**: Discrete quantity tiers simplify pricing, inventory management, and production planning.

### FR-4: Validation Consistency Across Entry Points

**ID**: FR-4  
**Priority**: High  
**Status**: Required

**Description**: The system shall apply identical validation logic across all quantity input points.

**Acceptance Criteria**:
- AC-4.1: PouchConfiguratorScreen increment/decrement buttons shall use the same validation as CartModal
- AC-4.2: Manual quantity input (if implemented) shall use the same validation rules
- AC-4.3: Validation logic shall be centralized in a single reusable service
- AC-4.4: All entry points shall display consistent error messages
- AC-4.5: Cart quantity controls shall enforce the same rules as configurator controls

**Rationale**: Consistency prevents user confusion and reduces maintenance burden. Centralized logic ensures uniform behavior.

### FR-5: User Feedback for Validation Failures

**ID**: FR-5  
**Priority**: High  
**Status**: Required

**Description**: The system shall provide clear, actionable feedback when validation fails.

**Acceptance Criteria**:
- AC-5.1: Bulk order threshold violations shall display: "Bulk Order" alert with contact information
- AC-5.2: Minimum order violations shall display: "Min Order" alert with Remove option

- AC-5.3: Alerts shall include sales team contact information: phone (+91 98765 43210) and email (admin@packmonk.com)
- AC-5.4: Alerts shall be dismissible by tapping "OK" button or outside the alert
- AC-5.5: After alert dismissal, the UI shall reflect that the operation was blocked (quantity unchanged)
- AC-5.6: Contact information shall be configurable via constants

**Rationale**: Clear feedback helps users understand why their action was blocked and what they can do next.

### FR-6: Validation Result Structure

**ID**: FR-6  
**Priority**: Medium  
**Status**: Required

**Description**: The validation service shall return structured results that include validity status, new quantity, alert requirements, and messages.

**Acceptance Criteria**:
- AC-6.1: Validation results shall include: `isValid`, `newQuantity`, `shouldShowAlert`, `alertType`, `message`
- AC-6.2: When `isValid` is true, `newQuantity` shall contain the approved quantity
- AC-6.3: When `isValid` is false, `shouldShowAlert` shall be true and `alertType` shall indicate the reason
- AC-6.4: `alertType` shall be one of: `'bulk_order'`, `'min_order'`, or `null`
- AC-6.5: Validation functions shall have no side effects (pure functions)

**Rationale**: Structured results make it easy for UI components to handle validation outcomes consistently.

### FR-7: Increment Validation

**ID**: FR-7  
**Priority**: High  
**Status**: Required

**Description**: The system shall validate quantity increment operations before applying them.

**Acceptance Criteria**:
- AC-7.1: Given current quantity, find the next step in the sequence
- AC-7.2: If next step >= bulk threshold (5000), return invalid result with bulk_order alert
- AC-7.3: If next step < bulk threshold, return valid result with new quantity
- AC-7.4: If current quantity is not in step list, use the first step (100)
- AC-7.5: If already at last valid step (3000), block increment to 5000

**Rationale**: Prevents users from accidentally exceeding bulk order threshold.

### FR-8: Decrement Validation

**ID**: FR-8  
**Priority**: High  
**Status**: Required

**Description**: The system shall validate quantity decrement operations before applying them.

**Acceptance Criteria**:
- AC-8.1: Given current quantity, find the previous step in the sequence
- AC-8.2: If previous step < MOQ (100), return invalid result with min_order alert
- AC-8.3: If previous step >= MOQ, return valid result with new quantity
- AC-8.4: If current quantity is not in step list, treat as if at first step
- AC-8.5: If already at first step (100), block further decrement

**Rationale**: Ensures orders never fall below minimum viable production quantity.

### FR-9: Manual Input Validation

**ID**: FR-9  
**Priority**: Medium  
**Status**: Optional (Future Enhancement)


**Description**: If manual quantity input is implemented, the system shall validate and sanitize user-entered quantities.

**Acceptance Criteria**:
- AC-9.1: Non-numeric input shall be rejected with an error message
- AC-9.2: Input >= 5000 shall be rejected with bulk_order alert
- AC-9.3: Input < 100 shall be rejected or clamped to 100 with min_order alert
- AC-9.4: Valid input not in step list shall be rounded to nearest step
- AC-9.5: Negative or zero input shall be rejected

**Rationale**: Manual input increases risk of invalid data. Strong validation prevents errors.

### FR-10: Reusable Validation Service

**ID**: FR-10  
**Priority**: High  
**Status**: Required

**Description**: The system shall provide a centralized, reusable validation service that all UI components can use.

**Acceptance Criteria**:
- AC-10.1: Validation logic shall be implemented in a separate module/class (`QuantityValidator`)
- AC-10.2: The service shall export public methods: `validateQuantityIncrement()`, `validateQuantityDecrement()`, `validateQuantityInput()`
- AC-10.3: The service shall accept configuration (thresholds, steps, MOQ) as parameters
- AC-10.4: The service shall be framework-agnostic (no React/Redux dependencies in core logic)
- AC-10.5: The service shall be fully unit-testable in isolation

**Rationale**: Centralized logic ensures consistency, simplifies maintenance, and enables thorough testing.

## Non-Functional Requirements

### NFR-1: Performance

**ID**: NFR-1  
**Priority**: Medium  
**Status**: Required

**Description**: Validation operations shall complete quickly without noticeable delay.

**Acceptance Criteria**:
- AC-1.1: Single validation operation shall complete in < 1ms
- AC-1.2: UI shall remain responsive during validation
- AC-1.3: Multiple rapid button clicks shall not cause performance degradation
- AC-1.4: Validation complexity shall be O(n) where n = number of quantity steps (typically 7)

**Measurement**: Profile validation functions with performance.now() in development, verify < 1ms average.

### NFR-2: Reliability

**ID**: NFR-2  
**Priority**: High  
**Status**: Required

**Description**: Validation shall be deterministic and reliable under all conditions.

**Acceptance Criteria**:
- AC-2.1: Same inputs shall always produce same outputs (pure functions)
- AC-2.2: No race conditions or timing issues with rapid user interactions
- AC-2.3: Validation shall work correctly on both iOS and Android
- AC-2.4: Edge cases (0, negative, very large numbers) shall be handled gracefully
- AC-2.5: Invalid configuration shall throw errors in development, log warnings in production

**Measurement**: Property-based testing with fast-check, cross-platform manual testing.

### NFR-3: Maintainability

**ID**: NFR-3  
**Priority**: High  
**Status**: Required


**Description**: Validation logic shall be easy to understand, modify, and extend.

**Acceptance Criteria**:
- AC-3.1: Code shall have comprehensive inline documentation
- AC-3.2: Configuration constants shall be externalized to constants file
- AC-3.3: Validation logic shall be decoupled from UI components
- AC-3.4: Unit test coverage shall be >= 95%
- AC-3.5: Code shall follow TypeScript best practices and team style guide

**Measurement**: Code review, SonarQube analysis, test coverage reports.

### NFR-4: Usability

**ID**: NFR-4  
**Priority**: High  
**Status**: Required

**Description**: Validation errors shall be communicated clearly to users without causing frustration.

**Acceptance Criteria**:
- AC-4.1: Error messages shall use plain language (no technical jargon)
- AC-4.2: Alerts shall provide actionable next steps (contact info, remove option)
- AC-4.3: UI shall remain responsive (buttons don't appear "broken")
- AC-4.4: Quantity controls shall have appropriate disabled states during operations
- AC-4.5: Screen readers shall announce validation errors (accessibility)

**Measurement**: User testing, accessibility audit with screen readers.

### NFR-5: Testability

**ID**: NFR-5  
**Priority**: High  
**Status**: Required

**Description**: Validation logic shall be thoroughly testable at unit, integration, and property levels.

**Acceptance Criteria**:
- AC-5.1: Unit tests shall cover all validation functions with edge cases
- AC-5.2: Integration tests shall verify UI + validation integration
- AC-5.3: Property-based tests shall verify mathematical properties hold for all inputs
- AC-5.4: Test suite shall run in < 30 seconds
- AC-5.5: Tests shall be deterministic (no flaky tests)

**Measurement**: Jest test results, fast-check property test reports, CI/CD test execution time.

### NFR-6: Security

**ID**: NFR-6  
**Priority**: Medium  
**Status**: Required

**Description**: Client-side validation shall not be the only defense against invalid quantities.

**Acceptance Criteria**:
- AC-6.1: Backend API shall independently validate all quantities in order requests
- AC-6.2: Client validation shall be treated as UX enhancement, not security boundary
- AC-6.3: Redux middleware shall validate actions to prevent direct state manipulation
- AC-6.4: Integer overflow shall be prevented with Number.isSafeInteger() checks
- AC-6.5: Audit logging shall record quantity changes for review

**Measurement**: Backend validation tests, security code review.

### NFR-7: Configurability

**ID**: NFR-7  
**Priority**: Medium  
**Status**: Required

**Description**: Validation thresholds and rules shall be easily configurable without code changes.

**Acceptance Criteria**:
- AC-7.1: Bulk order threshold shall be a named constant
- AC-7.2: Quantity steps array shall be a named constant

- AC-7.3: Minimum order quantity shall be a named constant
- AC-7.4: Contact information shall be configurable constants
- AC-7.5: All constants shall be in a single, well-documented location

**Measurement**: Verify constants are in `src/constants/index.ts`, attempt to change values without code rebuild.

## Constraints

### Technical Constraints

- **TC-1**: Solution must work with existing React Native codebase (version ~0.72.x)
- **TC-2**: Solution must integrate with existing Redux store architecture
- **TC-3**: Solution must use React Native's built-in Alert API (no custom modal for MVP)
- **TC-4**: Solution must be compatible with TypeScript strict mode
- **TC-5**: Solution must work on both iOS and Android platforms

### Business Constraints

- **BC-1**: Development timeline: 2 weeks for complete implementation and testing
- **BC-2**: No changes to backend API required (client-side only for MVP)
- **BC-3**: Must maintain backward compatibility with existing cart data structure
- **BC-4**: No changes to pricing calculation logic
- **BC-5**: Bulk order threshold (5,000) is a fixed business rule, not subject to frequent change

### Regulatory Constraints

- **RC-1**: Solution must comply with accessibility standards (WCAG 2.1 Level AA)
- **RC-2**: No collection or storage of PII - validation is purely operational
- **RC-3**: Must work in offline mode (validation is client-side)

## Dependencies

### Internal Dependencies

- **D-1**: Redux store (cart and pouch slices) - for state management
- **D-2**: Constants module - for configuration values
- **D-3**: Alert utility - for displaying validation messages
- **D-4**: TypeScript type definitions - for type safety

### External Dependencies

- **D-5**: React Native framework (Alert API)
- **D-6**: @reduxjs/toolkit (state management)
- **D-7**: Jest + React Native Testing Library (testing)
- **D-8**: fast-check (property-based testing)

### Upstream Dependencies

- **D-9**: Sales team must be prepared to handle bulk order inquiries
- **D-10**: Contact information (phone, email) must remain valid and monitored

## Assumptions

- **A-1**: Users primarily interact via increment/decrement buttons, not manual input
- **A-2**: Quantity steps will not change frequently (stable configuration)
- **A-3**: Sales team can handle volume of bulk order inquiries generated
- **A-4**: 5,000 unit threshold is appropriate for distinguishing standard vs. bulk orders
- **A-5**: Users will understand and accept the validation restrictions
- **A-6**: Backend validation (for security) will be implemented in a future phase
- **A-7**: Existing codebase has sufficient test infrastructure for new tests

## Out of Scope

The following items are explicitly excluded from this feature scope:

- **OS-1**: Backend API validation - will be addressed in separate backend feature
- **OS-2**: Custom modal UI for validation errors - using React Native Alert for MVP
- **OS-3**: Dynamic configuration from server - using hardcoded constants for MVP
- **OS-4**: Analytics tracking of validation failures - can be added in future iteration
- **OS-5**: A/B testing different threshold values - fixed at 5,000 for MVP
- **OS-6**: Localization of error messages - English only for MVP
- **OS-7**: Bulk order request form within app - directing to external contact for MVP
- **OS-8**: Admin dashboard for monitoring validation metrics - future enhancement

## Success Metrics

### Functional Metrics

- **M-1**: 100% of increment operations from 3,000 are blocked with bulk order message
- **M-2**: 0 orders >= 5,000 units processed through standard checkout flow
- **M-3**: 100% validation coverage across all quantity entry points


### Quality Metrics

- **M-4**: >= 95% unit test coverage for validation logic
- **M-5**: 0 defects found in production within first 30 days
- **M-6**: < 1ms average validation execution time
- **M-7**: 100% pass rate on cross-platform testing (iOS + Android)

### User Experience Metrics

- **M-8**: < 5% support tickets related to quantity validation confusion
- **M-9**: >= 80% user satisfaction in post-release survey (if conducted)
- **M-10**: 0 accessibility violations in automated audit (axe or similar)

### Business Metrics

- **M-11**: >= 90% of blocked bulk orders convert to sales inquiries
- **M-12**: Average sales response time to bulk inquiries < 24 hours
- **M-13**: 0 incorrectly processed large orders after implementation

## Risks and Mitigations

### Risk 1: User Confusion/Frustration

**Description**: Users may be frustrated when they cannot order 5,000+ units through the app  
**Likelihood**: Medium  
**Impact**: Medium  
**Mitigation**:
- Provide clear, empathetic error messages
- Include direct contact information in alerts
- Consider adding a "Request Quote" button in future iteration
- Monitor support tickets and iterate on messaging

### Risk 2: Sales Team Overwhelmed

**Description**: Sudden influx of bulk order inquiries could overwhelm sales team  
**Likelihood**: Low  
**Impact**: High  
**Mitigation**:
- Coordinate with sales team before launch
- Implement gradual rollout (staged release)
- Monitor inquiry volume in first weeks
- Have backup sales resources on standby

### Risk 3: Configuration Errors

**Description**: Incorrect constant values could break validation logic  
**Likelihood**: Low  
**Impact**: High  
**Mitigation**:
- Comprehensive unit tests verify correct thresholds
- Code review process includes configuration validation
- Add runtime validation checks in development mode
- Document correct configuration values clearly

### Risk 4: Backend Bypass

**Description**: Malicious users could bypass client validation  
**Likelihood**: Low  
**Impact**: High  
**Mitigation**:
- Prioritize backend validation in roadmap
- Add Redux middleware as secondary defense
- Monitor for anomalous orders (>= 5000 units)
- Implement order review process for suspicious activity

### Risk 5: Cross-Platform Inconsistencies

**Description**: Validation may behave differently on iOS vs Android  
**Likelihood**: Low  
**Impact**: Medium  
**Mitigation**:
- Thorough cross-platform testing
- Use platform-agnostic validation logic
- Test on multiple device types and OS versions
- Include both platforms in CI/CD pipeline

## Approval and Sign-off

**Product Owner**: ___________________ Date: ___________  
**Engineering Lead**: ___________________ Date: ___________  
**QA Lead**: ___________________ Date: ___________  
**Sales Manager**: ___________________ Date: ___________

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-XX | Kiro AI | Initial requirements document |
