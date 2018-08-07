import { PushObject } from './../models/pushObject';
import { Device } from './../models/device';
import { Injectable, Output } from '@angular/core';
import { Parse } from 'parse';

import { uriConfig,configuration } from '../config/config';
import { Router } from '@angular/router';

import { nearer } from 'q';

@Injectable()
export class ParseService {

    public user: any;
    public role: any;

    constructor(private route: Router) {
        Parse.initialize(configuration.PARSE_KEY );
        Parse.masterKey = configuration.MASTER_KEY;

        Parse.serverURL = configuration.SERVER_URL;
        this.user = Parse.User.current();
    }

    login(username: String, password: String): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.User.logIn(username, password, {
                success: user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject();
                    }
                },
                error: (error) => {
                    console.log('errror', error);
                    reject(error);
                }
            });
        });
    }

    isLoggedIn(): boolean {
        const currentUser = Parse.User.current();
        if (currentUser) {
            this.user = currentUser;
            if (!this.role) {
                const query = new Parse.Query(Parse.Role);
                query.equalTo('users', this.user);
                query.find().then(function (roles) {
                    this.roles = roles;
                });
            }
        }
        return !!(currentUser);
    }

    resetPassword(email): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.User.requestPasswordReset(email, {
                success: () => {
                    resolve();
                },
                error: error => {
                    reject(error);
                }
            });
        });
    }

    logout(): boolean {
        return Parse.User.logOut().then(() => {
            const currentUser = Parse.User.current();
            this.user = null;
            console.log('Current user', currentUser);
            this.route.navigate(['']);
            return true;
        });
    }

    register(userName: string, password: string, email: string) {
        // TODO: add array for adding any type of data on registration
        return new Promise((resolve, reject) => {
            const user = new Parse.User();
            user.set('username', userName);
            user.set('password', password);
            user.set('email', email);

            user.signUp(null, {
                success: (data) => {
                    Parse.User.logOut();
                    resolve();
                },
                error: (data, error) => {
                    reject(error);
                }
            });
        });
    }

    uploadFile(fileName: string, fileType: string, fileContent: any) {
        let parseFile = new Parse.File(fileName, { base64: fileContent }, fileType);
        console.log(parseFile.uriConfig);
        console.log(parseFile);
        // parseFile.save().then(function () {
        //     console.log('File is saved : ' + parseFile._url);
        // }, function (error) {
        //     console.log(error);
        // });
        return parseFile;
    }
    pushDevice(data1 : PushObject) {
        console.log("PUSH DEVICE PARSE SERVICE");
        //let str1 = JSON.(data);
        console.log('data1   : ' + JSON.stringify(data1));
        Parse.masterKey = configuration.MASTER_KEY;
    //    let dev1: Device;
        var query = new Parse.Query(Parse.Installation);
        //query.equalTo("objectId","CcDvQBvAp1");
        Parse.Push.send({
            
            where: query, // Set our Installation query
            data: {
                data1
                
              //alert: "Willie Hayes injured by own pop fly."

            }
          }, { useMasterKey: true, 
           
            success: function() {
            console.log("PUSH DEVICE PARSE SERVICE SUCCESS");
            console.log("success Invocation");
            },
            error: function(error) {
                console.log("PUSH DEVICE PARSE SERVICE Failed ");
                console.log("error in fal  "+error);
                
            }
          });
             
    }

    public getParseObject(className) {
        return new Parse.Object.extend(className);
    }

    public getParseQueryObject(className) {
        let classNameVar = new Parse.Object.extend(className);
        return new Parse.Query(classNameVar);
    }
}
