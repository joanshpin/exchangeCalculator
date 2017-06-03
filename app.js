document.addEventListener("DOMContentLoaded", function() {

  const exchangeRateInput = document.getElementById("exchangeRate");
  const newTransactionName = document.getElementById("transactionName");
  const newTransactionQuantity = document.getElementById("quantity");
  const addTransactionButton = document.getElementById("addTransaction");
  const transactionList = document.querySelector(".transactionList ol");
  const biggestTransaction = document.getElementById("biggestTransaction");
  const euroSum = document.getElementById("euroSum");
  const plnSum = document.getElementById("plnSum");
  const deleteBtns = document.querySelectorAll(".transactionList button");
  const transactions = [];

  function isEmpty(str) {
    return str.trim() === "";
  };

  function isNumber(str) {
    if (isEmpty(str))
      return false;

    try {
      return !isNaN(parseFloat(str)) && isFinite(str); //return jest numberem i jest skonczony
    } catch(e) {
      console.log('error parsing input:', str, e);
    };
  };

  function validateRequiredString(str, fieldName) {
    if(isEmpty(str)) {
      alert("Please fill the " + fieldName);
      return false;
    };
    return str;
  };

  function validateRequiredAmount(str, fieldName) {
    if (isEmpty(str)) {
      alert("Please fill the " + fieldName);
      return false;
    };
    if (!isNumber(str)) {
      alert("Please enter valid number for " + fieldName);
      return false;
    };
    return parseFloat(str);
  };

  function addNewTransaction() {
    const exchangeRate = validateRequiredAmount(exchangeRateInput.value, "transaction exchange rate");
    if(exchangeRate === false) {
      return;
    }
    const transactionName = validateRequiredString(newTransactionName.value, "transaction name");
    if (transactionName === false) {
      return;
    }
    const transactionQuantity = validateRequiredAmount(newTransactionQuantity.value, "transaction quantity");
    if(transactionQuantity === false) {
      return;
    }

    let exchangeRateRound = Math.round(exchangeRate * 100) / 100;

    // let newTransactionQuantityVal = parseFloat(newTransactionQuantity.value);
    let newTransactionQuantityValRound = Math.round(transactionQuantity * 100) / 100;

    let resultQuantity = newTransactionQuantityValRound * exchangeRateRound;
    let resultQuantityRound = Math.round(resultQuantity * 100) / 100;

    newTransactionQuantity.value = newTransactionQuantityValRound;
    biggestTransaction.parentNode.style.display = "block";

    const oneTransactionObj = {
      tranName:transactionName,
      euroValue: newTransactionQuantityValRound,
      plnValue: resultQuantityRound,
      exchangeRate: exchangeRateRound
    };

    let tranIndex = transactions.length;
    transactions.push(oneTransactionObj);

    let oneListElement = oneTransactionObj.tranName + " EUR: " + oneTransactionObj.euroValue + " PLN: " + oneTransactionObj.plnValue;

    let entry = document.createElement('li');
    let deleteEntryBtn = createDeleteBtn();

    entry.appendChild(document.createTextNode(oneListElement));
    entry.setAttribute('tranIndex', tranIndex);
    entry.appendChild(deleteEntryBtn);
    transactionList.appendChild(entry);

    calcSum();
    updateBiggestTransaction();
  };

  function onExchangeRateChange() {
    const exchangeRate = validateRequiredAmount(exchangeRateInput.value, "transaction quantity");
    if (exchangeRate === false) {
      return;
    }
    let exchangeRateValRound = Math.round(exchangeRate * 100) / 100;
    exchangeRateInput.value = exchangeRateValRound;

    removeAllTransactionsFromList();
    addWholeListFromArr();
    calcSum();
    updateBiggestTransaction();
  };

  function addWholeListFromArr() {
    for (let x of transactions) {
      const exchangeRateVal = parseFloat(exchangeRateInput.value);
      const exchangeRateValRound = Math.round(exchangeRateVal * 100) / 100;
      let newResult = exchangeRateValRound * x.euroValue;
      let parsedNewResult = Math.round(newResult * 100) / 100;
      x.plnValue = parsedNewResult;
      x.exchangeRate = exchangeRateValRound;

      const oneListElement = x.tranName + " EUR: " + x.euroValue + " PLN: " + x.plnValue;

      let tranIndex = transactions.indexOf(x)
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

  function deleteOldBiggestTransaction() {
    if (transactions.length > 0) {
      while (biggestTransaction.childNodes[1]) {
        biggestTransaction.removeChild(biggestTransaction.childNodes[1]);
      };
    };
  };
  function calcBiggestTransaction() {
    let highest = null;
    for (let i = 0; i < transactions.length; i++) {
      if (highest === null) {
        highest = transactions[i];
      } else if (highest.plnValue < transactions[i].plnValue) {
        highest = transactions[i];
      };
    };
    return highest;
  };

  function updateBiggestUi() {
    if (transactions.length > 0) {
      const highest = calcBiggestTransaction();
      const biggestListElement = highest.tranName + " EUR: " + highest.euroValue + " PLN: " + highest.plnValue;
      let entry = document.createElement('li');
      entry.appendChild(document.createTextNode(biggestListElement));
      biggestTransaction.appendChild(entry);
    };
  };

  function updateBiggestTransaction() {
    if (transactions.length > 0) {
      deleteOldBiggestTransaction();
      updateBiggestUi();
    };
  };

  function removeAllTransactionsFromList() {
    while (transactionList.firstChild) {
      transactionList.removeChild(transactionList.firstChild);
    };
  };

  function deleteTransaction(event) {
    if (event.target.tagName.toLowerCase() === "button") {
      let thisBtn = event.target;
      let listItem = thisBtn.parentNode;
      let listItemIndex = listItem.getAttribute("tranIndex");
      transactionList.removeChild(listItem); //from html
      transactions.splice(listItemIndex, 1); //from array
      removeAllTransactionsFromList();
      addWholeListFromArr();
      calcSum();
      updateBiggestTransaction()
    };
  };

  function updateSumUi(euroAmount, plnAmount) {
    euroSum.innerText = euroAmount;
    plnSum.innerText = plnAmount;
  };

  function calcSum() {
    let euroSum = 0;
    let plnSum = 0;
    for (let x of transactions) {
      euroSum += parseFloat(x.euroValue);
      plnSum += parseFloat(x.plnValue);
    };
    euroSumRound = Math.round(euroSum * 100) / 100;
    plnSumRound = Math.round(plnSum * 100) / 100;
    updateSumUi(euroSumRound, plnSumRound);
  };

  addTransactionButton.addEventListener("click", addNewTransaction);
  transactionList.addEventListener("click", deleteTransaction);
  exchangeRateInput.addEventListener("change", onExchangeRateChange);

}); //closing DOMContentLoaded
