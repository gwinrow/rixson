import { Component, OnInit } from '@angular/core';
import { Page } from '../../page';
import { PageService } from 'src/app/page.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  pages: Observable<Page[]>;

  deletePage(page: Page) {
    this.pageService.deletePage(page);
  }

  constructor(private pageService: PageService) { }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }

}
