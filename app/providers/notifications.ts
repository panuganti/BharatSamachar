import {LocalNotifications, Badge} from 'ionic-native';
import {Injectable} from 'angular2/core';

import {ServiceCaller} from './servicecaller';

@Injectable()
export class Notifications {
    constructor(public service: ServiceCaller) { }

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

    continousCheckForNotifications(userId: string) {
        this.service.checkForNotifications(userId).subscribe(data => {});
    }

    setBadge(number: number) {
        Badge.set(number);
    }
}
