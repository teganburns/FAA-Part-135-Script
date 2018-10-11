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
const faa_search = 'http://av-info.faa.gov/OpCert.asp?SrchBy=Location'
const start_time = Date.now();

"use strict";
var system = require('system');
var fs = require('fs');
var args = system.args;
var out_file = 'states.csv';

/*
if (args.length > 1 ) {
    page_number=args[1];
    out_file = "out_" + page_number + ".json";
} else {
    console.log('Invalid arguments!');
    console.log('Usage: mains.js [PAGE NUMBER]');
    phantom.exit(1);
}
*/
//console.log( "page_number: " + page_number );
//console.log( "out_file: " + out_file );


// GET request URL
var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 }
page.onConsoleMessage = function(msg) { console.log(msg); };

page.open( faa_search, function ( status ) {

    if (status !== 'success') { console.log('Connection issue!');
    } else {
        console.log( 'request: SUCCESS' );
        var res = page.evaluate(function() {

            //var result = Object(); // JSON results
            var result = Array(); // JSON results

            for ( var i in document.getElementById('cboState').children ) {
                console.log('looping...');
                var content = String( document.getElementById('cboState').children[i].innerText );
                content.replace(/ /g, '');
                //console.log('content: ' + content);
                result.push( content );
            }

            // Compound Arrays
            //result.states = result_table_body;

            console.log("result: " +  JSON.stringify( result ) );
            return result;
        });

        console.log( res );
        console.log( JSON.stringify( "res: " + res ) );

        // Write results to the output file 
        fs.write( out_file, JSON.stringify( res ), 'w');

    }
    phantom.exit();
});


