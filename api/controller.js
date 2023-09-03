var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

var data = [
    { 'placed_orders': [] },
    { 'predicted_sales': [] }
];

var products = { 1: 'Product 1', 2: 'Product 2', 3: 'Product 3' };

module.exports = function (app) {

    app.get('/', function (err, res) {
        res.render('index');
    });

    /* Place Order Api*/
    app.get('/place-order', function (err, res) {
        res.render('place-order', { data: data, products: products });
    });

    app.post('/place-order', urlEncodedParser, function (req, res) {
        data[0].placed_orders = data[0].placed_orders.filter((item) => {
            if (item.product == req.body.product) {
                req.body['created_till'] = (item.created_till ? item.created_till : 0);
                req.body.quantity = parseInt(req.body.quantity) + parseInt(item.quantity);
                return false;
            }
            return true;
        });

        if (data[1].predicted_sales.length > 0) {
            for (var i = 0; i < data[1].predicted_sales.length; i++) {
                if (data[1].predicted_sales[i].product == req.body.product) {
                    req.body['predicted_sale'] = (data[1].predicted_sales[i] ? data[1].predicted_sales[i].quantity : 0);
                }
            }
        } else {
            req.body['predicted_sale'] = 0;
        }

        req.body['status'] = false;
        req.body['created_till'] = (req.body['created_till'] ? req.body['created_till'] : 0);
        data[0].placed_orders.push(req.body);
        res.json(data);

    });
    //

    /* Sales Prediction Api */
    app.get('/predicted-sales', function (err, res) {
        res.render('predicted-sales', { data: data, products: products });
    });

    app.post('/predicted-sales', urlEncodedParser, function (req, res) {
        /////////////req.body.product = products[req.body.product];
        data[1].predicted_sales = data[1].predicted_sales.filter((item) => {
            if (item.product == req.body.product) {
                req.body.quantity = parseInt(req.body.quantity) + parseInt(item.quantity);
                return false;
            }
            return true;
        });

        if (data[0].placed_orders.length > 0) {
            for (var i = 0; i < data[0].placed_orders.length; i++) {
                if (data[0].placed_orders[i].product == req.body.product) {
                    data[0].placed_orders[i]['predicted_sale'] = req.body.quantity;
                }
            }
        }

        data[1].predicted_sales.push(req.body);
        res.json(data);
    });
    //

    /* Order Completed Api */
    app.post('/order-completed', urlEncodedParser, function (req, res) {
        data[0].placed_orders.filter((item, key) => {
            if (item.product == req.body.product) {
                item['status'] = true;
                item['created_till'] = parseInt(item.created_till ? item.created_till : 0) + parseInt(item.quantity);
                item.quantity = 0;
                data[0].placed_orders[key] = item;
                res.json(item);

                return false;
            }
            return true;
        });
    });
    //

}