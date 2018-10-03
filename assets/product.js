var products = { 1: 'Product 1', 2: 'Product 2', 3: 'Product 3' };

$('#placeOrdBtn').on('click', function () {

    $.ajax({
        url: '/place-order',
        type: 'post',
        data: { product: $('#product').val(), quantity: $('#quantity').val() },
        success: function (res) {
            var target = $('#placed_order_list tbody');
            $(target).empty();
            var html = '';
            if (res[0].placed_orders.length > 0) {
                for (var i = 0; i < res[0].placed_orders.length; i++) {
                    html += "<tr>";
                    html += "<td>" + products[res[0].placed_orders[i].product] + "</td>";
                    html += "<td>" + res[0].placed_orders[i].quantity + "</td>";
                    html += "<td>" + res[0].placed_orders[i].created_till + "</td>";
                    html += "<td>" + res[0].placed_orders[i].predicted_sale + "</td>";
                    if (res[0].placed_orders[i].status) {
                        html += "<td><span>Order Completed</span></td>";
                    } else {
                        html += "<td><button type='button' class='order_completed' value='" + res[0].placed_orders[i].product + "'>Done</button></td>";
                    }
                    html += "</tr>";
                }
                $(target).html(html);
            }
        }
    });
});

$('#predSaleBtn').on('click', function () {

    $.ajax({
        url: '/predicted-sales',
        type: 'post',
        data: { product: $('#product').val(), quantity: $('#quantity').val() },
        success: function (res) {
            var target = $('#predicted_sales_list tbody');
            $(target).empty();
            var html = '';
            if (res[1].predicted_sales.length > 0) {
                for (var i = 0; i < res[1].predicted_sales.length; i++) {
                    html += "<tr>";
                    html += "<td>" + products[res[1].predicted_sales[i].product] + "</td>";
                    html += "<td>" + res[1].predicted_sales[i].quantity + "</td>";
                    html += "</tr>";
                }
                $(target).html(html);
            }
        }
    });
});


document.addEventListener('click', function (event) {
    if (event.target.className == 'order_completed') {
        $.ajax({
            url: '/order-completed',
            type: 'post',
            data: { product: event.target.value },
            success: function (res) {
                $(event.target).closest('tr').find('td:eq(1)').text(res.quantity);
                $(event.target).closest('tr').find('td:eq(2)').text(res.created_till);
                $(event.target).closest('td').html('Order Completed');
            }
        });
    }
});