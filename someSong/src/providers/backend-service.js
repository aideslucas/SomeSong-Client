"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var Genres;
(function (Genres) {
    Genres[Genres["rock"] = 1] = "rock";
    Genres[Genres["pop"] = 2] = "pop";
    Genres[Genres["classic"] = 3] = "classic";
    Genres[Genres["metal"] = 4] = "metal";
    Genres[Genres["dubstep"] = 5] = "dubstep";
    Genres[Genres["rap"] = 6] = "rap";
    Genres[Genres["disco"] = 7] = "disco";
})(Genres = exports.Genres || (exports.Genres = {}));
var Languages;
(function (Languages) {
    Languages[Languages["english"] = 1] = "english";
    Languages[Languages["hebrew"] = 2] = "hebrew";
    Languages[Languages["spanish"] = 3] = "spanish";
    Languages[Languages["russian"] = 4] = "russian";
    Languages[Languages["french"] = 5] = "french";
    Languages[Languages["italian"] = 6] = "italian";
})(Languages = exports.Languages || (exports.Languages = {}));
var User = (function () {
    function User(userID, displayName, email, score, genres, languages) {
        this.userID = userID;
        this.displayName = displayName;
        this.email = email;
        this.score = score;
        this.genres = genres;
        this.languages = languages;
    }
    User.prototype.addLanguage = function (language) {
        this.languages.push(language);
    };
    User.prototype.addGenre = function (genre) {
        this.genres.push(genre);
    };
    return User;
}());
exports.User = User;
var BackendService = (function () {
    function BackendService() {
        console.log('Hello BackendService Provider');
    }
    BackendService.prototype.getUser = function (userID) {
        return null;
    };
    BackendService.prototype.createUser = function (userID, displayName, email) {
        return new User(userID, displayName, email, 0, new Array(), new Array());
    };
    return BackendService;
}());
BackendService = __decorate([
    core_1.Injectable()
], BackendService);
exports.BackendService = BackendService;
