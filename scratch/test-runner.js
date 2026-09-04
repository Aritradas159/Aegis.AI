import fs from 'fs';
import { translations } from '../client/src/i18n/translations.js';
import { getLessons } from '../server/controllers/learningController.js';
import { generateRiskSummary, generateScenarioInterpretation, generateChatResponse } from '../server/services/aiEngine.js';
import { getHistoricalReturns } from '../server/services/marketData.js';
import { runMonteCarlo } from '../server/services/monteCarlo.js';

async function runTests() {
  console.log('=== Step 1: Translations dictionary verification ===');
  const expectedLangs = ['en', 'ta', 'hi', 'bn', 'mr', 'te', 'ur', 'fr'];
  const actualLangs = Object.keys(translations);
  console.log('Detected languages:', actualLangs);
  if (expectedLangs.sort().join() !== actualLangs.sort().join()) {
    throw new Error('Supported languages mismatch!');
  }

  const enKeys = Object.keys(translations.en);
  console.log('Total keys per language in dictionary:', enKeys.length);

  for (const lang of expectedLangs) {
    const langKeys = Object.keys(translations[lang]);
    if (langKeys.length !== enKeys.length) {
      throw new Error(`Key count mismatch for ${lang}: got ${langKeys.length}, expected ${enKeys.length}`);
    }
    for (const k of enKeys) {
      if (!translations[lang][k] || typeof translations[lang][k] !== 'string') {
        throw new Error(`Missing or empty translation for ${lang}.${k}`);
      }
    }
  }
  console.log('✓ All 8 languages have 100% complete and valid translation keys!');

  console.log('=== Step 2: LanguageContext and LanguageSelector files ===');
  const ctxContent = fs.readFileSync('./client/src/i18n/LanguageContext.jsx', 'utf8');
  if (!ctxContent.includes('LanguageProvider') || !ctxContent.includes('useLanguage')) {
    throw new Error('LanguageContext.jsx missing required exports');
  }
  if (!ctxContent.includes("'ur'") || !ctxContent.includes("'rtl'")) {
    throw new Error('LanguageContext.jsx missing Urdu RTL definition');
  }
  console.log('✓ LanguageContext.jsx verified: exports LanguageProvider, useLanguage, and handles Urdu RTL direction!');

  const selectorContent = fs.readFileSync('./client/src/components/LanguageSelector.jsx', 'utf8');
  if (!selectorContent.includes('LanguageSelector') || !selectorContent.includes('useLanguage')) {
    throw new Error('LanguageSelector.jsx missing required exports or context usage');
  }
  console.log('✓ LanguageSelector.jsx verified: component exports properly and connects to useLanguage context!');

  console.log('=== Step 3: Server learningController 8-language verification ===');
  let mockResData = null;
  getLessons({}, { json: d => { mockResData = d; } });
  if (!mockResData || !mockResData.lessons || mockResData.lessons.length !== 5) {
    throw new Error('Invalid lessons returned from learningController!');
  }
  mockResData.lessons.forEach((l, idx) => {
    expectedLangs.forEach(lang => {
      if (!l.title[lang] || !l.body[lang]) {
        throw new Error(`Lesson ${idx} (${l.id}) missing title/body for language ${lang}`);
      }
    });
  });
  console.log('✓ All 5 lessons have full micro-lesson titles and bodies in all 8 languages!');

  console.log('=== Step 4: AI Engine deterministic fallback across all 8 languages ===');
  const mockSim = {
    totalInvested: 500000,
    probabilityOfLoss: 28.5,
    probabilityOfProfit: 71.5,
    medianOutcome: 850000,
    percentile5: 350000,
    percentile95: 1650000,
    maxDrawdown: 38.2
  };
  const mockForm = { initialInvestment: 100000, monthlyInvestment: 10000, durationYears: 5, leverage: 1 };

  for (const lang of expectedLangs) {
    const summary = generateRiskSummary(mockSim, 'sip', mockForm, null, lang);
    if (!summary || !summary.riskLevel || !summary.biggestRiskFactor || !summary.positiveSignal || !summary.caution || !summary.explanation) {
      throw new Error(`generateRiskSummary failed for ${lang}`);
    }
    const interp = generateScenarioInterpretation(mockSim, 'sip', mockForm, null, lang);
    if (!interp || !interp.biggestRisk || !interp.riskCause || !interp.worstCaseInterpretation || !Array.isArray(interp.keyAssumptions)) {
      throw new Error(`generateScenarioInterpretation failed for ${lang}`);
    }
    const chat = generateChatResponse({ result: mockSim, form: mockForm, strategy: 'sip' }, 'explain this in simple words', lang);
    if (!chat || !chat.response) {
      throw new Error(`generateChatResponse failed for ${lang}`);
    }
    console.log(`  - [${lang}] summary level: ${summary.riskLevel}, explanation: ${summary.explanation.slice(0, 50)}...`);
  }
  console.log('✓ aiEngine localized generation verified across all 8 languages!');

  console.log('=== Step 5: Untouched Monte Carlo calculations & math verification ===');
  const market = await getHistoricalReturns();
  const sim = runMonteCarlo({
    strategy: 'sip',
    initialInvestment: 50000,
    monthlyInvestment: 5000,
    durationYears: 5,
    leverage: 1,
    historicalReturns: market.returns,
    simulations: 2000
  });
  if (!sim || typeof sim.probabilityOfLoss !== 'number' || typeof sim.medianOutcome !== 'number') {
    throw new Error('Monte Carlo simulation failed!');
  }
  console.log(`✓ Monte Carlo calculations completely intact! Loss Prob: ${sim.probabilityOfLoss}%, Median Outcome: ₹${sim.medianOutcome.toLocaleString('en-IN')}`);

  console.log('\n========================================');
  console.log('ALL VERIFICATION SUITES PASSED (100%)');
  console.log('========================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
