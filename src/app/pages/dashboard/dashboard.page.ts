import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatModel, UserModel } from "../../shared/models";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../services/data.service";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MenuComponent } from "../../components/menu/menu.component";
import { ModalController, PopoverController } from "@ionic/angular";
import { pushTrigger } from "../../shared/animations";
import { Subscription } from "rxjs";
import { UsersListComponent } from "../../components/user/users-list/users-list.component";

@UntilDestroy( { checkProperties : true } )

@Component( {
                selector : "app-dashboard",
                templateUrl : "./dashboard.page.html",
                styleUrls : [ "./dashboard.page.scss" ],
                animations : [ pushTrigger ]
            } )
export class DashboardPage implements OnInit, OnDestroy {
    
    chat = false;
    userSub : Subscription;
    chatSub : Subscription;
    user : UserModel;
    users : UserModel[] = [];
    selectedUser : UserModel;
    chats : ChatModel[] = [];
    selectedChat : ChatModel;
    
    constructor( private route : ActivatedRoute,
                 public ds : DataService,
                 private pc : PopoverController,
                 private mc : ModalController ) {
    
        const uid = this.route.snapshot.params["uId"];
    
        this.userSub = this.ds.fetchUser()
                           .subscribe( value => {
                               if ( value ) {
                                   this.user = value.filter( usr => usr.uId === uid )[0];
                                   this.users = value.filter( usr => usr.uId !== uid );
                               }
                           } );
    
        this.chatSub = this.ds.fetchChats( "userIds", "array-contains", uid )
                           .subscribe( value => {
                               if ( value?.length > 0 ) {
                                   this.chats = value;
                               }
                           } );
    
    }
    
    ngOnInit() {
    }
    
    ngOnDestroy() : void {
        this.userSub.unsubscribe();
    }
    
    async openMenu( $event : MouseEvent ) {
        this.ngOnDestroy();
        const pop = await this.pc
                              .create( {
                                           component : MenuComponent,
                                           event : $event,
                                           animated : true,
                                           mode : "md",
                                           keyboardClose : true,
                                           backdropDismiss : true,
                                           componentProps : { uId : this.user.uId }
                                       } );
        await pop.present();
    }
    
    loadChatWith( oUser : UserModel, withChat? : ChatModel ) {
        if ( this.selectedUser === oUser ) {
            this.chat = !this.chat;
        } else {
            this.chat = false;
            
            setTimeout( value => {
                this.selectedUser = oUser;
                this.selectedChat = withChat;
                this.chat = true;
                
            }, 100 );
        }
    }
    
    loadChat( chat : ChatModel ) : void {
        var oUser = this.getOtherUser( chat );
        this.loadChatWith( oUser, chat );
    }
    
    getOtherUser( chat : ChatModel ) : UserModel {
        return this.users.filter( usr => usr.uId === chat.userIds.filter( value => value !== this.user.uId )[0] )[0];
    }
    
    async openUsersList() {
        const modal = await this.mc.create( {
                                                component : UsersListComponent,
                                                componentProps : { users : this.users },
                                                mode : "md",
                                                swipeToClose : true,
                                                showBackdrop : false,
                                                animated : true,
                                                backdropDismiss : false
                                            } );
        
        await modal.present();
        
        const { data } = await modal.onWillDismiss();
        if ( data?.user ) {
            this.loadChatWith( data.user );
        }
    }
}
