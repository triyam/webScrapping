// Define a constant for the maximum number of pages to scrape
const MAX_PAGES = 2;

// Convert JSON data to a CSV format
const jsonToCsv = (jsonData) => {
    const keys = Object.keys(jsonData[0]);
    const csvRows = [];
    csvRows.push(keys.join(","));
    for (const row of jsonData) {
        const values = keys.map((k) => row[k]);
        csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
};

// Function to download a CSV file
const downloadCsv = function (data) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    a.click();
}

// Function to introduce a delay using Promises
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract data from a given node on a web page
const getData = async (node) => {
    // Extract various pieces of information from the HTML elements in the 'node'
    // and store them in an object
    const companyName = node?.querySelector('.company_info')?.innerText;
    const rating = node?.querySelector('.rating.sg-rating__number')?.innerText;
    // ... Other data extraction logic ...
    const innnerNode = node?.querySelector('.module-list')?.querySelectorAll('.list-item.custom_popover')
    const minProjectSize = innnerNode?.[0].innerText
    const averageHourlyRate = innnerNode?.[1].innerText
    const employees = innnerNode?.[2].innerText
    const location = innnerNode?.[3].innerText
    const serviceFocus = node?.querySelector('.col-lg-6.provider-info__chart-data')?.querySelector('.chart-label.hidden-xs')?.innerText?.replaceAll('\n', ' ')
    const tagline = node?.querySelector('.company_info__wrap.tagline')?.innerText
    const websiteUrl = node?.querySelector('.website-link__item')?.href?.split('?')[0]


    const obj = {
        companyName: JSON.stringify(companyName),
        rating: JSON.stringify(rating),
        // ... Other properties ...
        minProjectSize: JSON.stringify(minProjectSize),
        averageHourlyRate: JSON.stringify(averageHourlyRate),
        employees: JSON.stringify(employees),
        location: JSON.stringify(location),
        serviceFocus: JSON.stringify(serviceFocus),
        tagline: JSON.stringify(tagline),
        websiteUrl: JSON.stringify(websiteUrl),
    };

    return obj;
}

// Scrape data from web pages
const scrapperData = async () => {
    let data = [];

    // Loop through a predefined number of pages
    for (let page = 0; page < MAX_PAGES; page++) {
        // Select all the nodes that represent providers on the page
        let nodes = document.querySelector('.directory-list').querySelectorAll('.provider.provider-row');

        for (let i = 0; i < nodes.length; i++) {
            console.log(`Fetching product ${(i + 1)} at page ${page + 1}`);
            // Extract data from the current node and push it into the 'data' array
            getData(nodes[i]).then((res) => {
                data.push(res);
            });
        }

        // Go to the next page and introduce a delay before continuing
        const nextPage = document.querySelector('.pagination.justify-content-center').querySelector('.page-item.next').querySelector('.page-link').click()
        await delay(1500);
    }

    // Introduce a longer delay before completing the scraping
    await delay(3000);

    return data;
}

// Start the scraping process and download the resulting data as a CSV
scrapperData().then((results) => {
    console.log(`Scraping Completed! Downloading CSV...`);
    const csv = jsonToCsv(results);
    downloadCsv(csv);
})
