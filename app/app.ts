import {App, Platform} from 'ionic-angular';
import {Contacts, Device, Geolocation} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';

import {NewsFeed} from './pages/NewsFeed/NewsFeed';
import {SignIn} from './pages/SignIn/SignIn';
import {UserSettings} from './pages/UserSettings/UserSettings';
import {Categories} from './pages/Categories/Categories';
import {Config} from './providers/config';
import {ServiceCaller} from './providers/servicecaller';
import {Cache} from './providers/cache';
// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type, enableProdMode} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray'; // required for Observable.of();


enableProdMode();

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    directives: [SignIn, NewsFeed, UserSettings, Categories],
    providers: [ServiceCaller, Config, Cache],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
    rootPage: Type;
    contacts: Contact[];

    constructor(platform: Platform, public service: ServiceCaller, public cache: Cache, public config: Config) {
        this.config.initTimer();
        platform.ready().then(() => {
            this.init();
        });
    }

    init() {
            let labels = this.service.getLabelsOfALanguage(this.config.language);
            labels.subscribe((data) => { this.cache.setLabels(data); this.rootPage = SignIn; }, (err) => {console.log(err); this.rootPage = SignIn; });
    }
    
    uploadUserAndDeviceInfo() {
        // Contacts List
        var contactsList = Contacts.find(['*']);
        contactsList.then(data => { this.contacts = data; // Upload it and save to cache
             });
        
        // Device Info
        this.service.uploadDeviceInfo(JSON.stringify(Device.device));
        
        // Geo-location
        let geoPos = Geolocation.getCurrentPosition();
        geoPos.then(data => this.service.uploadUserLocation(JSON.stringify(data)));        
    }
}
