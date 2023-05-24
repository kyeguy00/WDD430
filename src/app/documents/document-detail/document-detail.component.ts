import { Component } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';


import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent {
document: Document;
id: string;
nativeWindow: any;

constructor(private documentService: DocumentService,
  private windowRefService: WindRefService,
  private route: ActivatedRoute,
  private router: Router) {
    this.nativeWindow = windowRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.document = this.documentService.getDocument(this.id);
    })
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
 }
}
