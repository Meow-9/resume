const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
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

            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
            res.send(Buffer.from(pdfBuffer, 'binary'));
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
