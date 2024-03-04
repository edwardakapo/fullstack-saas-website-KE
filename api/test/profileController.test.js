const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);
let agent = chai.request.agent(server)
const User = require("../models/user.js");
const bcrypt = require('bcryptjs');


let testUser = { 
	username : "mytestprofileusername",
	password : "mytestprofilenpassword",
	email : "mytestprofileemail@test.com",
	profileImageUrl : "https://images.squarespace-cdn.com/content/v1/5f1e0b6068df2a40e2df3f97/1609276997320-4XOPSY3LVOE2ZEIKLDNB/public.jpeg",
	
}
const expiredJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU0ZGEyZDlmZTBjNzBmYjhhYTM0ZTAiLCJ1c2VybmFtZSI6Im15dGVzdHByb2ZpbGV1c2VybmFtZSIsImlhdCI6MTcwOTQ5NzI4MiwiZXhwIjoxNzA5NTA0NDgyfQ.sn51v1bKdFfNbbUt-FagrGJVuUq-Vg24LQnL98TnjCM"
const existingEmail = "mytestemail@test.com"
const newProfileImageUrl = 'https://static-00.iconduck.com/assets.00/person-question-mark-icon-2048x2048-zqofu2hh.png';

describe('Profile Controller Tests', () => {
    let jwt; // Assume this is set to the JWT of the logged-in user
    before((done) => {
        agent
        .post('/register')
        .send(testUser)
        .end((err,res) => {
            if(err){
                console.error('Error occured:', err);
                return done(err)
            }
            jwt = res.body.Token;
            done()
        });  
    });

    describe('GET  user profile', () => {

        it('should get the profile of the logged-in user', (done) => {
            agent
                .get('/profile')
                .set('Authorization', `Bearer ${jwt}`)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('usersPosts');
                    expect(res.body).to.have.property('usersSavedPosts');
                    expect(res.body).to.have.property('usersAnsweredPosts');
                    expect(res.body).to.have.property('usersStars');
                    done();
                });
        });

        it('should not get the profile of an expired logged-in user', (done) => {
            agent
                .get('/profile')
                .set('Authorization', `Bearer ${expiredJwt}`)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    describe('PATCH update user password', () => {


        it('should update the password and Validate data in DB', (done) => {
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ oldPassword: testUser.password, newPassword: 'newPassword' })
                .end( async (err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(200);
                    // Fetch the user from the database
                    const user = await User.findOne({ username: testUser.username });
                    // Check that the password has been updated
                    const isMatch = await bcrypt.compare('newPassword', user.password);
                    expect(isMatch).to.be.true;
                    done();
                
                });
        });

        it('should not update the password if new password missing', (done) => {
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ oldPassword: testUser.password })
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should not update the password if old password missing', (done) => {
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ newPassword: 'newPassword' })
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should not update the password if no info entered', (done) => {
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ })
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should not update the password if password incorrect', (done) => {
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({oldPassword: 'incorrect', newPassword: 'newPassword' })
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err)
                    }
                    expect(res).to.have.status(400);
                    done();
                });
        });

        after((done) => {
            // Revert the password after each test
            agent
                .patch('/profile/password')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ oldPassword: 'newPassword', newPassword: testUser.password })
                .end((err, res) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('PATCH update user email', () => {

        it('Should update email and validate change in DB', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ password: testUser.password, newEmail: 'newEmail@test.com' })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(200);
                // Fetch the user from the database
                User.findOne({ username: testUser.username })
                .then(user => {
                    // Check that the email has been updated
                    expect(user.email).to.equal('newEmail@test.com');
                    done();
                })
                .catch(err => {
                    console.error('Error occured:', err);
                    done(err);
                });
            });
        });

        it('Should not update email if password incorrect', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ password: 'incorrect password', newEmail: 'newEmail@test.com' })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(401);
                done();
            });

        });
        it('Should not update email if email exists in DB', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ password: testUser.password, newEmail: existingEmail })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(404);
                done();
            });

        });
        it('Should not update email if no password given', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({newEmail: 'newEmail@test.com' })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            });

        });
        it('Should not update email if no email given', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ password: testUser.password })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            });

        });
        it('Should not update email if no data given', (done) => {
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    return done(err)
                }
                expect(res).to.have.status(400);
                done();
            });

        });

        after((done) => {
            //revert the email after tests
            agent
            .patch('/profile/email')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ password: testUser.password, newEmail: testUser.email })
            .end((err, res) => {
                if (err) {
                    console.error('Error occurred:', err);
                    return done(err);
                }
                done();
            });

        })
    })

    describe('PATCH update user profile picture', () => {

        it('should update the profile picture and validate change in DB', (done) => {
            agent
                .patch('/profile/picture')
                .set('Authorization', `Bearer ${jwt}`)
                .send({ imageUrl: newProfileImageUrl })
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        done(err);
                    }
                    expect(res).to.have.status(200);
                    // Fetch the user from the database
                    User.findOne({ username: testUser.username })
                    .then(user => {
                        // Check that the profile picture has been updated
                        expect(user.profileImageUrl).to.equal(newProfileImageUrl);
                        done();
                    })
                    .catch(err => {
                        console.error('Error occured:', err);
                        done(err);
                    });
                });
        });

        it('should not update if no imageURL given', (done) => {
            agent
            .patch('/profile/picture')
            .set('Authorization', `Bearer ${jwt}`)
            .send({ })
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    done(err);
                }
                expect(res).to.have.status(400);
                done();
            });
            
        })
        
    })

    describe('DELETE user profile', () => {
        let newUserJwt;
        const newUser = {
            username: "newDeleteTestUser",
            password: "newPassword",
            email: "newDeleteTestUser@test.com",
            profileImageUrl: newProfileImageUrl
        };
    
        before((done) => {
            // Create a new user before the tests
            agent
                .post('/register')
                .send(newUser)
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        return done(err);
                    }
                    newUserJwt = res.body.Token;
                    done();
                });
        });
        it('should not delete the user if username is wrong', (done) => {
            agent
            .delete('/profile')
            .set('Authorization', `Bearer ${newUserJwt}`)
            .send({username : "wrong username", password : newUser.password})
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    done(err);
                }
                expect(res).to.have.status(403);
                done();
            });
        });


        it('should not delete the user if passwod is wrong', (done) => {
            agent
            .delete('/profile')
            .set('Authorization', `Bearer ${newUserJwt}`)
            .send({username : newUser.username, password : "wrong password"})
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    done(err);
                }
                expect(res).to.have.status(400);
                done();

            });
        });

        
        it('should not delete the user if fields are missing', (done) => {
            agent
            .delete('/profile')
            .set('Authorization', `Bearer ${newUserJwt}`)
            .send({})
            .end((err, res) => {
                if(err){
                    console.error('Error occured:', err);
                    done(err);
                }
                expect(res).to.have.status(401);
                done();
            });
        });
    
        it('should delete the user profile and validate removal from DB', (done) => {
            agent
                .delete('/profile')
                .set('Authorization', `Bearer ${newUserJwt}`)
                .send({username : newUser.username, password : newUser.password})
                .end((err, res) => {
                    if(err){
                        console.error('Error occured:', err);
                        done(err);
                    }
                    expect(res).to.have.status(200);
                    // Fetch the user from the database
                    User.findOne({ username: newUser.username })
                    .then(user => {
                        // Check that the user has been deleted
                        expect(user).to.be.null;
                        done();
                    })
                    .catch(err => {
                        console.error('Error occured:', err);
                        done(err);
                    });
                });
        });

    });

    after(async () => {
        try {
            // Delete the test user
            await User.deleteOne({ username: testUser.username });
    
        } catch (err) {
            console.error('Error in after hook:', err);
        }
    });

});
