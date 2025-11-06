"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type ICDItem = {
	id: string
	icd: string
	title: string
	description?: string
}

export default function ICD11Sidebar({ onSelectAction }: { onSelectAction?: (item: ICDItem) => void }) {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<ICDItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedId, setSelectedId] = useState<string | null>(null)

	useEffect(() => {
		if (!query.trim()) {
			setResults([])
			setError(null)
			return
		}

		const timer = setTimeout(() => {
			fetchResults(query)
		}, 300)

		return () => clearTimeout(timer)
	}, [query])

	async function fetchResults(q: string) {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(
				`https://clinicaltables.nlm.nih.gov/api/icd11_codes/v3/search?terms=${encodeURIComponent(q)}&maxList=12`
			)
			if (!res.ok) throw new Error("Network error")
			const data = await res.json()
			const codes = data[1] || []
			const entries = (data[3] || []).map((e: any[]) => ({ title: e[1] }))
			const mapped = codes.map((code: string, i: number) => ({
				id: code,
				icd: code,
				title: entries[i]?.title || code,
				description: "",
			}))
			setResults(mapped)
		} catch (err: any) {
			setError(err?.message || "Error searching ICD-11")
			setResults([])
		} finally {
			setLoading(false)
		}
	}

		function handleSelect(item: ICDItem) {
			setSelectedId(item.id)
			onSelectAction?.(item)
		}

	return (
		<Card className="p-3 bg-card border-border">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-semibold text-foreground">ICD-11 Lookup</h3>
			</div>

			<div className="relative">
				<input
					aria-label="Search ICD-11"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search ICD-11 — e.g. diabetes, heart"
					className="w-full pl-9 pr-3 h-9 rounded-md border border-border bg-input text-sm"
				/>
				<div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
					<Search className="w-4 h-4" />
				</div>
			</div>

			<div className="mt-3 max-h-56 overflow-auto">
				{loading && <p className="text-xs text-muted-foreground">Searching…</p>}
				{error && <p className="text-xs text-destructive">{error}</p>}
				{!loading && results.length === 0 && query.trim() !== "" && (
					<p className="text-xs text-muted-foreground">No matches</p>
				)}

				<ul className="space-y-2">
					{results.map((r) => (
						<li key={r.id}>
							<div
								role="button"
								tabIndex={0}
								onClick={() => handleSelect(r)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault()
										handleSelect(r)
									}
								}}
								className={`w-full text-left p-2 rounded-md transition hover:bg-accent/5 ${selectedId === r.id ? 'bg-accent/10' : ''}`}
							>
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm font-medium text-foreground">{r.title}</div>
										<div className="text-xs text-muted-foreground">ICD: {r.icd}</div>
									</div>
									<div>
										<Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleSelect(r) }}>
											Add
										</Button>
									</div>
								</div>
							</div>
							</li>
					))}
				</ul>
			</div>
		</Card>
	)
}

