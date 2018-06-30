import { MainCtrl } from "./main-ctrl";

export class MainView {
    constructor() {
        this.fetchCurrencies()
        this.doClick()
    }

    fetchCurrencies() {
        const mainCtrl = new MainCtrl()

        this.loadCachedCurrencies(mainCtrl).then(() => {
            mainCtrl.getCurrencies().then(data => {
                this.saveCurrenciesToDB(mainCtrl, data)
            })
        })
    }

    loadCurrencies(data, id) {
        const fromSelect = document.getElementById(id)
        const fragment = document.createDocumentFragment();
        Object.keys(data).forEach(element => {
            const option = document.createElement('option')
            option.innerHTML = data[element].currencyName
            option.value = data[element].id
            fragment.appendChild(option)
        });
        fromSelect.appendChild(fragment)
    }

    saveCurrenciesToDB(mainCtrl, data) {
        const dbPromise = mainCtrl.openDB()
        dbPromise.then(db => {
            if (!db) return

            const tx = db.transaction('currency', 'readwrite');
            const store = tx.objectStore('currency');
            const c = data.results
            Object.keys(c).forEach(element => {
                store.put({ id: c[element].id, currencyName: c[element].currencyName })
            });
        })
    }

    loadCachedCurrencies(mainCtrl) {
        const dbPromise = mainCtrl.openDB()
        return dbPromise.then(db => {
            if (!db) return

            const tx = db.transaction('currency', 'readwrite');
            const index = tx.objectStore('currency').index('currencyName');
            return index.getAll().then(data => {
                this.loadCurrencies(data, 'fromCurrency')
                this.loadCurrencies(data, 'toCurrency')
            })
        })
    }

    submitForm() {
        const fromAmount = document.getElementById('fromAmount').value
        const fromCurrency = document.getElementById('fromCurrency').value
        const toCurrency = document.getElementById('toCurrency').value
        const result = document.getElementById('toAmount')
        const query = `${fromCurrency}_${toCurrency}`

        this.getCachedQuery(query).then(res => {
            result.value = 0
            if (res) {
                this.computeResult(res.val, +fromAmount, result)
                return;
            }

            fetch(`/api/v5/convert?q=${query}`).then(res => {
                res.json().then(data => {
                    this.computeResult(data.results[query].val, +fromAmount, result)
                    this.saveQueries(data, query)
                })
            })
        })

        document.getElementById('convertForm').submit()
    }

    doClick() {
        const btn = document.getElementById('convert')
        btn.addEventListener("click", () => {
            this.submitForm()
        })
    }

    saveQueries(data, query) {
        const main = new MainCtrl()
        main.openDB().then(db => {
            if (!db) return

            const tx = db.transaction('conversion', 'readwrite');
            const store = tx.objectStore('conversion');
            const res = data.results[query]
            store.put({ id: res.id, fr: res.fr, to: res.to, val: res.val })
        })
    }

    getCachedQuery(query) {
        const main = new MainCtrl()
        return main.openDB().then(function (db) {
            if (!db) return

            var tx = db.transaction('conversion');
            var store = tx.objectStore('conversion');
            return store.get(query);
        })
    }

    computeResult(rate, amount, element) {
        const total = rate * amount
        element.value = total
    }
}