/*
 Runs all duplicate checks and groups their outputs in one consolidated report.
 Checks:
  - CaseEventToFields duplicates
  - AuthorisationCaseField duplicates
  - AuthorisationCaseEvent duplicates
 Exits non-zero if any check fails.
*/

const { spawn } = require('child_process');
const path = require('path');

function runNodeScript(scriptPath) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [scriptPath], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => (stdout += d.toString()));
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('close', (code) => resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
}

async function main() {
  const checks = [
    {
      name: 'CaseEventToFields duplicates',
      script: path.join(__dirname, 'case-event-to-fields-duplicate-checker.js'),
    },
    {
      name: 'AuthorisationCaseField duplicates',
      script: path.join(__dirname, 'auth-casefield-duplicate-checker.js'),
    },
    {
      name: 'AuthorisationCaseEvent duplicates',
      script: path.join(__dirname, 'auth-caseevent-duplicate-checker.js'),
    },
  ];

  console.log('Duplicate checks summary');
  console.log('========================');

  let hasFailures = false;

  for (const { name, script } of checks) {
    const result = await runNodeScript(script);
    const passed = result.code === 0;
    if (!passed) hasFailures = true;

    console.log(`\n- ${name}: ${passed ? 'OK' : 'FAIL'}`);
    if (passed) {
      console.log('  No duplicates found.');
    } else {
      const output = (result.stdout || result.stderr || '').trim();
      if (output) {
        console.log(output);
      } else {
        console.log('  Duplicate check failed with no output.');
      }
    }
  }

  console.log('\n========================');
  console.log(hasFailures ? 'Duplicate checks: FAILED' : 'Duplicate checks: PASSED');
  process.exit(hasFailures ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


