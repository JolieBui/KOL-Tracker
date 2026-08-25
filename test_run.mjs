import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function waitPort(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(`http://localhost:${port}`);
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
}

(async () => {
  console.log("Starting dev server...");
  const devServer = spawn('npm', ['run', 'dev', '--', '--port', '3000'], { stdio: 'pipe' });
  
  const isUp = await waitPort(3000);
  if (!isUp) {
    console.log("Dev server failed to start");
    process.exit(1);
  }
  
  console.log("Dev server is up. Launching browser...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await browser.close();
  devServer.kill();
  
  if (errors.length > 0) {
    console.log("ERRORS FOUND:");
    console.log(errors.join('\n'));
  } else {
    console.log("SUCCESS: No console errors found on load.");
  }
})();
