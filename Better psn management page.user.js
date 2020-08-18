// ==UserScript==
// @name         Better psn management page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows for defualt avatar and setitng realname to anything!!
// @author       SilicaAndPina
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

        window.updateAboutMe = function(txt)
        {
            var aboutMe = document.getElementsByClassName("textarea fixed-width ")[0]

            window.overrideAboutMe = aboutMe.value;

            aboutMe.value = txt;

            var inputEvent = document.createEvent('Event');
            inputEvent.initEvent('input', true, true);
            aboutMe.dispatchEvent(inputEvent)

        }
        window.waitForSave = function()
        {
            var btn = document.getElementsByClassName("primary-button row-button text-button")[0]
            if(btn.hasAttribute("disabled"))
            {
                window.setTimeout(window.waitForSave,0);
            }
            else
            {
                btn.click();
            }
        }

        window.aboutMeClick = function()
        {
            var btn = document.getElementsByClassName("primary-button row-button text-button")[0]

            window.overrideAboutMeChangeRequest = true;

            window.updateAboutMe("OVERRIDDEN");

            window.waitForSave();
        }
        window.updateAboutMeLabel = function()
        {
            var lbl = document.getElementsByClassName("pdr-list-column main-text bold-text")[2];
            if(lbl != undefined)
            {
                lbl.innerText = window.originalAbout;
            }
            else
            {
                window.setTimeout(window.updateAboutMeLabel,0);
            }
        }

        window.buttonAdded = false;
        window.enablePage = function()
        {
            var btn = document.getElementsByClassName("primary-button row-button text-button")[0]
            if(btn != undefined)
            {
                var aboutMeDiv = document.querySelector("*[data-components='pdr-about-me']");
                var realNameDiv = document.getElementsByClassName("theme-realname ember-view")[0]
                if(realNameDiv != undefined || aboutMeDiv != null) // applicible menu is open
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
                        // Determine Action
                        if(realNameDiv != undefined)
                        {
                            newButton.setAttribute("onclick",'realNameClick()')
                        }
                        if(aboutMeDiv != null)
                        {
                            updateAboutMe(document.getElementsByClassName("pdr-list-column main-text bold-text")[2].innerText);
                            newButton.setAttribute("onclick",'aboutMeClick()')
                        }
                    }
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
            if(method == "GET" && (url.includes("regcam/api") && url.includes("users/me/profile")))
            {
                this.sendOg = this.send;
                this.send = function(){
                    this.onreadystatechangeOg = this.onreadystatechange
                    this.onreadystatechange = function(){
                        if (this.readyState === 4) {
                            var oldResp = this.response;
                            var oldRespText = this.responseText
                            window.originalAbout = JSON.parse(oldResp)["aboutMe"];
                            window.updateAboutMeLabel();
                            Object.defineProperty(this, 'response',     {writable: true});
                            Object.defineProperty(this, 'responseText', {writable: true});
                            this.response = oldResp.replace(/\\u..../g, "");
                            this.responseText = oldRespText.replace(/\\u..../g, "");
                            Object.defineProperty(this, 'response',     {writable: false});
                            Object.defineProperty(this, 'responseText', {writable: false});
                        }
                        return this.onreadystatechangeOg();
                    }
                    return this.sendOg();
                }


            }
            if(method == "POST" && url.includes("users/me/profile"))
            {
                if(window.overrideAboutMeChangeRequest)
                {
                    this.sendOg = this.send;
                    this.send = function(body){
                        var profileData = JSON.parse(body);
                        profileData["aboutMe"] = window.overrideAboutMe;
                        var newBody = JSON.stringify(profileData);
                        console.log(body + ' -> ' + newBody);


                        this.onreadystatechangeOg = this.onreadystatechange
                        this.onreadystatechange = function(){
                            if (this.readyState === 4) {
                                if(this.status == 500) // 500 OK xD
                                {
                                    Object.defineProperty(this, 'status',     {writable: true});
                                    Object.defineProperty(this, 'statusText', {writable: true});
                                    this.status = 200;
                                    this.statusText = "OK";
                                    Object.defineProperty(this, 'status',     {writable: false});
                                    Object.defineProperty(this, 'statusText', {writable: false});
                                }
                            }
                            return this.onreadystatechangeOg();
                        }
                        window.overrideAboutMeChangeRequest = false;

                        try{
                            return this.sendOg(newBody);
                        }catch(Exception){}
                    }
                }

            }
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
