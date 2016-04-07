import {LocalNotifications, Badge} from 'ionic-native';

import {Injectable} from 'angular2/core';


@Injectable()
export class Notifications {
    constructor() { }

    sendNotification(message: string) {
        LocalNotifications.schedule({
            id: 1,
            text: message
        });

    }

    clearNotification() {

    }

    clearAllNotifications() {

    }

    setBadge(number: number) {

    }
}
