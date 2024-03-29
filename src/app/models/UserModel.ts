export enum StatusModel {
    offline,
    online
}

export enum Theme {
    light = "light", dark = "dark"
}

export class UserModel {
    public uId : string;
    public name : string;
    public email : string;
    public password : string;
    public profilePic : string;
    public dob : Date;
    public tofd : string;
    public status : StatusModel;
    public lastSeen : Date;
    public ghostMode : boolean;
    public theme : Theme;
    public createdAt : Date;
    public updatedAt : Date;
    
    constructor( email : string, password : string, name : string ) {
        this.password = password;
        this.email = email;
        this.name = name;
    }
}
