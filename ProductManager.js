import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    async addProduct(producto) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(prodsJSON)
        producto.id = ProductManager.incrementarID()
        prods.push(producto)
        await fs.writeFile(this.path, JSON.stringify(prods))
        return "Producto creado"
    }

    async getProducts() {
        const prods = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(prods)
    }

    async getProductById(id) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(prodsJSON)
        if (prods.some(prod => prod.id === parseInt(id))) {
            return prods.find(prod => prod.id === parseInt(id))
        } else {
            return "Producto no encontrado"
        }
    }

    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(prodsJSON)
        if (prods.some(prod => prod.id === parseInt(id))) {
            let index = prods.findIndex(prod => prod.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].thumbnail = thumbnail
            prods[index].code = code
            prods[index].stock = stock
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto actualizado"
        } else {
            return "Producto no encontrado"
        }
    }

    async deleteProduct(id) {
        const prodsJSON = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(prodsJSON)
        if (prods.some(prod => prod.id === parseInt(id))) {
            const prodsFiltrados = prods.filter(prod => prod.id !== parseInt(id))
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return "Producto eliminado"
        } else {
            return "Producto no encontrado"
        }
    }

}

class Product {
    constructor(title = "", description = "", price = 0, thumbnail = "", code = "", stock = 0) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

const prod = new ProductManager('./info.txt')

const producto = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
const productoM = new Product("producto prueba modificacion", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

prod.getProducts().then(prod => console.log(prod))
await prod.addProduct(producto).then(prod => console.log(prod))
prod.getProducts().then(prod => console.log(prod))
prod.getProductById(1).then(prod => console.log(prod))
prod.getProductById(2).then(prod => console.log(prod))
await prod.updateProduct(1, productoM).then(prod => console.log(prod))
prod.getProducts().then(prod => console.log(prod))
await prod.deleteProduct(1).then(prod => console.log(prod))
prod.getProducts().then(prod => console.log(prod))
await prod.deleteProduct(1).then(prod => console.log(prod))