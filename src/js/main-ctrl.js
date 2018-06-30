import idb from 'idb'

export class MainCtrl {

    constructor() { }

    getCurrencies() {
        return fetch('/api/v5/currencies').then(res => {
            if (res.status !== 200) {
                return;
            }

            return res.json()
        })
    }

    openDB() {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }

        return idb.open('ccdb', 2, function (upgradeDb) {
            switch (upgradeDb.oldVersion) {
                case 0:
                    var currencyStore = upgradeDb.createObjectStore('currency', {
                        keyPath: 'id'
                    });
                    currencyStore.createIndex('currencyName', 'currencyName');
                case 1:
                    upgradeDb.createObjectStore('conversion', { keyPath: 'id' });
            }
        });
    }
}