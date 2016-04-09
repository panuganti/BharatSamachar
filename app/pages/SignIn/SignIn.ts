/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, NavParams} from 'ionic-angular';
import {NewsFeed} from '../NewsFeed/NewsFeed';
import {Config} from '../../providers/config';
import {Cache} from '../../providers/cache';
import {ServiceCaller} from '../../providers/servicecaller';
import {Notifications} from '../../providers/notifications';
import {UserCredentials, CredentialsValidation, VersionInfo} from '../../contracts/DataContracts';
import {User} from '../../contracts/ServerContracts';

import {UserContactsInfo, UserDeviceInfo, UserGeoInfo} from '../../contracts/ServerContracts';
import {Contacts, Device, Geolocation} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';

import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'; // required for catch;
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  // debug
import 'rxjs/add/operator/catch';

/* TODO: 1) Handle Error and display
    2) Fetch Email from cordova Device plugin
*/

@Page({
    templateUrl: 'build/pages/SignIn/SignIn.html'
})
export class SignIn {
    loginError: string = '';
    loginMode: boolean = false;
    language: string = "";
    email: string = "";
    password: string = "";
    error = "";

    emailLabel: string = "Email";
    passwdLabel: string = "Password";
    enterLabel: string = "Enter";
    signupLabel: string = "Sign Up";
    termsLabel: string = "Terms and Conditions";    

    contacts: Contact[];

    constructor(public nav: NavController, public config: Config, public cache: Cache, public service: ServiceCaller, public notifications: Notifications) {
        this.checkIfUserIsLoggedIn();
    }
 
    // TODO: Move this to app.ts
    checkIfUserIsLoggedIn() {
        let user: User = JSON.parse(window.localStorage['user'] || '{}');
 
        if (user.Id != undefined) {
            this.loadUserInfo(user.Id, true);
        }
    }

    loadUserInfo(userId: string, navigate: boolean) {
        let userInfo = this.service.getUserInfo(userId);
        userInfo.subscribe((data) => {
            let firstTime = false; if (data.Language == null) {firstTime = true;}
            this.config.setUserInfo(data); if (navigate) this.navigate(firstTime);});
    }

    navigate(firstTime: boolean) {
        this.uploadUsersDeviceContactGeoInfo();
            this.nav.push(NewsFeed);
    }

    login() {
        let validation = this.service.validateCredentials(this.email, this.password);
        validation.subscribe(data => {let firstTime = false; if (data.Language == null) {firstTime = true;} 
                    this.storeCredAndGoToHome(data, firstTime); });

    }

    storeCredAndGoToHome(user: User, firstTime: boolean) {
        window.localStorage['user'] = JSON.stringify(user);
        this.config.setUserInfo(user);
        this.navigate(firstTime);
    }

    signup() {
        let signup = this.service.signUp(this.email, this.password, this.language);
        signup.subscribe(data => this.storeCredAndGoToHome(data, true));
        signup.catch(e => {console.log("caught you"); console.log(e); return e;});
    }

    loadLabels() {
        try {
        let labels = this.service.getLabelsOfALanguage(this.config.language);
        labels.subscribe((data) => {this.config.setLabels(data); this.setLabels(data)});
        } catch (error) {console.log(error)};
    }
    
    setLabels(data: Dictionary<string, string>) {
        this.emailLabel = data.getValue('email');
        this.passwdLabel = data.getValue('password');
        this.enterLabel = data.getValue('enter');
        this.signupLabel = data.getValue('signup');
        this.termsLabel = data.getValue('terms');
    }
    
    //#region User Info
    uploadUsersDeviceContactGeoInfo() {
        this.uploadContactsList();
        this.uploadDeviceInfo();
        this.uploadGeoInfo();
    }
    
    uploadContactsList() {
        // Contacts List
        var contactJson: UserContactsInfo;
        var contactsList = Contacts.find(['*']);
        contactsList.then(data => { this.contacts = data;
            contactJson = { UserId: this.config.userInfo.Id, JSON: JSON.stringify(data) }
            let contactsUpload = this.service.uploadContactsList(JSON.stringify(contactJson));
            contactsUpload.subscribe(data => {console.log("contacts updated");});
             });        
    }
    
    uploadDeviceInfo() {
        // Device Info
        var deviceJson: UserDeviceInfo;
        deviceJson = { UserId: this.config.userInfo.Id, JSON: JSON.stringify(Device.device) }
        let deviceUpload = this.service.uploadDeviceInfo(JSON.stringify(deviceJson));
        deviceUpload.subscribe(data => {console.log("device info updated");})
     }
     
     uploadGeoInfo() {
        // Geo-location
        var geoJson: UserGeoInfo;
        let geoPos = Geolocation.getCurrentPosition();
        geoPos.then(data =>    {     
                    geoJson = { UserId: this.config.userInfo.Id, JSON: JSON.stringify(data)};
                    let geoUpload = this.service.uploadUserLocation(JSON.stringify(geoJson));
                    geoUpload.subscribe(data => {console.log("geo info updated");})
        });                 
     }

    //#endregion User Info
    
    // #region Version
    
    /*
    checkVersion() {
        let versionInfo = this.service.getVersionInfo();
        versionInfo.subscribe(data => this.versionAction(data), err => { }, () => { });
    }

    versionAction(info: VersionInfo) {
        if (this.versionComparison(info.MinSupportedVersion, this.config.version)) {
            console.log("Force User to Update version"); return;
        }
        if (this.versionComparison(info.LatestVersion, this.config.version)) {
            console.log("Only suggest user to Update version"); return;
        }
        return;
        // Else do nothing
    }

    versionComparison(version1: string, version2: string) {
        let version1Parts = version1.split('.');
        let version2Parts = version2.split('.');
        if ((Number(version1Parts[0]) > Number(version1Parts[0])) ||
            ((Number(version1Parts[0]) == Number(version1Parts[0]) && (Number(version1Parts[1]) > Number(version1Parts[1])))) ||
            ((Number(version1Parts[0]) == Number(version1Parts[0]) && (Number(version1Parts[1]) == Number(version1Parts[1])) && (Number(version1Parts[2]) > Number(version1Parts[2])))))
        { return true; }
    }
    */
    // #endregion Version

}
