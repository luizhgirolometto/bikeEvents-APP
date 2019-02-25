import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EventsPage } from '../pages/events/events';
import { SigninUpPage } from '../pages/signin-up/signin-up';
import { SettingsPage } from '../pages/settings/settings';

import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { JoinEventsPage } from '../pages/join-events/join-events';
import { UserProvider } from '../providers/user/user';
import { MessagingProvider } from '../providers/messaging/messaging';
import {timer} from 'rxjs/observable/timer';
import { AboutPage } from '../pages/about/about';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { firebaseConfig } from '../providers/environment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage :any = EventsPage;
  eventsPage = EventsPage;
  signInUpPage = SigninUpPage;
  settings = SettingsPage;
  joinEventsPage = JoinEventsPage;
  about = AboutPage;
  tutorial = TutorialPage;

  isAuthenticated = true;
  email = "";
  showSplash = true;
  

  @ViewChild('nav') nav: NavController;

   constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private menuCtrl: MenuController,
    private authProvider: AuthProvider,
    private afAuth: AngularFireAuth,
    private userProvider: UserProvider,
    private mProv: MessagingProvider,
    private alertCtrl: AlertController
  ) {
    firebase.initializeApp(firebaseConfig);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    
      timer(1500).subscribe((() => {
        this.showSplash = false
        this.afAuth.authState.subscribe(user => {
          if(user){
                this.isAuthenticated = true;
                this.email = user.email;
                this.rootPage = EventsPage;
              }
              else{
                this.isAuthenticated = false;
                this.email = "";
                this.userProvider.userProfile = null;
                this.rootPage = SigninUpPage;
              }
          
        });
      })); 
    });
  }

  onLoad(page: any){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout(){
   let confirm = this.alertCtrl.create({
    title: 'Log out?',
    subTitle: 'Are you sure you want to log out?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.authProvider.logout();
        }
      },
      {
        text: 'No',
      }
    ]
  });
  confirm.present();
  this.menuCtrl.close();
  }






}
