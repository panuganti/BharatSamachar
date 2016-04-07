/// <reference path="../../../typings/tsd.d.ts" />

import {Page, NavParams, NavController, Platform} from 'ionic-angular';
import {Http, Headers, Response} from 'angular2/http';

import {Contacts, SMS} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';
import {UserNotification} from '../../contracts/DataContracts';

import {Config} from '../../providers/config';
import {ServiceCaller} from '../../providers/servicecaller';

import {UserContactsInfo, UserDeviceInfo, UserGeoInfo, UserContact} from '../../contracts/ServerContracts';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


@Page({
    templateUrl: 'build/pages/ContactsPage/ContactsPage.html'
})
export class ContactsPage {
    contacts: Contact[] = [];
    notifications: UserNotification[] = [];
    doneLabel: string = 'Done';
    contactsJsonFile: string = 'resources/contacts.json';
    userContacts: UserContact[] = [];

    defaultInviteLabel: string = 'Please send me an Invite!';
    defaultGreetingLabel: string = 'Hey there! Great to see you here';
    defaultSMSMessage: string = 'Hey, Check out this app';

    constructor(public config: Config, public service: ServiceCaller, public nav: NavController, public platform: Platform, public http: Http) {
        this.loadContactsFromFile();
    }

    // TODO: Delete .. Fetch from local store or remote
    loadContactsFromFile() {
        this.http.get(this.contactsJsonFile).map(res => res.json())
        .subscribe(data => this.filterContacts(data));
    }

    fetchContacts(userId: string) {
        let contacts = this.service.fetchContacts(userId);
        contacts.subscribe(data => this.filterContacts(data));
    }

    filterContacts(data: UserContact[]) {
        this.userContacts = Enumerable.From(data).OrderBy(elem => elem.Name).ToArray();
    }

    loadContacts() {
        var contactsList = Contacts.find(['*']);
        contactsList.then(data => { this.contacts = data; });
    }

    saveAndGoBack() {
        // write settings to cloud       
        this.nav.pop();
    }

    //#region Friend Functions
    inivte(contact: UserContact) {
        if (contact.Phone.length > 0) {
            this.inviteBySMS(contact);
        }
        else {
            console.log("send email");
         }
    }

    unFollow(contact: UserContact) {
        this.service.unFollow(contact).subscribe(data => { console.log(data);});
    }

    inviteBySMS(contact: UserContact) {
        SMS.send(contact.Phone, "Hey, Check out this ")
    }

    inviteByMail(contact: UserContact) {
        console.log("Invite by email"); // TODO: Use Native email
    }

    deleteContact(contact: UserContact) {
        this.service.deleteContact(contact).subscribe(data => {console.log(data);});
    }
    //#endregion Friend Functions
}
