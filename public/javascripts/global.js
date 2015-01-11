// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});


// Events ================================================================



// Functions =============================================================

function showAddPlayer(event) {

    //toggle sidebar navbar
    $('#navAllPlayers').removeClass('active');
    $('#navAddPlayer').addClass('active');

    //show player add form
    $('#showAddPlayerForm').removeClass('hidden');

    //hide all players
    $('#showViewAllPlayers').addClass('hidden');
};

function showAllPlayers(event) {

    //toggle sidebar nav
    $('#navAllPlayers').addClass('active');
    $('#navAddPlayer').removeClass('active');

    //hide player add form
    $('#showAddPlayerForm').addClass('hidden');

    //show all players
    $('#showViewAllPlayers').removeClass('hidden');

    populateTable();
}

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    $.getJSON( '/players/playerlist', function( data ) {

        //alert(data.length);

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){

            tableContent += '<tr>';
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td>' + this.birthdate + '</td>';
            tableContent += '</tr>';

        });

        console.log(tableContent);

        // Inject the whole content string into our existing HTML table
        $('#playerList table tbody').html(tableContent);
    });
};


//add player to the collection
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
            'firstname': $('#addPlayer input#playerFirstName').val(),
            'lastname' : $('#addPlayer input#playerLastName').val(),
            'birthdate' : $('#addPlayer input#playerBirthDate').val()
        }

        //ajax POST
        $.ajax({
            type: 'POST',
            data: newPlayer,
            url: 'staff/createplayer',
            dataType: 'JSON'
        }).done(function(resp) {

            if(resp.msg === ''){

                //clear input form and show all players
                $('#addPlayer input').val('');
                showAllPlayers();

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


//remove player from the collection
function removePlayer(event){

    var confirmation = confirm('Are you sure you want to delete this player?');

    if(confirmation === true) {

        $.ajax({
            type: 'DELETE',
            url: 'players/deleteplayer/' + $(this).attr('rel')
        }).done(function(response) {

            //check response
            if(response.msg != '') {
                alert('Error ' + response.msg);
            }

            //update player table
            populateTable();

        });
    }
};


