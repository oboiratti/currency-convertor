import './assets/css/main.css'
import { MainCtrl } from './js/main-ctrl';
import { MainView } from './js/main-view';
import { Init } from './sw';

// $("#preloader-body").hide();
document.write(require("./base.html"));

var mv = new MainView()
registerServiceWorker()

function registerServiceWorker() {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.register('sw.js').then((reg) => {
        console.log("Service worker registered");
    })
}
