var db;
var dbCreated = false;

$(document).ready(function() {
	    db = window.openDatabase("pagesDB", "1.0", "PhoneGap Demo", 200000);
	    if (dbCreated)
	    	//db.transaction(getEmployees, transaction_error);
            console.log("poplulate it");
	    else
	    	db.transaction(populateDB, transaction_error, populateDB_success);
});
function transaction_error(tx, error) {
	$('#busy').hide();

    alert("Database Error: " + error);
}

function populateDB_success() {
	dbCreated = true;
    console.log('db created');
    //db.transaction(getEmployees, transaction_error);
}

function populateDB(tx) {
	$('#busy').show();
   
    tx.executeSql('DROP TABLE IF EXISTS pages');
    
	var sql = 
	"CREATE TABLE IF NOT EXISTS pages ( "+
		"id varchar(50) PRIMARY KEY, " +
		"pagetitle VARCHAR(255), " +
		"pagecontent VARCHAR(3000), " +
		"pageActive bit, " +
		"lastupdated date, " + 
		"lastupdatedusername VARCHAR(50))";
    tx.executeSql(sql);
    loadJson();
}
function loadJson(){
    $.getJSON( "https://mercury.hamilton.edu:7075/appPages/ajax/getpages.cfm", function( data ) { 
        db.transaction(function (transaction) {
            var len = data.length;
            for(var i = 0; i < len; i++) {
                var id=data[i].id;
                var pagetitle=data[i].pagetitle;           
                var pagecontent=data[i].pagecontents;  
                var pageactive=data[i].pageactive; 
                var lastupdated=data[i].lastupdated; 
                var lastupdatedusername=data[i].lastupdatedusername; 
                transaction.executeSql('INSERT INTO pages (id,pagetitle, pagecontent, pageActive, lastupdated, lastupdatedusername) VALUES (?,?,?,?,?,?)',[id, pagetitle, pagecontent, pageactive, lastupdated,lastupdatedusername]);
            }
        });
    });
};