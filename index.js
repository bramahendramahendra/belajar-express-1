const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'courses1' },
    { id: 2, name: 'courses2' },
    { id: 3, name: 'courses3' },
]

app.get('/', (req, res) => {
    res.end('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    // memanggil function validate
    const result = validateCourse(req.body); //memanggil dengan cara result.error
    // const { error } = validateCourse(req.body); //memanggil dengan cara error
    // if invalid, return 400  bad request
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The courses with the given ID was not found.');

    // memanggil function validate
    // const result = validateCourse(req.body); //memanggil dengan cara result.error
    const { error } = validateCourse(req.body); //memanggil dengan cara error
    // if invalid, return 400  bad request
    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    course.name = req.body.name;
    // return the update course 
    res.send(course);
});

function validateCourse(course) {
    // Schema
    const schema = {
        name: Joi.string().min(3).required()
    };
    // Validate
    return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Npt exiting, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The courses with the given ID was not found.');

    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // return the same course
    res.send(course);
});







app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The courses with the given ID was not found.');
    res.send(course);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.query);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));