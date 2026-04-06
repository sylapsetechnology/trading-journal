import Papa from 'papaparse'
import { Trade } from '@/types'

export interface CSVColumn {
  key: string
  label: string
}

export const TRADE_COLUMNS: CSVColumn[] = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'entry_date', label: 'Entry Date' },
  { key: 'exit_date', label: 'Exit Date' },
  { key: 'side', label: 'Side' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'entry_price', label: 'Entry Price' },
  { key: 'exit_price', label: 'Exit Price' },
  { key: 'net_pnl', label: 'P&L' },
  { key: 'commission', label: 'Commission' },
]

export interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
  error?: string
}

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          rows: results.data as Record<string, string>[],
        })
      },
      error: (error) => {
        resolve({ headers: [], rows: [], error: error.message })
      },
    })
  })
}

export function mapCSVToTrades(
  rows: Record<string, string>[],
  mapping: Record<string, string>,
  userId: string
): Partial<Trade>[] {
  return rows.map(row => {
    const trade: Partial<Trade> = {
      user_id: userId,
      status: 'closed',
      asset_type: 'stocks',
      commission: 0,
      mistake_tags: [],
      is_backtested: false,
    }

    for (const [field, csvColumn] of Object.entries(mapping)) {
      if (!csvColumn || !row[csvColumn]) continue
      const val = row[csvColumn].trim()
      switch (field) {
        case 'symbol': trade.symbol = val.toUpperCase(); break
        case 'side': trade.side = val.toLowerCase().includes('buy') || val.toLowerCase() === 'long' ? 'long' : 'short'; break
        case 'quantity': trade.quantity = parseFloat(val); break
        case 'entry_price': trade.entry_price = parseFloat(val); break
        case 'exit_price': trade.exit_price = parseFloat(val); break
        case 'entry_date': trade.entry_date = new Date(val).toISOString(); break
        case 'exit_date': trade.exit_date = new Date(val).toISOString(); break
        case 'net_pnl': trade.net_pnl = parseFloat(val); break
        case 'commission': trade.commission = parseFloat(val); break
      }
    }

    return trade
  }).filter(t => t.symbol && t.entry_price && t.quantity)
}

export const BROKER_FORMATS = [
  {
    name: 'Generic CSV',
    description: 'Standard format with basic trade fields',
    columns: 'Symbol, Date, Side, Qty, Entry Price, Exit Price, P&L',
  },
  {
    name: 'Interactive Brokers',
    description: 'Export from IBKR Activity Statement',
    columns: 'Symbol, Date/Time, Quantity, T. Price, Proceeds, Comm/Fee',
  },
  {
    name: 'TD Ameritrade',
    description: 'Export from TDA Transaction History',
    columns: 'DATE, TRANSACTION TYPE, SYMBOL, QUANTITY, PRICE, AMOUNT',
  },
  {
    name: 'Binance',
    description: 'Export from Binance Trade History',
    columns: 'Date, Pair, Side, Price, Amount, Total, Fee',
  },
]
