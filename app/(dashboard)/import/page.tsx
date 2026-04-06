'use client'

import { useState, useRef, useCallback } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { parseCSVFile, BROKER_FORMATS } from '@/lib/csv-parser'
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ImportStatus = 'idle' | 'parsing' | 'preview' | 'importing' | 'done'

interface ParsedRow {
  [key: string]: string
}

export default function ImportPage() {
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file')
      return
    }
    setFileName(file.name)
    setError(null)
    setStatus('parsing')
    const result = await parseCSVFile(file)
    if (result.error) {
      setError(result.error)
      setStatus('idle')
      return
    }
    setHeaders(result.headers)
    setRows(result.rows as ParsedRow[])
    setStatus('preview')
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleImport = () => {
    setStatus('importing')
    setTimeout(() => {
      setImportedCount(rows.length)
      setStatus('done')
    }, 1800)
  }

  const reset = () => {
    setStatus('idle')
    setFileName(null)
    setHeaders([])
    setRows([])
    setError(null)
    setImportedCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const previewRows = rows.slice(0, 5)

  return (
    <div>
      <Topbar title="Import CSV" />
      <div className="p-6 space-y-6">

        {/* Drop Zone */}
        {(status === 'idle' || status === 'parsing') && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all',
              dragging
                ? 'border-indigo-500 bg-indigo-600/5'
                : 'border-[#2a2a40] bg-[#1a1a24] hover:border-indigo-600/50 hover:bg-indigo-600/5'
            )}
          >
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={onInputChange} />
            {status === 'parsing' ? (
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            ) : (
              <Upload className={cn('w-10 h-10 transition-colors', dragging ? 'text-indigo-400' : 'text-slate-500')} />
            )}
            <div className="text-center">
              <p className="text-white font-medium">
                {status === 'parsing' ? 'Parsing file...' : 'Drop your CSV here'}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {status === 'parsing' ? '' : 'or click to browse'}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Preview */}
        {(status === 'preview' || status === 'importing') && (
          <div className="space-y-4">
            {/* File info */}
            <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-white font-medium">{fileName}</div>
                  <div className="text-slate-500 text-sm">{rows.length} trades detected</div>
                </div>
              </div>
              <button onClick={reset} className="text-slate-500 hover:text-red-400 text-sm transition-colors">
                Remove
              </button>
            </div>

            {/* Preview table */}
            <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Preview (first {previewRows.length} rows)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a40]">
                      {headers.map(h => (
                        <th key={h} className="text-left py-2 px-3 text-slate-500 font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i} className="border-b border-[#2a2a40]/40">
                        {headers.map(h => (
                          <td key={h} className="py-2 px-3 text-slate-300 whitespace-nowrap max-w-[160px] overflow-hidden text-ellipsis">
                            {row[h] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Import button */}
            <Button
              onClick={handleImport}
              disabled={status === 'importing'}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3"
            >
              {status === 'importing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${rows.length} trade${rows.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        )}

        {/* Success */}
        {status === 'done' && (
          <div className="bg-[#1a1a24] border border-green-500/30 rounded-xl p-10 flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Import complete!</p>
              <p className="text-slate-400 text-sm mt-1">{importedCount} trades imported successfully.</p>
            </div>
            <Button
              onClick={reset}
              variant="outline"
              className="border-[#2a2a40] text-slate-400 hover:text-white mt-2"
            >
              Import another file
            </Button>
          </div>
        )}

        {/* Supported Brokers */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Supported Brokers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BROKER_FORMATS.map(broker => (
              <div key={broker.name} className="bg-[#0f0f13] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20">
                    {broker.name}
                  </Badge>
                </div>
                <p className="text-slate-400 text-xs mb-2">{broker.description}</p>
                <p className="text-slate-600 text-xs font-mono">{broker.columns}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
