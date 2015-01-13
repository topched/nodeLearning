# nodeLearning

Project for learning node.js

## Basic Setup Instructions:
* Create a local instance of mongoDB inside /data
* Run command npm install
* Manually create a admin user(TODO: automate this process)
*   1. Uncomment signup link in index.js
*   2. Start app with node app.js then navigate to localhost:8080 
*   3. Fill in form and create user(NOTE: this will create an undefined player. Will be fixed when the TODO above is complete)
*   4. Start mongo(From wherever you have mongo installed)
*   5. Switch to nodeLearning
*   6. Find the user you created in the users collection
*   7. Change admin from false to true
*   8. Recomment the signup link in index.js
*   9. Restart the app and you will be able to log in with admin credentials


#TODO
* Create new user when creating a player and link the collections
* Create player page
* Create teams and link players
* Add more fields to the player model
* Format birthdate so its more human-friendly
* automate initially creating admin user
* Make the connect-flash message only show for a brief period of time
* (more to come)


