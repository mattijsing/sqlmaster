"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function SqlAgent() {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNaturalLanguageQuery(e.target.value)
  }

  const handleGenerateSQL = async () => {
    if (!naturalLanguageQuery) {
      toast({
        title: "No query entered",
        description: "Please enter a natural language query to generate SQL.",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement SQL generation using OpenAI and vector database knowledge
    const mockSqlQuery = "SELECT * FROM users WHERE age > 30 AND city = 'New York';"
    setSqlQuery(mockSqlQuery)
    toast({
      title: "SQL query generated",
      description: "A SQL query has been generated based on your natural language input.",
    })
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="nlquery">Natural Language Query</Label>
      <Textarea
        id="nlquery"
        value={naturalLanguageQuery}
        onChange={handleQueryChange}
        placeholder="Enter your query in natural language"
      />
      <Button onClick={handleGenerateSQL}>Generate SQL</Button>
      {sqlQuery && (
        <div className="mt-4">
          <Label>Generated SQL Query:</Label>
          <pre className="text-sm bg-muted p-2 rounded">{sqlQuery}</pre>
        </div>
      )}
    </div>
  )
}