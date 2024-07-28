const express = require('express');
const { createServer } = require("http");
const { GameManager } = require('./GameManager')
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const cors = require('cors');
const z = require('zod');
const { authMiddleware } = require('./middleware');
// require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const prisma = new PrismaClient();
const app = express();
app.use(cors(
    {
        origin: ["https://bit-chess.vercel.app"],
        methods: ["POST", "PUT", "DELETE", "GET"],
        credentials: true
    }
));
app.use(bodyParser.json());

const signupBody = z.object({
    username: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

app.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    // const { username, name, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    })
    if (existingUser) {
        return res.status(411).json({
            message: "Email already in use"
        })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await prisma.user.create({
        data: {
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            email: req.body.email
        }
    })
    //console.log(newUser);
    const token = jwt.sign({ username: req.body.username }, 'jwt_secret');
    res.status(201).send({
        message: "User created successfully",
        token: token
    });
});

const signinBody = z.object({
    username: z.string(),
    password: z.string()
})

app.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: 'Invalid credentials'
        })
    }
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    })
    //console.log(user);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, 'jwt_secret');
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials')
    }
});


app.use(authMiddleware);

const updateBody = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional()
})

app.put('/updateInfo', authMiddleware, async (req, res) => {
    try {
        const { success, error } = updateBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: error.errors // Return detailed validation errors
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                username: req.username,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const response = await prisma.user.update({
            where: {
                username: req.username,
            },
            data: {
                username: req.body.username,
                password: hashedPassword,
                name: req.body.name !== "" ? req.body.name : user.name,
                email: req.body.email !== "" ? req.body.email : user.email
            }
        })

        res.json({
            message: "Information updated successfully",
        });
    } catch (error) {
        console.error("Error while updating information:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
});


app.get('/userinfo', authMiddleware, async (req, res) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                username: req.username,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const data = await prisma.user.findUnique({
            where: {
                username: req.username,
            }
        });

        res.json({
            data: data,
        });
    } catch (error) {
        console.error("Error while updating information:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
})

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});
const gameManager = new GameManager(io);


io.use((socket, next) => {
    const authHeader = socket.handshake.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        //console.log(token);
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            //console.log(decoded)
            socket.userId = decoded.userId;
            next();
        } catch (e) {
            console.error('JWT verification error:', e);
            return next(new Error('Authentication error'));
        }
    } else {
        console.error('Missing or invalid token');
        return next(new Error('Authentication error'));
    }
});



io.on("connection", (socket) => {
    ////console.log(`User connected: ${socket.id}`);
    //console.log(socket)
    gameManager.addUser(socket);
    socket.on("disconnect", () => {
        gameManager.removeUser(socket);
    })
});

httpServer.listen(3000, () => {
    //console.log("listening on 3000");
});








// const express = require('express');
// const { createServer } = require("http");
// const { GameManager } = require('./GameManager')
// const { Server } = require("socket.io");
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// app.use(bodyParser.json());

// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     users.push({ username, password: hashedPassword });
//     res.status(201).send('User created');
// });

// app.post('/signin', async (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username);
//     if (user && await bcrypt.compare(password, user.password)) {
//         const token = jwt.sign({ username: user.username }, 'jwt_secret');
//         res.json({ token });
//     } else {
//         res.status(401).send('Invalid credentials');
//     }
// });

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: "*"
//     }
// });
// const gameManager = new GameManager(io);

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//         return next(new Error('Authentication error'));
//     }
//     jwt.verify(token, 'jwt_secret', (err, decoded) => {
//         if (err) {
//             return next(new Error('Authentication error'));
//         }
//         socket.user = decoded;
//         next();
//     });
// });

// io.on("connection", (socket) => {
//     gameManager.addUser(socket);
//     socket.on("disconnect", () => {
//         gameManager.removeUser(socket);
//     });
// });

// httpServer.listen(3000, () => {
//     //console.log("listening on 3000");
// });
