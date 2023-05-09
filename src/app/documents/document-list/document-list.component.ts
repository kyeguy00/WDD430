import { Component, Output, EventEmitter } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Document 1', 'This is document 1', 'document1url'),
    new Document(2, 'Document 2', 'This is document 2', 'document2url'),
    new Document(3, 'Document 3', 'This is document 3', 'document3url'),
    new Document(4, 'Document 4', 'This is document 4', 'document4url'),
    new Document(5, 'Document 5', 'This is document 5', 'documenturl')
  ]
  onDocumentSelected(document: Document) {
  this.selectedDocumentEvent.emit(document);
  }
}
