const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
chai.use(chaiHttp);
const expect = chai.expect;
let agent = chai.request.agent(server);
const User = require("../models/user.js");
const bcrypt = require('bcryptjs');
const { DEFAULT_IMG_URL, MAX_AGE } = process.env


describe('AUTH Controller Tests', () => {

    describe('/POST register (New User Sign Up TestCases)', () => {
        let jwt;

        it('Register a user, set, store in database, then check database to verify new user data', (done) => {
            let user = {
                username: "myusername",
                email : "testemail@test.com",
                password: "mypassword",
                profileImageUrl: DEFAULT_IMG_URL,
            }
            agent
                .post('/register')
                .send(user)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    // check for status
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Token')
                    jwt = res.body.Token;
                    // Assuming User is your user model
                    User.findOne({username: user.username})
                    .then(foundUser => {
                        expect(foundUser).to.exist;
                        expect(foundUser.username).to.equal(user.username);
                        expect(foundUser.email).to.equal(user.email);
                        expect(foundUser.profileImageUrl).to.equal(user.profileImageUrl);
                        // Use bcrypt to compare the password
                        bcrypt.compare(user.password, foundUser.password, (err, isMatch) => {
                            if(err){
                                console.error('Error occured:', err);
                                return done(err)
                            };
                            expect(isMatch).to.be.true; // This asserts that the password matches

                            // logout
                            agent
                            .post('/logout') 
                            .set('Authorization', `Bearer ${jwt}`)
                            .end((err, res) => {
                                if(err){
                                    console.error('Error occured:', err);
                                    return done(err)
                                }
                                expect(res).to.have.status(200);
                                done();
                            });
                        });
                    })
                    .catch(err => {
                        if(err){
                            console.error('Error occured:', err);
                            return done(err)
                        };
                    });
                });
        });

        it('Not Register a user with an existing username', (done) => {
            let user = {
                username: "myusername",
                email : "testemail@test.com",
                password: "mypassword",
            }
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })    
        });

        it('Not Register a user with missing username', (done) => {
            let user = {
                email : "testemail@test.com",
                password: "mypassword",
            }
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })      
        });

        it('Not Register a user with missing email', (done) => {
            let user = {
                username: "myusername",
                password: "mypassword",
            }
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })       
        });

        it('Not Register a user with missing password', (done) => {
            let user = {
                username: "myusername",
                email : "testemail@test.com",
            }
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })       
        });

        it('Not Register a user with undefined user data', (done) => {
            let user = { 
                username : undefined,
                email : undefined,
                password :undefined,
            };
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })       
        });


        it('Not Register a user with missing user data', (done) => {
            let user = { }
            agent.post('/register')
            .send(user)
            .end((err,res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            })    
        });




        //close database connection
        after(async () => {
            try {
                // Delete the test user
                await User.deleteOne({ username: "myusername" });
        
            } catch (err) {
                console.error('Error in after hook:', err);
            }
        });
    });



    describe('Login Testing', () => {
        let jwt

        // Test the /POST login route
        describe('/POST login', () => {

            it('User Should Login and access auth page', (done) => {
                let user = {
                    username : "mytestloginusername",
                    password : "mytestloginpassword",
                }
                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        if(err){
                            console.error('Error occured:', err);
                            return done(err)
                        }
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('Token');
                        jwt = res.body.Token
                            agent
                            .get('/testAuthRoute')
                            .set('Authorization' , `Bearer ${jwt}`) 
                            .end((err, res) => {
                                if(err){
                                    console.error('Error occured:', err);
                                    return done(err)
                                }
                                expect(res).to.have.status(200);
                                done();
                            });

                        
                    });
            });

        it('User Should Login and logout', (done) => {
            let user = {
                username : "mytestloginusername",
                password : "mytestloginpassword",
            }
            agent
                .post('/login')
                .send(user)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('Token');
                    jwt = res.body.Token
                        agent
                        .post('/logout')
                        .set('Authorization' , `Bearer ${jwt}`) 
                        .end((err, res) => {
                            if(err){
                                console.error('Error occured:', err);
                                return done(err)
                            }
                            expect(res).to.have.status(200);
                            done();
                        });

                    
                });
        });


            it('User should not Login with wrong password', (done) => {
                let user = {
                    username : "mytestloginusername",
                    password : "wrongpassword",
                }
                agent
                .post('/login')
                .send(user)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(400);
                    expect(res.body).to.not.have.property('Token');
                    done();

                    
                });

            });
            it('User should not Login with missing credentials pt1', (done) => {
                let user = {
                    username : "mytestloginusername",
                }
                agent
                .post('/login')
                .send(user)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(400);
                    expect(res.body).to.not.have.property('Token');
                    done();

                    
                });
                
            });
            it('User should not Login with missing credentials pt2', (done) => {
                let user = { }
                agent
                .post('/login')
                .send(user)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(400);
                    expect(res.body).to.not.have.property('Token');
                    done();

                    
                });
                
            });
            it('should not login a user with same JWT as previous session', (done) => {
                let user = {
                    username: "mytestloginusername",
                    password: "mytestloginpassword"
                }
                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        if(err){
                            console.error('Error occured:', err);
                            return done(err)
                        }
                        expect(res.body).to.have.property('Token');
                        let firstjwt = res.body.Token
                        // Logout
                        agent
                            .post('/logout')
                            .set('Authorization' , `Bearer ${firstjwt}`) 
                            .end((err, res) => {
                                if(err){
                                    console.error('Error occured:', err);
                                    return done(err)
                                }
                                expect(res).to.have.status(200);
                                // Login again
                                setTimeout(() => {
                                    agent
                                        .post('/login')
                                        .send(user)
                                        .end((err, res) => {
                                            if(err){
                                                console.error('Error occured:', err);
                                                return done(err)
                                            }
                                            expect(res).to.have.status(200);
                                            expect(res.body).to.have.property('Token');
                                            let secondjwt = res.body.Token
                
                                            // Check that the cookies are not the same
                                            expect(firstjwt).to.not.equal(secondjwt);
                                            done();
                                        });
                                }, 1500 );// 1.5seconds wait to ensure that the jwt have different time properties
                            });
                    });
            });

        });

    });

    describe('Logout Testing', () => {

        it('Should Logout a user and delete jwt cookie', (done) => {

            
            let user = {
                username : "mytestloginusername",
                password : "mytestloginpassword",
            }
            // Login
            agent
            .post('/login')
            .send(user)
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('Token');
                let jwt = res.body.Token
                
                //logout
                agent
                .post('/logout')
                .set('Authorization' , `Bearer ${jwt}`) 
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    done()
                })
            });
        });

        it('Should not be able to Logout twice' , (done) => {

            let user = {
                username : "mytestloginusername",
                password : "mytestloginpassword",
            }
            // Login
            agent
            .post('/login')
            .send(user)
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('Token');
                let jwt = res.body.Token
                
                // first logout
                agent
                .post('/logout')
                .set('Authorization' , `Bearer ${jwt}`) 
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    let secondJwt = res.body.Token
                        // second Logout
                        agent
                        .post('/logout')
                        .set('Authorization' , `Bearer ${secondJwt}`) 
                        .end((err, res) => {
                            if(err){
                                console.error('Error occured:', err);
                                return done(err)
                            }
                            expect(res).to.have.status(401);
                            done()
                        })
                    
                })
            });
        });


        it('Should not be able to access authorized route after log out' , (done) => {
            
            let user = {
                username : "mytestloginusername",
                password : "mytestloginpassword",
            }
            // Login
            agent
            .post('/login')
            .send(user)
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('Token');
                let jwt = res.body.Token
                
                //logout
                agent
                .post('/logout')
                .set('Authorization' , `Bearer ${jwt}`) 
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    expect(res.body).to.not.have.property('Token');
                    let secondjwt = res.body.Token
                    
                        //test with autorized route
                        agent
                        .get('/testAuthRoute')
                        .set('Authorization' , `Bearer ${secondjwt}`) 
                        .end((err, res) => {
                            if(err){
                                console.error('Error occured:', err);
                                return done(err)
                            }
                            expect(res).to.have.status(401);
                            done()
                        })
                })
            });

        })

    });
});
