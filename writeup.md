# Week 2 — Spec-Driven Development

## Prompts per skill
/speckit-constitution Create principles focused on code quality, testing, and maintainability.
/speckit-specify A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.
/speckit-plan Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. (initial)
/speckit-plan Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. The page must work when index.html is opened directly from disk (file://), so do not use ES modules. (refined)
/speckit-tasks

## Refinement (before/after)
Original plan used ES2020+ modules for the pages scripts in html which conflicted with opening directly as a local file. Tested by creating a .js and .html file and attempting to open the page in safari. When opened as a file:// the browser error showed "Origin null is not allowed by Access-Control-Allow-Origin" while same files worked at localhost. Only tested on Safari browser. Revised plan prompt as shown above in prompts section. Fix to be verified after implementation.

**Before:** `ad61665` (plan with ES modules)

**After:** `c5a6614` (plan with classic scripts). Per `git diff --stat`,
```
 specs/001-quote-of-the-day/contracts/js-module-contracts.md | 44 +++++++++++++++++++++++++++++++-------------
 specs/001-quote-of-the-day/plan.md                          | 16 ++++++++--------
 specs/001-quote-of-the-day/quickstart.md                    |  5 ++++-
 specs/001-quote-of-the-day/research.md                      | 18 ++++++++++++------
 4 files changed, 55 insertions(+), 28 deletions(-)
```
One rule change in prompt updated four documents to match.

## Convergence outcome

## What I learned