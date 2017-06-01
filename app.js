document.addEventListener("DOMContentLoaded", function() {

  const exchangeRateInput = document.getElementById("exchangeRate");
  const newTransactionName = document.getElementById("transactionName");
  const newTransactionQuantity = document.getElementById("quantity");
  const addTransactionButton = document.getElementById("addTransaction");
  const transactionList = document.querySelector(".transactionList ol");
  const transactions = document.querySelector(".transactionList");
  const arrOfTransactions = [];
  const biggestTransaction = document.getElementById("biggestTransaction");
  const euroSum = document.getElementById("euroSum");
  const plnSum = document.getElementById("plnSum");
  const deleteBtns = transactions.querySelectorAll("button");

  biggestTransaction.parentNode.style.display = "none";

  addTransactionButton.addEventListener("click", function() { //adding first list before change rate
    let exchangeRateVal = parseFloat(exchangeRateInput.value);
    let exchangeRateValRound = Math.round(exchangeRateVal * 100) / 100;
    let transactionNameVal = newTransactionName.value;
    let newTransactionQuantityVal = parseFloat(newTransactionQuantity.value);
    let newTransactionQuantityValRound = Math.round(newTransactionQuantityVal * 100) / 100;
    let resultQuantity = newTransactionQuantityValRound * exchangeRateValRound;
    let resultQuantityRound = Math.round(resultQuantity * 100) / 100;

    newTransactionQuantity.value = newTransactionQuantityValRound;
    biggestTransaction.parentNode.style.display = "block";

    if (transactionNameVal != "") {
      if (newTransactionQuantityVal != "") {

        const oneTransactionObj = {
          tranName:transactionNameVal,
          euroValue: newTransactionQuantityValRound,
          plnValue: resultQuantityRound,
          exchangeRate: exchangeRateValRound
        };

        let tranIndex = arrOfTransactions.length;
        arrOfTransactions.push(oneTransactionObj);

        let oneListElement = oneTransactionObj.tranName + " EUR: " + oneTransactionObj.euroValue + " PLN: " + oneTransactionObj.plnValue;

        let entry = document.createElement('li');
        let deleteEntryBtn = createDeleteBtn();

        entry.appendChild(document.createTextNode(oneListElement));
        entry.setAttribute('tranIndex', tranIndex);
        entry.appendChild(deleteEntryBtn);
        transactionList.appendChild(entry);


        calcSum();
        findBiggestTransaction()

      } else {
        alert("Please fill the transaction quantity");
      };
    } else {
      alert("Please fill the transaction name");
    };
  }, false); //closing addEventListener to click on addTransaction


  exchangeRateInput.addEventListener("change", function() {
    let exchangeRateVal = parseFloat(exchangeRateInput.value);
    let exchangeRateValRound = Math.round(exchangeRateVal * 100) / 100;
    exchangeRateInput.value = exchangeRateValRound;

    if (exchangeRateValRound !== " ") {
      removeAllTransactionsFromList();
      addWholeListFromArr();
      calcSum()
      findBiggestTransaction()

    } else {
      alert("Please fill the exchange rate.")
    };
  });


  function addWholeListFromArr() {
    for (let x of arrOfTransactions) {
      const exchangeRateVal = parseFloat(exchangeRateInput.value);
      const exchangeRateValRound = Math.round(exchangeRateVal * 100) / 100;
      let newResult = exchangeRateValRound * x.euroValue;
      let parsedNewResult = Math.round(newResult * 100) / 100;
      x.plnValue = parsedNewResult;
      x.exchangeRate = exchangeRateValRound;

      const oneListElement = x.tranName + " EUR: " + x.euroValue + " PLN: " + x.plnValue;

      let tranIndex = arrOfTransactions.indexOf(x)
      let entry = document.createElement('li');
      let deleteEntryBtn = createDeleteBtn();
      entry.appendChild(document.createTextNode(oneListElement));
      entry.setAttribute('tranIndex', tranIndex);
      entry.appendChild(deleteEntryBtn)
      transactionList.appendChild(entry);
    };
  };

  function createDeleteBtn() {
    let deleteEntryBtn = document.createElement("button");
    let deleteEntryBtnText = document.createTextNode("Delete");
    deleteEntryBtn.appendChild(deleteEntryBtnText);
    deleteEntryBtn.className = "delete";
    return deleteEntryBtn;
  }

  function findBiggestTransaction() {
    if (arrOfTransactions.length > 0) {
      while (biggestTransaction.childNodes[1]) { //deletes if it exists
        biggestTransaction.removeChild(biggestTransaction.childNodes[1]);
      };

      let highest = null; //search for the biggest
      for (let i = 0; i < arrOfTransactions.length; i++) {
        if (highest === null) {
          highest = arrOfTransactions[i];
        } else if (highest.plnValue < arrOfTransactions[i].plnValue) {
          highest = arrOfTransactions[i];
        };
      };

      const biggestListElement = highest.tranName + " EUR: " + highest.euroValue + " PLN: " + highest.plnValue;
      let entry = document.createElement('li');
      entry.appendChild(document.createTextNode(biggestListElement));
      biggestTransaction.appendChild(entry);
    };
  };

  function removeAllTransactionsFromList() {
    while (transactionList.firstChild) {
      transactionList.removeChild(transactionList.firstChild);
    };
  };

  function removeOneTransactionFromList() {
    transactionList.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'button') {
        let thisBtn = event.target;
        let listItem = thisBtn.parentNode;
        let listItemIndex = listItem.getAttribute('tranIndex');

        transactionList.removeChild(listItem); //delete from html
        arrOfTransactions.splice(listItemIndex, 1) //delete from array

        removeAllTransactionsFromList();
        addWholeListFromArr();
        calcSum();
        findBiggestTransaction()
      };
    });
  };
  removeOneTransactionFromList()


  function calcSum() {
    let euroSumText = document.getElementById("euroSum").innerText;
    let plnSumText = document.getElementById("plnSum").innerText;
    let parsedEuroSum = parseInt(euroSumText);
    let parsedPlnSum = parseInt(plnSumText);

    parsedEuroSum = 0;
    parsedPlnSum = 0;

    for (let x of arrOfTransactions) {
      parsedPlnSum += parseInt(x.plnValue);
      parsedEuroSum += parseInt(x.euroValue);
    };

    euroSum.innerText = parsedEuroSum;
    plnSum.innerText = parsedPlnSum;

  };

}, false); //closing DOMContentLoaded
