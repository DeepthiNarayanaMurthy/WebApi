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
                console.log(response);
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
//                 console.log(response);
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
       //  console.log(accessToken);
         $.ajax({
             url: "http://localhost:11942/GetFiles",
             type: 'GET',
             xhrFields: { 'withCredentials': true },
             contentType: 'application/json',
             dataType: 'json',
             success: function (response) {
                 //console.log("hgcghv");
                 //console.log(response.StatusCode);
                 folders = response.children;
                 var buttons = new Array();

                 for (i = 0; i < folders.length; i++) {
                     document.write('<a href="javascript:;" onclick="displayContent('+"'"+folders[i].id+"'"+')" data-theme="b" data-role="button" >' + folders[i].name + '</a></br>');

                 }
             },
             error: function (response) {
                 console.log("gfgvjh");
                 console.log(response.status);
                 if (response.status == 401)
                     window.location = "http://localhost:11942/frontpage.html";
                 console.log(response);
                 //console.log(response);
             }
         });
     })
 });


 function displayContent(item_id) {
     console.log(item_id);
     $.ajax({
         url: "http://localhost:11942/Download/"+item_id,
         type: 'GET',
         xhrFields: { 'withCredentials': true },
         contentType: 'application/json',
         success: function (response) {
             //console.log("hgcghv");
             //console.log(response);
             var downloadUrl = response['@content.downloadUrl.downloadUrl'];
             console.log(downloadUrl);
             console.log("gvghvj");
         },
         error: function (response) {
             console.log("gfgvjh");
             console.log(response);
             //console.log(response);
         }
     });
 };


 $(document).ready(function () {
     $('#txtUploadFile').on('change', function (e) {
         var files = e.target.files;
         console.log("gvgvm");
         if (files.length > 0) {
             if (window.FormData !== undefined) {
                 var data = new FormData();
                 for (var x = 0; x < files.length; x++) {
                     data.append("file" + x, files[x]);
                 }

                 $.ajax({
                     type: "PUT",
                     url: 'http://localhost:11942/Upload',
                     contentType: false,
                     processData: false,
                     data: data,
                     success: function (result) {
                         console.log(result);
                     },
                     error: function (xhr, status, p3, p4) {
                         var err = "Error " + " " + status + " " + p3 + " " + p4;
                         if (xhr.responseText && xhr.responseText[0] == "{")
                             err = JSON.parse(xhr.responseText).Message;
                         console.log(err);
                     }
                 });
             } else {
                 alert("This browser doesn't support HTML5 file uploads!");
             }
         }
     });
 });