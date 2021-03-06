$(document).ready(function () {
    //This function disables the serach button or dropdown based on input
    $(function () {
        $("#foodsearch").keydown(function () {
            if ($(this).val() == '') {
                $('.enableOnInput').prop('disabled', true);
            } else {
                $('.enableOnInput').prop('disabled', false);
                $('#cuisineoption').prop('disabled', true);
                $("#dietoption").prop('disabled', true);
            }
        })
        $('#cuisineoption').click(function (event) {
            if ($(this).val() == '') {
                $('.enableOnInput').prop('disabled', true)
            }
            else {
                $('.enableOnInput').prop('disabled', false)
                $("#dietoption").prop('disabled', true);
                $("#foodsearch").prop('disabled', true);
            }
        })
        $('#dietoption').click(function (event) {
            if ($(this).val() == '') {
                $('.enableOnInput').prop('disabled', true)
            }
            else {
                $('.enableOnInput').prop('disabled', false)
                $("#cuisineoption").prop('disabled', true);
                $("#foodsearch").prop('disabled', true);
            }
        })
    });

    //This function enables the serach button or dropdown after user has submitted the search
    $("#userinputinfo").submit(function (event) {
        $('.enableOnInput').prop('disabled', true);
        $("#foodsearch").prop('disabled', false);
        $("#cuisineoption").prop('disabled', false);
        $("#dietoption").prop('disabled', false);
    });


    var searchtext = $("#foodsearch");
    var searchcuisine = $("#cuisineoption");
    var searchdiet = $("#dietoption");

    //This is a submit event which is invoked when user enters a search keyword and presses enter or clicks on search button
    $("#userinputinfo").submit(function (event) {
        event.preventDefault();
        $("#searchresult").html('');
        var foodsearched = searchtext.val();
        var cuisineselected = searchcuisine.val();
        var dietselected = searchdiet.val();
        $(".pagination").text('');

        //Based on which search input user chooses the condition below selects the correct URL for API call
        foodListArr = [];
        foodListObj = {};
        var foodURL = "https://api.spoonacular.com/recipes/search?apiKey=95ae78eaca0d4ab7832f91cbb104fb11&query=" + foodsearched + "&number=50"
        if (foodsearched === '' && cuisineselected === null) {
            foodURL = "https://api.spoonacular.com/recipes/search?apiKey=95ae78eaca0d4ab7832f91cbb104fb11&diet=" + dietselected + "&number=50";
        } else if (foodsearched === '' && dietselected === null) {
            foodURL = "https://api.spoonacular.com/recipes/search?apiKey=95ae78eaca0d4ab7832f91cbb104fb11&cuisine=" + cuisineselected + "&number=50";
        }
        $.ajax({
            url: foodURL,
            method: "GET",
            success: (function (foodResponse) {
                //The response from api is used to create an object and push it into an Array
                for (var i = 0; i < foodResponse.results.length; i++) {
                    foodListObj = {
                        id: foodResponse.results[i].id,
                        title: foodResponse.results[i].title,
                        foodimage: foodResponse.baseUri + foodResponse.results[i].id + "-" + "480x360.jpg"
                    };
                    foodListArr.push(foodListObj);
                }
                appendFood(foodListArr);

                //This is to clear the search area once the event has been fired
                $("#foodsearch").val('');
                $("#cuisineoption").val('');
                $("#dietoption").val('');
            }),
            error: (function (err) {
                console.log("ERROR - " + err);
            })
        });
    });

    //This is eventbinding where instructions class is dynamically created to in order for event to be associated to it i had to add it to the event with a class or id that is not dynamic which is searchresult
    $("#searchresult").on("click", ".modal-trigger", function (event) {
        event.preventDefault();
        var selectedid = $(this).attr("id")     //This get the value inside the id attribute
        //clearing the content of modal
        $(".modal-content").text('');
        $(".modal-nutrition").text('');
        $(".modal-ingredients").text('');


        //This section is related to nutrition value api call and appending the response to the modal 
        var nutritiontitle = $("<h4>").text('Nutrition Value - ');
        nutritiontitle.css({
            "font-weight": "Bolder",
            "font-size": "Large",
            "text-decoration": "Underline"
        });
        $(".modal-nutrition").append(nutritiontitle);
        var nutritionURL = "https://api.spoonacular.com/recipes/" + selectedid + "/nutritionWidget.json?apiKey=95ae78eaca0d4ab7832f91cbb104fb11";
        $.ajax({
            url: nutritionURL,
            method: "GET",
            success: (function (nutritionResponse) {
                var calories = $("<li>").text("Calories: " + nutritionResponse.calories);
                var carbs = $("<li>").text("Carbs: " + nutritionResponse.carbs);
                var fat = $("<li>").text("Fat: " + nutritionResponse.fat);
                var protein = $("<li>").text("Protein: " + nutritionResponse.protein);
                $(".modal-nutrition").append(calories);
                $(".modal-nutrition").append(carbs);
                $(".modal-nutrition").append(fat);
                $(".modal-nutrition").append(protein);
            }),
            error: (function (err) {
                console.log("ERROR - " + err);
            })
        });


        //This section is related to ingredients required api call and appending the response to the modal 
        var ingredientstitle = $("<h4>").text('Ingredients Required - ');
        ingredientstitle.css({
            "font-weight": "Bolder",
            "font-size": "Large",
            "text-decoration": "Underline"
        });
        $(".modal-ingredients").append(ingredientstitle);

        var ingredientsURL = "https://api.spoonacular.com/recipes/" + selectedid + "/ingredientWidget.json?apiKey=95ae78eaca0d4ab7832f91cbb104fb11";
        $.ajax({
            url: ingredientsURL,
            method: "GET",
            success: (function (ingredientsResponse) {
                for (var i = 0; i < ingredientsResponse.ingredients.length; i++) {
                    var ingredientsreq = $("<li>").text(ingredientsResponse.ingredients[i].name + " - Quantity: " + ingredientsResponse.ingredients[i].amount.us.value + " " + ingredientsResponse.ingredients[i].amount.us.unit);

                    //Apending food steps into the modal
                    $(".modal-ingredients").append(ingredientsreq);
                }
            }),
            error: (function (err) {
                console.log("ERROR - " + err);
            })
        });


        //This section is related to Steps to prepare the dish api call and appending the response to the modal 
        var foodtitle = $("<h4>")
        foodtitle.text('Steps to Make - ');
        foodtitle.css({
            "font-weight": "Bolder",
            "font-size": "Large",
            "text-decoration": "Underline"
        });
        $(".modal-content").append(foodtitle);

        //API call to get the recipes,ingredients and nutrition 
        var instructionURL = "https://api.spoonacular.com/recipes/" + selectedid + "/analyzedInstructions?apiKey=95ae78eaca0d4ab7832f91cbb104fb11";
        $.ajax({
            url: instructionURL,
            method: "GET",
            success: (function (instructionResponse) {
                for (var i = 0; i < instructionResponse[0].steps.length; i++) {
                    var foodSteps = $("<li>").attr("class", "foodstepline")
                    foodSteps.text(instructionResponse[0].steps[i].step);
                    $(".modal-content").append(foodSteps);
                }
            }),
            error: (function (err) {
                console.log("ERROR - " + err);
            })
        });
    });

    //This function is to append the food list into the body of the ui by dynamically creating elements
    function appendFood(list) {
        var resultfood = $("#foodsearchedfor")
        var searchvaluefood = searchtext.val();
        if (searchtext.val() === '' && searchcuisine.val() === null) {
            searchvaluefood = $("#dietoption").val();
        } else if (searchtext.val() === '' && searchdiet.val() === null) {
            searchvaluefood = $("#cuisineoption").val();
        }
        resultfood.text("Results : " + searchvaluefood);
        for (var i = 0; i < list.length; i++) {
            var cols12m6 = $("<div>").attr("class", "col s12 m6 foodcol");
            var fooditem = $("<div>").attr("class", "card singleitem");
            var imagediv = $("<div>").attr("class", "card-image");
            var foodimage = $("<img>").attr("src", list[i].foodimage);
            var morefood = $("<a>").attr({
                href: "#m-" + list[i].id,
                rel: "modal:open",
                class: "modal-trigger btn-floating halfway-fab waves-effect waves-light red",
                id: list[i].id
            });
            var moreicon = $("<i>").attr("class", "material-icons");
            moreicon.text("more_horiz");
            var foodnamediv = $("<div>").attr("class", "card-content")
            var foodname = $("<span>").attr("class", "card-title")
            foodname.text(list[i].title);
            foodname.css("font-size", "20px")
            var foodtitle = $("<p>")
            foodtitle.text(list[i].title)
            foodtitle.css({
                "font-weight": "Bolder",
                "font-size": "X-Large",
                "text-decoration": "Underline"
            });

            //Dynamically creating the modal elements and setting properties
            var modaldiv = $("<div>").attr({
                id: "m-" + list[i].id,
                class: "modal"
            })
            var modalheader = $("<h5>").attr("class", "modal-header");
            modalheader.css({
                "text-align": "Center"
            })
            var modalnutrition = $("<div>").attr("class", "modal-nutrition")
            modalnutrition.css({
                "margin-left": "10px"
            });
            var modalingredients = $("<div>").attr("class", "modal-ingredients");
            modalingredients.css({
                "margin-left": "10px",
                "margin-top": "20px"
            })
            var modalcontent = $("<div>").attr("class", "modal-content");

            //Appending the created elements together
            foodnamediv.append(foodname);
            morefood.append(moreicon);
            imagediv.append(morefood);
            imagediv.append(foodimage);
            fooditem.append(imagediv);
            fooditem.append(foodnamediv);
            cols12m6.append(fooditem);
            modalheader.append(foodtitle);

            //Appending the modal elements together
            modaldiv.append(modalheader);
            modaldiv.append(modalnutrition);
            modaldiv.append(modalingredients);
            modaldiv.append(modalcontent);

            //Appending the newly created elements and modal to the main body
            $("#searchresult").append(modaldiv);
            $("#searchresult").append(cols12m6);
        }

        //Pagination Code
        
        // Get total number of the items that should be paginated
        var numberoffoodItems = $("#searchresult .foodcol").length
        // Limit of items per each page
        var limitPerPage = 10;
        $("#searchresult .foodcol:gt(" + (limitPerPage - 1) + ")").hide();
        var totalPages = Math.round(numberoffoodItems / limitPerPage);
        $(".pagination").append("<li id='previouspage'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>");
        $(".pagination").append("<li class='pagenumber active'><a href='#!'>" + 1 + "</a></li>");

        // Loop to insert page number for each sets of items equal to page limit
        for (i = 2; i <= totalPages; i++) {
            $(".pagination").append("<li class='waves-effect pagenumber'><a href='#!'>" + i + "</a></li>");
        }

        // Add next button after all the page numbers  
        $(".pagination").append("<li id='nextpage' class='waves-effect'><a href='#!'><i class='material-icons'>chevron_right</i></a></li>")

        $(".pagination li.pagenumber").on("click", function () {
            // Check if page number that was clicked on is the current page that is being displayed
            if ($(this).hasClass("active")) {
                return false;
            } else {
                // Get the current page number
                var currentpage = $(this).index();
                // alert("User clicked on " + currentpage);  
                $(".pagination li").removeClass("active");
                $(this).addClass("active");
                $("#searchresult .foodcol").hide();
                var grandtotal = limitPerPage * currentpage;

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandtotal - limitPerPage; i < grandtotal; i++) {
                    $("#searchresult .foodcol:eq(" + i + ")").show();
                }
            }
        });

        // Function to navigate to the next page when users click on the next-page id (next page button)
        $("#nextpage").on("click", function () {
            var currentpage = $(".pagination li.active").index();
            // Check to make sure that navigating to the next page will not exceed the total number of pages
            if (currentpage === totalPages) {
                return false;
            } else {
                //Increment page by one
                currentpage++;
                $(".pagination li").removeClass("active");
                $("#searchresult .foodcol").hide();
                var grandtotal = limitPerPage * currentpage;

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandtotal - limitPerPage; i < grandtotal; i++) {
                    $("#searchresult .foodcol:eq(" + i + ")").show();
                }
                $(".pagination li.pagenumber:eq(" + (currentpage - 1) + ")").addClass("active");
            }

        });

        // Function to navigate to the previous page when users click on the previous-page id (previous page button)
        $("#previouspage").on("click", function () {
            var currentpage = $(".pagination li.active").index();
            // Check to make sure that users is not on page 1 and attempting to navigating to a previous page
            //Return false (i.e., cannot navigate to a previous page because the current page is page 1)
            if (currentpage === 1) {
                return false;
            } else {
                //Decrement page by one
                currentpage--;
                $(".pagination li").removeClass("active");
                $("#searchresult .foodcol").hide();
                var grandtotal = limitPerPage * currentpage;

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandtotal - limitPerPage; i < grandtotal; i++) {
                    $("#searchresult .foodcol:eq(" + i + ")").show();
                }
                $(".pagination li.pagenumber:eq(" + (currentpage - 1) + ")").addClass("active");
            }
        });
    }
});
