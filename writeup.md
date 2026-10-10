# Week 2 — Spec-Driven Development

## Prompts per skill
/speckit-constitution Create principles focused on code quality, testing, and maintainability.
/speckit-specify A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.
/speckit-plan Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. (initial)
/speckit-plan Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage. The page must work when index.html is opened directly from disk (file://), so do not use ES modules. (refined)
/speckit-tasks
/speckit-implement (pass 1)
/speckit-converge (pass 1)
/speckit-implement (pass 2)
/speckit-converge (pass 2)

## Refinement (before/after)
Original plan used ES2020+ modules for the pages scripts in html which conflicted with opening directly as a local file. Tested by creating a .js and .html file and attempting to open the page in safari. When opened as a file:// the browser error showed "Origin null is not allowed by Access-Control-Allow-Origin" while same files worked at localhost. Only tested on Safari browser. Revised plan prompt as shown above in prompts section. Fix verified after implementation: opened index.html directly in Safari, and page works for all features. Observed all proposed tests from red to green in agent log.

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
Pass 1: all task boxes checked; converge appended one task for "flaky reload-persistence" check
Pass 2: after implement convergence confirmed

## What I learned
There was a large degree of overhead added by the inclusion of a heavy toolchain used striclty for testing a relatively small page. Throughout most stages of the process, the agent made informed guesses and documented them as assumptions which resulted in no questions directed to me for feedback and potential revisions. This meant I had to manually scan created files to determine potential issues upstream in the SDD pipeline.
After identifying a necessary refinement before actual code generation, the rest of the process proceeded entirely autonomously with no necessary intervention before final convergence. Because of this upstream refinement, the payoff was extreme and surpising. Agentic coding has shown unprecedented time reductions in the coding phase of development, which in turn adds substantial time allocation to analysis and reflection in order to understand the generated code.