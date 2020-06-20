import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
    name: string = '';
    email: string = '';
    password: string = '';
    password_confirmation: string = '';
    loadingRequest: boolean = false;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private toastController: ToastController) { }

    ngOnInit() {
    }

    setValue(e, key) {
        this[key] = e.target.value;
    }

    async register(e) {
        e.preventDefault();

        this.loadingRequest = true;

        await this.httpClient.post('https://vodeacloud.vodea.xyz/api/register', {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
        }).subscribe(async (response: any) => {
            this.loadingRequest = false;

            const toast = await this.toastController.create({
                message: 'Successfully Register',
                duration: 2000,
                color: "primary"
            });

            await toast.present();

            await this.router.navigateByUrl('/login');
        }, (async error => {
            this.loadingRequest = false;

            const toast = await this.toastController.create({
                message: 'The given data is invalid.',
                duration: 2000,
                color: "danger"
            });

            await toast.present();
        }));
    }

}
