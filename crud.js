var express = require('express'),
    mongoose = require('mongoose'),
    port = 4008,
    router = express.Router(),
    fs = require('fs'),
    http = require('http'),
    bodyParser = require('body-parser');
    app = express(),
    schema = mongoose.Schema;
    mongoose.connect('mongodb://localhost:27017/dashboard', { useNewUrlParser: true });
    httpServer = http.createServer(app);

mongoose.set('useFindAndModify', false);
// Creating a mongoose schema
var userSchema = mongoose.Schema({
    _id: { type: String, required: true}, name: String, created_at: { type: Date, default: Date.now },
    sensors: [{ sensor_name: { type: String, required: true }, description: { type: String }, 
        measurements: [{ value: { type: String }, time: { type: Date, default: Date.now } }], u_id: { type: String }
    }]
});

// Creating a mongoose model for the schema
var User = mongoose.model('users', userSchema);

router.route('/').get(function(req, res) { res.send("Welcome to Sensor Dashboard") });

// Controllers
var getAllUsers = function(req, res){
    User.find({}, (function(err, dashboard) { if (err) throw err; res.send(dashboard); }));
};

var getUserById = function(req, res) {
    User.findOne({ _id: req.params._id }, function(err, dashboard){ if (err) throw err; res.send(dashboard); });
};

var createUser = function(req, res){
    var user = new User();
    user._id = req.body._id;
    user.name = req.body.name;
    user.save(function(err) { if (err) throw err; res.json({ message: 'User info created!'}); });
};

var recentSensors = function(req, res){
    User.find().sort({ $natural: -1 }).limit(2).find(function(err, dashboard) { if (err) res.send(err); res.send(dashboard); });
};

var updateSensor = function(req, res){
    User.findOneAndUpdate({ _id: req.params._id},
        { 
            $push: {
                "sensors": {
                    sensor_name: req.body.sensor_name,
                    description: req.body.description,
                    measurements: [],
                    u_id: req.params._id
                }
            }
        }, 
        { upsert: true, new: true }, function(err, dashboard) { if (err) res.send(err); res.send(dashboard)});
};

var updateSensorMeasurements = function(req, res){
    User.findOneAndUpdate({ _id: req.params._id, "sensors.sensor_name": req.params.sensor_name},
        { 
            $push: {
                "sensors.$.measurements": {
                    value: req.body.value
                }
            }
        }, 
        function(err, dashboard) { if (err) res.send(err); res.send(dashboard)});
};

// Routes
router.route('/sensors').get(getAllUsers)
router.route('/create_sensor').post(createUser);
router.route('/sensors/:_id').get(getUserById);
router.route('/recent_sensors/').get(recentSensors);
router.route('/update_sensor/:_id/').put(updateSensor);
router.route('/update_sensor_measurement/:_id/:sensor_name/').put(updateSensorMeasurements);


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/', router);
httpServer.listen(port);