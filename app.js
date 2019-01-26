//Budget Controller
var budgetController = (function () {
    //some code


})();



//UI Controller
var UIController = (function () {
    var DOMStrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,//returns inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        getDOMStrings:function(){
            return DOMStrings;
        }
    };

})();


//Global APP Controller
var Controller = (function (budgetCtrl, UICtrl) {
    
    var setupEventListener=function(){
        var DOM=UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            
            }
        });
    }
    var ctrlAddItem = function () {
        //1. Get the filed input data
        var input=UICtrl.getInput();
        console.log(input);

        //2.Add the item to the Budget Controller

        //3.Add the item to the UI

        //4.Calculate the budget

        //5.Display the budget on the UI
        

    }
    return{
        init:function(){
            console.log('Application has started');
            setupEventListener();
        }

    };


})(budgetController, UIController);
Controller.init();