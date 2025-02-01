
class Carts {
    constructor(id,products){
        this.id = id;
        this.products = products;
    }

    static getNextId(items) {
        // 1. Extraer todos los IDs únicos y ordenarlos numéricamente.
        const ids = [...new Set(items.map(item => item.id))].sort((a, b) => a - b);

        // 2. Encontrar el primer número entero positivo que no esté en el conjunto de IDs.
        let nextId = 1;
        for (const id of ids) {
            if (id === nextId) {
                nextId++;
            } else if (id > nextId) {
                return nextId; // Encontramos un hueco
            }
        }
        return nextId; // No hay huecos, el siguiente es el siguiente número después del último.
    }
}


export default Carts;