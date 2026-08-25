import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

(async () => {
  const devServer = spawn('npm', ['run', 'dev', '--', '--port', '3000'], { stdio: 'pipe' });
  await new Promise(r => setTimeout(r, 2000));
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:\n' + err.stack);
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await browser.close();
  devServer.kill();
})();
