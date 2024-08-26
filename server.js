const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-resume', async (req, res) => {
    try {
        const { name, email, phone, education, experience, skills } = req.body;
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Resume</title>
        </head>
        <body>
            <h1>${name}</h1>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Education: ${education}</p>
            <p>Experience: ${experience}</p>
            <p>Skills: ${skills}</p>
        </body>
        </html>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // Explicitly set content-type and content-disposition headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');

        // Send the PDF buffer as a response
        res.send(Buffer.from(pdfBuffer, 'binary'));

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
