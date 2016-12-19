
function importData() {

  var ss = SpreadsheetApp.openById('1119IY4cV3TPsMnRVk9HWhkE61Y62xOxY0-fNEkBCr44'); // data_sheet_id = id of spreadsheet that holds the data to be updated with new report data
  var newsheet = ss.insertSheet('NEWDATA'); // create a 'NEWDATA' sheet to store imported data

  // variables being used i, j, k, n, m, a, d, x

  //search gmail with the given query(partial name using * as a wildcard to find anything in the current subject name).
  var threads = GmailApp.search('label:ktf-inbox from:giasupport@gia.edu subject:invoices label:unread')

  //retrieve all messages _IN THREADS_ using the specified search string.
  var msgs = GmailApp.getMessagesForThreads(threads);

  //iterate through each message _THREAD_ that gmail search found
  for (var i = 0; i < msgs.length; i++) {

    //iterate through each message _IN EACH THREAD_ that gmail search found
    for (var j = 0; j < msgs[i].length; j++) {

      var emailDate = msgs[i][j].getDate(); //not doing anything with this at the moment
      var attachments = msgs[i][j].getAttachments(); //not doing anything with this at the moment

      //iterate through each attachment in each message
      for (var k = 0; k < attachments.length; k++) {

        var attachmentName = attachments[k].getName();
          var file = attachments[k];
          var csv = file.getDataAsString();
          // loop through csv data array and insert (append) as rows into 'NEWDATA' sheet
            for ( var i=0, lenCsv=csvData.length; i<lenCsv; i++ ) {
              newsheet.getRange(i+1, 1, 1, csvData[i].length).setValues(new Array(csvData[i]));
    }
    /*
    ** report data is now in 'NEWDATA' sheet in the spreadsheet - process it as needed,
    ** then delete 'NEWDATA' sheet using ss.deleteSheet(newsheet)
    */
    // change the labels on the gmail messages so that they are not processed on next scheduled run
      // change label code to go here

      } //iteration through attachments
    } // iteration through messages
  } // iteration through threads
};


// http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray( strData, strDelimiter ) {
  // Check to see if the delimiter is defined. If not,
  // then default to COMMA.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
};
