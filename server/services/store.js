import crypto from 'node:crypto';

// No database. Simulation history lives in memory for the life of the
// server process only — on Vercel that means it can reset between cold
// starts, which is expected for a database-free demo backend.
const simulations = [];

export function createSimulation(data) {
  const item = { _id: crypto.randomUUID(), ...data, createdAt: new Date() };
  simulations.unshift(item);
  return item;
}

export function findSimulationsBySession(sessionId) {
  return simulations.filter(s => s.sessionId === sessionId).slice(0, 20);
}
