// DATA MODULE
var budgetController = (function () {
    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPerc = function () {
        return this.percentage;
    };
    var Income = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum = sum + current.value
        });
        data.totals[type] = sum;
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
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function (type,descr,val) {
            var newItem,ID;
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item based inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID,descr,val);
            } else if (type === 'inc') {
                newItem = new Income(ID,descr,val);
            }
           data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            // 1. Sum of all incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // 2. Total budget
            data.budget = data.totals.inc - data.totals.exp;
            // 3. Percentages exp / inc * 100
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentages(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPercentages;
            allPercentages = data.allItems.exp.map(function (cur) {
               return cur.getPerc();
            });
            return allPercentages;
        },
        getBudget: function () {
          return {
             budget: data.budget,
             totalExp: data.totals.exp,
             totalInc: data.totals.inc,
             percentage: data.percentage,
          }
        },
      deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function (current) {
                return current.id

            });
          var index = ids.indexOf(id);
          if (index !== -1) {
              data.allItems[type].splice(index, 1);
          }
      }
    }
})();

// USER INTERFACE MODULE
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        percentageItem: '.item__percentage',
        currentMonth: '.budget__title--month'
    };
    var formatNumber = function (num, type) {
        var numSplit,int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        return (type === 'exp'? '-': '+') + ' ' + int + '.' + dec;
    };
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            return {
                 type: document.querySelector(DOMStrings.inputType).value,
                 description: document.querySelector(DOMStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }

        },
        getDOMStrings: function () {
            return DOMStrings;
        },
        addToDOMList: function (obj,type) {
            var html, newHtml, element;
            // Read html from DOM
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> ' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn">' +
                    '<i class="ion-ios-close-outline"></i>' +
                    '</button>' +
                    '</div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div>' +
                    '<div class="item__percentage"></div><div class="item__delete">' +
                    '<button class="item__delete--btn">' +
                    '<i class="ion-ios-close-outline"></i>' +
                    '</button>' +
                    '</div></div></div>';
            }
            // Adding html with our data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Adding html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteDOMItem: function (currentID) {
            var elemID = document.getElementById(currentID);
            elemID.parentNode.removeChild(elemID);
        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue );

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArr[0].focus();
        },
        addPercentageItem: function (arr) {
            var fields = document.querySelectorAll(DOMStrings.percentageItem);

            nodeListForEach(fields, function (current, index) {
                if (arr[index] > 0) {
                    current.textContent = arr[index] + ' %' ;
                } else {
                    current.textContent = '---';
                }
            })
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc': type = 'exp';

            document.querySelector(DOMStrings.budgetValue).textContent         = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.budgetIncomeValue).textContent   = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.budgetExpensesValue).textContent = formatNumber(obj.totalExp,'exp');
          if (obj.percentage > 0) {
              document.querySelector(DOMStrings.budgetPercentage).textContent = obj.percentage + ' %';
          } else {
              document.querySelector(DOMStrings.budgetPercentage).textContent = '---';
          }
        },
        displayMonth: function () {
            var date, month, year, day;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August',
                'September', 'October', 'November', 'December'];
            date  = new Date();
            year  = date.getFullYear();
            month = date.getMonth();
            day   = date.getDay();
            document.querySelector(DOMStrings.currentMonth).textContent = months[month] + ' ' + year;
        },
        changeType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
               cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        }
    };
})();

// CONTROLLER APP MODULE
var Controller = (function (budgetCtrl, UICtrl) {

    var setUpEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updatePercentage = function () {
        // Calculate percentages
        budgetCtrl.calculatePercentages();
        // Put percentages into data
        var percent = budgetCtrl.getPercentages();
        // Display actual percentages for each item
        UICtrl.addPercentageItem(percent);
    };

    var updateBudget = function () {
        // 1. Calculate budget
        budgetCtrl.calculateBudget();
        // 2. Return budget
        var budget = budgetCtrl.getBudget();
        // 3. Update UI with new calculations
        UICtrl.displayBudget(budget);
    };

    var ctrlDeleteItem = function (event) {
        var itemID,splitID, type, ID;
        itemID  = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type    = splitID[0];
            ID      = parseInt(splitID[1]);
            // Delete item from data structure
            budgetCtrl.deleteItem(type,ID);
            // Delete item from UI
            UICtrl.deleteDOMItem(itemID);
            // Update Budget
            updateBudget();
            // Update percentages
            updatePercentage();

        }
    };

    var ctrlAddItem = function () {
        // 1. Get input values
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value !== 0 && input.value > 0) {
           // 2. Add new item to our Data controller
           var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
           // 3. Add new item to UI;
           UICtrl.addToDOMList(newItem, input.type);
           // 4. After adding item we clear all inputs
           UICtrl.clearFields();
           // 5. Calculate budget
           updateBudget();
           // 6. Update percentages
           updatePercentage();
       }

    };
    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1,
            });
            UICtrl.displayMonth();
            setUpEventListeners();
        }
    }
})(budgetController, UIController);

Controller.init();




