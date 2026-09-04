import express from 'express';
import aiRoutes from '../server/routes/ai.js';
import learningRoutes from '../server/routes/learning.js';
import simulationRoutes from '../server/routes/simulations.js';

async function testExpressRoutes() {
  console.log('--- Testing Express API mounting & request handling ---');
  const app = express();
  app.use(express.json());
  app.use('/api/ai', aiRoutes);
  app.use('/api/learning', learningRoutes);
  app.use('/api/simulations', simulationRoutes);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  console.log(`Test server running on port ${port}`);

  try {
    // 1. Test /learning
    const learnRes = await fetch(`${baseUrl}/learning`).then(r => r.json());
    console.log(`✓ /api/learning returned ${learnRes.lessons?.length} lessons`);
    if (!learnRes.lessons[0].title.fr || !learnRes.lessons[0].title.ur) {
      throw new Error('Missing multilingual titles in /api/learning response');
    }

    const mockResult = {
      totalInvested: 300000,
      probabilityOfLoss: 22.4,
      probabilityOfProfit: 77.6,
      medianOutcome: 420000,
      percentile5: 210000,
      percentile95: 780000,
      maxDrawdown: 32.5
    };
    const mockForm = { initialInvestment: 100000, monthlyInvestment: 5000, durationYears: 5 };

    // 2. Test /ai/summary in Tamil
    const sumTa = await fetch(`${baseUrl}/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulationResult: mockResult, strategy: 'sip', form: mockForm, language: 'ta' })
    }).then(r => r.json());
    console.log(`✓ /api/ai/summary [ta] explanation: ${sumTa.explanation.slice(0, 45)}...`);

    // 3. Test /ai/interpret in Hindi
    const intHi = await fetch(`${baseUrl}/ai/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulationResult: mockResult, strategy: 'sip', form: mockForm, language: 'hi' })
    }).then(r => r.json());
    console.log(`✓ /api/ai/interpret [hi] biggestRisk: ${intHi.biggestRisk.slice(0, 45)}...`);

    // 4. Test /ai/chat in Urdu
    const chatUr = await fetch(`${baseUrl}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'explain this in simple words', context: { result: mockResult, form: mockForm, strategy: 'sip' }, language: 'ur' })
    }).then(r => r.json());
    console.log(`✓ /api/ai/chat [ur] response: ${chatUr.response.slice(0, 45)}...`);

    // 5. Test /simulations/compare
    const compRes = await fetch(`${baseUrl}/simulations/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initialInvestment: 50000, monthlyInvestment: 5000, durationYears: 5, leverage: 2 })
    }).then(r => r.json());
    console.log(`✓ /api/simulations/compare returned SIP loss prob: ${compRes.sip?.probabilityOfLoss}%, F&O loss prob: ${compRes.fno?.probabilityOfLoss}%`);

    console.log('✓ All API routes responding perfectly in multilingual mode!');
  } finally {
    server.close();
  }
}

testExpressRoutes().catch(err => {
  console.error('API test failed:', err);
  process.exit(1);
});
