export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'CLOSED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface Account {
  id: number;
  accountNumber: string;
  holderName: string;
  holderDocument: string;
  currency: string;
  balance: number;
  status: AccountStatus;
  createdAt: string;
}

export interface Transaction {
  transactionReference: string;
  idempotencyKey?: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  status: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface CreateAccountDTO {
  holderName: string;
  holderDocument: string;
  currency: string;
  initialBalance: number;
}

export interface TransferDTO {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description: string;
}

export interface DepositWithdrawDTO {
  accountNumber: string;
  amount: number;
  description: string;
}
