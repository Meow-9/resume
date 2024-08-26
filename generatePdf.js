const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const filePath = path.join(__dirname,'views' , 'test.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    fs.writeFileSync('test.pdf', pdfBuffer);

    await browser.close();
    console.log('PDF generated successfully.');
})();
