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