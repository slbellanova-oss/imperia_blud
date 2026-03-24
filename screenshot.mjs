import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const isMobile = process.argv[4] === 'mobile';
const mobileWidth = 375;
const mobileHeight = 812;

const screenshotsDir = './temporary screenshots';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

const files = fs.readdirSync(screenshotsDir);
const maxNum = files.reduce((max, f) => {
    const match = f.match(/^screenshot-(\d+)/);
    if (match) return Math.max(max, parseInt(match[1]));
    return max;
}, 0);

const num = maxNum + 1;
const filename = label 
    ? `screenshot-${num}-${label}.png`
    : `screenshot-${num}.png`;

const filepath = path.join(screenshotsDir, filename);

(async () => {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    if (isMobile) {
        await page.setViewport({ width: mobileWidth, height: mobileHeight, isMobile: true });
    } else {
        await page.setViewport({ width: 1280, height: 800 });
    }
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    await page.screenshot({ path: filepath, fullPage: false });
    
    await browser.close();
    console.log(`Screenshot saved to ${filepath}`);
})();
