/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    takePicture: function() {
      navigator.camera.getPicture( function( imageURI ) {
        alert( imageURI );
      },
      function( message ) {
        alert( message );
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      });
    }
};
var db;
var transaction;
$(document).ready(function() {
       db = window.openDatabase("PagesDB", "1.0", "PhoneGap Demo", 200000);
        db.transaction(function (tx) {  
        tx.executeSql('DROP TABLE IF EXISTS pages');
	var sql = 
		"CREATE TABLE IF NOT EXISTS pages ( "+
		"id varchar(50) PRIMARY KEY, " +
		"pagetitle VARCHAR(255), " +
		"pageContents VARCHAR(8000), " +
		"pageActive VARCHAR(1), " +
		"lastupdated varchar(50), " + 
		"lastupdatedusername VARCHAR(50))";
        tx.executeSql(sql);
        });
        loadJson();
        console.log('foo');
    });
    
function loadJson(){
    $.getJSON( "https://mercury.hamilton.edu:7075/appPages/ajax/getpages.cfm", function( data ) { 
        db.transaction(function (transaction) {
            var len = data.length;
            for(var i = 0; i < len; i++) {
                var id=data[i].id;
                var pagetitle=data[i].pagetitle;           
                var pagecontent=data[i].pagecontent;  
                var pageactive=data[i].pageactive; 
                var lastupdated=data[i].lastupdated; 
                var lastupdatedusername=data[i].lastupdatedusername; 
                transaction.executeSql('INSERT INTO pages (id,pagetitle, pagecontent, pageaActive, lastupdated, lastupdatedusername) VALUES (?,?,?,?,?,?)',[id, pagetitle, pagecontent, pageactive, lastupdated,lastupdatedusername]);
            }
        });
    });
};