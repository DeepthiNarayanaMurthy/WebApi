 $(document).ready(function () {
    $("#authenticate").click(function () {
        $.ajax({
            url: "http://localhost:11942/Authenticate",
            type: 'GET',
            xhrFields: { 'withCredentials': true },
            crossDomain: true,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:11942',
                'Access-Control-Allow-Origin': '*'
            },
            success: function (response) {
                console.log(response);
                window.location = "https://login.live.com/oauth20_authorize.srf?client_id=c65a0efe-ef12-4bbc-9255-f965789f2522 &scope=wl.basic onedrive.readwrite &response_type=code&redirect_uri=http://localhost:11942/uploadpage.html";
            },
            error: function (response) {
                console.log("asaax");
                //console.log(response);
            }
        });
    })
 });
 $.extend({
             getUrlVars: function(){
                 var vars = [], hash;
                 var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                 for(var i = 0; i < hashes.length; i++)
                 {
                     hash = hashes[i].split('=');
                     vars.push(hash[0]);
                     vars[hash[0]] = hash[1];
                 }
                 return vars;
             },
     getUrlVar: function(name){
         return $.getUrlVars()[name];
     }
 });
 var accessToken;
 $(document).ready(function () {
     $("#Redeem").click(function () {
         $.ajax({
             url: "http://localhost:11942/Redeem",
             type: 'POST',
             xhrFields: { withCredentials: true },
             contentType: 'application/json',
             dataType: 'json',
             //crossDomain: true,
             data: JSON.stringify($.getUrlVar('code')),
             success: function (response) {
                 console.log(response);
                 //var temp = JSON.stringify(response.access_token);
                 accessToken = response;
             },
             error: function (response) {
                 console.log(response);
             }
         });
     })
 });


 $(document).ready(function () {
     $("#Getfiles").click(function () {
         console.log(accessToken);
         $.ajax({
             url: "http://localhost:11942/GetFiles",
             type: 'GET',
             xhrFields: { 'withCredentials': true },
             contentType: 'application/json',
             dataType: 'json',
             success: function (response) {
                 console.log(response.children);
                 folders = response.children;
                 var buttons = new Array();

                 for (i = 0; i < folders.length; i++) {
                     document.write('<a href="javascript:;" onclick="displayContent('+"'"+folders[i].id+"'"+')" data-theme="b" data-role="button" >' + folders[i].name + '</a></br>');

                 }
             },
             error: function (response) {
                 console.log(response.RequestMessage);
                 //console.log(response);
             }
         });
     })
 });
 function displayContent(item_id) {
     console.log(item_id);
 };
