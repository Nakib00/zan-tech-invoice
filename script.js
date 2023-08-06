$(document).ready(function () {
  var items = [];

  $("#item-form").on("submit", addItemToCart);
  $("#cart-table").on("click", ".btn-danger", removeItemFromCart);
  $("#generated-invoice").on("click", generateInvoice);

  function addItemToCart(event) {
    event.preventDefault();

    var itemName = $("#itame-name").val();
    var itemPrice = parseFloat($("#itame-price").val());
    var itemQuantity = parseInt($("#itame-quantity").val());

    if (
      itemName !== "" &&
      !isNaN(itemPrice) &&
      !isNaN(itemQuantity) &&
      itemQuantity > 0
    ) {
      var itemTotalPrice = itemPrice * itemQuantity;
      var item = {
        name: itemName,
        price: itemPrice,
        quantity: itemQuantity,
        totalPrice: itemTotalPrice,
      };

      items.push(item);
      $("#cart-table tbody").append(
        "<tr><td>" +
          item.name +
          "</td><td>" +
          item.quantity +
          "</td><td>TK " +
          item.price.toFixed(2) +
          "</td><td>TK " +
          item.totalPrice.toFixed(2) +
          '</td><td><button class="btn btn-sm btn-danger"><i class="fa fa-trash-alt"></i></button></td></tr>'
      );

      updateTotalCost();
      $("#itame-name").val("");
      $("#itame-price").val("");
      $("#itame-quantity").val("");
    }
  }

  function removeItemFromCart() {
    var index = $(this).closest("tr").index();
    items.splice(index, 1);
    $(this).closest("tr").remove();
    updateTotalCost();
  }

  function updateTotalCost() {
    var totalCost = getTotalCost();
    $("#total-cost").text("Total Cost: TK " + totalCost.toFixed(2));
  }

  function getTotalCost() {
    var totalCost = 0;
    items.forEach(function (item) {
      totalCost += item.totalPrice;
    });

    return totalCost;
  }

  function paid(){
    var _Paid = $("#paid").val();
    var paids = _Paid-0;

    return paids;
  }

  function dueCalcluted(){
    due = getTotalCost() - paid();
    return due;
  }

  function voucher(){
    var _voucher= $("#voucher").val();
    cvocher = _voucher - 0;
    return cvocher;
  }

  function voucherCalculation(){
    var vouchercal = dueCalcluted().toFixed(2) - voucher().toFixed(2);

    return vouchercal
  }

  function currentDate(){
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Note: Months are 0-indexed, so we add 1
    var day = currentDate.getDate();

    var formattedDate = addLeadingZero(day) + "-" + addLeadingZero(month) + "-" + year;

    // Helper function to add leading zero to single-digit numbers
    function addLeadingZero(number) {
      return number < 10 ? "0" + number : number;
    }

    return formattedDate;
  }

  // Invoice Number generator function
  let invoiceCount = localStorage.getItem("invoiceCount") || 1;

    function generateInvoiceNumber() {
      const invoicePrefix = "";
      const paddedCount = invoiceCount.toString().padStart(3, "0");
      const invoiceNumber = invoicePrefix + paddedCount;
      invoiceCount++;
      // Save the updated invoice count to localStorage
      localStorage.setItem("invoiceCount", invoiceCount);
      return invoiceNumber;
    }

 
  function generateInvoice() {
    var customerName = $("#customer-name").val();
    var customerPhone = $("#customer-phone").val();
    var customerDelivaryAddress = $("#delivery-address").val();
    //Call this function whenever you need a new invoice number
    const newInvoiceNumber = generateInvoiceNumber();

    var currentDateValue = currentDate();

    if (customerName !== "" && customerPhone !== "") {
      var invoice = `
            <html>
<head>
	<title>Invoice of ZAN Tech</title>
	<link rel="stylesheet" type="text/css" href="styles1.css">
</head>
<body>

<div class="wrapper">
	<div class="invoice_wrapper">
		<div class="header">
			<div class="logo_invoice_wrap">
				<div class="logo_sec">
					<img src="codingboss.png" alt="code logo">
					<div class="title_wrap">
						<p class="title bold">ZAN Tech</p>
						<p class="sub_title">Awaken your hidden talent.</p>
					</div>
				</div>
				<div class="invoice_sec">
        <p class="invoice bold">INVOICE</p>
        <p class="invoice_no">
          <span class="bold">Invoice</span>
          <span>${newInvoiceNumber}</span>
        </p>
        <p class="date">
          <span class="bold">Date</span>
          <span>${currentDateValue}</span>
        </p>
				</div>
			</div>
			<div class="bill_total_wrap">
				<div class="bill_sec">
					<p>Bill To</p> 
	          		<p class="bold name">${customerName}</p>
			        <span>
                ${customerDelivaryAddress}<br/>
                ${customerPhone}

			        </span>
				</div>
			</div>
		</div>
		<div class="body">
			<div class="main_table">
				<div class="table_header">
					<div class="row">
						<!-- <div class="col col_no">NO.</div> -->
						<div class="col col_des">ITEM NAME</div>
						<div class="col col_price">PRICE</div>
						<div class="col col_qty">QTY</div>
						<div class="col col_total">TOTAL</div>
					</div>
				</div>
				<div class="table_body">`;

      items.forEach(function (item) {
        invoice += `<div class="row">
                        <div class="col col_des">
                            <p class="bold">${item.name}</p>
                            <!-- <p>Lorem ipsum dolor sit.</p> -->
                        </div>
                        <div class="col col_price">
                                <p>TK${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col col_qty">
                                <p>${item.quantity}</p>
                        </div>
                        <div class="col col_total">
                                <p>TK${item.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>`;
      });

      invoice += `</div>
                </div>
                <div class="paymethod_grandtotal_wrap">
                    <div class="paymethod_sec">
                        <!-- <p class="bold">Payment Method</p>
                        <p>Visa, master Card and We accept Cheque</p> -->
                    </div>
                    <div class="grandtotal_sec">
                        <p class="bold">
                            <span>Subtotal</span>
                            <span>TK${getTotalCost().toFixed(2)}</span>
                        </p>
                        <p>
                            <span>Discount</span>
                            <span>-${voucher().toFixed(2)}</span>
                        </p>
                        <p>
                            <span>PAID</span>
                            <span>TK${paid().toFixed(2)}</span>
                        </p>
                           <p class="bold">
                            <span>Total</span>
                            <span>TK${voucherCalculation().toFixed(2)}</span></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Thank you and Best Wishes</p>
                <div class="terms">
                    <!-- <p class="tc bold">Terms & Coditions</p> -->
                    <p>
                      For questions concerning this invoice, please contact </br>
                      Email Address: zantechbd@gmail.com
                    </p>
                </div>
            </div>
        </div>
    </div>
    
    
    </body>
    </html>`;

      var popup = window.open("", "_blank");
      popup.document.open();
      popup.document.write(invoice);
      popup.document.close();
    }
  }
});
