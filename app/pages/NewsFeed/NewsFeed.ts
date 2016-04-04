/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, NavParams, Modal} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromArray'; // required for Observable.of();

import {PublishedPost} from '../../contracts/ServerContracts';
import {UserSettings} from '../UserSettings/UserSettings';
import {ContactsPage} from '../ContactsPage/ContactsPage';
import {Notifications} from '../Notifications/Notifications';
import {FullArticle} from '../FullArticle/FullArticle';
import {PostPage} from '../PostPage/PostPage';

import {Categories} from '../Categories/Categories';
import {Config} from '../../providers/config';
import {ServiceCaller} from '../../providers/servicecaller';



@Page({
    templateUrl: 'build/pages/NewsFeed/NewsFeed.html'
})

export class NewsFeed {
    articles: PublishedPost[] = [];
    homeBadgeNumber: number = 0;
    notificationBadgeNumber: number = 0;
    backgroundImageUrl: string = "url(\"resources/background.jpg\")";
    public swiper: any;

    options: any = {
        direction: "vertical",
        keyboardControl: true,
        mousewheelControl: true,
        onlyExternal: false,
        onInit: (slides: any) => {this.swiper = slides; this.refresh(); }
    };

    constructor(public http: Http, public nav: NavController, public navParams: NavParams, 
                                        public config: Config, public service: ServiceCaller) {
    }

    onPageWillEnter() {
        this.refresh();
    }

    createNewPost() {
        this.nav.push(PostPage);
    }
    
    refresh() {
        this.swiper.slideTo(0,100,true); // Note: see api
        this.fetchArticles(this.config.userInfo.Streams);
    }

    fetchArticles(streams: string[]) {
        this.service.getNewsFeed(streams, 0)
            .subscribe(articles => this.update(articles));
    }

    moreDataCanBeLoaded() {
        //return true;
    }

    loadMore($event: any) {
        console.log("infile scroll to load more triggered");
    }

    update(art: PublishedPost[]) {
        this.articles = art.slice();
    }

    //#region User Reaction
    addLike(article: PublishedPost) {
        var likes = this.service.sendUserReaction(article.Id, this.config.userInfo.Id, 'Like');
        likes.subscribe(data => article.LikedBy);
    }

    removeLike(id: string) {
        this.service.sendUserReaction(id, this.config.userInfo.Id, 'UnLike');
    }

    reTweet(id: string) {
        this.service.sendUserReaction(id, this.config.userInfo.Id, 'ReTweet');
    }

    undoReTweet(id: string) {
        this.service.sendUserReaction(id, this.config.userInfo.Id, 'UnReTweet');
    }    
    //#endregion User Reaction

    //#region Modals 
    showContacts() {
        console.log("show contacts");
        this.nav.push(ContactsPage);
    }


    openFullArticle(event: any, source: string) {
        var params = { src: source };
        let fullArticleModal = Modal.create(FullArticle, params);
        this.nav.present(fullArticleModal);
    }

    openCategorySettings() {
        let settingsModal = Modal.create(Categories);
        settingsModal.onDismiss(settings => { this.refresh(); })
        this.nav.present(settingsModal);
    }

    openUserSettings() {
        let settingsModal = Modal.create(UserSettings);
        settingsModal.onDismiss(settings => { this.refresh(); })
        this.nav.present(settingsModal);
    }

    openNotifications() {
        let notificationsModal = Modal.create(Notifications);
        this.nav.present(notificationsModal);
    }
    //#endregion Modals 
}
