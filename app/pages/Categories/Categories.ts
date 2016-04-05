/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, ViewController} from 'ionic-angular';
import {Component} from 'angular2/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import {Stream} from '../../contracts/DataContracts';
import {Config} from '../../providers/config';
import {ServiceCaller} from '../../providers/servicecaller';

@Page({
    templateUrl: 'build/pages/Categories/Categories.html'
})

export class Categories {
    streams: Stream[] = [];
    sectionStreams: Dictionary<string, Stream[]> = new Dictionary<string, Stream[]>();
    doneLabel: string = "Save";

    constructor(public config: Config, public nav: NavController,
        public view: ViewController, public service: ServiceCaller) {
        this.init();
    }

    init() {
        let userStreams = this.service.getStreams(this.config.userInfo.Id);
        userStreams.subscribe(data => { this.streams = data; this.buildSectionStreams(data)})
    }
    
    buildSectionStreams(streams: Stream[]){
       let sectionStreams = new Dictionary<string, Stream[]>();
           
    }    

    saveAndGoBack() {
        // write settings to cloud
        this.view.dismiss();
    }
}
