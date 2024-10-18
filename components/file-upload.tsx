"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { openai } from "@/lib/openai"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // 1. Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}_${file.name}`, file)

      if (error) throw error

      // 2. Get the file content
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .download(data.path)

      if (fileError) throw fileError

      const content = await fileData.text()

      // 3. Generate embedding using OpenAI
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: content,
      })

      const [{ embedding }] = embeddingResponse.data

      // 4. Store the file info and embedding in Supabase
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          content: content,
          embedding: embedding,
        })

      if (insertError) throw insertError

      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded, processed, and stored.",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading and processing your file.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file">Upload File</Label>
      <Input id="file" type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload and Process"}
      </Button>
    </div>
  )
}