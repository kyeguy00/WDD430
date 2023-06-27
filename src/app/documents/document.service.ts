import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): void {
    const url = 'http://localhost:3000/documents';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.get<Document[]>(url, { headers }).subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.sortDocuments();
        this.documentListChangedEvent.next([...this.documents]);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null!;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === document.id);
  
    if (pos < 0) {
      return;
    }
  
    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        (error: any) => {
          console.error('Error deleting document:', error);
        }
      );
  }
  

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = Number(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  private sortAndSend() {
    // Sort the documents based on your sorting criteria
    this.sortDocuments();

    // Send the sorted documents to wherever you need
    this.documentListChangedEvent.next([...this.documents]);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
  
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
  
    if (pos < 0) {
      return;
    }
  
    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        (error: any) => {
          console.error('Error updating document:', error);
        }
      );
  }
  
  

  private sortDocuments(): void {
    this.documents.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private storeDocuments(): void {
    const url =
      'https://cms-project-38479-default-rtdb.firebaseio.com/documents.json';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const documentsString = JSON.stringify(this.documents);

    this.http.put(url, documentsString, { headers }).subscribe(
      () => {
        console.log('Documents stored successfully.');
      },
      (error: any) => {
        console.error('Error storing documents:', error);
      }
    );
  }
}
