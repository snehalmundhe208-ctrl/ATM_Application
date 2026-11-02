import React, { useState } from 'react';
import {
  Beaker,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Download,
  Printer,
  X,
  Clock,
  Shield,
  Layers,
  FileCheck,
} from 'lucide-react';
import { api } from '../services/api';

export default function SetTestingModal({ isOpen, onClose }) {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PASSED' | 'FAILED'
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    try {
      const response = await api.runSetTests();
      if (response.success && response.data) {
        setTestResults(response.data);
      } else {
        setErrorMsg('Failed to run test suite: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error executing automated test suite');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportJson = () => {
    if (!testResults) return;
    const blob = new Blob([JSON.stringify(testResults, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SET-ATM-TestSuite-Report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCases = testResults?.testCases
    ? testResults.testCases.filter((tc) => {
        if (filter === 'PASSED') return tc.status === 'PASSED';
        if (filter === 'FAILED') return tc.status === 'FAILED';
        return true;
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[92vh] bg-white rounded-[24px] border border-black/[0.06] shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FAF5EE] via-[#FFF8F0] to-[#FAF5EE] border-b border-[#E8DDD2] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E88745] to-[#CF6F2E] flex items-center justify-center text-white shadow-md shadow-[#E88745]/20">
              <Beaker className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-[#292929] tracking-tight">
                  Software Engineering & Testing (SET) Panel
                </h2>
                <span className="bg-[#E88745] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Academic Project
                </span>
              </div>
              <p className="text-xs text-[#737373]">
                Automated Test Verification & Validation Harness • Isolated Test Sandbox
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Controls & Overview Banner */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DDD2] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunAllTests}
              className="flex items-center space-x-2 bg-[#E88745] hover:bg-[#D9732F] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-[#E88745]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Executing Test Cases...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Complete Test Suite (14 TC)</span>
                </>
              )}
            </button>

            {testResults && (
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center space-x-1.5 bg-[#FFF8F0] hover:bg-[#FBECE3] border border-[#E8DDD2] text-[#CF6F2E] font-semibold px-3.5 py-2.5 rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Report</span>
              </button>
            )}
          </div>

          {/* Test Case Filters */}
          {testResults && (
            <div className="flex items-center space-x-1 bg-[#FAF5EE] p-1 rounded-xl border border-[#E8DDD2] text-xs">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filter === 'ALL' ? 'bg-white text-[#292929] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All ({testResults.summary.total})
              </button>
              <button
                type="button"
                onClick={() => setFilter('PASSED')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  filter === 'PASSED' ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                Passed ({testResults.summary.passed})
              </button>
              {testResults.summary.failed > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter('FAILED')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    filter === 'FAILED' ? 'bg-red-100 text-red-800 shadow-sm' : 'text-red-700 hover:text-red-900'
                  }`}
                >
                  Failed ({testResults.summary.failed})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Summary Metrics Cards */}
        {testResults && (
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF5EE]/70 border-b border-[#E8DDD2]">
            <div className="p-3 bg-white rounded-2xl border border-[#E8DDD2] shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-500">Total Test Cases</p>
              <p className="text-xl font-extrabold text-[#292929] mt-0.5">{testResults.summary.total}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-emerald-700">Passed Tests</p>
              <p className="text-xl font-extrabold text-emerald-800 mt-0.5">{testResults.summary.passed}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-blue-700">Pass Rate</p>
              <p className="text-xl font-extrabold text-blue-800 mt-0.5">{testResults.summary.passRate}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-amber-700">Execution Time</p>
              <p className="text-xl font-extrabold text-amber-900 mt-0.5 font-mono">
                {testResults.summary.executionTimeMs} ms
              </p>
            </div>
          </div>
        )}

        {/* Main Content Area: Test Cases Table or Initial State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!testResults && !isRunning && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#FAF5EE]/50 rounded-2xl border-2 border-dashed border-[#E8DDD2]">
              <div className="w-14 h-14 rounded-full bg-[#FFF8F0] border border-[#E88745]/30 flex items-center justify-center text-[#E88745] mb-3">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#292929]">SET Academic Test Suite Ready</h3>
              <p className="text-xs text-gray-500 max-w-md mt-1 mb-4 leading-relaxed">
                Click <strong>"Run Complete Test Suite"</strong> above to execute all 14 mandatory Software Engineering & Testing verification scenarios against the backend API and database.
              </p>
              <div className="text-[11px] text-[#737373] bg-white px-3 py-1.5 rounded-lg border border-[#E8DDD2]">
                🛡️ Note: Tests use an isolated sandbox account (`9999888877776666`). Bill Gates' demo balance (₹25,000) is never affected.
              </div>
            </div>
          )}

          {isRunning && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 border-4 border-[#E88745] border-t-transparent rounded-full animate-spin mb-4" />
              <h4 className="text-base font-bold text-[#292929]">Running Automated SET Test Runner...</h4>
              <p className="text-xs text-gray-500 mt-1">
                Executing PIN authentication, transaction bounds, database rollbacks, and mathematical balance verification...
              </p>
            </div>
          )}

          {testResults && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF5EE] border-b border-[#E8DDD2] text-gray-600 font-bold">
                      <th className="py-2.5 px-3 rounded-l-lg">ID</th>
                      <th className="py-2.5 px-3">Test Scenario</th>
                      <th className="py-2.5 px-3">Test Input</th>
                      <th className="py-2.5 px-3">Expected Result</th>
                      <th className="py-2.5 px-3">Actual Result</th>
                      <th className="py-2.5 px-3 text-center rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {filteredCases.map((tc) => (
                      <tr key={tc.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#CF6F2E] whitespace-nowrap">
                          {tc.id}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#292929] max-w-[200px]">
                          {tc.scenario}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-600 max-w-[160px] truncate" title={tc.input}>
                          {tc.input}
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-[200px] leading-relaxed">
                          {tc.expectedResult}
                        </td>
                        <td className="py-3 px-3 text-gray-800 font-medium max-w-[200px] leading-relaxed">
                          {tc.actualResult}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {tc.status === 'PASSED' ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>PASS</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>FAIL</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF5EE] border-t border-[#E8DDD2] flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#E88745]" />
            <span>Academic Project Specification: 14 Requirements Covered</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 border border-gray-300 font-semibold px-4 py-2 rounded-xl text-gray-700 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
