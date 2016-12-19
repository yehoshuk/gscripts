function importData() {
  var fSource = DriveApp.getFolderById('0B5SBa_g3SMstb0ozMi1mbHBZaDA'); // reports_folder_id = id of folder where csv reports are saved
  var fi = fSource.getFilesByName('report.csv'); // latest report file
  var ss = SpreadsheetApp.openById('1119IY4cV3TPsMnRVk9HWhkE61Y62xOxY0-fNEkBCr44'); // data_sheet_id = id of spreadsheet that holds the data to be updated with new report data



    // variables being used i, j, k, n, m, a, d, x
  var threads = GmailApp.search('label:ktf-inbox from:giasupport@gia.edu subject:invoices label:unread') //search gmail with the given query(partial name using * as a wildcard to find anything in the current subject name).
  var msgs = GmailApp.getMessagesForThreads(threads); //retrieve all messages in the specified threads.
  //var sheet = SpreadsheetApp.create('test_filename', 2, 8); //creates a new spreadsheet in case I need to create it on a separate file.
  //you can get the id from your own google spreadsheet in your browser bar.
  //var sheet = SpreadsheetApp.openById('1119IY4cV3TPsMnRVk9HWhkE61Y62xOxY0-fNEkBCr44').getSheetByName('Sheet1');
  //sheet.clearContents(); //clears all the data in the specified tab, the code below will recreate the dataset once again.

  var newsheet = ss.insertSheet('NEWDATA'); // create a 'NEWDATA' sheet to store imported data

  for (var i = 0; i < msgs.length; i++) {
    Logger.log('Going through thread i = ' + i);
    for (var j = 0; j < msgs[i].length; j++) {
      Logger.log('Going through message j = ' + j);
      var emailDate = msgs[i][j].getDate();
      var attachments = msgs[i][j].getAttachments();
      for (var k = 0; k < attachments.length; k++) {

        Logger.log('Going through attachment k = ' + k);
        Logger.log(' - attachment k length = ' + attachments[k].length);

        /*search for the attachment by name, stringLen returns the start position number of the word 'filename' ignoring any previous characters, counting starts at 0.
        e.g. "test_filename", will output the number 6 "test_" will ends at 5 and 6 will start at "f" for filename. Than we use substring to get the actual name out of
        attachment name then we use the stringLen variable as a starting position and also as an end position plus the number of characters in word I'm searching for
        to get the attachment name, 8 is used because this is how many letters are in the string. Finally we create the stringValue variable and compare to see which
        attachments meet the criteria that we are looking for and return only that attachment.*/
        var attachmentName = attachments[k].getName();
        Logger.log(' - attachment k name = ' + attachmentName);

    var file = attachments[k];
    var csv = file.getDataAsString();
    var csvData = CSVToArray(csv); // see below for CSVToArray function

    // loop through csv data array and insert (append) as rows into 'NEWDATA' sheet
    for ( var i=0, lenCsv=csvData.length; i<lenCsv; i++ ) {
      newsheet.getRange(i+1, 1, 1, csvData[i].length).setValues(new Array(csvData[i]));
    }
    /*
    ** report data is now in 'NEWDATA' sheet in the spreadsheet - process it as needed,
    ** then delete 'NEWDATA' sheet using ss.deleteSheet(newsheet)
    */
    // rename the report.csv file so it is not processed on next scheduled run
    //file.setName("report-"+(new Date().toString())+".csv");
      }
    }
  }
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
