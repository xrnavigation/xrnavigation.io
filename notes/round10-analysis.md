# Round 10 Visual Comparison Analysis
**Date:** 2026-04-01

## Observations
- Tests passed: 1 passed, 180 comparisons (90 desktop, 90 mobile)
- Hugo server started on port 1314, tests ran in ~11.5 minutes

## R10 Results
- **Avg: 29.03%** (R9: 26.81%) -- REGRESSION of +2.22pp
- **Median: 22.89%** (R9: 21.16%) -- REGRESSION of +1.73pp
- **Desktop avg: 27.65%** (R9: 22.67%) -- REGRESSION of +4.98pp
- **Desktop median: 19.09%** (R9: 9.73%) -- REGRESSION of +9.36pp
- **Mobile avg: 30.41%** (R9: 31.00%) -- slight improvement of -0.59pp
- **Mobile median: 27.59%** (R9: 27.81%) -- slight improvement of -0.22pp

## Distribution
- Under 1%: 0 (R9: 2) -- lost the near-perfect matches
- Under 5%: 11 (R9: 40) -- MAJOR regression, lost 29 pages
- Under 10%: 25 (R9: 45) -- lost 20 pages
- Under 20%: 87 (R9: 89) -- roughly same
- Under 30%: 106 (R9: 110) -- lost 4 pages

## Key finding
This is a REGRESSION from R9. Desktop got significantly worse. The sub-5% bucket collapsed from 40 to 11. The embed pages that were near-perfect in R9 (lske-map, audiom-tvm-map, etc.) jumped from ~3% to ~4.5-5%. Something changed that hurt desktop scores broadly.

The digital-map-tool-accessibility-comparison page that was 0% in R9 desktop is now 61.27% -- massive regression, with a 5266px height difference (page appears to be missing most content).

## Next step
- Write the report comparing R10 to R9, noting the regression
- Kill hugo (done), commit report
