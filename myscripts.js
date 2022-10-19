//Initialize global vars to track items across program
itemCost = [0.0,0.0,0.0,0.0,0.0];
itemsOrdered = [0,0,0,0,0];
totalCostGlob = 0;
totalTaxGlob = 0;
subTotalGlob = 0;
order = "pickup";
time = Date.now();

/* calcTotalPerItem
 * Arguments: number of items ordered and the item number corresponding to the menuItems array.
 * Description: Calculates total cost per item
 * Return value: Updates global itemCost and itemsOrdered array but no return value
 */
function calcTotalPerItem(numItems, itemNum){
    numItemFloat = parseFloat(numItems)
    cost = numItemFloat * menuItems[itemNum].cost;

    x = $('[name="cost"]');
    $(x[itemNum]).val(cost);

    itemCost[itemNum] = cost;
    itemsOrdered[itemNum] = numItems;

    updateTotals();
}

/* trackSelectors
 * Arguments: None
 * Description: Grabs value in the select options for each food item
 * Return value: Calls calcTotalPerItem but no return value
 */
function trackSelectors(){
    x = $('select option:selected');
    selectorFindNum = this.name.split("").pop();
    selectorFindNum = parseInt(selectorFindNum);
    numItems = $(x[selectorFindNum]).text();
    calcTotalPerItem(numItems, selectorFindNum)
}

/* updateTotals
 * Arguments: None
 * Description: Updates the subtotal, tax and end total values based on itemCost
 * Return value: Updates global variables related to cost (subtotal, tax, total) but no return value
 */
function updateTotals(){
    subTotalGlob = 0;
    for(i=0; i < itemCost.length; i++){
        subTotalGlob += itemCost[i];
    }
    totalTaxGlob = subTotalGlob * 0.0625;
    totalCostGlob = subTotalGlob + totalTaxGlob;
    totalTaxGlob = totalTaxGlob.toFixed(2);
    totalCostGlob = totalCostGlob.toFixed(2);

    $(".subtotal input").val(subTotalGlob);
    $(".tax input").val(totalTaxGlob);
    $(".total input").val(totalCostGlob);

}

/* PorD
 * Arguments: None
 * Description: Hides/shows the address fields based on whether pickup or delivery selected
 * Return value: Updates global order status variable but no return value
 */
function PorD(){
    if(this.value == "pickup"){
        order = "pickup";
        $(".address").addClass("hidden");
    } else {
        order = "delivery";
        $(".address").removeClass("hidden");
    }
}

/* validPhone
 * Arguments: Phone Number
 * Description: Determines whether number has 7 or 10 digits
 * Return value: True if valid number, false if invalid phone number
 */
function validPhone(number){
    validNums = "0123456789";
    counter = 0;
    for(i = 0; i<number.length; i++){
        if(validNums.includes(number[i])) counter++;
    }

    if(counter == 7 || counter == 10){
        return true;
    } else{
        return false;
    }
}

/* validateFields
 * Arguments: None
 * Description: Validates all fields to make sure it meets requirements and highlights/alerts the user if the requirements aren't met
 * Return value: True if valid fields, false if invalid fields
 */
function validateFields(){
    valid = true;
    if(order == "delivery"){
        //validate city/street
        street = $('input[name="street"]').val();
        city = $('input[name="city"]').val();
        
        if(street == ""){
            alert("Please enter in a value for street for delivery.")
            x = $(".address");
            $(x[0]).addClass("invalid");
            valid = false;
        }

        if(city ==""){
            alert("Please enter in a value for city for delivery.");
            x = $(".address");
            $(x[1]).addClass("invalid");
            valid = false;
        }
        
    }

    //Last Name and phone validation sections
    //Happens regardless of delivery/pickup
    lName = $('input[name="lname"]').val();
    phone = $('input[name="phone"]').val();

    if(lName == ""){
        alert("Please enter in a value for last name.");
        x = $(".userInfo");
        $(x[1]).addClass("invalid");
        valid = false;
    }

    validPhoneNum = validPhone(phone);

    if(!validPhoneNum){
        alert("Please enter a phone number 7 or 10 digits long.");
        x = $(".userInfo");
        $(x[4]).addClass("invalid");
        valid = false;
    }

    //Make sure some item has been put into order
    if($(".total input").val() == "" || $(".total input").val() <= 0){
        valid = false;
        alert("Please enter something for your order.");
        $("table").addClass("invalid");
    }
    

    return valid;
}

/* orderReceipt
 * Arguments: None
 * Description: Generates new window with order description and details
 * Return value: None
 */
function orderReceipt(){
    orderHTML = "<h1>Order Details</h1>";
    //Generate order details for each item
    for(i=0;i<itemsOrdered.length; i++){
        if(itemsOrdered[i] == 0) continue;
        orderHTML +="<p><strong>" + menuItems[i].name +"</strong><br />";
        orderHTML += " Quantity: " + itemsOrdered[i] + " Cost: $" + itemCost[i];
        orderHTML += "</p>";
    }

    //HTML for costs
    orderHTML += "<br /><p><strong>Subtotal: </strong>$" + subTotalGlob +"</p>";
    orderHTML += "<br /><p><strong>Tax: </strong>$" + totalTaxGlob +"</p>";
    orderHTML += "<br /><p><strong>Total: </strong>$" + totalCostGlob +"</p>";

    //HTML for pickup/delivery time
    if(order == "pickup"){
        orderHTML += "<br /><p>Pickup Time: " + time + "</p>";
    } else {
        orderHTML += "<br /><p>Delivery Time: " + time + "</p>";
    }
    
    var orderWindow = window.open("", "newWindow", "width=700, height=700");
    orderWindow.document.write(orderHTML);

}

/* completeOrder
 * Arguments: None
 * Description: Calls methods to validate the fields and generate order receipt
 * Return value: None
 */
function completeOrder(){
    $('.address').removeClass("invalid");
    $(".userInfo").removeClass("invalid");
    $("table").removeClass("invalid");
    if(order == "pickup"){
        time = new Date(Date.now()+ 20*60*1000);
        time = time.toLocaleString();
    } else {
        time = new Date(Date.now()+ 40*60*1000);
        time = time.toLocaleString();
    }

    valid = validateFields();

    if(valid){
        alert("Thank you for your order!");
        orderReceipt();
    }
}

//Once document loaded, apply event listeners to necessary items
$(document).ready(function(){
    $("select").change(trackSelectors);
    $('[name="p_or_d"]').change(PorD);
    $(".address").addClass("hidden");
    $(":button").click(completeOrder);
});

