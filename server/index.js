const pdfjs = require('pdfjs-dist/es5/build/pdf')
const _ = require("lodash")

pdfjs.getDocument("../bank-statement.pdf").promise
    .then(async (doc) => {
        let page = await doc.getPage(1) // if doc has many pages use doc.numPages to iterate and pass index to doc.getPage
        let content = await page.getTextContent()
        console.log(content.items)

        return content.items
            .filter((item) => item.str.trim().length)
            .map((item) => item.str)
            .filter((item, i) => i > 7)
    })
    .then(items => {
        const records = _.chunk(items, 6)
            .reduce((records, [id, date, amount, description, reconciled, transaction_type]) => {
                records.push({ id, date, amount, description, reconciled, transaction_type })
                return records
            }, [])
        // save json or save csv or write to db
    })
    .catch(error => { console.log(error) }) // handle errors