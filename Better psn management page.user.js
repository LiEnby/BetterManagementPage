// ==UserScript==
// @name         Better psn management page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows for defualt avatar and setitng realname to anything!!
// @author       You
// @match        https://id.sonyentertainmentnetwork.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    if(window.location.host == "id.sonyentertainmentnetwork.com")
    {
        window.realNameClick = function()
        {
            var btn = document.getElementsByClassName("primary-button row-button text-button")[0]

            window.overrideNameChangeRequest = true;
            var firstName = document.getElementsByClassName("textfield ember-text-field ember-view")[0]
            var middleName = document.getElementsByClassName("textfield ember-text-field ember-view")[1]
            var lastName = document.getElementsByClassName("textfield ember-text-field ember-view")[2]

            window.overrideFirstName = firstName.value;
            window.overrideMiddleName = middleName.value;
            window.overrideLastName = lastName.value;

            firstName.value = "OVERRIDDEN";
            middleName.value = "OVERRIDDEN";
            lastName.value = "OVERRIDDEN";

            var keyEvent = document.createEvent('KeyboardEvent');
            keyEvent.initEvent('keyup',true,true);
            firstName.dispatchEvent(keyEvent);

            keyEvent = document.createEvent('KeyboardEvent');
            keyEvent.initEvent('keyup',true,true);
            middleName.dispatchEvent(keyEvent);

            keyEvent = document.createEvent('KeyboardEvent');
            keyEvent.initEvent('keyup',true,true);
            lastName.dispatchEvent(keyEvent);

            btn.click();
        }
        window.buttonAdded = false;
        window.enablePage = function()
        {
            var btn = document.getElementsByClassName("primary-button row-button text-button")[0]
            if(btn != undefined)
            {
                var div = document.getElementsByClassName("theme-realname ember-view")[0]
                if(div != undefined) // real name menu is open
                {
                    if(!window.buttonAdded){
                         //Inject new button
                        window.buttonAdded = true;

                        var mainDiv = btn.parentElement.parentElement

                        var seperatorDiv = mainDiv.appendChild(document.createElement("div"));
                        seperatorDiv.setAttribute("class","separator-pageitems beside narrow");

                        var newDiv = mainDiv.appendChild(document.createElement("div"));
                        newDiv.setAttribute("data-components","pdr-button");
                        newDiv.setAttribute("class","column-flex button ember-view");

                        var newButton = newDiv.appendChild(document.createElement("button"));
                        newButton.innerHTML = '<span dir="ltr" class="caption">Force Save</span>'
                        newButton.setAttribute("tabIndex",3)
                        newButton.setAttribute("class","primary-button row-button text-button")
                        newButton.setAttribute("onclick",'realNameClick()')
                    }
                }
                else
                {
                    window.buttonAdded = false;
                }
            }
            else
            {
                window.buttonAdded = false
            }
            window.setTimeout(window.enablePage,0);
        }
        window.setTimeout(window.enablePage,0);

        XMLHttpRequest.prototype.openOg = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async){
            if(method == "PUT" && url.includes("accounts/me/communication"))
            {
                if(window.overrideNameChangeRequest)
                {
                    this.sendOg = this.send;
                    this.send = function(body){
                        var realNameData = JSON.parse(body);

                        realNameData["realName"]["name"]["first"] = window.overrideFirstName;
                        realNameData["realName"]["name"]["middle"] = window.overrideMiddleName;
                        realNameData["realName"]["name"]["last"] = window.overrideLastName

                        var newBody = JSON.stringify(realNameData);
                        console.log(body + ' -> ' + newBody);
                        return this.sendOg(newBody);
                    }
                    window.overrideNameChangeRequest = false;
                }
             }
            if(method == "PUT" && url.includes("users/me/avatar"))
            {
                this.sendOg = this.send;
                this.send = function(body){
                    if(body == '{"avatarId":100000}')
                    {
                        console.log("Setting default avatar.");
                        body = '{"avatarId":0}'
                    }
                    this.sendOg(body);
                }
            }

            if(method == "GET" && url.includes("avatars/categories/0?offset=0&limit=48"))
            {
                this.sendOg = this.send;
                this.send = function(){
                    this.onreadystatechangeOg = this.onreadystatechange
                    this.onreadystatechange = function(){
                        if (this.readyState === 4) {
                            var parsed = JSON.parse(this.response);
                            parsed.avatars.unshift({avatarId:100000,avatarUrls:[{size:"m",avatarUrl:"https://static-resource.np.community.playstation.net/avatar_m/default/DefaultAvatar_m.png"}]});
                            var newJson = JSON.stringify(parsed);
                            Object.defineProperty(this, 'response',     {writable: true});
                            Object.defineProperty(this, 'responseText', {writable: true});
                            this.response = newJson;
                            this.responseText = newJson;
                            Object.defineProperty(this, 'response',     {writable: false});
                            Object.defineProperty(this, 'responseText', {writable: false});
                        }
                        return this.onreadystatechangeOg();
                    }
                    return this.sendOg();
                }
            }
            return this.openOg(method,url,async);
        }
//        alert('Better Management Page script by SilicaAndPina loaded! and on the correct domain.');
    }
    else
    {
        alert('Wrong domain! please run on\n"https://id.sonyentertainmentnetwork.com/id/management/#/p/psn_profile".');
    }
})();
