# TODO — Fix Metadata Extraction Error

## Steps
- [x] Analyze metadata extraction flow (`src/services/gemini.js`, `src/components/UploadZone.jsx`)
- [x] Fix `callGemini()` to use proper structured `contents` array format
- [x] Add robust `parseJSONFromText()` helper (markdown fences, trailing commas, outer-object extraction)
- [x] Harden `extractDocumentMetadata()` (retry, normalization of title/author/year/keywords)
- [x] Verify changes build (optional: `npm run build`)

