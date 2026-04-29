import { PrismaClient } from "@prisma/client";
import { success, error } from "../utils/response.js";


const prisma = new PrismaClient();

// Controlador para criar um novo usuário - CREATE
export async function createUser(req, res) {
    try{
        const { name, email, password, age, gender, phone } = req.body;

        // Validação básica dos campos obrigatórios
        if(!name || !email || !password){
            return error(res, "Nome, email e senha são obrigatórios", 400);
        }

        // Verificar se o email já está cadastrado
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser){
            return error(res, "Email já cadastrado", 400);
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

        return success(res, "Usuário criado com sucesso", userWithoutPassword, 201);
    } catch (err) {
        return error(res, "Erro ao criar usuário :" + err.message, 500);
    }
}

// Controlador para listar todos os usuários - READ
export async function findAllUsers(req, res) {
    try{
        const users = await prisma.user.findMany();
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        return success(res, "Usuários encontrados", usersWithoutPasswords);

    } catch (err) {
        return error(res, "Erro ao buscar usuários :" + err.message, 500);
    }
}

// Controlador para buscar um usuário por ID - READ
export async function findUserById(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return error(res, "ID inválido", 400);
        }

        const user = await prisma.user.findUnique({ where: { id: parseInt(id) }, include: { books: true } });

        if(!user){
            return error(res, "Usuário não encontrado", 404);
        }

        const { password: _, ...userWithoutPassword } = user;
        return success(res, "Usuário encontrado", userWithoutPassword);
    } catch (err) {
        return error(res, "Erro ao buscar usuário :" + err.message, 500);
    }
}

// Controlador para atualizar um usuário por ID - UPDATE
export async function updateUser(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return error(res, "ID inválido", 400);
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
        return success(res, "Usuário atualizado com sucesso", userWithoutPassword);
    } catch (err) {

        if(err.code === "P2025"){
            return error(res, "Usuário não encontrado", 404);
        }

        if (err.code === "P2002") {
            return error(res, "Email já está em uso", 400);
        }

        return error(res, "Erro ao atualizar usuário :" + err.message, 500);
    }
}

// Controlador para deletar um usuário por ID - DELETE
export async function deleteUser(req, res) {
    try{
        const id = Number(req.params.id);

        if(isNaN(id)){
            return error(res, "ID inválido", 400);
        }

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        return success(res, "Usuário deletado com sucesso");
    } catch (err) {
        if(err.code === "P2025"){
            return error(res, "Usuário não encontrado", 404);
        }

        return error(res, "Erro ao deletar usuário :" + err.message, 500);
    }
}
