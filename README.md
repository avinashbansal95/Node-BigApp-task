# Node-BigApp-task
1) Firstly i set up the server in index.js file and installed required packages
2)After that i created a user model with various fields 
3)In user.js file(present in routes folder) a)'/users Route: it will list all the users in the database else it will notify nothing is present
b) Signup Route : First we are checking if mail id already exist. if it isn't then we will create a new user with hashed password then we will save the user and 
display details " user created". if we will face any error in creating user then we will send the error message
c) Login route : first we check if mailid matches in databse ,if it does then we will compare the password. after authenticating user we 
will generate jwt token and send that to user. Now this token will be used for protecting routes
d)balanced routes : User have to pass the token in the header(you just need to pass in the postman tool),if user don't do that then message
will say "You need to pass the token for accessing this route". If user pass this token then , he will be authenticated .
To check whether user has entered token or not i  have implemented a miidleware which will exexute brfore looging the user.
For checking balanced paraenthis i have implemented stack data structure. we will take paranthesis as input and if it balanced then we will
save them into the databse in new collections with the number of attempts otherwise notify user that it isn't balanced.

