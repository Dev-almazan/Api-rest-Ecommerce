
import fs from "fs";

class fileManager {

     readFileJson(path,res) {
        try {
            const fileContent = fs.readFileSync(path, 'utf-8');
            if (!fileContent.trim()) { // Verifica si el contenido (después de quitar espacios en blanco) está vacío
                fs.writeFileSync(path, '[]'); //si esta vacio agregar corchetes para tipado json
                return [];
            }
                const data = JSON.parse(fileContent);
                return data;
        }
        catch (error) {
            res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al cargar el archivo' })  
        }
    }

    readFile(path) {
        try {
            const fileContent = fs.readFileSync(path, 'utf-8');
            if (!fileContent.trim()) { // Verifica si el contenido (después de quitar espacios en blanco) está vacío
                fs.writeFileSync(path, '[]'); //si esta vacio agregar corchetes para tipado json
                return [];
            }
            const data = JSON.parse(fileContent);
            return data;
        }
        catch (error) {
            return false
        }
    }

    writeFilesJson(path,newContent,res){
        try {
            fs.writeFileSync(path, newContent);
            return true;
        }
        catch (error) {
            res.status(400).send({ 'status': 'error', 'message': 'Hubo un problema al cargar el archivo' })  
        }
    }

    
}

export default new fileManager();