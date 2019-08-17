//budget controller
var budgetController=(function(){
   /* var x=23;
    //provdes data privacy as 'add' is not visible out side the scope
    var add=function(a){
        return a+x;
    }
    //to make any thing public
    return{
        publicmethod:function(b){
            return add(b);
        }
     }*/
    //code here
    //using function constructor
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome){
         if(totalIncome>0){
             this.percenatge=Math.round((this.value/totalIncome)*100); 
         }   
        else{
            this.percenatge=-1;
        }
    };
    Expense.prototype.getPercentage=function(){
       return this.percenatge;  
    };
    var Income=function(id,description,value){
         this.id=id;
        this.description=description;
        this.value=value;
    };
    //calculatetotal
    var calculatetotal=function(type){
      var sum=0;
      data.allitems[type].forEach(function(curr){
          sum=sum+curr.value;   
      });
     data.totals[type]=sum;
    };
    //data structure to store all values is array
    var data={
        allitems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    return {
        addItem:function(type,desc,value){
            var newItem,Id=0;
            //we collect id from data object ,from allItem property which contains exp,inc arrays
            //i.e the last element id +1;
            if(data.allitems[type].length>0){
            Id=data.allitems[type][data.allitems[type].length-1].id+1;
                }
            else{
                id=0;
            }
            //create new item based on inc,exp
            if(type=='exp'){
             
                newItem=new Expense(Id,desc,value);
            }
            else if(type=='inc'){
                newItem=new Income(Id,desc,value);
            } 
            //push it into our data structure
            data.allitems[type].push(newItem);
            //return the new elements
            return newItem;
        },
        deleteItem:function(type,id){
             var ids,index;
            ids=data.allitems[type].map(function(current){
                return current.id;
            }); 
            index=ids.indexOf(id);
            if(index !== -1){
                data.allitems[type].splice(index,1); 
            }
        },
        calculateBudget:function(){
            //caclculat e total income and expenses
            calculatetotal('exp');
            calculatetotal('inc');
            //calculate the budget=income-expenses
            data.budget=data.totals.inc-data.totals.exp;
           //calculate hte percentage of income spent
           if(data.totals.inc>0){
               data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
            else{
                data.percentage=-1;
            }
        },
        
        calculatePercentages:function(){
            
                data.allitems.exp.forEach(function(current){
               current.calcPercentage(data.totals.inc); 
                 });  
        },
        
        getPercentages:function(){
            var allperc=data.allitems.exp.map(function(current){
                return current.getPercentage();
            });
            return allperc;
        },
            
        getBudget:function(){
            return {
                budget:data.budget,
                totalinc:data.totals.inc,
                totalexp:data.totals.exp,
                percentage:data.percentage
            }
        },
        test:function(){
            return data;
        }
    };
})();
//ui controller
var uiController=(function(){
    //code here
    var strings={
        inputtype:'.add__type',
        inputdesc:'.add__description',
        inputval:'.add__value',
        inputbtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };
    var formatnumber=function(num,type){
            var numsplit,int,dec,sign;
            /*
            + or - before numbder
            exactly 2 decimal places
            comma seperating the thousands
            */
            num=Math.abs(num);
            num=num.toFixed(2);
            numsplit=num.split('.');
            int=numsplit[0];
            dec=numsplit[1];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
            return (type=='exp'?'-':'+') +' '+int+'.'+dec;
            
        };
    var nodeListForEach=function(list,callback){
             for(var i=0;i<list.length;i++){
                 
                 callback(list[i],i);
              
             }
         };
    return {
         getinput:function(){
             //insted of returning 3 different values we can return object with these as properties
           return{ type:document.querySelector(strings.inputtype).value,//will be either inc or exp
             description:document.querySelector(strings.inputdesc).value,
             value:parseFloat(document.querySelector(strings.inputval).value)
            
             };
         },
        addListItem:function(object,type){
            var html,newHtml,element;
            //create html string with placeholder text
            if(type=='inc'){
            element=strings.incomeContainer;
                
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type=='exp'){
            element=strings.expensesContainer;
                
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder text with some actual data
            newHtml=html.replace('%id%',object.id);
            newHtml=newHtml.replace('%description%',object.description);
            newHtml=newHtml.replace('%value%',formatnumber(object.value,type));
            //insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(selectorID){
             var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el); 
        },
        clearFields:function(){
         var fields; fields=document.querySelectorAll(strings.inputdesc +','+strings.inputval); 
         var fieldsarr=Array.prototype.slice.call(fields);
            //forEach will work on arrays 
        fieldsarr.forEach(function(current,index,array){
            //this can receive upto 3 arguments in this case
            current.value="";
        });
            fieldsarr[0].focus(); 
        },
        displayBudget:function(obj){
            /*budget:data.budget,
                totalinc:data.totals.inc,
                totalexp:data.totals.exp,
                percentage:data.percentage*/ 
            var type;
            obj.budget>0 ? type='inc': type='exp';
            document.querySelector(strings.budgetLabel).textContent=formatnumber(obj.budget,type);
            document.querySelector(strings.incomeLabel).textContent=formatnumber(obj.totalinc,'inc');
            document.querySelector(strings.expensesLabel).textContent=formatnumber(obj.totalexp,'exp');
            
            if(obj.percentage>0){
                document.querySelector(strings.percentageLabel).textContent=obj.percentage + '%';
            }
            else{
                document.querySelector(strings.percentageLabel).textContent='---';
            }
        },
        displayPercentages:function(percentages){
           var fields=document.querySelectorAll(strings.expensesPercLabel);
            
           //a replica of foreach loop written by user
        
            nodeListForEach(fields,function(current,index){
                //code
               if(percentages[index]>0){ current.textContent=percentages[index]+'%';
               }
             else{
                 if(percentages[index]!==-1){
                 current.textContent='<1%';
                }
                 else{
                     current.textContent='---';
                 }
             }
            });
        },
        displayMonth:function(){
           var now,year,month,months;
            now=new Date();
            year=now.getFullYear();
            month=now.getMonth();
           months=['January','February','March','April','May','June','July','August','September','October','November','December']; document.querySelector(strings.dateLabel).textContent=months[month]+' '+year;
        },
        changedType:function(){
          var fields=document.querySelectorAll(strings.inputtype+','+strings.inputdesc+','+strings.inputval);  
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
                
            });
            document.querySelector(strings.inputbtn).classList.toggle('red');
          
        },
        getstrings:function(){
                 return strings;
        }
     };
})();







//app controller 
var controller=(function(budgetctrl,uictrl){
    /*var z=budgetctrl.publicmethod (20);
    return{
        publicmethod3:function(){
            console.log(z);
        }
    }*/
    //code here
    var setEventListeners=function(){
     
       var DOM=uictrl.getstrings(); 
      document.querySelector(DOM.inputbtn).addEventListener('click',ctrlAddItem);
    
      document.addEventListener('keypress',function(event){
         if(event.keyCode==13 || event.which==13) {
             ctrlAddItem();
         }
      }); 
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
      document.querySelector(DOM.inputtype).addEventListener('change',uictrl.changedType);
    };
    var updatebudget=function(){
        //1.calcul the budget
          budgetctrl.calculateBudget();
        //2.return the budget
          var budget=budgetctrl.getBudget();
       //3.display the budget on the ui
        uictrl.displayBudget(budget);
    }; 
    var updatePercentages=function(){
        //1.calculate perceantage
          budgetctrl.calculatePercentages();
        //2.read from budget controller
        var percentages=budgetctrl.getPercentages();
        //3.update ui with new percentages
        uictrl.displayPercentages(percentages);
    };
    
   var ctrlAddItem=function(){
        var input,newItem;
        //1.get the input data
        input=uictrl.getinput();
       if(input.description!==" " && !(isNaN(input.value)) && input.value>0){
        //2.add item to the budget controller
         newItem=budgetctrl.addItem(input.type,input.description,input.value);
         //3.add new item to ui
           uictrl.addListItem(newItem,input.type);
        //4.clear fields
           uictrl.clearFields(); 
        //5.calculate and updte budget
        updatebudget();
        //calculate update percentages
         updatePercentages();
       }
   };
    var ctrlDeleteItem=function(event){
       var itemId,splitId,type,id; itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
           //we get inc-1 to split we use split method
           splitId=itemId.split('-');
            type=splitId[0];
            id=splitId[1];
            //1.dlelete item form data structure
               budgetctrl.deleteItem(type,parseInt(id));
            //2.delete the item form user  interface
               uictrl.deleteListItem(itemId);
            //3.update and show the new budget
            updatebudget();
            //calculate update percentages
          updatePercentages();
        }
        
    };
    //as we need some thing to call eventlistener function we need to call them
    return{
        init:function(){
            uictrl.displayBudget({
                budget:0,
                totalinc:0,
                totalexp:0,
                percentage:0
            });
            setEventListeners();
            uictrl.displayMonth();
        }
    }
})(budgetController,uiController);
//controller.publicmethod3();
controller.init();
















