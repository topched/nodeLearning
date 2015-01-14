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

            

        });
    }
};


