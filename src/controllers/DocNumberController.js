const BaseController = require('./BaseController');

class DocNumberController extends BaseController {
    model = null;

    lastDocNumber = async (req, res, next) =>{
        let modelx = await this.model.findOne({
            order: [
                ['number', 'DESC'],
            ]
        });

        let result = 1;

        if(modelx !== null){
            result = modelx.number + 1;
        }

        res.send({ number: result });
    }
}

module.exports = DocNumberController;