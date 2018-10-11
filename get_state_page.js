// author: Tegan Burns
// website: teganburns.com

// PhantomJs Script to Automate Headless Interaction with Devrant
// Copyright 2018 Tegan Burns
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Const Endpoints
const faa_search = 'http://av-info.faa.gov/OperatorsLoc.asp';
const start_time = Date.now();

"use strict";
var system = require('system');
var fs = require('fs');
var args = system.args;
var out_file = '';
var state = '';
var url = '';

// 'txtTypeSearch=Location&cboFAR=135&cboCountry=US&cboState=COLORADO&txtCity=&cmdSearch=Search';


if (args.length > 1 ) {
    state = args[1];
    out_file = "STATES/" + state + ".json";
} else {
    console.log('Invalid arguments!');
    console.log('Usage: mains.js [STATE NAME]');
    phantom.exit(1);
}
console.log( "state: " + state );
console.log( "out_file: " + out_file );

// 'txtTypeSearch=Location&cboFAR=135&cboCountry=US&cboState=COLORADO&txtCity=&cmdSearch=Search';
var url_data = '?txtTypeSearch=Location&cboFAR=135&cboCountry=US&cboState=' + state + '&txtCity=&cmdSearch=Search';
console.log( "URL : " + faa_search + url_data );

// Page variable 
var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 }
page.onConsoleMessage = function(msg) { console.log(msg); };

var check_page = function( url, name ){
    page.open( url, function( status ) {
    
        console.log( 'request_: SUCCESS' );
        //page.render('STATES/' + state + '/' + name + '.png');
        //fs.write( 'STATES/' + state + '/' + name + '.txt', page.plainText, 'w');
       
    });
};


page.open( faa_search, 'POST', url_data, function ( status ) {

    if (status !== 'success') { console.log('Connection issue!');
    } else {
        console.log( 'request: SUCCESS' );
        page.render('render.png');
        var res = page.evaluate(function() {

            //var result = Object(); // JSON results
            var result = Array(); // JSON results
            
            var table_length = document.getElementsByClassName('Table_Container')[0].children[0].children.length;
            console.log( "table_length: " + table_length );

            // Starts at 1 b/c the first row is not needed
            for ( var i = 1; i < table_length; i++ ) {

                console.log( i + ' looping...');

                var content = Object();

                content.href = String(document.getElementsByClassName('Table_Container')[0].children[0].children[i].children[1].children[0].href );
                content.name = String(document.getElementsByClassName('Table_Container')[0].children[0].children[i].children[1].children[0].innerText );

                //check_page( content.href, content.name );
                
                //content.replace(/ /g, '');

                result.push( content );
            }

            //console.log("result: " +  JSON.stringify( result ) );
            return result;
        });

        //console.log( res );
        console.log( "result: " + JSON.stringify( res ) );
        console.log( "result length: " + JSON.stringify( res.length ) );

        page.render('STATES/' + state + '/' + state + '.png');
        fs.write( 'STATES/' + state + '/'+ state + '.json', JSON.stringify( res ), 'w' );

        // for ( var i = 0; i < res.length; i++ ) {
        var i = -1;

        function handle_page( ) {

            page.settings.loadImages = false;
            //page.settings.resourceTimeout = 5000;

            page.onResourceReceived = function(response) {

                // Print response details
                console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));


                if ( response.stage == "end" && response.status == 200 ) {

                    var table_res = page.evaluate(function() {

                        // Variables
                        var table_result = Array();
                        var name = document.getElementsByClassName('Table_Container')[0].children[0].children[0].innerText;
                        var table = document.getElementsByClassName('Table_Container')[0].children[0].children;
                        var table_length = document.getElementsByClassName('Table_Container')[0].children[0].children.length;
                        
                        // Add the name of the table first
                        table_result.push( Object( { 'name':name }) );

                        for ( var j = 0; j < table.length; j++ ) {

                            var obj = Object();

                            if ( table[j].children.length == 1 ) {
                                /*
                                obj.key = table[j].children[0].innerText;
                                obj.value = null;
                                */

                                obj[ table[j].children[0].innerText ] = null;

                            } else if ( table[j].children.length == 2 ) {
                                /*
                                obj.key = table[j].children[0].innerText;
                                obj.value = table[j].children[1].innerText;
                                */

                                obj[ table[j].children[0].innerText ] = table[j].children[1].innerText;
                            }

                            table_result.push( obj );
                            
                        }

                        return table_result;

                    });

                    console.log("Done");
                    console.log( JSON.stringify( table_res ) );

                    page.render('STATES/' + state + '/' + table_res[0].name + '.png');
                    fs.write( 'STATES/' + state + '/'+ table_res[0].name + '.json', JSON.stringify( table_res ), 'w' );

                }
            };

            page.open( res[i].href, function ( status ) {


                if (status !== 'success') {
                    console.log('Connection issue!');
                } else {
                    console.log( 'request: SUCCESS' );
                    page.render('render.png');
                }
                setTimeout( next_page, 3000);

            });

        }

        function next_page() {
            i++;
            if ( i < res.length ) {
                console.log("Iterating..." + i );
                console.log("href: " + res[i].href );
                handle_page( );
            } else {
                console.log( "Done!" );
                console.log( "res.length: " + res.length );
                console.log( "i: " + i );
            
                phantom.exit();
            }
        }
        next_page();


        // Write results to the output file 
        //fs.write( out_file, JSON.stringify( res ), 'w');

    }
});


