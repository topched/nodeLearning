// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    //populateTable();

});


// Events ================================================================



// Functions =============================================================

function editPlayer(event) {
    
    //toggle side nav
    $('#navAllPlayers').removeClass('active');
    $('#navAddPlayer').removeClass('active');
    $('#navEditPlayer').addClass('active');

    //show edit player form
    $('#showEditPlayerForm').removeClass('hidden');

    //hide all players
    $('#showViewAllPlayers').addClass('hidden');

    //hide player add form
    $('#showAddPlayerForm').addClass('hidden');
    
}

function showAddPlayer(event) {

    //toggle sidebar navbar
    $('#navAllPlayers').removeClass('active');
    $('#naveEditPlayer').removeClass('active');
    $('#navAddPlayer').addClass('active');

    //show player add form
    $('#showAddPlayerForm').removeClass('hidden');

    //hide all players
    $('#showViewAllPlayers').addClass('hidden');

    //hide player edit form
    $('#showEditPlayerForm').addClass('hidden');
};

function showAllPlayers(event) {

    //toggle sidebar nav
    $('#navAddPlayer').removeClass('active');
    $('#naveEditPlayer').removeClass('active');
    $('#navAllPlayers').addClass('active');

    //show all players
    $('#showViewAllPlayers').removeClass('hidden');

    //hide player add form
    $('#showAddPlayerForm').addClass('hidden');

    //hide player edit form
    $('#showEditPlayerForm').addClass('hidden');
}

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


