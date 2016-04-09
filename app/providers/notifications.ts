import {LocalNotifications, Badge} from 'ionic-native';
import {Injectable} from 'angular2/core';

import {ServiceCaller} from './servicecaller';
import {Config} from './config';

@Injectable()
export class Notifications {
    badge: number = 0;
    notifications: any[] = [];
    notificationsOn: boolean = true;
    
    constructor(public service: ServiceCaller, public config: Config) { }

    sendNotification(message: string) {
        if (!this.config.isActive()) {
            LocalNotifications.schedule({
                id: 1,
                text: message
            });
        }
    }

    clearAllNotifications() {
        LocalNotifications.clearAll();
    }

    stopNotifications() {
        this.clearAllNotifications();
        this.clearBadge();
        this.notificationsOn = false;
        this.service.clearAllNotifications(this.config.userInfo.Id);
    }
    
    startNotifications() {
        // TODO: Add Notification preference to User object & check here
        while(this.notificationsOn) {
            setTimeout(this.getNotifications(), 100000);
        }
        // Watch for notifications and push it out until activated
    }

    getNotifications()  {
        this.service.checkForNotifications(this.config.userInfo.Id)
                            .subscribe(data => { console.log(data)});
        // Update home icon with badge number
        // if (background) { set badge, send local notifications}
    }

    setBadge(number: number) {        
        Badge.set(number);
    }
    
    clearBadge() {
        Badge.clear();
    }
}
