import {Page, NavParams, NavController, Platform} from 'ionic-angular';
import {Contacts} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';
import {UserNotification} from '../../contracts/DataContracts';

import {Config} from '../../providers/config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


@Page({
    templateUrl: 'build/pages/ContactsPage/ContactsPage.html'
})
export class ContactsPage {
    contacts: Contact[] = [];
    notifications: UserNotification[] = [];                   
    constructor(public config: Config, public nav: NavController, public platform: Platform) {
       console.log("in contacts page");
    }    
        
    saveAndGoBack() {
       // write settings to cloud       
       this.nav.pop();
     }    
}
