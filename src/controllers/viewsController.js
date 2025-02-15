import fileManager from "../manager/filesManager.js";
class viewsController {

    viewProducts(req,res){
        res.render("index");
    }

    viewProductsRealTime(req, res) {
        res.render("realTimeProducts");
    }

}

export default new viewsController();