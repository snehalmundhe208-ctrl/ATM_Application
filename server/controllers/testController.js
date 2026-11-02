import { runAllSetTests } from '../services/testRunner.js';

export const runTests = async (req, res) => {
  try {
    const report = await runAllSetTests();
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('SET Test Suite Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute automated test runner.',
      details: error.message,
    });
  }
};
