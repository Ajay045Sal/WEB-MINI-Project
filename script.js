
    let analyticsChart, activityChart, transactionChart, trendChart;
    let expenses = { 
        Healthcare: 24700, 
        Shopping: 6200, 
        Utilities: 3500, 
        Transportation: 4800, 
        Dining: 3200, 
        Entertainment: 1500, 
        Education: 2000 
    };
    let budget = 1000000;
    let savingsGoal = 50000;
    let transactions = [
        { date: 'Mar 1', amount: 1000, category: 'Shopping' },
        { date: 'Mar 5', amount: 500, category: 'Utilities' },
        { date: 'Mar 10', amount: 1500, category: 'Healthcare' }
    ];
    let bills = [
        { name: 'Electricity', amount: 120, dueDate: 'Mar 15', status: 'Pending', paid: 0 },
        { name: 'Rent', amount: 1500, dueDate: 'Mar 1', status: 'Paid', paid: 1500 }
    ];
    let debts = [
        { name: 'Credit Card', amount: 3000, dueDate: 'Mar 20', interest: 18.5, minPayment: 100, paid: 500 },
        { name: 'Student Loan', amount: 10000, dueDate: 'Mar 25', interest: 6.8, minPayment: 200, paid: 1000 }
    ];
    let showCumulative = true;
    let currentPage = 'dashboard';

    function loadPage(page) {
        currentPage = page;
        const totalSpent = Object.values(expenses).reduce((a,b) => a+b, 0);
        const remainingBudget = budget - totalSpent;
        const budgetPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
        const yearlySpending = totalSpent * 12;
        const savingsProgress = Math.min((budget - totalSpent) / savingsGoal * 100, 100);

        transactions.sort((a, b) => new Date(`2025 ${a.date}`) - new Date(`2025 ${b.date}`));

        const content = {
            'dashboard': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all'>
                            <div class="flex justify-between items-center">
                                <h1 class='text-3xl font-bold text-gray-800'>Welcome, Danielly</h1>
                                <div class="relative">
                                    <button onclick="toggleDropdown()" class="text-2xl text-gray-700">👤</button>
                                    <div id="dropdownMenu" class="dropdown-menu">
                                        <a href="#" onclick="loadLogin()">Login</a>
                                        <a href="#" onclick="loadSignup()">Sign Up</a>
                                    </div>
                                </div>
                            </div>
                            <p class='text-gray-600'>Your financial overview for March 2025</p>
                            <div class='flex space-x-4 mt-4'>
                                <button onclick="loadPage('activity')" class='bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>Quick Add Expense</button>
                                <button onclick="loadPage('bills')" class='bg-green-600 text-white p-2 rounded hover:bg-green-700'>Quick Add Bill</button>
                            </div>
                            <div class='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                                <div>
                                    <h2 class='text-xl font-semibold text-gray-700'>Account Balance</h2>
                                    <p class='text-3xl font-bold text-green-600'>₹${remainingBudget.toLocaleString()}.00</p>
                                    <h2 class='text-xl font-semibold text-gray-700 mt-4'>Monthly Budget</h2>
                                    <div class='flex items-center mt-2'>
                                        <input type='number' id='budgetInput' value='${budget}' class='border p-2 rounded w-32' placeholder='Set Budget'>
                                        <button onclick='updateBudget()' class='bg-blue-600 text-white p-2 rounded ml-2 hover:bg-blue-700'>Update</button>
                                    </div>
                                    <p class='text-sm text-gray-600 mt-1'>Current: ₹${budget.toLocaleString()}.00</p>
                                </div>
                                <div>
                                    <h2 class='text-xl font-semibold text-gray-700'>Budget Usage</h2>
                                    <div class='progress-bar bg-gray-200 mt-2'>
                                        <div class='progress-fill bg-purple-500' style='width: ${budgetPercentage}%'></div>
                                    </div>
                                    <p class='text-sm text-gray-600 mt-1'>${budgetPercentage.toFixed(1)}% of budget spent</p>
                                    <button onclick='resetAll()' class='bg-red-600 text-white p-2 rounded mt-4 hover:bg-red-700'>Reset All</button>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h2 class='text-xl font-semibold text-gray-700'>Savings Goal</h2>
                                <div class='bg-gray-100 p-4 rounded-lg mt-2'>
                                    <p class='text-sm text-gray-600'>Goal: ₹${savingsGoal.toLocaleString()}</p>
                                    <div class='progress-bar bg-gray-200 mt-2'>
                                        <div class='progress-fill bg-green-500' style='width: ${savingsProgress}%'></div>
                                    </div>
                                    <p class='text-sm text-gray-600 mt-1'>${savingsProgress.toFixed(1)}% achieved (₹${(budget - totalSpent).toLocaleString()} saved)</p>
                                    <input type='number' id='savingsGoalInput' value='${savingsGoal}' class='border p-2 rounded w-32 mt-2' placeholder='Set Goal'>
                                    <button onclick='updateSavingsGoal()' class='bg-blue-600 text-white p-2 rounded ml-2 hover:bg-blue-700'>Update Goal</button>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h2 class='text-xl font-semibold text-gray-700'>Spending Summary</h2>
                                <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2'>
                                    ${Object.entries(expenses).map(([cat, amt]) => `
                                        <div class='bg-gray-100 p-3 rounded-lg'>
                                            <p class='text-sm text-gray-600'>${cat}</p>
                                            <p class='text-lg font-semibold text-gray-800'>₹${amt.toLocaleString()}</p>
                                        </div>`).join('')}
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h2 class='text-xl font-semibold text-gray-700'>Recent Transactions</h2>
                                <ul class='mt-2 space-y-2'>
                                    ${transactions.slice(-3).reverse().map(t => `
                                        <li class='bg-gray-50 p-3 rounded-lg flex justify-between'>
                                            <span>${t.date} - ${t.category}</span>
                                            <span class='font-semibold text-red-500'>-₹${t.amount.toLocaleString()}</span>
                                        </li>`).join('') || '<li class="text-gray-600">No transactions yet</li>'}
                                </ul>
                            </div>
                            <div class='mt-6'>
                                <h2 class='text-xl font-semibold text-gray-700'>Quick Stats</h2>
                                <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2'>
                                    <div class='bg-blue-50 p-3 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Avg. Daily Spend</p>
                                        <p class='text-lg font-semibold text-blue-600'>₹${(totalSpent / 31).toFixed(2)}</p>
                                    </div>
                                    <div class='bg-green-50 p-3 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Remaining Days</p>
                                        <p class='text-lg font-semibold text-green-600'>28 days</p>
                                    </div>
                                    <div class='bg-yellow-50 p-3 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Top Category</p>
                                        <p class='text-lg font-semibold text-yellow-600'>${Object.entries(expenses).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0]}</p>
                                    </div>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h2 class='text-xl font-semibold text-gray-700'>Yearly Spending (Estimate)</h2>
                                <div class='bg-purple-50 p-4 rounded-lg mt-2'>
                                    <p class='text-sm text-gray-600'>Total Spent This Year (Projected)</p>
                                    <p class='text-xl font-semibold text-purple-600'>₹${yearlySpending.toLocaleString()}</p>
                                </div>
                            </div>
                            <button onclick='exportData("transactions")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Transactions as CSV</button>
                          </div>`,
            'activity': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all'>
                            <h2 class='text-2xl font-bold text-gray-800'>Recent Activity</h2>
                            <div class='mt-4'>
                                <input type='number' id='activityAmount' class='border p-2 rounded' placeholder='Amount'>
                                <span class='ml-2'>₹</span>
                                <select id='activityCategory' class='border p-2 rounded ml-2' onchange='toggleCustomInput(this)'>
                                    <option value='Healthcare'>Healthcare</option>
                                    <option value='Shopping'>Shopping</option>
                                    <option value='Utilities'>Utilities</option>
                                    <option value='Transportation'>Transportation</option>
                                    <option value='Dining'>Dining</option>
                                    <option value='Entertainment'>Entertainment</option>
                                    <option value='Education'>Education</option>
                                    <option value='Custom'>Custom</option>
                                </select>
                                <input type='text' id='customCategory' class='border p-2 rounded ml-2 hidden' placeholder='Enter custom category'>
                                <button onclick='recordExpense()' class='bg-blue-600 text-white p-2 rounded ml-2 hover:bg-blue-700'>Add Expense</button>
                            </div>
                            <div class='chart-container mt-4'><canvas id="activityChart"></canvas></div>
                            <button onclick='exportData("transactions")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Transactions as CSV</button>
                         </div>`,
            'analytics': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all min-h-screen'>
                            <h2 class='text-2xl font-bold text-gray-800'>Expense Analytics</h2>
                            <p class='text-gray-600'>Track your spending patterns</p>
                            <div class='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <h3 class='text-lg font-semibold text-gray-700'>Category Breakdown</h3>
                                    <div class='chart-container mt-2'><canvas id="analyticsChart"></canvas></div>
                                </div>
                                <div>
                                    <h3 class='text-lg font-semibold text-gray-700'>Spending Trends</h3>
                                    <div class='chart-container mt-2'><canvas id="trendChart"></canvas></div>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Category Insights</h3>
                                <div class='bg-gray-100 p-4 rounded-lg mt-2'>
                                    <p class='text-sm text-gray-600'>Highest Spending: ${Object.entries(expenses).reduce((a, b) => a[1] > b[1] ? a : b)[0]} (₹${Object.entries(expenses).reduce((a, b) => a[1] > b[1] ? a : b)[1].toLocaleString()})</p>
                                    <p class='text-sm text-gray-600'>Lowest Spending: ${Object.entries(expenses).reduce((a, b) => a[1] < b[1] ? a : b)[0]} (₹${Object.entries(expenses).reduce((a, b) => a[1] < b[1] ? a : b)[1].toLocaleString()})</p>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Detailed Category Insights</h3>
                                <table class='w-full mt-2 text-sm text-gray-700 border'>
                                    <thead class='bg-gray-100'>
                                        <tr>
                                            <th class='p-2 text-left'>Category</th>
                                            <th class='p-2 text-right'>Amount</th>
                                            <th class='p-2 text-right'>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.entries(expenses).map(([cat, amt]) => `
                                            <tr class='border-b'>
                                                <td class='p-2'>${cat}</td>
                                                <td class='p-2 text-right'>₹${amt.toLocaleString()}</td>
                                                <td class='p-2 text-right'>${totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(1) : 0}%</td>
                                            </tr>`).join('')}
                                        <tr class='font-semibold bg-gray-50'>
                                            <td class='p-2'>Total</td>
                                            <td class='p-2 text-right'>₹${totalSpent.toLocaleString()}</td>
                                            <td class='p-2 text-right'>${totalSpent > 0 ? 100 : 0}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Budget Comparison</h3>
                                <div class='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
                                    <div class='bg-blue-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Total Spent</p>
                                        <p class='text-xl font-semibold text-blue-600'>₹${totalSpent.toLocaleString()}</p>
                                    </div>
                                    <div class='bg-green-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Remaining Budget</p>
                                        <p class='text-xl font-semibold text-green-600'>₹${remainingBudget.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div class='progress-bar bg-gray-200 mt-4'>
                                    <div class='progress-fill bg-purple-500' style='width: ${budgetPercentage}%'></div>
                                </div>
                                <p class='text-sm text-gray-600 mt-1'>${budgetPercentage.toFixed(1)}% of budget used (${(100 - budgetPercentage).toFixed(1)}% remaining)</p>
                            </div>
                            <button onclick='exportData("transactions")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Transactions as CSV</button>
                          </div>`,
            'transactions': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all'>
                            <h2 class='text-2xl font-bold text-gray-800'>Transaction History</h2>
                            <p class='text-gray-600'>Your spending over time</p>
                            <div class='mt-4 flex space-x-4'>
                                <button onclick='toggleTransactionView(true)' class='bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>Cumulative</button>
                                <button onclick='toggleTransactionView(false)' class='bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>Individual</button>
                            </div>
                            <div class='chart-container mt-4'><canvas id="transactionChart"></canvas></div>
                            <h3 class='text-lg font-semibold text-gray-700 mt-6'>All Transactions</h3>
                            <ul class='mt-2 space-y-2 max-h-60 overflow-y-auto'>
                                ${transactions.map(t => `
                                    <li class='bg-gray-50 p-3 rounded-lg flex justify-between'>
                                        <span>${t.date} - ${t.category}</span>
                                        <span class='font-semibold text-red-500'>-₹${t.amount.toLocaleString()}</span>
                                    </li>`).join('') || '<li class="text-gray-600">No transactions yet</li>'}
                            </ul>
                            <button onclick='exportData("transactions")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Transactions as CSV</button>
                         </div>`,
            'bills': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all min-h-screen'>
                            <h2 class='text-2xl font-bold text-gray-800'>Bills</h2>
                            <p class='text-gray-600'>Manage your upcoming bills</p>
                            <div class='mt-4'>
                                <input type='text' id='billName' class='border p-2 rounded' placeholder='Bill Name'>
                                <input type='number' id='billAmount' class='border p-2 rounded ml-2' placeholder='Amount'>
                                <input type='text' id='billDueDate' class='border p-2 rounded ml-2' placeholder='Due Date (e.g., Mar 15)'>
                                <button onclick='addBill()' class='bg-blue-600 text-white p-2 rounded ml-2 hover:bg-blue-700'>Add Bill</button>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Upcoming Bills</h3>
                                <ul class='mt-2 space-y-2'>
                                    ${bills.map(b => `
                                        <li class='bg-gray-50 p-3 rounded-lg flex justify-between items-center'>
                                            <span>${b.name} - Due: ${b.dueDate} <span class='text-sm ${b.status === 'Paid' ? 'text-green-600' : 'text-red-600'}'>(${b.status})</span></span>
                                            <span class='font-semibold text-red-500'>₹${b.amount.toLocaleString()}</span>
                                        </li>`).join('') || '<li class="text-gray-600">No bills yet</li>'}
                                </ul>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Bill Payment Summary</h3>
                                <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2'>
                                    <div class='bg-blue-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Total Bills</p>
                                        <p class='text-xl font-semibold text-blue-600'>₹${bills.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                                    </div>
                                    <div class='bg-green-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Paid Amount</p>
                                        <p class='text-xl font-semibold text-green-600'>₹${bills.reduce((a, b) => a + b.paid, 0).toLocaleString()}</p>
                                    </div>
                                    <div class='bg-red-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Pending Amount</p>
                                        <p class='text-xl font-semibold text-red-600'>₹${bills.reduce((a, b) => a + (b.status === 'Pending' ? b.amount : 0), 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Payment Progress</h3>
                                <div class='progress-bar bg-gray-200 mt-2'>
                                    <div class='progress-fill bg-green-500' style='width: ${bills.length > 0 ? (bills.reduce((a, b) => a + b.paid, 0) / bills.reduce((a, b) => a + b.amount, 0) * 100) : 0}%'></div>
                                </div>
                                <p class='text-sm text-gray-600 mt-1'>${bills.length > 0 ? (bills.reduce((a, b) => a + b.paid, 0) / bills.reduce((a, b) => a + b.amount, 0) * 100).toFixed(1) : 0}% of bills paid</p>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Bill History</h3>
                                <table class='w-full mt-2 text-sm text-gray-700 border'>
                                    <thead class='bg-gray-100'>
                                        <tr>
                                            <th class='p-2 text-left'>Bill Name</th>
                                            <th class='p-2 text-right'>Amount</th>
                                            <th class='p-2 text-right'>Due Date</th>
                                            <th class='p-2 text-right'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${bills.map(b => `
                                            <tr class='border-b'>
                                                <td class='p-2'>${b.name}</td>
                                                <td class='p-2 text-right'>₹${b.amount.toLocaleString()}</td>
                                                <td class='p-2 text-right'>${b.dueDate}</td>
                                                <td class='p-2 text-right ${b.status === 'Paid' ? 'text-green-600' : 'text-red-600'}'>${b.status}</td>
                                            </tr>`).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <button onclick='exportData("bills")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Bills as CSV</button>
                         </div>`,
            'debt': `<div class='bg-white p-6 rounded-xl shadow-md shadow-hover transition-all min-h-screen'>
                            <h2 class='text-2xl font-bold text-gray-800'>Debt</h2>
                            <p class='text-gray-600'>Track and manage your debts</p>
                            <div class='mt-4'>
                                <input type='text' id='debtName' class='border p-2 rounded' placeholder='Debt Name'>
                                <input type='number' id='debtAmount' class='border p-2 rounded ml-2' placeholder='Amount'>
                                <input type='text' id='debtDueDate' class='border p-2 rounded ml-2' placeholder='Due Date (e.g., Mar 20)'>
                                <input type='number' id='debtInterest' class='border p-2 rounded ml-2' placeholder='Interest Rate (%)' step='0.1'>
                                <input type='number' id='debtMinPayment' class='border p-2 rounded ml-2' placeholder='Min Payment'>
                                <button onclick='addDebt()' class='bg-blue-600 text-white p-2 rounded ml-2 hover:bg-blue-700'>Add Debt</button>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Current Debts</h3>
                                <ul class='mt-2 space-y-2'>
                                    ${debts.map(d => `
                                        <li class='bg-gray-50 p-3 rounded-lg flex justify-between items-center'>
                                            <span>${d.name} - Due: ${d.dueDate} (${d.interest}% Interest)</span>
                                            <span class='font-semibold text-red-500'>₹${d.amount.toLocaleString()}</span>
                                        </li>`).join('') || '<li class="text-gray-600">No debts yet</li>'}
                                </ul>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Debt Summary</h3>
                                <div class='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2'>
                                    <div class='bg-blue-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Total Debt</p>
                                        <p class='text-xl font-semibold text-blue-600'>₹${debts.reduce((a, d) => a + d.amount, 0).toLocaleString()}</p>
                                    </div>
                                    <div class='bg-green-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Amount Paid</p>
                                        <p class='text-xl font-semibold text-green-600'>₹${debts.reduce((a, d) => a + d.paid, 0).toLocaleString()}</p>
                                    </div>
                                    <div class='bg-red-50 p-4 rounded-lg'>
                                        <p class='text-sm text-gray-600'>Remaining Debt</p>
                                        <p class='text-xl font-semibold text-red-600'>₹${debts.reduce((a, d) => a + (d.amount - d.paid), 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Debt Payoff Progress</h3>
                                <div class='progress-bar bg-gray-200 mt-2'>
                                    <div class='progress-fill bg-green-500' style='width: ${debts.length > 0 ? (debts.reduce((a, d) => a + d.paid, 0) / debts.reduce((a, d) => a + d.amount, 0) * 100) : 0}%'></div>
                                </div>
                                <p class='text-sm text-gray-600 mt-1'>${debts.length > 0 ? (debts.reduce((a, b) => a + b.paid, 0) / debts.reduce((a, b) => a + b.amount, 0) * 100).toFixed(1) : 0}% of debt paid off</p>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Debt Details</h3>
                                <table class='w-full mt-2 text-sm text-gray-700 border'>
                                    <thead class='bg-gray-100'>
                                        <tr>
                                            <th class='p-2 text-left'>Debt Name</th>
                                            <th class='p-2 text-right'>Amount</th>
                                            <th class='p-2 text-right'>Interest (%)</th>
                                            <th class='p-2 text-right'>Min Payment</th>
                                            <th class='p-2 text-right'>Paid</th>
                                            <th class='p-2 text-right'>Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${debts.map(d => `
                                            <tr class='border-b'>
                                                <td class='p-2'>${d.name}</td>
                                                <td class='p-2 text-right'>₹${d.amount.toLocaleString()}</td>
                                                <td class='p-2 text-right'>${d.interest}</td>
                                                <td class='p-2 text-right'>₹${d.minPayment.toLocaleString()}</td>
                                                <td class='p-2 text-right text-green-600'>₹${d.paid.toLocaleString()}</td>
                                                <td class='p-2 text-right text-red-600'>₹${(d.amount - d.paid).toLocaleString()}</td>
                                            </tr>`).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <div class='mt-6'>
                                <h3 class='text-lg font-semibold text-gray-700'>Interest Impact (Estimated Yearly)</h3>
                                <div class='bg-yellow-50 p-4 rounded-lg mt-2'>
                                    <p class='text-sm text-gray-600'>Total Interest Paid This Year</p>
                                    <p class='text-xl font-semibold text-yellow-600'>₹${debts.reduce((a, d) => a + (d.amount * (d.interest / 100)), 0).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onclick='exportData("debts")' class='bg-gray-600 text-white p-2 rounded mt-4 hover:bg-gray-700'>Export Debts as CSV</button>
                         </div>`,
            'login': `<div class="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
                        <div class="bg-white p-8 rounded-xl shadow-md shadow-hover w-full max-w-md">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">Login</h2>
                            <div class="space-y-4">
                                <input type="text" id="loginUsername" class="w-full border p-2 rounded" placeholder="Username">
                                <input type="password" id="loginPassword" class="w-full border p-2 rounded" placeholder="Password">
                                <button onclick="alert('Login functionality to be implemented')" class="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Login</button>
                                <p class="text-center text-gray-600">Don't have an account? <a href="#" onclick="loadPage('signup')" class="text-purple-600 hover:underline">Sign Up</a></p>
                            </div>
                        </div>
                      </div>`,
            'signup': `<div class="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
                        <div class="bg-white p-8 rounded-xl shadow-md shadow-hover w-full max-w-md">
                            <h2 class="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
                            <div class="space-y-4">
                                <input type="text" id="signupUsername" class="w-full border p-2 rounded" placeholder="Username">
                                <input type="password" id="signupPassword" class="w-full border p-2 rounded" placeholder="Password">
                                <input type="password" id="signupConfirmPassword" class="w-full border p-2 rounded" placeholder="Confirm Password">
                                <button onclick="alert('Signup functionality to be implemented')" class="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Sign Up</button>
                                <p class="text-center text-gray-600">Already have an account? <a href="#" onclick="loadPage('login')" class="text-purple-600 hover:underline">Login</a></p>
                            </div>
                        </div>
                      </div>`
        };
        document.getElementById('main-content').innerHTML = content[page];
        if (page !== 'login' && page !== 'signup') {
            updateSidebar();
            checkAlerts(totalSpent, budget, bills);
            setTimeout(() => renderCharts(page), 100);
        }
        // Close dropdown when loading a new page
        document.getElementById('dropdownMenu').style.display = 'none';
    }

    function updateSidebar() {
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            const page = link.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (page === currentPage) {
                link.classList.remove('text-gray-700', 'hover:text-purple-900');
                link.classList.add('text-purple-900', 'font-semibold');
            } else {
                link.classList.remove('text-purple-900', 'font-semibold');
                link.classList.add('text-gray-700', 'hover:text-purple-900');
            }
        });
    }

    function checkAlerts(totalSpent, budget, bills) {
        const alertContainer = document.getElementById('alert-container') || document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.className = 'alert';
        let alerts = '';

        if (totalSpent > budget * 0.9) {
            alerts += `<div class='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2'>Budget Alert: You've spent over 90% of your budget (₹${totalSpent.toLocaleString()}/₹${budget.toLocaleString()})!</div>`;
        }

        const today = new Date();
        bills.forEach(bill => {
            const dueDate = new Date(`2025 ${bill.dueDate}`);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            if (bill.status === 'Pending' && daysUntilDue <= 3 && daysUntilDue >= 0) {
                alerts += `<div class='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-2'>Bill Alert: "${bill.name}" is due in ${daysUntilDue} day(s) (₹${bill.amount.toLocaleString()})!</div>`;
            }
        });

        alertContainer.innerHTML = alerts;
        if (alerts && !document.getElementById('alert-container')) {
            document.body.appendChild(alertContainer);
        }
    }

    function toggleDropdown() {
        const dropdown = document.getElementById('dropdownMenu');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    function loadLogin() {
        loadPage('login');
    }

    function loadSignup() {
        loadPage('signup');
    }

    function updateSavingsGoal() {
        const newGoal = parseInt(document.getElementById('savingsGoalInput').value);
        if (!isNaN(newGoal) && newGoal > 0) {
            savingsGoal = newGoal;
            loadPage('dashboard');
        }
    }

    function exportData(type) {
        let csvContent = "data:text/csv;charset=utf-8,";
        let data;
        if (type === 'transactions') {
            csvContent += "Date,Category,Amount\n";
            data = transactions.map(t => `${t.date},${t.category},-₹${t.amount}`).join('\n');
        } else if (type === 'bills') {
            csvContent += "Name,Amount,Due Date,Status,Paid\n";
            data = bills.map(b => `${b.name},₹${b.amount},${b.dueDate},${b.status},₹${b.paid}`).join('\n');
        } else if (type === 'debts') {
            csvContent += "Name,Amount,Due Date,Interest,Min Payment,Paid\n";
            data = debts.map(d => `${d.name},₹${d.amount},${d.dueDate},${d.interest},₹${d.minPayment},₹${d.paid}`).join('\n');
        }
        csvContent += data;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${type}_export_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function renderCharts(page) {
        if (page === 'analytics') {
            const ctxPie = document.getElementById('analyticsChart').getContext('2d');
            if (analyticsChart) analyticsChart.destroy();
            analyticsChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: Object.keys(expenses),
                    datasets: [{
                        data: Object.values(expenses),
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            const ctxTrend = document.getElementById('trendChart').getContext('2d');
            if (trendChart) trendChart.destroy();
            trendChart = new Chart(ctxTrend, {
                type: 'line',
                data: {
                    labels: transactions.map(t => t.date),
                    datasets: [{
                        label: 'Daily Spending',
                        data: transactions.map(t => t.amount),
                        backgroundColor: '#4caf50',
                        borderColor: '#4caf50',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
        if (page === 'activity') {
            const ctx = document.getElementById('activityChart').getContext('2d');
            if (activityChart) activityChart.destroy();
            activityChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(expenses),
                    datasets: [{
                        label: 'Expense Amount',
                        data: Object.values(expenses),
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        if (page === 'transactions') {
            const ctx = document.getElementById('transactionChart').getContext('2d');
            if (transactionChart) transactionChart.destroy();
            transactionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: transactions.map(t => t.date),
                    datasets: [{
                        label: showCumulative ? 'Cumulative Expenses' : 'Individual Expenses',
                        data: showCumulative 
                            ? transactions.map((t, i) => transactions.slice(0, i+1).reduce((a, b) => a + b.amount, 0))
                            : transactions.map(t => t.amount),
                        backgroundColor: '#ff5722',
                        borderColor: '#ff5722',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const t = transactions[tooltipItem.index];
                                return `${t.date}: -₹${t.amount} (${t.category})`;
                            }
                        }
                    }
                }
            });
        }
    }

    function toggleCustomInput(selectElement) {
        const customInput = document.getElementById('customCategory');
        customInput.classList.toggle('hidden', selectElement.value !== 'Custom');
    }

    function recordExpense() {
        const amount = parseInt(document.getElementById('activityAmount').value);
        let category = document.getElementById('activityCategory').value;
        const customCategory = document.getElementById('customCategory').value.trim();

        if (isNaN(amount) || amount <= 0) return;

        if (category === 'Custom' && customCategory) {
            category = customCategory;
        } else if (category === 'Custom') {
            return;
        }

        expenses[category] = (expenses[category] || 0) + amount;
        transactions.push({ 
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            amount, 
            category 
        });
        document.getElementById('customCategory').value = '';
        loadPage('activity');
    }

    function updateBudget() {
        const newBudget = parseInt(document.getElementById('budgetInput').value);
        if (!isNaN(newBudget) && newBudget >= 0) {
            budget = newBudget;
            loadPage('dashboard');
        }
    }

    function resetAll() {
        for (let category in expenses) {
            expenses[category] = 0;
        }
        budget = 0;
        transactions = [];
        bills = [];
        debts = [];
        loadPage('dashboard');
    }

    function addBill() {
        const name = document.getElementById('billName').value.trim();
        const amount = parseInt(document.getElementById('billAmount').value);
        const dueDate = document.getElementById('billDueDate').value.trim();

        if (name && !isNaN(amount) && amount > 0 && dueDate) {
            bills.push({ name, amount, dueDate, status: 'Pending', paid: 0 });
            document.getElementById('billName').value = '';
            document.getElementById('billAmount').value = '';
            document.getElementById('billDueDate').value = '';
            loadPage('bills');
        }
    }

    function addDebt() {
        const name = document.getElementById('debtName').value.trim();
        const amount = parseInt(document.getElementById('debtAmount').value);
        const dueDate = document.getElementById('debtDueDate').value.trim();
        const interest = parseFloat(document.getElementById('debtInterest').value);
        const minPayment = parseInt(document.getElementById('debtMinPayment').value);

        if (name && !isNaN(amount) && amount > 0 && dueDate && !isNaN(interest) && !isNaN(minPayment)) {
            debts.push({ name, amount, dueDate, interest, minPayment, paid: 0 });
            document.getElementById('debtName').value = '';
            document.getElementById('debtAmount').value = '';
            document.getElementById('debtDueDate').value = '';
            document.getElementById('debtInterest').value = '';
            document.getElementById('debtMinPayment').value = '';
            loadPage('debt');
        }
    }

    function toggleTransactionView(cumulative) {
        showCumulative = cumulative;
        loadPage('transactions');
    }

    window.onload = () => loadPage('dashboard');
