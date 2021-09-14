"use strict";

// Data
const account1 = {
  owner: "Vignesh Manickam",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Prakash Murugan",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Shrish Madan",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Anand Tamilarasu",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Display Movements
const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = "";

  // Sorting the movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const movementType = mov > 0 ? "deposit" : "withdrawal";
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${movementType}">${
      i + 1
    } ${movementType}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>
  `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculate & Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Display Summary
const calcDisplaySummary = function (acc) {
  const deposits = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposits}€`;
  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}€`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Create Username
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((x) => x[0])
      .join("");
  });
};
createUserName(accounts);

//Update UI
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS
let currentAccount;
// Login Action
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    containerApp.style.opacity = 100;

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    updateUI(currentAccount);
  }
});

// Transfer Action
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  let transferAmount = Number(inputTransferAmount.value);
  let transferAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  console.log(transferAmount);

  if (
    transferAccount &&
    transferAmount > 0 &&
    transferAmount < currentAccount.balance &&
    transferAccount?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-transferAmount);
    transferAccount.movements.push(transferAmount);
    console.log("Transfer successful");
    updateUI(currentAccount);
  }

  // Clear fields
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
});

// Loan Action
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const isLoanValid = currentAccount.movements.some(
    (mov) => mov >= (loanAmount * 10) / 100
  );

  if (isLoanValid && loanAmount > 0) {
    currentAccount.movements.push(loanAmount);
    console.log("Loan received");
    updateUI(currentAccount);
  }

  //Clear fields
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// Close Action
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const indexDelete = accounts.findIndex(
      (acc) => currentAccount.userName === acc.userName
    );
    // Delete account
    accounts.splice(indexDelete, 1);
    // Clear Fields
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
    // Hide UI
    containerApp.style.opacity = 0;
  }
});

// Sorting Action
let sorted = true;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, sorted);
  sorted = !sorted;
});
