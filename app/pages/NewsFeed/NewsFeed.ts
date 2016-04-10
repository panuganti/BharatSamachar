/// <reference path="../../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Page, NavController, NavParams, Modal, Platform} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
//import {SocialSharing} from 'ionic-native';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromArray'; // required for Observable.of();

import {PublishedPost, Stream} from '../../contracts/ServerContracts';
import {UserSettings} from '../UserSettings/UserSettings';
import {ContactsPage} from '../ContactsPage/ContactsPage';
//import {Notifications} from '../Notifications/Notifications';
import {FullArticle} from '../FullArticle/FullArticle';
import {PostPage} from '../PostPage/PostPage';
import {SignIn} from '../SignIn/SignIn';

import {Categories} from '../Categories/Categories';
import {Config} from '../../providers/config';
import {ServiceCaller} from '../../providers/servicecaller';
import {Notifications} from '../../providers/notifications';


@Page({
    templateUrl: 'build/pages/NewsFeed/NewsFeed.html'
})

export class NewsFeed {
    userId: string = '';
    skip: number = 0;
    newsFeedError: string = '';
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
        onInit: (slides: any) => { this.swiper = slides; this.refresh(); }
    };

    constructor(public http: Http, public platform: Platform, public nav: NavController, public navParams: NavParams,
            public config: Config, public service: ServiceCaller, public notifications: Notifications) {
            this.init();    
    }

    init() {
        this.userId = JSON.parse(window.localStorage['userId']); 
        if (this.userId == undefined || this.userId.length == 0) {
            this.nav.push(SignIn); // TODO: Change this to setting root
        }         
        this.subscribeToNotifications();
    }

    //#region Notifications
    subscribeToNotifications() {
        this.platform.ready().then(() => {
            this.config.printTimeElapsed();
            document.addEventListener("pause", this.onPause);
            document.addEventListener("resume", this.onResume);
        });
    }

    onPause() {
        this.notifications.startNotifications();
    }

    onResume() {
        this.notifications.stopNotifications();
    }


    sendNotifiation() {
        this.notifications.sendNotification("Hello World 2");
        this.notifications.setBadge(2);
    }
    //#endregion Notifications

    onPageWillEnter() {
        this.refresh();
    }

    createNewPost() {
        this.nav.push(PostPage);
    }

    refresh() {
        this.config.printTimeElapsed();
        this.swiper.slideTo(0, 100, true);
        let streamsOb = this.service.getStreams(this.userId);
        streamsOb.subscribe(streams => this.fetchArticles(streams), 
                                    err => {this.handleError(err)});
        this.skip = 0;
    }
    
    handleError(err: any) {
        this.newsFeedError = JSON.parse(err._body).ExceptionMessage;   
    }

    fetchArticles(streams: Stream[]) {
        this.config.printTimeElapsed();
        let feedStreams = Enumerable.From(streams).Where(s => s.UserSelected).ToArray();
        this.service.getNewsFeed(feedStreams, 0)
                .subscribe(articles => {this.update(articles); },
                           err => {this.handleError(err)});
    }

    /*
    moreDataCanBeLoaded() {
        return true;
    }

    loadMore($event: any) {
        console.log("infile scroll to load more triggered");
    }
    */
    
    update(art: PublishedPost[]) {
        this.config.printTimeElapsed();
        this.articles = art.slice();
    }

    //#region Utils
    contains(array: any[], value: any): boolean {
        for (var elem of array) {
            if (elem === value) { return true; }
        }
        return false;
    }
    //#endregion Utils

    //#region User Reaction
    addLike(article: PublishedPost) {
        var likes = this.service.sendUserReaction(article.Id, this.config.userInfo.Id, 'Like');
        likes.subscribe(data => { article.LikedBy = data; });
    }

    removeLike(article: PublishedPost) {
        var likes = this.service.sendUserReaction(article.Id, this.config.userInfo.Id, 'UnLike');
        likes.subscribe(data => { article.LikedBy = data; });
    }

    reTweet(article: PublishedPost) {
        var shares = this.service.sendUserReaction(article.Id, this.config.userInfo.Id, 'ReTweet');
        shares.subscribe(data => { article.SharedBy = data; });
    }

    undoReTweet(article: PublishedPost) {
        var shares = this.service.sendUserReaction(article.Id, this.config.userInfo.Id, 'UnReTweet');
        shares.subscribe(data => { article.SharedBy = data; });
    }
    //#endregion User Reaction

    //#region Modals 
    showContacts() {
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
