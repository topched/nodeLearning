// Events ================================================================



// Functions =============================================================


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


//Adds a player to the available list
function addPlayerToAvailable(userId) {

    var html = '';
    
    $.ajax({
        type: 'GET',
        url: '/staff/player/' + userId

    }).done(function(resp) {

        //add player to the available table
        html += "<tr id='availRow" + userId + "'>";
        html += "<td><a class='fa fa-plus-square' id='avail" + userId + "'></a></td>";
        
        html += '<td>' + resp.firstname + '</td>';
        html += '<td>' + resp.lastname + '</td>';

        html += '</tr>'

        //update the html
        $('#availablePlayers table tbody').append(html);

        //add the click listener to remove available player
        $('#avail' + userId).on("click", function(){
            addPlayerToRoster(userId);
        });

        //remove the player from the roster list
        $('#rosRow' + userId).remove();

    });

}

//Adds a player to the roster list
function addPlayerToRoster(userId) {

    var html = '';
    
    $.ajax({
        type: 'GET',
        url: '/staff/player/' + userId

    }).done(function(resp) {

        //add player to teams roster table
        html += "<tr id='rosRow" + userId + "'>";
        //html += '<tr>'
        html += "<td><a class='fa fa-minus-square' id='ros" + userId + "'></a></td>";
        
        html += '<td>' + resp.firstname + '</td>';
        html += '<td>' + resp.lastname + '</td>';

        html += "<input type='hidden' name='id' value='" + userId + "'>";

        html += '</tr>'

        //update the html
        $('#currentTeamRoster table tbody').append(html);

        //add the click listener to remove roster player
        $('#ros' + userId).on("click", function(){
            addPlayerToAvailable(userId);
        });

        //remove the player from the available list
        $('#availRow' + userId).remove();

    });


}





