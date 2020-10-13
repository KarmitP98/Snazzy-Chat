import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable( {
                 providedIn: "root"
             } )
export class LoginGuard implements CanActivate {

    constructor( private router: Router,
                 private afa: AngularFireAuth ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return new Promise( resolve => {
            const sub = this.afa.authState.subscribe( value => {
                if ( value ) {
                    sub.unsubscribe();
                    resolve( this.router.navigate( [ "/", value.uid ] ) );
                } else {
                    sub.unsubscribe();
                    resolve( true );
                }
            } );
        } );
    }

}
