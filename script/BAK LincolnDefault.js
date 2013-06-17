

//document.write("<script src='http://www2.lincoln.ac.nz/CDNtheme/theme/script/json-serialization.js' type='text/javascript'></script>");
//document.write("<script src='http://www2.lincoln.ac.nz/CDNtheme/theme/script/Cookie-less-Session.js' type='text/javascript'></script>");

//-----------------------------------------------------
//
// class	:
//
// Purpose	:  COOKIE helper
//
//-----------------------------------------------------
var COOKIEhelper = {

    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },

    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    checkCookie: function () {
        var username = getCookie("username");
        if (username != null && username != "") {
            alert("Welcome again " + username);
        }
        else {
            username = prompt("Please enter your name:", "");
            if (username != null && username != "") {
                setCookie("username", username, 365);
            }
        }
    }

}

//-----------------------------------------------------
//
// class	:
//
// Purpose	:  JSON helper
//
//-----------------------------------------------------
var JSONhelper = {


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetJSON: function ( method, parameters, async_id) {

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (async_id != "") {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    document.getElementById(async_id).innerHTML = xmlhttp.responseText;
                }

            }
        }

        //Post to server
        if (async_id == "") {
            xmlhttp.open("POST", method, false);
        } else {
            xmlhttp.open("POST", method, true);
        }

        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        xmlhttp.send(parameterString);

        if (async_id == "") { return xmlhttp.responseText; }

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for encoding
    GetValueFromString: function (jsonstring, key) {

        var obj = JSON.parse(jsonstring);
        
        var Count = obj[0].PSmembers.length;

        for (var i = 0; i < Count; i++) {

            if( obj[0].PSmembers[i].Key == key)
                return obj[0].PSmembers[i].Value;

        }

        return '';
    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for encoding
    GetValueFromObject: function (jsonobject, key) {

        var Count = jsonobject[0].PSmembers.length;

        for (var i = 0; i < Count; i++) {

            if (jsonobject[0].PSmembers[i].Key == key)
                return jsonobject[0].PSmembers[i].Value;

        }

        return '';
    }
    
}


//-----------------------------------------------------
//
// class	:
//
// Purpose	:  Base64 encode / decode http://www.webtoolkit.info/
//
//-----------------------------------------------------
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for encoding
    getkey: function () {
        return this._keyStr;
    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for encoding
    setkey: function (key) {
        this._keyStr = key;
    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

//-----------------------------------------------------
//
// class	:
//
// Purpose	:  HTTP helper
//
//-----------------------------------------------------
var HTTPhelper = {



    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    QueryStringList: function (varname) {

        // get the current URL
        var url = window.location.toString();

        //get the parameters
        url.match(/\?(.+)$/);
        var params = RegExp.$1;

        // split up the query string and store in an
        // associative array
        var params = params.split("&");
        var queryStringList = {};

        for (var i = 0; i < params.length; i++) {
            var tmp = params[i].split("=");
            queryStringList[tmp[0]] = unescape(tmp[1]);
        }

        // print all querystring in key value pairs
        //for (var i in queryStringList)
        //    alert(i + " = " + queryStringList[i] );

        //alert("resp = " + resp);

        return queryStringList[varname];

    },



    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetPartial: function (resourse, async_id) {

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (async_id != "") {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    document.getElementById(async_id).innerHTML = xmlhttp.responseText;
                }

            }
        }

        if (async_id == "") {
            xmlhttp.open("GET", resourse, false);
        } else {
            xmlhttp.open("GET", resourse, true);
        }

        xmlhttp.send();

        if (async_id == "") { return xmlhttp.responseText; }

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetPartialwithArgs: function (resourse, async_id, parameters) {

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (async_id != "") {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    document.getElementById(async_id).innerHTML = xmlhttp.responseText;
                }

            }
        }

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "?")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }



        if (async_id == "") {
            xmlhttp.open("GET", resourse + parameterString, false);
        } else {
            xmlhttp.open("GET", resourse + parameterString, true);
        }

        xmlhttp.send();

        if (async_id == "") { return xmlhttp.responseText; }

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    AsyncPOST: function (http, method, parameters) {

        //Post to server
        http.open("POST", method, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        http.send(parameterString);
    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    SyncPOST: function (http, method, parameters) {

        //Post to server
        http.open("POST", method, false);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        http.send(parameterString);

        return http.responseText;
    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    AsyncGET: function (http, method, parameters) {

        //Post to server
        http.open("GET", method, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "?")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        http.send(parameterString);
    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    SyncGET: function (http, method, parameters) {

        //Post to server
        http.open("GET", method, false);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "?")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        http.send(parameterString);

        return http.responseText;

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    getParameter: function (pName) {
        lName = pName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var lRegexS = "[\\?&]" + lName + "=([^&#]*)";
        var lRegex = new RegExp(lRegexS);

        var lResults = lRegex.exec(window.location.href);

        if (lResults == null)
            return "";
        else
            return lResults[1];
    }

}