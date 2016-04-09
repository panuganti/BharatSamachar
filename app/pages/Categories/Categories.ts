/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, ViewController} from 'ionic-angular';
import {Component} from 'angular2/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import {Stream} from '../../contracts/ServerContracts';
import {Config} from '../../providers/config';
import {ServiceCaller} from '../../providers/servicecaller';

@Page({
    templateUrl: 'build/pages/Categories/Categories.html'
})

export class Categories {
    streams: Stream[] = [];
    doneLabel: string = "Save";

    constructor(public config: Config, public nav: NavController,
        public view: ViewController, public service: ServiceCaller) {
        this.init();
    }

    init() {
        let userStreams = this.service.getStreams(this.config.userInfo.Id);
        userStreams.subscribe(data => { 
            Enumerable.From(data).Where(t=> t.Lang == this.config.language).ToArray(); 
        })
    }
    
    saveAndGoBack() {
        // write settings to cloud
        this.service.updateUserStreams(this.config.userInfo.Id, this.streams);
        this.config.userInfo.Streams = this.streams;
        this.view.dismiss();
    }
}
