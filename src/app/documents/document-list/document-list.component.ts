import { Component, OnInit, OnDestroy } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = [];

  private docChangeSub: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.getDocuments();
    this.docChangeSub = this.documentService.documentListChangedEvent.subscribe((documents: Document[]) => {
      this.documents = documents;
    });

  }

  ngOnDestroy(): void {
    this.docChangeSub.unsubscribe();
  }
}
