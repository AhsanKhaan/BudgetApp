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
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type]=sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage:-1,
    };
        return {
        AddItem: function (type, des, val) {
            var newItem, ID;
            //[1 2 3 4 5] , iD=6
            //[1 2 4 6 8], id=9
            //id=last ID+1
            //create new Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //push into ds
            data.allItems[type].push(newItem);
            //return it to budget controller
            return newItem;

        },
        testing: function () {
            return data;
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
        },
        calculateBudget:function(){
            //calculate Total Income and Expense
            calculateTotal('inc');
            calculateTotal('exp');
            //budget=income -expense
            data.budget=data.totals.inc-data.totals.exp;
            //calculate percentage of income that we spent
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }else{
                data.percentage=-1;
            }
            
        },
    

    }


})();



//UI Controller
var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expanseContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,//returns inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
        },
        addListItem: function (obj, type) {
            var html, newHTML, element;
            //create an HTML string with placeholder text
            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.incomeContainer;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.expanseContainer;
            }
            //Replace the placeHolder Text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        clearFields: function () {
            var fileds, fieldArr;
            //returns a list
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            //lsit converted into array using slice()
            fieldArr = Array.prototype.slice.call(fields);
            //for each loop where curr=value of present array,i=index,array=field arr
            fieldArr.forEach(function (curr, i, Arr) {
                curr.value = "";
            });
            fieldArr[0].focus();
        },
        getDOMStrings: function () {
            return DOMStrings;
        },
        displayBudget:function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent=obj.totalExp;
            if(obj.percentage>0){
                document.querySelector(DOMStrings.percentageLabel).textContent=obj.percentage+'%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent='---';
            }
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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    var updateBudget = function () {
        //1.Calculate the budget
        budgetCtrl.calculateBudget();
        //2.Return Budget
        var budget=budgetCtrl.getBudget();
        //3.Display the budget on the UI
        UICtrl.displayBudget(budget);

    };
    var ctrlAddItem = function () {
        //1. Get the filed input data
        var input = UICtrl.getInput();
        if (input.description!==""&&!isNaN(input.value)&&input.value>0) {
            //2.Add the item to the Budget Controller
            var newItem = budgetCtrl.AddItem(input.type, input.description, input.value);
            //3.Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4.Clear Input fields
            UICtrl.clearFields();
            //5.Calculate and update the budget
            updateBudget();
        }

    };
    var ctrlDeleteItem=function(event){
        var itemID,splitID,type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            //inc-1
            splitID=itemID.split('-');
            type=splitID[0];
            ID=splitID[1];
            //delete item from data structure

            //delete from UI
            
            //update the budget
        }
    }

    return {
        init: function () {
            console.log('Application has started');
            UICtrl.displayBudget({budget:0,
                totalInc:0,
                totalExp:0,
                percentage:'---'});
            setupEventListener();
        }

    };


})(budgetController, UIController);
Controller.init();