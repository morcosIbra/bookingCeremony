const fs = require('fs');
const puppeteer = require('puppeteer');

const printPdf = async (file) => {
    const browser = await puppeteer.launch({ headless: true }); const page = await browser.newPage();
    await page.setContent(file)
    const pdf = await page.pdf({
        format: 'A4',
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        },
        printBackground: true
    });
    await browser.close();
    return pdf;
};
export default printPdf