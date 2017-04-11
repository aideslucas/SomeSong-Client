"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var home_1 = require("../home/home");
var angularfire2_1 = require("angularfire2");
var language_select_1 = require("../language-select/language-select");
var LoginPage = (function () {
    function LoginPage(platform, navCtrl, _auth, _backend) {
        this.platform = platform;
        this.navCtrl = navCtrl;
        this._auth = _auth;
        this._backend = _backend;
    }
    LoginPage.prototype.loginWithFB = function () {
        var _this = this;
        this._auth.signInWithFacebook()
            .then(function () { return _this.onSignInSuccess(); });
    };
    LoginPage.prototype.loginWithGoogle = function () {
        var _this = this;
        this._auth.signInWithGoogle()
            .then(function () { return _this.onSignInSuccess(); });
    };
    LoginPage.prototype.onSignInSuccess = function () {
        var user = this._backend.getUser(this._auth.authState.uid);
        if (!user) {
            var displayName = '';
            var email = '';
            if (this._auth.authState.provider == angularfire2_1.AuthProviders.Facebook) {
                displayName = this._auth.authState.facebook.displayName;
                email = this._auth.authState.facebook.email;
            }
            else if (this._auth.authState.provider == angularfire2_1.AuthProviders.Google) {
                displayName = this._auth.authState.google.displayName;
                email = this._auth.authState.google.email;
            }
            user = this._backend.createUser(this._auth.authState.uid, displayName, email);
            this.navCtrl.push(language_select_1.LanguageSelectPage, user);
        }
        else {
            this.navCtrl.setRoot(home_1.HomePage, user);
        }
    };
    return LoginPage;
}());
LoginPage = __decorate([
    core_1.Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    })
], LoginPage);
exports.LoginPage = LoginPage;
