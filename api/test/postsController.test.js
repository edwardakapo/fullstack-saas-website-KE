const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
chai.use(chaiHttp);
const expect = chai.expect;
let agent = chai.request.agent(server);
const User = require("../models/user.js");
const Post = require("../models/post.js");

let testUser = { 
	username : "mytestpostusername",
	password : "mytestpostpassword",
	email : "mytestpostemail@test.com",
	
}
describe('GET post tests', () => {
    let jwt; // Assume this is set to the JWT of the logged-in user
    let user_id;//Assume ID of logged in user
    before((done) => {
        // create a test user then create test posts with that user
        // log in before running test
        agent
        .post('/register')
        .send(testUser)
        .end((err,res) => {
            if(err){
                console.error('Error occured:', err);
                return done(err)
            }
            expect(res).to.have.status(200);
            jwt = res.body.Token;
            user_id = res.body.user
            let completedRequests = 0;
            for (let i = 0; i < 5; i++) {
                const postData = {
                    title: `Post ${i}`,
                    text: `Body ${i}`
                };
                agent
                    .post('/post')
                    .send(postData)
                    .set('Authorization', `Bearer ${jwt}`)
                    .end((err, res) => {
                        if(err){
                            console.error('Error occured:', err);
                            return done(err)
                        }
                        expect(res).to.have.status(200);
                        const postId = res.body.post._id;
                        for (let j = 0; j < 2; j++) {
                            const commentData = {
                                // replace with your actual comment data
                                text: `Comment ${j}`
                            };
                            agent
                                .patch(`/post/${postId}/comment`)
                                .send(commentData)
                                .set('Authorization', `Bearer ${jwt}`)
                                .end((err, res) => {
                                    if(err){
                                        console.error('Error occured:', err);
                                        return done(err)
                                    }
                                    expect(res).to.have.status(200);
                                    expect(res.body.comments).to.be.a('array');
                                    completedRequests++;
                                    if (completedRequests === 10) {
                                        done();
                                    }
                                });
                        }
                    });
            };
        });
    });

        it('Should get the posts that were created and validate their fields', (done) => {
            agent
            .get('/post')
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(5);
                res.body.forEach(post => {
                    expect(post).to.be.a('object');
                    expect(post).to.have.property('author');
                    expect(post).to.have.property('authorId');
                    expect(post).to.have.property('title');
                    expect(post).to.have.property('body');
                    expect(post).to.have.property('comments');
                    expect(post.comments.length).to.equal(2);
                    // ... other properties ...
                });
                done();
            });

        })
        it('Should get the post id specified', async () => {
            let findUser = await User.findOne({username : testUser.username});
            let postId = findUser.usersPosts[0]
            agent
            .get(`/post/${postId}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.comments.length).to.equal(2);
            });
        })

    after( async() => {
        try {            
            await User.deleteOne({username : testUser.username});
            await Post.deleteMany({ author: testUser.username});

        } catch (err) {
            console.error('Error in after hook:', err);
        }



    });
});
/*
    describe('Posts Controller Tests', () => {

        // Test the POST /post route
        it('should create a new post', (done) => {
            const post = {
                title: 'Test Post',
                text: 'This is a test post.'
            };
            agent
                .post('/post')
                .send(post)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.title).to.equal(post.title);
                    expect(res.body.text).to.equal(post.text);
                    postId = res.body._id; // Save the post ID for the next test
                    done();
                });
        });

        // Test the GET /post/:id route
        it('should get a post by id', (done) => {
            chai.request(app)
                .get(`/post/${postId}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res.body._id).to.equal(postId);
                    done();
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
});
*/