var express = require('express'),
    mongoose = require('mongoose'),
    
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
    
    port = 4007,
    router = express.Router(),
    fs = require('fs'),
    http = require('http'),
    
    app = express(),
    schema = mongoose.Schema;
    mongoose.connect('mongodb://localhost:27017/newSensor', { useNewUrlParser: true });
    httpServer = http.createServer(app);


// Creating a mongoose schema
var userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    sensors: [{
        sensor_name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        measurements: [{
            value: {
                type: String
            },
            time: {
                type: Date,
                default: Date.now
            }
        }],
        u_id: {
            type: String
        }
    }]
});

// Creating a mongoose model for the schema
var User = mongoose.model('users', userSchema);

router.route('/').get(function(req, res) {
    res.send("Welcome to Sensor Dashboard")
});

var getAllUsers = function(req, res){
    User.find({}, (function(err, newSensor) {
        if (err) throw err;
        res.send(newSensor); 
    }));
};

var getUserById = function(req, res) {
    User.findOne({ _id: req.params._id }, function(err, newSensor){
        if (err) res.send(err);
        res.send(newSensor);
    });
};

var createUser = function(req, res){
    var user = new User();
    user._id = req.body._id;
    user.name = req.body.name;
 
    user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'User info created!'});
    });
};

var recent_sensors = function(req, res){
    User.find().sort({ $natural: -1 }).limit(5).find(function(err, newSensor) {
        if (err) res.send(err);
        res.send(newSensor);
    });
};


router.route('/sensors').get(getAllUsers);
router.route('/sensors/:_id').get(getUserById);
router.route('/recent_sensors/').get(recent_sensors);

// router.route('/sensors')
//     .get(function(req, res) {
//         User.find(function(err, newSensor) {
//             if (err)
//                 res.send(err);
//             res.send(newSensor);
//         });
//     });


// router.route('/sensors/:_id')
//     .get(function(req, res) {
//         User.findOne({
//             _id: req.params._id
//         }, function(err, newSensor) {
//             if (err)
//                 res.send(err);
//             res.send(newSensor);
//         });
//     });

// router.route('/recent_sensors/')
//     .get(function(req, res) {
//         User.find().sort({
//             $natural: -1
//         }).limit(5).find(function(err, newSensor) {
//             if (err)
//                 res.send(err);
//             res.send(newSensor);
//         });
//     });


// // POST : Creating a new user with _id, name and empty sensor array.
// // INPUT : _id and name
// router.route('/sensors/')
//     .post(function(req, res) {
//         var user = new User();
//         user._id = req.body._id;
//         user.name = req.body.name;
//         var user_dict = {
//             "_id": user._id,
//         };

//         var options = {
//             "header": {
//                 "typ": "JWT"
//             }
//         };
//         var token = jwt.sign(JSON.stringify(user_dict), app.get('superSecret'), options);

//         //save the info
//         user.save(function(err) {
//             if (err)
//                 res.send(err);
//             res.json({
//                 message: 'User info created!',
//                 token: token
//             });
//         });
//     });


// // PUT : Updates the sensor array with sensor name, description and empty measurments array
// // INPUT : sensor_name, description and token
// router.route('/sensors/:_id/')
//     .put(function(req, res) {
//         var token = req.body.token
//         if (token) {
//             // verifies secret
//             jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//                 if (err) {
//                     return res.json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     req.decoded = decoded;
//                     var user_dict = {
//                         "_id": req.params._id,
//                     };
//                     if (JSON.stringify(req.decoded) == JSON.stringify(user_dict)) {
//                         // user verified 
//                         User.findOneAndUpdate({
//                             _id: req.params._id,
//                             sensors: {
//                                 $nin: [{
//                                     sensor_name: req.body.sensor_name
//                                 }]
//                             }
//                         }, {
//                             $push: {
//                                 "sensors": {
//                                     sensor_name: req.body.sensor_name,
//                                     description: req.body.description,
//                                     measurements: [],
//                                     u_id: req.params._id
//                                 }
//                             }
//                         }, {
//                             upsert: true,
//                             new: true
//                         }, function(err, newSensor) {
//                             if (err)
//                                 res.send(err);
//                             res.send(newSensor)
//                         });
//                     } else {
//                         res.json({
//                             success: false,
//                             message: 'Failed to authenticate token.'
//                         });
//                     }
//                 }
//             });
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     });


// // PUT : Updates timestamp and value in the measurements array
// // INPUT : value and token
// router.route('/sensors/:_id/:sensor_name/')
//     .put(function(req, res) {
//         var token = req.body.token
//         if (token) {
//             // verifies secret
//             jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//                 if (err) {
//                     return res.json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     req.decoded = decoded;
//                     var user_dict = {
//                         "_id": req.params._id,
//                     };
//                     if (JSON.stringify(req.decoded) == JSON.stringify(user_dict)) {
//                         // user verified 
//                         User.findOneAndUpdate({
//                             _id: req.params._id,
//                             "sensors.sensor_name": req.params.sensor_name
//                         }, {
//                             $push: {
//                                 "sensors.$.measurements": {
//                                     value: req.body.value
//                                 }
//                             }
//                         }, function(err, newSensor) {
//                             if (err)
//                                 res.send(err);
//                             res.send(newSensor)
//                         });
//                     } else {
//                         res.json({
//                             success: false,
//                             message: 'Failed to authenticate token.'
//                         });
//                     }
//                 }
//             });
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     });

// // PUT : Updates name
// // INPUT : _id and name
// router.route('/update_name/:_id/')
//     .put(function(req, res) {
//         var token = req.body.token
//         if (token) {
//             // verifies secret
//             jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//                 if (err) {
//                     return res.json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     req.decoded = decoded;
//                     var user_dict = {
//                         "_id": req.params._id,
//                     };
//                     if (JSON.stringify(req.decoded) == JSON.stringify(user_dict)) {
//                         // user verified 
//                         User.findOneAndUpdate({
//                             _id: req.param._id
//                         }, {
//                             $set: {
//                                 name: req.body.name
//                             }
//                         }, function(err, newSensor) {
//                             if (err)
//                                 res.send(err);
//                             res.send(newSensor)
//                         });
//                     } else {
//                         res.json({
//                             success: false,
//                             message: 'Failed to authenticate token.'
//                         });
//                     }
//                 }
//             });
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     });


// // DELETE
// router.route('/sensors/:_id')
//     .delete(function(req, res) {
//         var token = req.body.token
//         if (token) {
//             // verifies secret
//             jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//                 if (err) {
//                     return res.json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     req.decoded = decoded;
//                     var user_dict = {
//                         "_id": req.params._id,
//                     };
//                     if (JSON.stringify(req.decoded) == JSON.stringify(user_dict)) {
//                         // user verified 
//                         User.remove({
//                             _id: req.params._id
//                         }, function(err, newSensor) {
//                             if (err)
//                                 res.send(err);
//                             res.json({
//                                 message: 'User deleted'
//                             })
//                         });
//                     } else {
//                         res.json({
//                             success: false,
//                             message: 'Failed to authenticate token.'
//                         });
//                     }
//                 }
//             });
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
//     });

app.use('/', router);
httpServer.listen(port);