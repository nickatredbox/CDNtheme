
//document.write("<script src='http://www2.lincoln.ac.nz/CDNtheme/theme/script/json-serialization.js' type='text/javascript'></script>");
//document.write("<script src='http://www2.lincoln.ac.nz/CDNtheme/theme/script/Cookie-less-Session.js' type='text/javascript'></script>");
//document.write("<script src='http://www2.lincoln.ac.nz/CDNtheme/theme/script/LincolnDefault.js' type='text/javascript'></script>");

//-----------------------------------------------------
//
// class	:
//
// Purpose	:  Authentication
//
//-----------------------------------------------------
var LincolnAuth = {



    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    DoAuth: function (authurl, passurl, failurl) {

        alert("111 *************** Session.dump() " + Session.dump());

        //obj = COOKIEhelper.getCookie("AUTH");
        //alert(obj.SessionKey);
        
        this.SessionKey = "";

        if (this.SessionAuth() == "") {

            alert("222 *************** Session.dump() " + Session.dump());

            var url = authurl + '?pass=' + passurl + '&fail=' + failurl;

            window.location = url;

            /*
            Session.set("pass", passurl);
            Session.set("fail", failurl);

            var parameters = [];

            parameters.push("pass");
            parameters.push(passurl);
            parameters.push("fail");
            parameters.push(failurl);

            document.write(HTTPhelper.GetPartialwithArgs(authurl, "", parameters));
            */
        }

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    GetAuthParm: function (key) {

        //alert("GetAuthParm: = " + key);

        //curuser64 = Session.get("curuser");

        alert("~~~~~~~~~~~~~~~~~~~~~GetAuthParm this.curuser64 = " + this.curuser64);

        if (this.curuser64 == undefined) { return ""; }

        this.curuser = Base64.decode(this.curuser64);

        alert("~~~~~~~~~~~~~~~~~~~~~GetAuthParm curuser = " + curuser);

        if (this.curuser == undefined) { return ""; }

        return JSONhelper.GetValueFromString(this.curuser, key);

    },

    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    Authenticate: function (ouser, opass) {

        var xmlhttp;

        alert("444 *************** Session.dump() " + Session.dump());

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //Get name(s)
        var user = document.getElementById(ouser).value;
        var pass = document.getElementById(opass).value;



        //PRE LOGIN
        // create the parameter string 
        // iterate the parameters array 
        var parameters = [];

        parameters.push("script");
        parameters.push('Pre-authenticate-AD-user');

        parameters.push("a");
        parameters.push('pre');

        if (user) {
            parameters.push("u");
            parameters.push(Base64.encode(user));
        }

        if (pass) {
            parameters.push("p");
            parameters.push(Base64.encode(pass));
        }

        var resp = HTTPhelper.SyncPOST(xmlhttp, "/ajaxlogin.json", parameters);

        this.curuser64 = Base64.encode(resp);

        //alert("resp = " + resp);
        //alert("curuser64 = " + curuser64);

        //Session.set("curuser", curuser64);
        //window.name = resp;

        alert("555 *************** Session.dump() " + Session.dump());

        var obj = JSON.parse(resp);

        //alert(resp);

        document.writeln("<table>");

        var Count = obj[0].PSmembers.length;

        for (var i = 0; i < Count; i++) {

            var Key = obj[0].PSmembers[i].Key;
            var Value = obj[0].PSmembers[i].Value;

            document.writeln("<tr>");
            document.writeln("<td>" + Key + "</td><td>" + Value + "</td>");
            document.writeln("</tr>");

        }

        document.writeln("</table>");

        //alert(resp);

        var SessionKey = JSONhelper.GetValueFromString(resp, 'sessionkey');

        document.writeln('<p>JSONhelper.GetValueFromSTring(resp, sessionkey) : ' + SessionKey + '</p>');

        //document.writeln('<p>this.GetAuthParm(employeeID): ' + this.GetAuthParm('employeeID') + '</p>');

        //Session.set("SessionKey", SessionKey);
        this.SessionKey = SessionKey;

        alert("666 *************** Session.dump() " + Session.dump());
        //alert("222222222222 " + Session.get("SessionKey"));
        //alert("222222222222 Session.dump() " + Session.dump());


        s = JSON.stringify(this);

        alert(s);

        return SessionKey;

    },


    //-----------------------------------------------------
    //
    // Function	: 
    //
    // Purpose	: 
    //
    //-----------------------------------------------------
    SessionAuth: function () {

        var xmlhttp;

        ///alert("1111111111111111 Session.dump() " + Session.dump());


        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //alert(" SessionAuth: function " + this.SessionKey);

        //if (Session.get("SessionKey") == undefined) {
        if (this.SessionKey == undefined) {
            alert('==================== SessionAuth: this.SessionKey == undefined');
            return "";
        }

        //if (window.name == "") {
        //if (Session.get("SessionKey") == "") {
        if (this.SessionKey == "") {
            alert('******************* SessionAuth: this.SessionKey == empty');
            return "";
        }



        //alert("22222222222 var user = this.GetAuthParm('SamAccountName')" + this.GetAuthParm('SamAccountName'));

        var user = this.GetAuthParm('SamAccountName');
        var sk = this.GetAuthParm('sessionkey');



        //NOW LOGIN WITH SESSION KEY
        // create the parameter string 
        // iterate the parameters array 
        var parameters = [];

        parameters.push("script");
        parameters.push('Authenticate-User');

        parameters.push("a");
        parameters.push('chk');

        if (user) {
            parameters.push("u");
            parameters.push(user);
        }

        if (sk) {
            parameters.push("sk");
            parameters.push(sk);
        }


        var resp = HTTPhelper.SyncPOST(xmlhttp, "/ajaxlogin.json", parameters);

        alert('XXXXXXXXXXXXXXXXXXX SessionAuth: function () { resp = ' + resp);

        if (resp != "") {
            this.SessionKey = JSONhelper.GetValueFromString(resp, 'sessionkey');
        }

        //Session.set("SessionKey", SessionKey)

        alert('YYYYYYYYYYYYYYYYYY SessionAuth: function () { SessionKey = ' + this.SessionKey);

        return this.SessionKey;

    }

}