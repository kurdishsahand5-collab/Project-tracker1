# Firebase Security Specification - Peptonix Ad Videos Work Log

## 1. Data Invariants
- Any authenticated user can read or write video log entries.
- A project/video log must have a valid `id`, `name`, `type`, `date`, `amount`, and `paid` status.
- Amount must be a number.

## 2. Dirty Dozen Security Attack Payloads
1. **Unauthenticated Read**: Attempt to read projects collection without being signed-in.
2. **Unauthenticated Write**: Attempt to create a project entry without being signed-in.
3. **Ghost Field Write**: Attempt to write a project entry containing unapproved properties (privilege escalation / shadow fields).
4. **Invalid Type (Amount)**: Attempt to save a project with `amount` set as a string instead of a number.
5. **Malicious ID Injection**: Attempt to write a document with an extremely long or path-poisend document ID.
6. **Invalid Date Format**: Attempt to save a project with an invalid date string format.
7. **Type Spoofing (Paid status)**: Attempt to save `paid` status as a string `"true"` instead of a proper boolean value.
8. **Shadow Field Modification**: Attempt to update immutable system fields during an update.
9. **Spam Notes Payload**: Attempt to save notes field with content exceeding appropriate string length boundaries.
10. **Null Attribute Creation**: Attempt to create a project document missing required attributes like `name` or `type`.
11. **Improper Video Type Attribute**: Saving a video with a type not allowed by standard classification.
12. **Tampered Date Field size**: Providing an unexpected date format that could corrupt history sorting or UI presentation.

---

## 3. Deployment Target Rules
We will implement and enforce these safeguards via the `firestore.rules` file:
- Match `/projects/{projectId}`
- Allow `read`, `create`, `update`, `delete` only if the user is authenticated (`request.auth != null`).
