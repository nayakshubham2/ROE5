import asyncio
from playwright.async_api import async_playwright

seeds = list(range(72, 82))
urls = [f"https://sanand0.github.io/tdsdata/js_table/?seed={seed}" for seed in seeds]

async def scrape():
    total_sum = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        for url in urls:
            print(f"Visiting {url}")
            await page.goto(url)
            tables = await page.query_selector_all("table")

            for table in tables:
                rows = await table.query_selector_all("tr")
                for row in rows:
                    cells = await row.query_selector_all("td")
                    for cell in cells:
                        text = (await cell.inner_text()).replace(",", "").strip()
                        try:
                            number = float(text)
                            total_sum += number
                        except ValueError:
                            continue

        await browser.close()

    print(f"✅ Grand Total Sum: {total_sum}")

if __name__ == "__main__":
    asyncio.run(scrape())
