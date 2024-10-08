const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const fs = require("fs");
const db = JSON.parse(fs.readFileSync("db.json","utf-8"));


server.use(middlewares);
server.use(jsonServer.bodyParser);


// Login endpoint

server.post("/login",(req,res) => {
    const {email,password} = req.body;
    const user = db.users.find((user) => user.email === email && user.password === password);
    if(user){
        res.status(200).json({message:"Login Successfully!!", user});
    } else {
        res.status(400).json({message:"Invalid email or password"});
    }
});

// Signup endpoint

server.post("/signup", (req, res) => {
    const { email, password } = req.body;
    const userExists = db.users.find((user) => user.email === email);

    if (userExists) {
        res.status(400).json({ error: "User already exists" });
    } else {
        const newUser = {
            id: db.users.length + 1,
            email,
            password
        };
        db.users.push(newUser);

        // Writing the new user to db.json
        fs.writeFileSync("db.json", JSON.stringify(db), "utf-8");

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    }
});

server.post("/forgot-password",(req,res) => {
    const {email} = req.body;

    const user = db.users.find((user) => user.email === email);

    if(user){
        res.status(200).json({message:"Password reset link send to email"})
    }else{
        res.status(400).json({error:"User not found"});
    }
});

server.use(router);

server.listen(5000, () => {
    console.log("JSON server is running on port 5000");
});