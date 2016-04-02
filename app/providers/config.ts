/// <reference path="../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Injectable} from 'angular2/core';
import {Stream} from '../contracts/DataContracts';
import {User} from '../contracts/ServerContracts';
import {ServiceCaller} from './servicecaller';


@Injectable()
export class Config {    
    version = "0.0.1";
    
    //#region global variables
    userInfo: User;
    globalTimer: number;
    labels: Dictionary<string, string> = new Dictionary<string, string>();
    language: string = 'Hindi';
    //#endregion global variables
        
    constructor(public service: ServiceCaller) {
        this.setInitialLabels();
    }   
    
    initTimer() {
        this.globalTimer = new Date().getTime();
    }

    setUserInfo(user: User) {
        this.userInfo = user;
        this.language = user.Language;
    }    
    
    setLabels(labels: Dictionary<string, string>) {
        this.labels = labels;
    }
        
    setInitialLabels() {
        this.labels = new Dictionary<string, string>();
        this.labels.setValue('Email', 'Email');
        this.labels.setValue('Password', 'Password');
        this.labels.setValue('Login','Login');
        this.labels.setValue('SignUp', 'SignUp');
    }
}