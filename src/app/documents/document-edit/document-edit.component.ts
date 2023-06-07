import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import {Document} from '../document.model';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('f') dlForm: NgForm;
  editMode = false;
  originalDocument: Document;
  document: Document;

  
constructor(
  private documentService: DocumentService,
  private router: Router,
  private route: ActivatedRoute) {

}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      
      if (!id) {
        this.editMode = false;
        return;
      }
      
      this.originalDocument = this.documentService.getDocument(id);
      
      if (!this.originalDocument) {
        return;
      }
      
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument))
    });
  }

  onCancel() {
    this.router.navigate(['../'])
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newDocument = new Document(values.id, values.title, values.description, values.url);
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument)
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.editMode = false;
    this.router.navigate(['../'])
  }
}
