/// <reference path="../../typings/tsd.d.ts" />
import Dictionary = collections.Dictionary;

import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray'; // required for Observable.of();

import {Config} from './config';
import {Cache} from './cache';
import {Article, UserNotification, VersionInfo, ConfigData, Stream, CredentialsValidation} from '../contracts/DataContracts';
import {PostPreview, UnpublishedPost, User, PublishedPost} from '../contracts/ServerContracts';

@Injectable()
export class ServiceCaller {
    url: string = "https://script.google.com/macros/s/AKfycbz2ZMnHuSR4GmTjsuIo6cmh433RRpPRH7TwMaJhbAUr/dev";
    apiUrl: string = "http://newsswipesserver20160101.azurewebsites.net";
    //apiUrl: string = "http://localhost:54909";

    constructor(public cache: Cache, public http: Http) {

    }
    /*
        loadArticles(lang: string, categories: string[], prevId: number): Observable<Article[]> {
            // Check cache else retrieve
            lang = lang.toLowerCase(); // case-invariant        
            if (this.cache.langArticleCache.containsKey(lang)) {
                return Observable.of(this.cache.getFromArticleCache(lang));
            }
    
            // If not present in cache, fetcsh from server
            let params = new Dictionary<string, string>();
            params.setValue("method", "getArticles");
            params.setValue("language", lang);
            params.setValue("categories", "");
            params.setValue("sinceId", prevId.toString());
            let articles = this.http.get(this.formatRequest(params)).map(res => res.json());
            articles.subscribe((data: Article[]) => { this.cache.addToCache(lang, data); this.prefetchImages(data) });
    
            // prefetchImages        
            return articles;
        }
    
        
        private formatRequest(params: Dictionary<string, string>) {
            let url = `${this.config.url}?`;
            let first: boolean = true;
            params.forEach((k, v) => { if (!first) { url = `${url}&`; } url = `${url}${k}=${v}`; first = false; });
            return url;
        }
        */
    prefetchImages(articles: Article[]) {
        articles.forEach(article => this.http.get(article.Image));
    }

    /*
        sendUserInfo(userInfo: User): Observable<void> {
            let params = new Dictionary<string, string>();
            params.setValue("method", "storeUserInfo");
            params.setValue("version", this.config.version);
            params.setValue("userId", this.config.userId);
            params.setValue("email", userInfo.Email);
            params.setValue("lang", userInfo.PrimaryLanguage);
            return this.http.get(this.formatRequest(params)).map(res => res.json()); // TODO: Replace it with PUT/POST
        }
    
        recordLastActivityTime(): Observable<boolean> {
            let params = new Dictionary<string, string>();
            params.setValue("method", "recordLastActivityTime");
            params.setValue("version", this.config.version);
            params.setValue("lastActivityTime", this.config.lastActivityTime.toString());
            return this.http.get(this.formatRequest(params)).map(res => res.json()); // TODO: Replace it with PUT/POST        
        }
        getNotifications(): Observable<UserNotification[]> {
            let params = new Dictionary<string, string>();
            params.setValue("method", "getNotifications");
            params.setValue("version", this.config.version);
            params.setValue("userId", this.config.userId); // TODO: send user info
            let notifications = this.http.get(this.formatRequest(params)).map(res => res.json());
            return notifications;
        }
    */

    //#region Feed

    getNewsFeed(streams: string[], skip: number): Observable<PublishedPost[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let feed = this.http.get(this.apiUrl + "/feed/getfeed/" + streams.join(',') + "/" + skip,
            { headers: headers }).map(res => res.json());
        return feed;
    }

    getTimeline(userId: string, skip: number): Observable<PublishedPost[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let feed = this.http.get(this.apiUrl + "/feed/timeline/" + userId + "/" + skip,
            { headers: headers }).map(res => res.json());
        return feed;
    }

    //#endregion Feed

    //#region Likes & Shares
    sendUserReaction(articleId: string, userId: string, reaction: string): Observable<number> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var userReaction = {
            UserId: userId,
            ReactionType: reaction
        };
        var count = this.http.post(this.apiUrl + "/feed/UserReaction", JSON.stringify(userReaction), { headers: headers })
            .map(res => res.json());
        return count;
    }

    //#region Likes & Shares


    //#region User
    updateUserInfo(user: User): Observable<boolean> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let updated = this.http.post(this.apiUrl + "/user/UpdateUserProfile", JSON.stringify(user), { headers: headers })
            .map(res => res.json());
        return updated;
    }

    getUserInfo(userId: string): Observable<User> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let user = this.http.get(this.apiUrl + "/user/GetUserInfo/" + userId, { headers: headers }).map(res => res.json());
        return user;
    }

    signUp(email: string, password: string, language: string): Observable<User> {
        var credentials = {
            Email: email,
            Password: password,
            Language: language
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let user = this.http.post(this.apiUrl + "/user/SignUp", JSON.stringify(credentials), { headers: headers }).map(res => res.json());
        return user;
    }

    validateCredentials(email: string, password: string): Observable<User> {
        var credentials = {
            Email: email,
            Password: password
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let user = this.http.post(this.apiUrl + "/user/ValidateCredentials", JSON.stringify(credentials), { headers: headers }).map(res => res.json());
        return user;
    }

    checkIfEmailExists(email: string): Observable<boolean> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let exists = this.http.get(this.apiUrl + "/user/CheckIfEmailExists/" + email, { headers: headers }).map(res => res.json());
        return exists;
    }

    getStreams(userId: string): Observable<Stream[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let streams = this.http.get(this.apiUrl + "/user/GetStreams/" + userId, { headers: headers }).map(res => res.json());
        return streams;
    }

    //#endregion User

    //#region Config
    getVersionInfo(): Observable<VersionInfo> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let versionInfo = this.http.get(this.apiUrl + "/config/GetVersionInfo", { headers: headers }).map(res => res.json());
        return versionInfo;
    }

    getAllStreams(): Observable<Stream[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let streams = this.http.get(this.apiUrl + "/config/GetAllStreams", { headers: headers }).map(res => res.json());
        return streams;
    }

    getStreamsOfALanguage(lang: string): Observable<Stream[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let streams = this.http.get(this.apiUrl + "/config/GetStreams/" + lang, { headers: headers }).map(res => res.json());
        return streams;
    }

    getLabelsOfALanguage(lang: string): Observable<Dictionary<string, string>> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let labelsDict = this.http.get(this.apiUrl + "/config/GetLabels/" + lang, { headers: headers }).map(res => res.json());
        return labelsDict;
    }

    //#endregion Config

    //#region Post
    fetchPostPreview(url: string): Observable<PostPreview> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.apiUrl + "/feed/PreviewArticle",
            JSON.stringify(url), { headers: headers }).map(res => res.json());
    }

    fetchFromFeeds(feedStream: string): Observable<PostPreview> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.apiUrl + "/feed/FetchFromFeedStream",
            JSON.stringify(feedStream), { headers: headers }).map(res => res.json());
    }

    postArticle(post: UnpublishedPost): Observable<boolean> {
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        var body: string = JSON.stringify(post);
        return this.http.post(this.apiUrl + "/feed/PostArticle",
            body, { headers: headers }).map(res => res.json());

    }
    //#endregion Post
}