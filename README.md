# CITS3403ProjectForOfflineUse

## About

This is repository of the entirity of the bacterial battles site for use as an offline NODE application.
This was created by the UWA Tyler Smith and Daniel Cocks for the CITS3403 Unit.
A online version is running at http://bacterialbattles.herokuapp.com

## Running the Application

Best way to run this application is to navigate to the folder and use nodemon to start the application.

## Running Online

Currently this is configured for offline use, this means it will look to a mongodb running locally. 
To deploy this to an online server requires changing references to the database to references to an online database such as a mlabs db.
Reference to this are in 
  * db.js: dbURI variable as well as the exported url variable


Other references are made ot localhost as being the website address these should be changed to your intended website URL
  * commentspage.js: the variable server in the exported APIsettings object
  * scorepage.js: the variable server in the exported APIsettings object
  * snakegame.js: the variable server in the exported APIsettings object
  * addcomments.jade: change to the submit function to submitted to correct url
  
