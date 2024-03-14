import { NextRequest, NextResponse } from "next/server";
// import { PineconeClient } from '@pinecone-database/pinecone'
import { Pinecone } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { createPineconeIndex, updatePinecone } from "@/utils";
import { indexName } from "@/config";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";



export async function POST() {
  const loader = new DirectoryLoader('./documents', {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path)
  })

  const docs = await loader.load()
  const vectorDimensions = 1536

  const client = new Pinecone
  ({
    apiKey: process.env.PINECONE_API_KEY || '',
    // environment: process.env.PINECONE_ENVIRONMENT || ''
  })

  console.log("oyy")

  try {
    await createPineconeIndex(client, indexName, vectorDimensions)
    console.log("hii")
    await updatePinecone(client, indexName, docs)
  } catch (err) {
    console.log('error: ', err)
  }

  return NextResponse.json({
    data: 'successfully created index and loaded data into pinecone...'
  })
}