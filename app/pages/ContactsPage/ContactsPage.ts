import {Page, NavParams, NavController, Platform} from 'ionic-angular';
import {Contacts} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';
import {UserNotification} from '../../contracts/DataContracts';

import {Config} from '../../providers/config';

import {UserContactsInfo, UserDeviceInfo, UserGeoInfo} from '../../contracts/ServerContracts';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


@Page({
    templateUrl: 'build/pages/ContactsPage/ContactsPage.html'
})
export class ContactsPage {
    contacts: Contact[] = [];
    notifications: UserNotification[] = [];
    doneLabel: string = 'Done';

    constructor(public config: Config, public nav: NavController, public platform: Platform) {
    }

    loadContacts() {
        var contactsList = Contacts.find(['*']);
        contactsList.then(data => { this.contacts = data; console.log(data)});
    }

    saveAndGoBack() {
        // write settings to cloud       
        this.nav.pop();
    }
}
