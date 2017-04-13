"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var backend_service_1 = require("../../providers/backend-service");
var home_1 = require("../home/home");
var GenreSelectPage = (function () {
    function GenreSelectPage(platform, navCtrl, navParams, _backend) {
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._backend = _backend;
        this.genres = backend_service_1.Genres;
        this.genresKeys = Object.keys(this.genres).filter(Number);
        this.user = navParams.data;
        console.log(this.user);
    }
    GenreSelectPage.prototype.insertGenreToArray = function (item, genre) {
        var index = this.user.genres.indexOf(genre, 0);
        if (item.checked) {
            if (index == -1) {
                this.user.genres.push(genre);
            }
        }
        else {
            if (index > -1) {
                this.user.genres.splice(index, 1);
            }
        }
    };
    GenreSelectPage.prototype.save = function () {
        this.navCtrl.setRoot(home_1.HomePage, this.user);
    };
    return GenreSelectPage;
}());
GenreSelectPage = __decorate([
    core_1.Component({
        selector: 'page-genre-select',
        templateUrl: 'genre-select.html'
    })
], GenreSelectPage);
exports.GenreSelectPage = GenreSelectPage;
