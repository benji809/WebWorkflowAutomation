const {Sequelize } = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


exports.workflow = null;
exports.offer = null;
exports.sub = null;
const sequelize = new Sequelize('mysql://root:Ycpxtyr4212..@localhost/opmp8948_wf');

const user = sequelize.define(
  'users',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    how: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recover: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }
);


const workflow = sequelize.define(
  'workflows',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    wf: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    launcha : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startdate: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    every: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sendemail: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wftxt: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    screenshot: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }
);


const run = sequelize.define(
  'runs',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    workflowid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    result : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    log: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }
);



const offer = sequelize.define(
  'offers',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nbmaxworkflow : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workflowautomatedallowed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sendemail: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    everymin : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagequality_value : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagequality_text : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attributeallowed : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    screenshotallowed : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Hotline : {
      type: DataTypes.STRING,
      allowNull: false,
    },


  }
);



const sub = sequelize.define(
  'sub',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    userid : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offerid : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startdate : {
      type: DataTypes.TIME,
      allowNull: false,
    },
    enddate: {
      type: DataTypes.TIME,
      allowNull: true,
    }
  }
);

// associations
/*
user.hasOne(workflow, {
  foreignKey: 'userid',
});
workflow.belongsTo(user);

workflow.hasMany(run, {
  foreignKey: 'wfid',
});
run.belongsTo(workflow);*/


async function init ()
{
    await sequelize.authenticate();
}

module.exports = {init,sequelize,user,workflow,offer,sub,run};