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

}

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    $.getJSON( '/players/playerlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){

            tableContent += '<tr>';
            tableContent += '<td>' + this.username + '</td>';//put username here once that part is done
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td>' + this.birthdate + '</td>';
            tableContent += '</tr>';

        });

        // Inject the whole content string into our existing HTML table
        $('#playerList table tbody').html(tableContent);
    });
};

function validatePlayerAddForm() {

    var errCnt = 0;
    $('#addPlayer input').each(function(index, val) {
        if($(this).val() === '') {errCnt++;}
    });

    if(errCnt > 0) {
        alert("Please fill in all fields");
        return false;
    }
}

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


