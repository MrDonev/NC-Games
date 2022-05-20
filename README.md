 ### Link to hosted version of the back-end app: https://donev-nc-games.herokuapp.com/api  



 ### App description :
 This back-end app provides API handling and requests to the database. Viewing, adding, updating or deleting reviews/comments is managed through 
 different URLs. More info on the functions and the APIs can be found at https://donev-nc-games.herokuapp.com/api

### Running requirements:
All dev dependencies should be installed before running the app. You can do that by using :
```
npm i
```
The database should be seeded first, references on the scripts could be found in the package.json file.
How to se the environment variables to access the database is explained below.

 ### Database connection:
 Connection to the database is established by setting environment variable in the .env files e.g. / .env.development contains PGDATABASE=your_database_name , env.test contains PGDATABASE=your_database_name_test /
