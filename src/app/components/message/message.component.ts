import { Component, Input, OnInit } from "@angular/core";
import { MessageModel } from "../../models/ChatModel";
import { UserModel } from "../../models/UserModel";
import { getStatusIcon, TimeStampToDate } from "../../shared/functions";

@Component( {
                selector : "app-message",
                templateUrl : "./message.component.html",
                styleUrls : [ "./message.component.scss" ]
            } )
export class MessageComponent implements OnInit {
    
    @Input() message : MessageModel;
    @Input() user : UserModel;
    @Input() current : boolean = false;
    
    constructor() { }
    
    ngOnInit() {}
    
    getDate = ( stamp ) => {
        return TimeStampToDate( stamp );
    };
    
    getStatusIcon = () => {
        return getStatusIcon( this.message.status );
    };
    
}
