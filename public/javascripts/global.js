// Userlist data array for filling in info box
var playerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/players/playerlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.FirstName + '</td>';
            tableContent += '<td>' + this.LastName + '</td>';
            tableContent += '<td>' + this.DOB + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#playerList table tbody').html(tableContent);
    });
};


$('#btnAddPlayer').on('click', addPlayer);

//add player to the db
function addPlayer(event) {

    //basic form validation
    var errCnt = 0;
    $('#addPlayer input').each(function(index, val) {
        if($(this).val() === '') {errCnt++;}
    });

    //error free
    if(errCnt === 0) {

        //create a new player
        var newPlayer = {
            'FirstName': $('#addPlayer input#playerFirstName').val(),
            'LastName' : $('#addPlayer input#playerLastName').val(),
            'DOB' : $('#addPlayer input#playerDOB').val()
        }

        //ajax POST
        $.ajax({
            type: 'POST',
            data: newPlayer,
            url: 'players/addplayer',
            dataType: 'JSON'
        }).done(function(resp) {

            if(resp.msg === ''){

                //clear input form
                $('#addPlayer input').val('');

                //update player table
                populateTable();

            }else{

                //something went wrong
                alert('Error: ' + resp.msg);
            }

        });

    }else{

        //error filling in the form
        alert('Please fill in all the fields');
        return false;
    }

};


