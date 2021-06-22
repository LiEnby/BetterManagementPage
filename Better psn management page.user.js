// ==UserScript==
// @name         Better psn management page
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Allows for defualt avatar and setitng realname to anything!!
// @author       SilicaAndPina
// @match        https://id.sonyentertainmentnetwork.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    if(window.location.host == "id.sonyentertainmentnetwork.com")
    {
        if(window.location.toString().includes("/signin"))
        {
            var url = window.location.toString();
            if(!url.includes("user%3Aaccount.profile.get%20user%3Aaccount.profile.update"))
            {
                var get = url.split('&')
                for(var i = 0; i < get.length; i++)
                {
                    if(get[i].startsWith('scope'))
                    {
                        get[i] += "%20user%3Aaccount.profile.get%20user%3Aaccount.profile.update";
                    }
                }

                window.location = get.join('&');
            }

            return;
        }
        function htmlToElement(html) {
            var template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }

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

            firstName.value = "OFirst";
            middleName.value = "OMiddle";
            lastName.value = "OLast";

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
        window.updateRealNameLabel = function()
        {
            var lbl = document.getElementsByClassName("pdr-list-column main-text bold-text")[1];
            if(lbl != undefined)
            {
                if(lbl.innerText.includes("OLast"))
                {
                    lbl.innerText = lbl.innerText.replace("OFirst",window.overrideFirstName);
                    lbl.innerText = lbl.innerText.replace("OMiddle",window.overrideMiddleName);
                    lbl.innerText = lbl.innerText.replace("OLast",window.overrideLastName);

                    lbl = document.getElementsByClassName("profile-text-title max-two-lines")[0];

                    lbl.innerText = lbl.innerText.replace("OFirst",window.overrideFirstName);
                    lbl.innerText = lbl.innerText.replace("OMiddle",window.overrideMiddleName);
                    lbl.innerText = lbl.innerText.replace("OLast",window.overrideLastName);
                }
                else
                {
                    window.setTimeout(window.updateRealNameLabel,0);
                }
            }
            else
            {
                window.setTimeout(window.updateRealNameLabel,0);
            }
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
        window.cancelColorChange = function()
        {
            document.getElementById("colorChangeWindow").remove()
        }
        window.setColor = function()
        {
            window.selectedColor = document.getElementById("colorSelector").value.substring(1);
            var xhr = new XMLHttpRequest();
            xhr.open("PATCH","https://profile.api.playstation.com/v1/users/me/profile/backgroundImage",true);
            xhr.setRequestHeaderOg("Content-Type","application/json");
            xhr.setRequestHeaderOg("Authorization",window.loginToken);
            xhr.onreadystatechange = function()
            {
                if (this.readyState === 4) {
                    document.getElementById("mainPageColor").innerText = "#"+window.selectedColor;
                    document.getElementById("mainPageColor").style.color = document.getElementById("mainPageColor").innerText
                    window.cancelColorChange();
                }
            }
            xhr.send("{\"ops\":[{\"op\":\"replace\",\"path\":\"/color\",\"value\":\""+window.selectedColor+"\"}]}");

        }
        window.newColorSelected = function()
        {
            document.getElementById("colorHex").innerText = document.getElementById("colorSelector").value;
        }
        window.editColor = function()
        {
            var popupBox = htmlToElement('<div id="colorChangeWindow" data-components="pdr-popup" id="girlsdyingcute" class="ember-view"><div data-components="pdr-popup-frame" id="girlsdyingcutely" class="modal rows scroller theme-dimmer ember-view"> <div class="separator-pagetop dialog row-unshrink"></div><div class="row-flex"></div><div class="columns row-unshrink"> <div class="separator-frame beside column-unshrink"></div><div class="column-flex"></div><div class="popup-frame fixed-height rows theme-basebackground"> <div data-components="pdr-popup-header" id="girlsdyingiscute" class="separator-horizontal-hairline bottom ember-view"><div class="popup-header"> <div class="popup-header-text" dir="ltr">Profile Color</div><button onclick="window.cancelColorChange()" tabindex="0" title="Close" class="popup-header-icon close icon-header-close-black" dir="ltr" data-ember-action="" data-ember-action-220="220"></button></div></div><div data-components="kekka-scroller" id="girlsdyingiscute" class="outline-top scroller custom-scrollbar row-flex rows scroller-visible ember-view"><main tabindex="-1" data-components="pdr-main-content" id="girlsdyingiscute" class="rows flex-content theme-basebackground ember-view"> <div class="theme-noticeback row-unshrink"> <div data-components="pdr-notice" id="girlsdyingiscute" style="display: none;" class="row-notice item-notice ember-view"><div class="wrap-notice "> <div class="cell-notice top"> <div class="notice-icon-base " title=""></div></div><div class="cell-notice middle"> <div class="separator-notice text-notice text-margin " dir="ltr"></div></div></div></div></div><div class="separator-pagetop middle row-unshrink"></div><div class="columns row-flex"> <div class="popup-content-wrapper rows"> <div class="label description-regular" dir="ltr">You can change the color of your PSN Profile Page to anything you want.</div><div class="separator-pageitems row-unshrink"></div><div data-components="pdr-color-change" id="girlsdyingiscute" class="ember-view"><div class="grid-parent description-input-title"> <div class="grid-child description-input-title" dir="ltr">Update your profile color: </div><div> <input id="colorSelector" onchange="window.newColorSelected()" type="color"> <span id="colorHex">#000000</span></div></div></div><div class="separator-pageitems small"></div><div class="separator-pageitems"></div><div class="columns-center"> <div data-components="pdr-button" id="girlsdyingiscute" class="column-flex button ember-view"><button onclick="window.cancelColorChange()" tabindex="0" class="secondary-button row-button text-button" type="button"><span dir="ltr" class="caption">Cancel</span></button></div><div class="separator-pageitems beside narrow"></div><div data-components="pdr-button" id="girlsdyingiscute" class="column-flex button ember-view"><button onclick="window.setColor()" tabindex="0" class="primary-button row-button text-button"><span dir="ltr" class="caption">Set Color</span></button></div></div></div></div><div class="separator-pagefooter middle row-unshrink"></div></main></div></div><div class="column-flex"></div><div class="separator-frame beside column-unshrink"></div></div><div class="row-flex"></div><div class="separator-pagefooter dialog row-unshrink"></div></div></div>');
            document.getElementById("modalarea").appendChild(popupBox);
            document.getElementById("colorSelector").value = "#"+window.selectedColor;
            document.getElementById("colorHex").innerText = "#"+window.selectedColor;
        }

        window.buttonAdded = false;
        window.colorAdded = false;
        window.enablePage = function()
        {
            window.setTimeout(window.enablePage,5);
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

            var onProfilePage = window.location.toString().includes("/psn_profile");
            if(onProfilePage && window.colorAdded == false)
            {
                var elms = document.getElementsByClassName("pdr-list-item ember-view");
                if(elms.length == 0)
                    return;
                var xhr = new XMLHttpRequest();
                xhr.open("GET","https://profile.api.playstation.com/v1/users/me/profile?fields=backgroundImage",true);
                xhr.setRequestHeaderOg("Content-Type","application/json; charset=UTF-8-Type");
                xhr.setRequestHeaderOg("Authorization",window.loginToken);
                xhr.onreadystatechange = function()
                {
                    if (this.readyState === 4) {
                        window.selectedColor = JSON.parse(this.responseText)["backgroundImage"]["color"];
                        var elm = document.getElementsByClassName("row-unshrink")[11].children[0]
                        var newElement = htmlToElement('<li data-components="pdr-li" id="girlsdyingcute" class="ember-view"><div data-components="pdr-li-row" id="girlsdyingcutely" class="pdr-list-item ember-view"> <div class="pdr-list-column flex-width fixed-width has-hint"> <div class="pdr-list-item"> <div class="pdr-list-column flex-width "> <div class="pdr-list-item inner-list-item " style=""> <div class="pdr-list-column flex-width column-unshrink "> <div class="pdr-list-item"> <div class="pdr-list-column main-text fitting-width "> <div id="girlsdyingiscute" data-components="pdr-label" class="label ember-view"><div> <div class="grid-parent "> <div class="grid-child "> <span dir="ltr" class="label-title" id="profile_color">Profile Color</span> </div></div></div></div></div></div></div></div></div></div></div><div class="pdr-list-column flex-width "> <div class="pdr-list-item"> <div class="pdr-list-column flex-width "> <div class="pdr-list-item inner-list-item " style=""> <div class="pdr-list-column flex-width column-unshrink "> <div class="pdr-list-item"> <div class="pdr-list-column main-text bold-text" dir="ltr" id="mainPageColor">#'+window.selectedColor.toString()+'</div></div></div></div></div><div class="pdr-list-column column-unshrink button-column "> <div data-components="pdr-button" id="girlsdyingiscute" class="list-cam-narrow-button expand-taparea button ember-view"><button tabindex="0" class="secondary-button row-button text-button disabled-loading-caption" type="button" onclick="window.editColor()"><span dir="ltr" class="caption">Edit</span></button></div></div></div></div></div></li>');
                        elm.appendChild(newElement);
                        document.getElementById("mainPageColor").style.color = document.getElementById("mainPageColor").innerText
                    }
                }
                xhr.send();
                window.colorAdded = true;
            }
            else if(!onProfilePage)
            {
                window.colorAdded = false;
            }
        }
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
            if(method == "PUT" && url.includes("/realName"))
            {
                if(window.overrideNameChangeRequest)
                {
                    this.sendOg = this.send;
                    this.send = function(body){
                        var realNameData = JSON.parse(body);

                        realNameData["first"] = window.overrideFirstName;
                        realNameData["middle"] = window.overrideMiddleName;
                        realNameData["last"] = window.overrideLastName

                        var newBody = JSON.stringify(realNameData);
                        console.log(body + ' -> ' + newBody);
                        window.updateRealNameLabel();
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

        XMLHttpRequest.prototype.setRequestHeaderOg = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value){
            if(header == "Authorization")
            {
                if(window.loginToken == undefined)
                    window.setTimeout(window.enablePage,0);

                window.loginToken = value; // i can make my own requests now :3
                console.log("Found token: "+value);
            }
            return this.setRequestHeaderOg(header,value);
        }
//        alert('Better Management Page script by SilicaAndPina loaded! and on the correct domain.');
    }
    else
    {
        alert('Wrong domain! please run on\n"https://id.sonyentertainmentnetwork.com/id/management/#/p/psn_profile".');
    }
})();
