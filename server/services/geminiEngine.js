// Gemini AI engine — used when GEMINI_API_KEY is available.
// Falls back to the deterministic engine on any failure.
// Supports 8 languages: en, ta, hi, bn, mr, te, ur, fr.

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const TIMEOUT_MS = 8000;

let genAI = null;

function getClient() {
  if (genAI) return genAI;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

export function isGeminiAvailable() {
  return !!process.env.GEMINI_API_KEY;
}

// Helper: race a promise against a timeout
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), ms))
  ]);
}

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  bn: 'Bengali (বাংলা)',
  mr: 'Marathi (मराठी)',
  te: 'Telugu (తెలుగు)',
  ur: 'Urdu (اردو)',
  fr: 'French (Français)'
};

// Build context string from simulation data
function buildContextString(context) {
  const { strategy, form, result, stressScenario } = context || {};
  if (!result) return 'No simulation has been run yet.';

  const lines = [
    `Strategy: ${(strategy || 'sip').toUpperCase()}`,
    `Initial Investment: ₹${Number(form?.initialInvestment || 0).toLocaleString('en-IN')}`,
  ];
  if (strategy !== 'fno') lines.push(`Monthly SIP: ₹${Number(form?.monthlyInvestment || 0).toLocaleString('en-IN')}`);
  lines.push(`Duration: ${form?.durationYears || 5} years`);
  if (strategy === 'fno') lines.push(`Leverage: ${form?.leverage || 1}×`);
  lines.push(`Total Invested: ₹${Number(result.totalInvested || 0).toLocaleString('en-IN')}`);
  lines.push(`Probability of Loss: ${result.probabilityOfLoss}%`);
  lines.push(`Probability of Profit: ${result.probabilityOfProfit}%`);
  lines.push(`Median Outcome: ₹${Number(result.medianOutcome || 0).toLocaleString('en-IN')}`);
  lines.push(`5th Percentile: ₹${Number(result.percentile5 || 0).toLocaleString('en-IN')}`);
  lines.push(`95th Percentile: ₹${Number(result.percentile95 || 0).toLocaleString('en-IN')}`);
  lines.push(`Max Drawdown: ${result.maxDrawdown}%`);
  lines.push(`Simulations: 10,000 Monte Carlo bootstrap paths using historical Nifty 50 returns (2000-2025)`);

  if (stressScenario) {
    const label = stressScenario.label || stressScenario.scenarioLabel || stressScenario.scenarioType;
    lines.push(`Active Stress Scenario: ${label}`);
    if (stressScenario.probabilityOfLoss !== undefined) {
      lines.push(`Stress Test Loss Probability: ${stressScenario.probabilityOfLoss}%`);
      lines.push(`Stress Test Median Outcome: ₹${Number(stressScenario.medianOutcome || 0).toLocaleString('en-IN')}`);
      lines.push(`Stress Test Max Drawdown: ${stressScenario.maxDrawdown}%`);
      lines.push(`Stress Test 5th Percentile: ₹${Number(stressScenario.percentile5 || 0).toLocaleString('en-IN')}`);
    }
  }

  return lines.join('\n');
}

const SYSTEM_INSTRUCTION = `You are Risk Copilot AI — an educational financial risk analysis assistant embedded in an investment simulation tool.

RULES:
1. Always base your answers on the ACTUAL simulation data provided in the context. Reference specific numbers.
2. Keep responses educational and illustrative. Never give personalized financial advice.
3. End every response with a brief disclaimer that this is educational/illustrative, not personalized financial advice.
4. Use markdown formatting: **bold** for key numbers, bullet points for lists.
5. Be concise but informative. Aim for 3-5 paragraphs.
6. If the user asks a "what if" question about changing a simulation parameter (duration, investment amount, monthly SIP, leverage, or strategy), include a JSON block at the very end of your response in this exact format:
   |||SUGGESTED_CHANGE|||{"field":"durationYears","newValue":10,"reason":"Change duration from 5 to 10 years"}|||END|||
   Valid fields: durationYears, initialInvestment, monthlyInvestment, leverage, strategy. For relative changes, calculate the new absolute value for newValue based on current inputs. Only include this when the user explicitly asks about changing a parameter.
7. Never fabricate simulation numbers. Only reference data from the provided context.
8. Retain standard financial terminology (SIP, F&O, Nifty 50, Monte Carlo, Drawdown, Mutual Fund) while delivering fluent localized explanations.`;

// ── Chat ──────────────────────────────────────────────────────────────
export async function geminiChat(context, userMessage, lang = 'en') {
  const client = getClient();
  if (!client) return null;
  const m = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const targetLang = LANGUAGE_NAMES[lang] || 'English';
  const contextStr = buildContextString(context);
  const prompt = `${SYSTEM_INSTRUCTION}

LANGUAGE REQUIREMENT: Respond fluently in ${targetLang}. Keep financial acronyms (SIP, F&O, Nifty 50, Drawdown) intact and clear.

CURRENT SIMULATION CONTEXT:
${contextStr}

USER QUESTION: ${userMessage}`;

  try {
    const result = await withTimeout(m.generateContent(prompt), TIMEOUT_MS);
    const text = result.response.text();
    if (!text) return null;

    // Parse out suggested changes if present
    const changeMatch = text.match(/\|\|\|SUGGESTED_CHANGE\|\|\|(.*?)\|\|\|END\|\|\|/s);
    let suggestedChanges = null;
    let cleanText = text;
    if (changeMatch) {
      try {
        suggestedChanges = JSON.parse(changeMatch[1].trim());
        cleanText = text.replace(/\|\|\|SUGGESTED_CHANGE\|\|\|.*?\|\|\|END\|\|\|/s, '').trim();
      } catch { /* ignore parse errors */ }
    }

    return { response: cleanText, ...(suggestedChanges ? { suggestedChanges } : {}) };
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    return null;
  }
}

// ── Scenario Interpretation (structured output with SchemaType) ───────
export async function geminiInterpret(simulationResult, strategy, form, stressScenario, lang = 'en') {
  const client = getClient();
  if (!client) return null;

  const targetLang = LANGUAGE_NAMES[lang] || 'English';

  const interpretSchema = {
    type: SchemaType.OBJECT,
    properties: {
      biggestRisk: { type: SchemaType.STRING, description: `The single biggest risk detected in ${targetLang}, referencing actual numbers` },
      riskCause: { type: SchemaType.STRING, description: `What caused or drives this risk in ${targetLang}` },
      worstCaseInterpretation: { type: SchemaType.STRING, description: `Worst-case outcome explanation using actual percentile data in ${targetLang}` },
      keyAssumptions: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: `Key assumptions behind this simulation in ${targetLang}`
      },
      improvementFactors: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: `Factors that could improve the simulated outcome in ${targetLang}`
      },
      worseningFactors: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING },
        description: `Factors that could worsen the simulated outcome in ${targetLang}`
      }
    },
    required: ['biggestRisk', 'riskCause', 'worstCaseInterpretation', 'keyAssumptions', 'improvementFactors', 'worseningFactors']
  };

  const m = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: interpretSchema
    }
  });

  const context = { strategy, form, result: simulationResult, stressScenario };
  const contextStr = buildContextString(context);

  const prompt = `${SYSTEM_INSTRUCTION}

LANGUAGE REQUIREMENT: Generate all string values in ${targetLang}. Preserve terms like SIP, F&O, Drawdown, and Monte Carlo.

CURRENT SIMULATION CONTEXT:
${contextStr}

Analyze this simulation and generate structured insights strictly following the JSON schema.`;

  try {
    const result = await withTimeout(m.generateContent(prompt), TIMEOUT_MS);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    if (!parsed.biggestRisk || !parsed.riskCause || !parsed.worstCaseInterpretation) return null;
    if (!Array.isArray(parsed.keyAssumptions)) return null;
    return parsed;
  } catch (err) {
    console.error('Gemini interpret error:', err.message);
    return null;
  }
}

// ── Risk Summary (structured output with SchemaType) ──────────────────
export async function geminiSummary(simulationResult, strategy, form, stressScenario, lang = 'en') {
  const client = getClient();
  if (!client) return null;

  const targetLang = LANGUAGE_NAMES[lang] || 'English';

  const summarySchema = {
    type: SchemaType.OBJECT,
    properties: {
      riskLevel: {
        type: SchemaType.STRING,
        enum: ['Low', 'Moderate', 'High'],
        description: "Overall risk level classification ('Low', 'Moderate', or 'High')"
      },
      biggestRiskFactor: { type: SchemaType.STRING, description: `Concise statement of the biggest risk factor with real numbers in ${targetLang}` },
      positiveSignal: { type: SchemaType.STRING, description: `One key positive signal observed in the data in ${targetLang}` },
      caution: { type: SchemaType.STRING, description: `One key caution for the investor in ${targetLang}` },
      explanation: { type: SchemaType.STRING, description: `Plain 2-3 sentence overview of the risk in ${targetLang}` }
    },
    required: ['riskLevel', 'biggestRiskFactor', 'positiveSignal', 'caution', 'explanation']
  };

  const m = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: summarySchema
    }
  });

  const context = { strategy, form, result: simulationResult, stressScenario };
  const contextStr = buildContextString(context);

  const prompt = `${SYSTEM_INSTRUCTION}

LANGUAGE REQUIREMENT: Generate biggestRiskFactor, positiveSignal, caution, and explanation in ${targetLang}. The riskLevel must strictly remain one of 'Low', 'Moderate', or 'High'.

CURRENT SIMULATION CONTEXT:
${contextStr}

Generate a concise risk summary strictly adhering to the JSON schema.
Risk level rules:
- 'High' if probability of loss > 35% or max drawdown > 55%
- 'Low' if probability of loss <= 15% and max drawdown <= 35%
- 'Moderate' otherwise`;

  try {
    const result = await withTimeout(m.generateContent(prompt), TIMEOUT_MS);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    if (!['Low', 'Moderate', 'High'].includes(parsed.riskLevel)) return null;
    if (!parsed.biggestRiskFactor || !parsed.positiveSignal || !parsed.caution || !parsed.explanation) return null;
    return parsed;
  } catch (err) {
    console.error('Gemini summary error:', err.message);
    return null;
  }
}
