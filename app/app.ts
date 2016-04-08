import {App, Platform} from 'ionic-angular';

import {NewsFeed} from './pages/NewsFeed/NewsFeed';
import {SignIn} from './pages/SignIn/SignIn';
import {UserSettings} from './pages/UserSettings/UserSettings';
import {Categories} from './pages/Categories/Categories';
import {Config} from './providers/config';
import {ServiceCaller} from './providers/servicecaller';
import {Notifications} from './providers/notifications';
import {Cache} from './providers/cache';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type, enableProdMode} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray'; // required for Observable.of();


enableProdMode();

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    directives: [SignIn, NewsFeed, UserSettings, Categories],
    providers: [ServiceCaller, Config, Cache, Notifications],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
    rootPage: Type;

    constructor(platform: Platform, public service: ServiceCaller, public cache: Cache, public config: Config, public notifications: Notifications) {
        this.config.initTimer();
        platform.ready().then(() => {
            this.init();
        });
    }

    init() {
        let labels = this.service.getLabelsOfALanguage(this.config.language);
        labels.subscribe((data) => { this.cache.setLabels(data); this.rootPage = SignIn; }, (err) => { console.log(err); this.rootPage = SignIn; });
        // Check if user is logged in, set root page to NewsFeed
    }

}
