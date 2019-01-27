//Budget Controller
var budgetController = (function () {
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        AddItem: function (type, des, val) {
            var newItem, ID;
            //[1 2 3 4 5] , iD=6
            //[1 2 4 6 8], id=9
            //id=last ID+1
            //create new Id
            if (data.allItems[type].length>0) {
                ID = data.allItems[type](data.allItems[type].length - 1).id + 1;
            } else {
                ID = 0;
            }
            //create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
            //push into ds
            data.allItems[type].push(newItem);
            //return it to budget controller
            return newItem;

        }
    }


})();



//UI Controller
var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,//returns inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    };

})();


//Global APP Controller
var Controller = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();

            }
        });
    }
    var ctrlAddItem = function () {
        //1. Get the filed input data
        var input = UICtrl.getInput();
        console.log(input);

        //2.Add the item to the Budget Controller
        budgetCtrl.AddItem(input.type,input.description,input.value);
        //3.Add the item to the UI

        //4.Calculate the budget

        //5.Display the budget on the UI


    }
    return {
        init: function () {
            console.log('Application has started');
            setupEventListener();
        }

    };


})(budgetController, UIController);
Controller.init();