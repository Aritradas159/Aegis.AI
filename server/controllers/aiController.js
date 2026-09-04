// AI controller — tries Gemini first, falls back to deterministic engine.
// Supports 8 languages: en, ta, hi, bn, mr, te, ur, fr.

import { generateChatResponse, generateScenarioInterpretation, generateRiskSummary } from '../services/aiEngine.js';
import { isGeminiAvailable, geminiChat, geminiInterpret, geminiSummary } from '../services/geminiEngine.js';

const SUPPORTED_LANGUAGES = ['en', 'ta', 'hi', 'bn', 'mr', 'te', 'ur', 'fr'];

function normalizeLanguage(lang) {
  if (typeof lang === 'string' && SUPPORTED_LANGUAGES.includes(lang.toLowerCase())) {
    return lang.toLowerCase();
  }
  return 'en';
}

export async function chat(req, res) {
  const { message, context, language } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'A message is required.' });
  }

  const lang = normalizeLanguage(language);

  // Try Gemini first
  if (isGeminiAvailable()) {
    try {
      const geminiResult = await geminiChat(context, message, lang);
      if (geminiResult && geminiResult.response) {
        return res.json(geminiResult);
      }
    } catch (err) {
      console.error('Gemini chat failed, falling back:', err.message);
    }
  }

  // Fallback to deterministic engine
  const result = generateChatResponse(context, message, lang);
  res.json(result);
}

export async function interpret(req, res) {
  const { simulationResult, strategy, form, stressScenario, language } = req.body;
  if (!simulationResult) {
    return res.status(400).json({ message: 'simulationResult is required.' });
  }

  const lang = normalizeLanguage(language);

  // Try Gemini first
  if (isGeminiAvailable()) {
    try {
      const geminiResult = await geminiInterpret(simulationResult, strategy, form, stressScenario, lang);
      if (geminiResult) {
        return res.json(geminiResult);
      }
    } catch (err) {
      console.error('Gemini interpret failed, falling back:', err.message);
    }
  }

  // Fallback
  const result = generateScenarioInterpretation(simulationResult, strategy, form, stressScenario, lang);
  if (!result) return res.status(400).json({ message: 'Could not generate interpretation.' });
  res.json(result);
}

export async function summary(req, res) {
  const { simulationResult, strategy, form, stressScenario, language } = req.body;
  if (!simulationResult) {
    return res.status(400).json({ message: 'simulationResult is required.' });
  }

  const lang = normalizeLanguage(language);

  // Try Gemini first
  if (isGeminiAvailable()) {
    try {
      const geminiResult = await geminiSummary(simulationResult, strategy, form, stressScenario, lang);
      if (geminiResult) {
        return res.json(geminiResult);
      }
    } catch (err) {
      console.error('Gemini summary failed, falling back:', err.message);
    }
  }

  // Fallback
  const result = generateRiskSummary(simulationResult, strategy, form, stressScenario, lang);
  if (!result) return res.status(400).json({ message: 'Could not generate summary.' });
  res.json(result);
}
