# Recipe website
This is project I am working for a month now.
The purpose for this project is that people recipe books, could self-host a save all of the recipes on to the site and don't need to bring the recipe books where ever they go.

## Requirements
This project uses:
- Node.js
- Postgresql

## Installation
1. Installing postgresql (Use the preferred package manager to install)  
If you have postgresql already installed, you can jump to step 4
```
apt install postgresql
```

2. Change the password of the user postgres
```
sudo passwd postgres
```
After prompt enter password

3. Start postgresql server
```
sudo service postgresql start
```

4. Create the database
```
sudo psql -U postgres
```
If this gives you an error, try [this](https://stackoverflow.com/a/26735105).  
Login using the password you used in step 2
When logged in psql.
```
CREATE DATABASE recipeDB;
```
You can use a different name of the DB. Just replace `recipeDB`. I will use `recipeDB`.

5. Importing DB schema from repository
```
git clone https://github.com/ItsOKayCZ/Web
cd "Web/2020/Online recipes"
psql -U postgresl recipeDB < DB.psql
```
When prompted, enter password.

6. Install nodejs and npm
If you have nodejs and npm already installed, jump to step 7.
```
apt install nodejs npm
```

7. Install packages
```
npm install
```

8. Enter credientals
In the file `cred` enter the credentials to the postgresql server.
Example:
```
DBusername='postgres'
DBdatabase='recipeDB'
DBpassword='123456'
```

9. Run the server
```
node index.js
```

10. Viewing page  
Open you preferred explorer and in the URL bar write `http://127.0.0.1:8080`.

