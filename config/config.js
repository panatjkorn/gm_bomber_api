require('dotenv').config()
console.log('process.env.DB_ENV',process.env.DB_ENV);
const dbHost = process.env.DB_ENV === "local" ? process.env.DB_HOST : process.env.DB_PRODUCTION_HOST
const dbUsername = process.env.DB_ENV === "local" ? process.env.DB_USERNAME : process.env.DB_PRODUCTION_USERNAME
const dbPass = process.env.DB_ENV === "local" ? process.env.DB_PASSWORD : process.env.DB_PRODUCTION_PASSWORD
const dbName = process.env.DB_ENV === "local" ? process.env.DB_NAME : process.env.DB_PRODUCTION_NAME
const dbport = process.env.DB_ENV === "local" ? process.env.DB_PORT : process.env.DB_PRODUCTION_PORT


module.exports = {
    "development": {
        "host": dbHost,
        "username": dbUsername,
        "password": dbPass,
        "database": dbName,
        "port": dbport,
        "dialect": "postgres",
        "pool": {
            max: 10,
            min: 0,
            acquire: 60000,
            idle: 20000
        },
        "define": {
            paranoid: true,
            underscored: true,
            timestamps: true,
            deletedAt: 'deleted_at',
            updatedAt: 'updated_at',
            createdAt: 'created_at',
        }
    },
    google: {
        projectId: process.env.PROJECT_ID,
        bucket: process.env.BUCKET,
        keyFilename: process.env.KEY_FILENAME,
    },
    secret: process.env.SECRET,
    // refresh: process.env.REFRESH,
    // deploy_env: process.env.DEPLOY_ENV,

}