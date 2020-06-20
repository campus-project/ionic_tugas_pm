import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
    email: string = '';
    loadingRequest: boolean = false;

    constructor(private httpClient: HttpClient,
                private router: Router,
                private toastController: ToastController) { }

    ngOnInit() {
    }

    setValue(e, key) {
        this[key] = e.target.value;
    }

    async resetPassword(e) {
        e.preventDefault();

        this.loadingRequest = true;

        await this.httpClient.post('https://vodeacloud.vodea.xyz/api/forgot-password', {
            email: this.email,
        }).subscribe(async (response: any) => {
            this.loadingRequest = false;

            const toast = await this.toastController.create({
                message: 'The token successful sent to mail',
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
