import fs from "fs";
import path from "path";

export const deleteFile = async (fileUrl: string) => {
  try {
    // A URL vem como: http://192.168.0.105:3333/files/nome-do-arquivo.jpg
    // Pegamos apenas o final: nome-do-arquivo.jpg
    const filename = fileUrl.split("/files/").pop();

    if (!filename) return;

    // Caminho da pasta uploads
    // src/utils/file.ts -> src/utils -> src -> raiz -> uploads
    const filePath = path.resolve(__dirname, "..", "..", "uploads", filename);

    // Verifica se o arquivo existe
    try {
      await fs.promises.stat(filePath);
    } catch {
      return; // Se não existir, não faz nada
    }

    // Deleta o arquivo
    await fs.promises.unlink(filePath);
    console.log(`🗑️ Arquivo deletado: ${filename}`);
  } catch (err) {
    console.error("Erro ao deletar arquivo:", err);
  }
};
