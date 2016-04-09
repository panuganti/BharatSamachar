/// <reference path="../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Injectable} from 'angular2/core';
import {User, Stream} from '../contracts/ServerContracts';
import {ServiceCaller} from './servicecaller';


@Injectable()
export class Config {    
    version = "0.0.1";
    
    //#region global variables
    state: string = 'Active';
    userInfo: User;
    globalTimer: number;
    labels: Dictionary<string, string> = new Dictionary<string, string>();
    language: string = 'Hindi';
    //#endregion global variables
        
    constructor(public service: ServiceCaller) {
        this.setInitialLabels();
    }   
    
    setStateToActive() {
        this.state = 'Active';
    }
    
    setStateToBackground() {
        this.state = 'Background';        
    }
    
    isActive() : boolean { return this.state == 'Active';}
    
    initTimer() {
        this.globalTimer = new Date().getTime();
        console.log("timer started");
    }

    getTimeElapsed() : number {
        return new Date().getTime() - this.globalTimer;
    }
    
    printTimeElapsed() {
        console.log("Time: " + (new Date().getTime() - this.globalTimer) + "ms");
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