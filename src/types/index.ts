export interface Expense {
    id: string;
    title: string;
    price: number;
    category: string;
    date: string;
  }
  
  export interface ChartData {
    food: number;
    entertainment: number;
    travel: number;
  }
  
  export interface ExpenseTrackerState {
    walletBalance: number;
    expenses: Expense[];
    totalExpenses: number;
    chartData: ChartData;
    maxCategoryAmount: number;
  }
  