import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Store } from "@ngrx/store";
import { RootState } from "../../../store/root";
import { UserModel } from "../../../models/UserModel";
import { Subscription } from "rxjs";
import { UserService } from "../../../services/user.service";
import { ModalController } from "@ionic/angular";
import { AvatarSelectorComponent } from "../../../components/avatar-selector/avatar-selector.component";

@Component( {
                selector : "app-settings",
                templateUrl : "./settings.page.html",
                styleUrls : [ "./settings.page.scss" ]
            } )
export class SettingsPage implements OnInit, OnDestroy {
    
    currentUser : UserModel = undefined;
    userSub : Subscription;
    loading = true;
    currentAvatar : string = "";
    
    constructor( private authService : AuthService, private store : Store<RootState>, private userService : UserService, private modal : ModalController ) { }
    
    ngOnInit() {
        // Fetch the value of current user from the store.
        this.userSub = this.store.select( "user" ).subscribe( value => {
            if ( value?.user ) {
                this.currentUser = { ...value.user };
                this.currentAvatar = this.currentUser.profilePic;
            }
            this.loading = false;
        } );
    }
    
    ngOnDestroy() : void {
        if ( this.userSub ) {
            this.userSub.unsubscribe();
        }
    }
    
    /**
     * Logout the user and perform the necessary steps to navigate the login.
     */
    async logout() {
        await this.authService.logOut();
    }
    
    /**
     * Update user in the system.
     */
    updateUser = async () => {
        await this.userService.updateUser( this.currentUser );
    };
    
    async selectAvatar() : Promise<void> {
        const mod = await this.modal
                              .create( {
                                           component : AvatarSelectorComponent,
                                           keyboardClose : true,
                                           swipeToClose : true,
                                           componentProps : { "currentProfilePicture" : this.currentAvatar }
                                       } );
        await mod.present();
        
        const data = await mod.onWillDismiss();
        if ( data.data ) {
            this.currentAvatar = data.data.selected;
            this.currentUser.profilePic = this.currentAvatar;
        }
    }
}
