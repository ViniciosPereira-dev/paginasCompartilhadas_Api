import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Controlador para criar um novo usuário - CREATE
export async function createUser(req, res) {
    try{
        const { name, email, password, age, gender, phone } = req.body;

        // Validação básica dos campos obrigatórios
        if(!name || !email || !password){
            return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        }

        // Verificar se o email já está cadastrado
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser){
            return res.status(400).json({ error: "Email já cadastrado" });
        }

        // Criar o usuário no banco de dados
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                age,
                gender,
                phone
            }
        });

        const { password: _, ...userWithoutPassword } = user; // Excluir a senha da resposta

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para listar todos os usuários - READ
export async function findAllUsers(req, res) {
    try{
        const users = await prisma.user.findMany();
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        res.json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários :" + error.message });
    }
}

// Controlador para buscar um usuário por ID - READ
export async function findUserById(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        }

        const user = await prisma.user.findUnique({ where: { id: parseInt(id) }, include: { books: true } });

        if(!user){
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário : " + error.message });
    }
}

// Controlador para atualizar um usuário por ID - UPDATE
export async function updateUser(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        }

        const { name, email, password, age, gender, phone } = req.body;

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                password,
                age,
                gender,
                phone
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {

        if(error.code === "P2025"){
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(500).json({ error: "Erro ao atualizar usuário :" + error.message });
    }
}

// Controlador para deletar um usuário por ID - DELETE
export async function deleteUser(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ error: "ID inválido" });
        }

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        if(error.code === "P2025"){
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(500).json({ error: "Erro ao deletar usuário :" + error.message });
    }
}
