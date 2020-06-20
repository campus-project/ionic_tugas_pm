import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    username: string = '';
    password: string = '';
    loadingRequest: boolean = false;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private toastController: ToastController,
                private storage: Storage) { }

    ngOnInit() {
    }

    setValue(e, key) {
        this[key] = e.target.value;
    }

    async registerPage(e) {
        await this.router.navigateByUrl('/register')
    }

    async login(e) {
        e.preventDefault();

        this.loadingRequest = true;

        await this.httpClient.post('https://vodeacloud.vodea.xyz/oauth/token', {
            client_id: 2,
            client_secret: 'ol9FSJh3ypk4FdYUu2pL0wp21UransnXSKi5DaGm',
            grant_type: 'password',
            username: this.username,
            password: this.password,
        }).subscribe(async (response: any) => {
            this.loadingRequest = false;

            await this.storage.set("ACCESS_TOKEN", response.access_token);

            await this.router.navigateByUrl('/dashboard');
        }, (async error => {
            this.loadingRequest = false;

            const toast = await this.toastController.create({
                message: 'Username or password is incorrect.',
                duration: 2000,
                color: "danger"
            });

            await toast.present();
        }));
    }

}
