import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {LoadingController, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {User} from "../auth/user";
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    loadingRequest: boolean = false;
    longitude: Number;
    latitude: Number;
    latitudeUeu: Number;
    longitudeUeu: Number;
    distanceWithUeu: any;
    locationName: string;
    user: User;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private toastController: ToastController,
                private storage: Storage,
                private loadingController: LoadingController,
                private geolocation: Geolocation) {
        this.latitudeUeu = -6.2732231;
        this.longitudeUeu = 106.5096607;
    }

    async ngOnInit() {
        await this.geolocation.getCurrentPosition().then(async (resp) => {
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;

            await this.getLocation()

            this.distanceWithUeu = this.calcCrow(this.latitude, this.longitude, this.latitudeUeu, this.longitudeUeu).toFixed(2) + ' KM'
        }).catch((error) => {
            console.log('Error getting location', error);
        });

        await this.getAccount();
    }

    toRad(Value) {
        return Value * Math.PI / 180;
    }

    calcCrow(lat1, lon1, lat2, lon2) {
        let R = 6371; // km
        let dLat = this.toRad(lat2-lat1);
        let dLon = this.toRad(lon2-lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    async getLocation() {
        await this.httpClient.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.latitude}+${this.longitude}&key=d6039c3830d245faa07210172ddaa500`)
            .subscribe(async (response: any) => {

                const result = response.results[0];
                this.locationName = result.formatted
            }, (async error => {
                const toast = await this.toastController.create({
                    message: `Failed to get location name`,
                    duration: 2000,
                    color: "danger"
                });

                await toast.present();
            }));
    }

    async getAccount() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });

        await loading.present();

        const accessToken = await this.storage.get("ACCESS_TOKEN");

        if (!accessToken) {
            await this.router.navigateByUrl('/login');

            await loading.dismiss();
        }

        await this.httpClient.get('https://vodeacloud.vodea.xyz/api/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).subscribe(async (response: any) => {

            this.user = response;

            const toast = await this.toastController.create({
                message: `Welcome ${response.name}`,
                duration: 2000,
                color: "primary"
            });

            await loading.dismiss();
            await toast.present();
        }, (async error => {
            await this.router.navigateByUrl('/login');

            await loading.dismiss();
        }));
    }

    async logout(e) {
        e.preventDefault();

        this.loadingRequest = true;
        await setTimeout(async() => {
            await this.storage.remove("ACCESS_TOKEN");

            this.loadingRequest = false;

            await this.router.navigateByUrl('/login');
        }, 1000);
    }

}
