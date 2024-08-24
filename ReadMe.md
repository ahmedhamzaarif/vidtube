# Backend-Practice
Web Brower / Mobile <->  Web Server <-> Database

### Language
- JavaScript*
- Python
- Java 

### Runtime
- NodeJs*
- Bun
- Deno

### Framework
- ExpressJS*
- HonoJS
- ElysiaJS

### Database
- MongoDB* (NoSQL)
- MySQL
- PostgresSQL

### ORMs
- Mongoose*
- Prisma
- Drizzle

### Advance Logging
[winston & morgan](https://docs.chaicode.com/advance-node-logger/)

### Database Diagram / ERD (Entity Relationship Diagram)
[eraser](https://www.eraser.io/)
[example: todo, health management, ecom](https://app.eraser.io/workspace/gGQB8RlwymdEcdUOA4Wn)
[example: vidtube database](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
Moon Modeler

```
npm init -y
npm i express
npm i nodemon prettier -D
```
```
// package.json
"type": "module",
"scripts": {
"start": "node src/index.js",
"dev": "node src/index.js",
},
```

```
npm i express mongoose dotenv cors

<!-- Mongoose Hooks for Schema -->
npm i mongoose-aggregate-paginate-v2

<!-- JWT -->
npm i bcrypt jsonwebtoken

<!-- File Handling -->
npm i cookie-parser multer cloudinary
```