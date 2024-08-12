var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

 


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);




//-----------------------------------------------------------------
const courses = 
  [
    { id: 1, name: 'Emerging Technologies', professorId: 1 },
    { id: 2, name: 'Java EE', professorId: 1 },
    { id: 3, name: 'Networking For Software Developers', professorId: 1 },
    { id: 4, name: 'Enterprise Integration Systems', professorId: 2 },
    { id: 5, name: 'IT Management', professorId: 2 },
    { id: 6, name: 'Software Development Project 1', professorId: 2 },

  ]
const professors = [
  {id:1, lastName:'Hernandez', firstName:'Diego'},
  {id:2, lastName:'Gonzalez', firstName:'Saul'},
  {id:3, lastName:'Ceballos', firstName:'Maria'},
  {id:4, lastName:'Gonzalez', firstName:'Fernanda'},
  {id:5, lastName:'Celmo', firstName:'Ricardo'},
  {id:6, lastName:'Gonzalez', firstName:'Jesus'}
]

const CourseType = new GraphQLObjectType({
  name:'Course',
  description:'Represents courses from a college',
  fields:()=> ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name:{ type: GraphQLNonNull(GraphQLString)},
    professorId:{ type: GraphQLNonNull(GraphQLInt)},
    professor:{
      type:ProfessorType,
      resolve:(course)=>{
        return professors.find(professor => professor.id === course.professorId);
      }
      
    }
  })
})

const ProfessorType = new GraphQLObjectType({
  name:'Professor',
  description:'Represents professors from a college',
  fields:()=> ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    firstName:{ type: GraphQLNonNull(GraphQLString)},
    lastName:{ type: GraphQLString},
    courses:{
      type:new GraphQLList(CourseType),
      resolve:(professor)=>{
        return courses.filter(course=> professor.id===course.id)
      }
      
    }
  })
})

const RootQueryType2= new GraphQLObjectType({
  name:'Query',
  description:'Root Query',
  fields:()=>({
  
    courseByProfessor: {
      type: CourseType,
      description: 'Represents a course',
      args: {
        professorId: { type: GraphQLInt },
        
      },
      resolve: (parent, args) => {
        return courses.find(course => course.professorId === args.professorId);
      }
    },
     course: {
      type: CourseType,
      description: 'Represents a course',
      args: {
        id: { type: GraphQLInt },
        
      },
      resolve: (parent, args) => {
        return courses.find(course => course.id === args.id);
      }
    }

    ,
    courses:{
      type:new GraphQLList(CourseType),
      description:'Represents courses',
      resolve: ()=>{return courses}
    },
    professors:{
      type: new GraphQLList(ProfessorType),
      description:'Represents professors',
      resolve:()=>{
        console.log(professors)
       return professors}
    },
    professor:{
      type:ProfessorType,
      description:'Represents a professor',
      args:{
        id:{type:GraphQLInt},
        
      },
      resolve:(parent,args)=>{ return professors.find(professor =>professor.id===args.id)}
    }
  })
})

const RootMutationType2= new GraphQLObjectType({
  name:'Mutation',
  description:'Root Mutation',
  fields:()=>({
    addCourse:{
      type:CourseType,
      description:'Add Course',
      args:{
        name: { type: GraphQLNonNull(GraphQLString) },
        professorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve:(parent,args)=>{
        const course={id: courses.length +1, name:args.name, professorId: args.professorId}
        courses.push(course);
        return course;
      }
    },

    addProfessor:{
      type:ProfessorType,
      description:'Add Professor',
      args:{
        firstName:{ type: GraphQLNonNull(GraphQLString)},
        lastName:{ type: GraphQLNonNull(GraphQLString)},
      },
      resolve:(parent,args)=>{
        const professor = {id:professors.length+1, firstName:args.firstName, lastName:args.lastName}
        professors.push(professor);
        return professor;
      }
    }
  })

})

const schema = new GraphQLSchema({
  query: RootQueryType2,
  mutation: RootMutationType2
})


//GraphQL
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))

app.listen(3001, () => console.log('Server Running'))

module.exports = app;
