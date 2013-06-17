
var query_string = {};

//-----------------------------------------------------
//
// Function	: 
//
// Purpose	: 
//
//-----------------------------------------------------
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}


//-----------------------------------------------------
//
// Function	: 
//
// Purpose	: 
//
//-----------------------------------------------------
function QueryString()
{
	
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
		// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
		// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
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
var SCRIPThelper = {

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    SyncRunScript: function (scriptname, parameters, outputobjectname) {

        // create the parameter string 
        // iterate the parameters array 

        var allparameters = [];

        allparameters.push("scriptname");
        allparameters.push(encodeURI(scriptname));

        allparameters.push("outputobject");
        allparameters.push(encodeURI(outputobjectname));

        var n = parameters.length;

        for (var i = 0; i < n; i += 2) {

            allparameters.push(parameters[i])
            allparameters.push(encodeURI(parameters[1 + i]));
        }

        var resp = JSONhelper.GetJSON("ajaxscript.json", allparameters, "");

        var obj = JSON.parse(resp);

        return obj;
    },



    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    AsyncRunScript: function (xmlhttp, scriptname, outputobjectname, parameters) {

        // create the parameter string 
        // iterate the parameters array 

        var allparameters = [];

        allparameters.push("scriptname");
        allparameters.push(encodeURI(scriptname));

        allparameters.push("outputobject");
        allparameters.push(encodeURI(outputobjectname));

        var n = parameters.length;

        for (var i = 0; i < n; i += 2) {

            allparameters.push(parameters[i])
            allparameters.push(encodeURI(parameters[1 + i]));
        }

        var resp = HTTPhelper.AsyncPOST(xmlhttp, "ajaxscript.json", allparameters);

        return resp;

    }

}

//-----------------------------------------------------
//
// class	:
//
// Purpose	:  JSON helper
//
//-----------------------------------------------------
var LUCASpeople = {

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetPerson: function (emplid, async_id) {


        // create the parameter string 
        // iterate the parameters array 
        var parameters = [];

        if (emplid) {
            parameters.push("emplid");
            parameters.push(emplid);
        }

        var resp = JSONhelper.GetJSON("ajaxlucasperson.json", parameters, async_id);

        var obj = JSON.parse(resp);

        return obj;
    },

    
    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetPersonAsync: function (emplid) {
    
        // create the parameter string 
        // iterate the parameters array 
        var parameters = [];

        if (emplid) {
            parameters.push("emplid");
            parameters.push(emplid);
        }

        var LucasHTTP = JSONhelper.AsyncGetJSON("ajaxlucasperson.json", parameters);

        return LucasHTTP;
    }

}



//-----------------------------------------------------
//
// class	:
//
// Purpose	:  STRING helper
//
//-----------------------------------------------------

//A static array of lists
var LucasListObj = [];

var LUCASlists = {


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    LucasListJSON: function (lucaslistname) {

        if (LucasListObj == undefined) { return ""; }

        var sjson = "";

        for (var i = 0; i < LucasListObj.length; i++) {

            if (LucasListObj[i].key == lucaslistname) {

                sjson = LucasListObj[i].value;
                //alert("FOUND " + sjson);
                break;
            }

        }

        return sjson;
    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetLucasListJSON: function (lucaslist, fields) {

        var sjson = this.LucasListJSON(lucaslist);

        //alert(sjson);

        if (sjson == "") {//Get value from server

            //alert("0");

            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            // create the parameter string 
            // iterate the parameters array 
            var parameters = [];

            if (lucaslist) {
                parameters.push("lucaslist");
                parameters.push(lucaslist);
            }


            if (fields != undefined) {
                for (var i = 0; i < fields.length; i += 2) {
                    parameters.push(fields[i]);
                    parameters.push(fields[i + 1]);
                }
            }

            var resp = HTTPhelper.SyncPOST(xmlhttp, "ajaxlucaslist.json", parameters);

            LucasListObj.push({ "key": lucaslist, "value": resp });

            //alert(this.LucasListJSON(lucaslist));

            var obj = JSON.parse(resp);

            return obj;

        } else {//Get value from cache

            //alert("1");

            var obj = JSON.parse(sjson);

            return obj;

        }



    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetLucasOptionList: function (lucaslist, fields) {

        var obj = this.GetLucasListJSON(lucaslist, fields);

        var options = "";

        for (var i = 0; i < obj.RowList.length; i++) {

            options += "<option value=\"" + obj.RowList[i][0].Value + "\">" + obj.RowList[i][1].Value + "</option>";
        }

        return options;

    },



    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    getValueforElement: function (OptionID) {

        return document.getElementById(OptionID).value;

    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    getLucasListforOption: function (SQLqueryName, SQLvariable, Value) {

        var fields = [];
        fields.push(SQLvariable);
        fields.push("'" + Value + "'");

        return this.GetLucasOptionList(SQLqueryName, fields);
    }

}//end of class



//-----------------------------------------------------
//
// class	:
//
// Purpose	:  STRING helper
//
//-----------------------------------------------------
var STRINGhelper = {

    hex2bin: function (hex) {
        var bytes = [], str;

        for (var i = 0; i < hex.length - 1; i += 2)
            bytes.push(parseInt(hex.substr(i, 2), 16));

        return String.fromCharCode.apply(String, bytes);
    },

    // check for valid numeric strings 
    IsNumericOnly: function (strString) {
       
        var strValidChars = "0123456789";
        var strChar;

        if (strString.length == 0) return false;

        // test strString consists of valid characters listed above
        for (i = 0; i < strString.length; i++) {

            strChar = strString.charAt(i);

            if (strValidChars.indexOf(strChar) == -1) {

                return false;
            }
        }

        return true;
    },

    // check for valid numeric strings 
    IsNumericOrDecimal: function (strString) {
       
        var strValidChars = "0123456789.-";
        var strChar;

        if (strString.length == 0) return false;

        // test strString consists of valid characters listed above
        for (i = 0; i < strString.length; i++) {

            strChar = strString.charAt(i);

            if (strValidChars.indexOf(strChar) == -1) {

                return false;
            }
        }

        return true;
    }

}//end of class

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
    GetJSON: function (method, parameters, async_id) {

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

            parameterString += (i > 0 ? "&" : "") + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        //Post to server
        if (async_id == "") {
            xmlhttp.open("POST", method, false);
        } else {
            xmlhttp.open("POST", method, true);
        }

        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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
    AsyncGetJSON: function (method, parameters) {

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "") + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        //Post to server
        xmlhttp.open("POST", method, true);

        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xmlhttp.send(parameterString);

        return xmlhttp;

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetPSmembersValueFromString: function (jsonstring, key) {

        var obj = JSON.parse(jsonstring);

        var Count = obj[0].PSmembers.length;

        for (var i = 0; i < Count; i++) {

            if (obj[0].PSmembers[i].Key == key)
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
    GetPSmembersValueFromObject: function (jsonobject, key) {

        var Count = jsonobject[0].PSmembers.length;

        for (var i = 0; i < Count; i++) {

            if (jsonobject[0].PSmembers[i].Key == key)
                return jsonobject[0].PSmembers[i].Value;

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
	jsonToCSV: function (sourceRows, omitHeader, fieldsToIgnore)
	{

		/// <summary>
		/// Converts an array of JSON objects to CSV.
		///</summary>
		/// <param name="sourceRows" type="Object[]">
		/// An array of objects containing a single level of scalar fields.
		/// e.g. [{ foo: "bar", fu: true }, { foo: "baarbar", fu: false }]
		///
		/// The first element in the array will define the header row.
		/// </param>
		/// <param name="omitHeader" type="Boolean" optional="true">if true, header row is not emitted</param>
		/// <param name="fieldsToIgnore" type="Map" optional="true">a map of fields to ignore e.g. { field1:1,field4:1 }</param>

		/// <returns type="String"></returns>
		/// <author name="sky sanders" contact="http://skysanders.net/subtext" date="2010-09-19"/>

		function quote(value)
		{
			return '"' + value.replace(/"/g, '""').replace(/\r/g, "\\r").replace(/\n/g, "\\b") + '"';
		};
		function pad(n)
		{
			return n < 10 ? '0' + n : n;
		};

		var header = "";
		var rows = "";
		var headerComplete = false;

		for (var i = 0; i < sourceRows.length; i++)
		{
			var firstElement = true;
			var row = "";
			for (var key in sourceRows[i])
			{
				if (sourceRows[i].hasOwnProperty(key))
				{
					if (fieldsToIgnore && (key in fieldsToIgnore))
					{
						continue;
					}

					if (!headerComplete)
					{
						if (!firstElement)
						{
							header = header.concat(", ");
						};
						header = header.concat(key);
					};

					if (!firstElement)
					{
						row = row.concat(", ");
					};

					var value = sourceRows[i][key];

					if (typeof value != 'undefined' && value !== null)
					{
						if (value instanceof Date)
						{
							var dateResult = value.getUTCFullYear() + '-'
									+ pad(value.getUTCMonth() + 1) + '-'
									+ pad(value.getUTCDate()) + 'T'
									+ pad(value.getUTCHours()) + ':'
									+ pad(value.getUTCMinutes()) + ':'
									+ pad(value.getUTCSeconds()) + 'Z';
							row = row.concat(dateResult);
						}
						else if ((value instanceof Boolean) || !isNaN(value))
						{
							row = row.concat(value.valueOf());
						}
						else
						{
							row = row.concat(quote(value.valueOf()));
						}
					}
					firstElement = false;
				}
			}
			rows = rows.concat(row).concat("\r\n");
			headerComplete = true;
		}
		return omitHeader ? rows : header.concat("\r\n").concat(rows);
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
    NewHttpRequest: function () {

        var xmlhttp = null;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        return xmlhttp;
    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    AsyncPOST: function (http, method, parameters) {


        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        //Post to server
        http.open("POST", method, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


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

        var n = parameters.length;
        var parameterString = "";

        for (var i = 0; i < n; i += 2) {

            parameterString += (i > 0 ? "&" : "")
            + parameters[i] + "=" + encodeURI(parameters[1 + i]);
        }

        //Post to server
        http.open("POST", method, false);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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