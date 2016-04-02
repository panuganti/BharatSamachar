/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController} from 'ionic-angular';
import {Component} from 'angular2/core';
import {Config} from '../../providers/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';


@Page({
    templateUrl: 'build/pages/Categories/Categories.html'
})

export class Categories {
    categoriesLabel: string = "Categories";
    doneLabel: string = "Done";

    constructor(public config: Config, public nav: NavController) {
        if (this.config.labels != null) {this.setLabels(this.config.labels);}
    }

    setLabels(data: Dictionary<string, string>) {
        this.categoriesLabel = data.getValue('categories');
        this.doneLabel = data.getValue('done');
      }

    saveAndGoBack() {
        // write settings to cloud
    }
}
