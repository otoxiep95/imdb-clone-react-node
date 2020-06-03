# Ms. IMDB
#### Created by: Tiril Key Grimsrud, Alberto Pacheco and Mindaugas Jukna
A movie database web application based on IMDB and TMDB where you can browse and search for movies, add them to your watchlist, favorite them or leave reviews. 


## Installation
### The Movie DB API
1. Sign up with the Movie DB API and get approved for an API key
2. Navigate to the /client/config/ folder and create a file "keys.js" by copying the "keys_template.js" file, and adding your API key
### Server
1. Log into your local MySQL Database
2. Create a database
3. Navigate to the /server/config/ folder, and create a file "db_config.js" by copying the "db_config_template.js" contents, and replacing the database name, username and password with your own credentials
4. Open an IDE, navigate to the folder /server/ and run the following command
```bash
npm i
```
5. After all the packages are installed, while still in the /server/  directory, run the following commands in this order
```bash
knex migrate:rollback
```
 ```bash
knex migrate:latest
```
 ```bash
knex seed:run
```
6. When all the migrations and seed is completed, you can start the server by running the following command. 
 ```bash
nodemon server.js
```
Once completed you should see the message "Server is running on port 9090" in the terminal.

#### Nodemailer
To make nodemailer work, navigate to the /server/config/ folder, and create a file "mailer_config.js" by copying the "mailer_config_template.js" file and replace the credentials with your own gmail credentials. Use a gmail for testing purposes only, and make sure the security setting "allow less secure apps" is turned on in your gmail settings. 

### Client
1. In your IDE, navigate to /client/ folder and run the following commands in this order 
 ```bash
npm i
```
 ```bash
npm start
```

The project is now up and running! 

