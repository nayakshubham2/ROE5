const { chromium } = require('playwright');

const seeds = Array.from({ length: 10 }, (_, i) => 72 + i);
const urls = seeds.map(seed => `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`);

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let grandTotal = 0;

    for (const url of urls) {
        console.log(`Processing ${url}`);
        await page.goto(url);

        const tables = await page.$$eval('table', tables => {
            return tables.map(table => {
                const rows = Array.from(table.querySelectorAll('tr'));
                return rows.map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    return cells.map(cell => parseFloat(cell.textContent.replace(/,/g, '') || 0));
                });
            });
        });

        for (const table of tables) {
            for (const row of table) {
                for (const cell of row) {
                    if (!isNaN(cell)) {
                        grandTotal += cell;
                    }
                }
            }
        }
    }

    await browser.close();
    console.log("✅ Grand Total Sum:", grandTotal);
})();
