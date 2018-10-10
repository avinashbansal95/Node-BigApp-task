const express    = require('express');
const router     = express.Router();
const User       = require('../models/users');
const Balanced   = require('../models/balanced');
const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const checkAuth  = require('../middleware/check-auth');
let attempt = 0;

//Routes to list all users
router.get('/users',(req,res,next)=>
{
    User.find()
    .exec()
    .then(users =>
        {
            console.log(users);
            if(users.length > 0)
            {
                res.status(200).json(users);
            }

            else{
                res.status(404).json({
                    error:"No entries found"
                })
            }
           
        })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

//for user registration
router.post('/signup',(req, res) =>
{

    //checking if email already exist
    User.find({email: req.body.email}).exec()
    .then(doc =>
        {
            if(doc.length >=1)    //it is an array of users
            {
                //if we find any result then simply return by sending a message
                return res.status(409).json({
                    message:"Email already exist"
                });
            }
            else
            {

                //otherwise create a new user

             //Encrypting password for security reasons into the DB
                bcrypt.hash(req.body.password,10,(err, hash) =>
                    {
                        if(err)
                        {
                          return res.status(500).json({
                              error:err
                          })
                        }
                        else
                        {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email   : req.body.email,
                                password:hash,
                                dob     :req.body.dob,
                                username:req.body.username,
                                role    :req.body.role
                               
                            });

                            user.save().then(newUser =>
                                {
                                    console.log(newUser);
                                    res.status(201).json(
                                        {
                                            message:"user created",
                                            userIs: user
                                        }
                                    )
                                })
                                .catch(err =>console.log(err));      
                        }
                    }) 
            }
        })
});

//For user login functionality

router.post("/login",(req, res, next) =>
{
   
    User.find({email:req.body.email,}).exec()
    .then(user =>
        {
            if(user.length <= 0) //if email doesn't exist in DB then simply return
            {
                
                return res.status(404).json({
                    message:"Email doesn't exist in the database"
                   
                })
            }
          else
          {
              //if email exists then compare passsword
              bcrypt.compare(req.body.password,user[0].password,(err, result) =>
              {
                  if(err)
                  {
                     //if password doesn't match 
                     return res.status(401).json({
                          error: "Auth failed"
                          
                      })
                  }
                  if(result){

                    //Generating jwt token to be used for protected routes
                   const token =  jwt.sign(
                       {
                        email:user[0].email,
                        userId:user[0]._id,
                        username:user[0].username
                    }, 
                    'secret',
                    {
                        expiresIn: '2h'
                    }
                    );
                    console.log("token is" + token);
                      return res.status(200).json({
                          message:"auth successful",
                          token:token,
                          important_info:'Change method to POST when click the link below',
                          URL_for_protected_path :'http://localhost:4000/balanced'
                      })
                  }
                  res.status(401).json({
                    error: "Auth failed"
                });
              });
          }

        })
    .catch(err =>
        {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
})


//Balanced parenthsis route

router.post("/balanced",checkAuth,(req, res, next) =>
{
   
   
    let input  = req.body.paranthesis;
    let username = req.body.username
    
    //
    if(input === undefined)
    return res.status(404).json({message:"Enter input in json format please"});
    inputArr = input.split('');
//function that checks paranthesis are balanced or not
function para(arr)
{
    const opening = ['{','[','('];
    const closing = ['}',']',')'];
    
    n = arr.length;
    const stack = [];
    for(let i=0;i<n;i++)
    {
        if(opening.includes(arr[i]))
        {
            stack.push(arr[i]);
            console.log(stack);

        }

        else{
            let top = stack[stack.length-1];
            let index = opening.indexOf(top);
           
            if(stack.length === 0 || closing[index] !== arr[i])
            {
                attempt++;
                return false;
            }
           
            else
            {
                 stack.pop();
            }
        }
      
      
    
    }
    if(stack.length > 0)
    {
        attempt++;
        return false
    }
    attempt++;
    return true;

}

//

if(para(inputArr) === true)
{
    console.log("Balanced parenthesis");

    const user = new Balanced(
        {
            username:username,
            message:'success'
        }
    )

    user.save()
    .then(result =>
        {
            res.status(201).json({
                message: "Balanced paraenthesis",
                Attempts:attempt,
                user:username,
                info:"Data saved in the database.Check it!!"
            })
            
        })
    .catch(err =>
        {
            res.status(500).json({error:"Some error occured while saving the data,try again!"})
        })
}
else{
    console.log("unbalanced paranthesis");
    
    return res.status(201).json(
        {
            message: "unBalanced paraenthesis",
            Attempts:attempt,
             user:username
        }
    )
   
}



//     //
})


//Admin delete functionality
router.delete("/users/:userid",(req, res, next) =>
{
    const id = req.params.userid;//Grab the id of the user and delete it
    User.remove({_id:id}).exec()
    .then(result=>
        {
            res.status(200).json({
                message:"user deleted",
                user:result
            })
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;
