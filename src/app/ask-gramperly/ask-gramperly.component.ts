import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ask-gramperly',
  templateUrl: './ask-gramperly.component.html',
  styleUrls: ['./ask-gramperly.component.scss']
})
export class AskGramperlyComponent implements OnInit {

  gramperlyQuestion = '';
  showResults = false;

  constructor() { }

  ngOnInit(): void {
  }

  onUpdateQuestion(event: any): void {
    this.gramperlyQuestion = event.target.value;
  }

  onSubmit(): void {
    console.log(this.gramperlyQuestion);
    this.showResults = true;
    // var search = this.gramperlyQuestion;
    // search.replace(/\s/g, '+');
    // window.location.href = `https://api.duckduckgo.com/?q=${search}`
  }

}
