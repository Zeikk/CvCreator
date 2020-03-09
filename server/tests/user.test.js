const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const testUserID = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserID,
    firstname: "Tchoupi",
    name: "Sauvaget",
    email: "tchoupi@sesamis.fr",
    password: "tchoupax",
    role: 1,
    tokens: [
        {
            token: jwt.sign({ _id: testUserID }, process.env.JWT_SECRET)
        }
    ]
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(testUser).save();
});

// Creation d'utilisateurs
test("Devrait inscrire un nouvel utilisateur", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "LE CORFF",
            firstname: "Pierre",
            email: "pierre.lecorff2@gmail.com",
            password: "poiuytre"
        })
        .expect(201);

    // Verifier que l'utilisateur est bien dans la base
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Verifier que l'utilisateur correspond bien à celui entré
    expect(response.body).toMatchObject({
        user: {
            name: "LE CORFF",
            firstname: "Pierre",
            email: "pierre.lecorff2@gmail.com"
        },
        token: user.tokens[0].token
    });
});

test("Devrait générer une erreur si un utilisateur ne rempli pas les conditions nécessaires pour se connecter (mdp trop court)", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "LE CORFF",
            firstname: "Pierre",
            email: "pierre.lecorff2@gmail.com",
            password: "poiuy"
        })
        .expect(400);
});

test("Devrait générer une erreur si un utilisateur ne rempli pas les conditions nécessaires pour se connecter (pas de prenom)", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "LE CORFF",
            email: "pierre.lecorff2@gmail.com",
            password: "poiuytre"
        })
        .expect(400);
});

// Connexion des utilisateurs
test("Devrait générer une erreur si un utilisateur ne rempli pas les conditions nécessaires pour se connecter (faux mail)", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "LE CORFF",
            firstname: "Pierre",
            email: "pierre.lecorff2@re",
            password: "poiuytre"
        })
        .expect(400);
});

test("Devrait connecter un utilisateur existant", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200);
    // Vérification de la création du token de connexion
    const user = await User.findById(testUserID);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Devrait générer une erreur si un utilisateur inexistant essaie de se login", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "testUser.email",
            password: "testUser.password"
        })
        .expect(400);
});

// Tests avec connexion pour afficher les profils des utilisateurs
test("Devrait afficher le profil de l'utilisateur ", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Devrait afficher une erreur de type 401 non autorisé si on essaie d'accéder au profil d'un autre utilisateur de l'utilisateur ", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});

// Tests avec connexion pour modifier / supprimer notre profil d'utilisateur
test("Devrait supprimer le compte de l'utilisateur", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200);
    // Vérification de la suppression
    const user = await User.findById(testUserID);
    expect(user).toBeNull();
});

test("Devrait échouer à la suppression du compte de l'utilisateur", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});

// Test avatars
test('Devrait ajouter un avatar à l\'utilisateur test', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/Monkey D. Barti.jpg')
        .expect(200)
    const user = await User.findById(testUserID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

// Test mise à jour utilisateur

test('Devrait mettre à jour les champs choisis par l\'utilisateur', async () => {
    await request(app)
        .patch('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send({
            firstname: 'TChoupax',
            email: 'lebonchibrax@tchoupax.fr'
        })
        .expect(200)
    const user = await User.findById(testUserID)
    expect(user.firstname).toEqual('TChoupax')
    expect(user.email).toEqual('lebonchibrax@tchoupax.fr')
})

test('Ne devrait pas mettre à jour si les champs sont incorrects', async () => {
    await request(app)
        .patch('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
        .send({
            test: 'TChoupax'
        })
        .expect(400)
})