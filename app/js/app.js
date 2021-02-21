((pdfjs, lodash) => {
    const reader = new FileReader()
    const fileUpload = document.querySelector("#file-upload")
    const transactionsTable = document.querySelector("#transactions-table")

    fileUpload.addEventListener("change", (event) => {
        let file = event.target.files[0]

        // probably check if we've got the right file

        reader.addEventListener('load', (event) => {
            processFile(event.target.result)
                .then(async (doc) => {
                    let page = await doc.getPage(1) // if doc has many pages use doc.numPages to iterate and pass index to doc.getPage
                    let content = await page.getTextContent()

                    return content.items
                        .filter((item) => item.str.trim().length)
                        .map((item) => item.str)
                        .filter((item, i) => i > 7)
                })
                .then(items => {
                    const trs = lodash.chunk(items, 6)
                        .reduce((trs, [id, date, amount, description, reconciled, transaction_type]) => {
                            let tr = `<tr><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${id}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${amount}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${description}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${reconciled}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction_type}</td></tr>`
                            trs.push(tr)
                            return trs
                        }, [])

                    transactionsTable.querySelector('tbody').innerHTML = trs.join('')
                })
                .catch(error => { console.log(error) }) // handle errors
        })

        reader.readAsDataURL(file)
    })

    function processFile(file) {
        return pdfjs.getDocument(file).promise
    }

})(pdfjsLib, _)