import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ask-gramperly',
  templateUrl: './ask-gramperly.component.html',
  styleUrls: ['./ask-gramperly.component.scss']
})
export class AskGramperlyComponent implements OnInit {

  gramperlyQuestion = '';
  showResults = false;
  lastRandomLoadingTime = 1000;

  loadingMessages = [
    'I\'m doing the best I can...',
    'Thinking... thinking...',
    'Hold your horses...',
    'Hold your horses, sonny...',
    'Is this our table?...',
    'Hmmm... that\'s a tough one...'
  ];

  loadingGifs = [
    "<img src='https://media.giphy.com/media/K6aZlaZEJjt4s/giphy.gif' />",
    "<img src='https://media.giphy.com/media/26tno5f6B0AwsTC9O/giphy.gif' />",
    "<img src='https://media.giphy.com/media/l3709n4zm8kgeoxyr8/giphy.gif' />",
    "<img src='https://media.giphy.com/media/gWNr07kKBUM3S/giphy.gif' />",
    "<img src='https://media.giphy.com/media/T1Ta8bcA6KkUM/giphy.gif' />",
    "<img src='https://media.giphy.com/media/ip9n5Cg3Pcfyo/giphy.gif' />",
    "<img src='https://media.giphy.com/media/l2JJO0D0JpgoU5OTe/giphy.gif' />",
    "<img src='https://media.giphy.com/media/de5bARu0SsXiU/giphy.gif' />",
    "<img src='https://media.giphy.com/media/XpxVDWILLXC92/giphy.gif' />"
  ];

  getRandomLoadingTime() {
    const min = 5000;
    const max = 15000;
    this.lastRandomLoadingTime = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.lastRandomLoadingTime;
  }

  lastRandomLoadingTimeInSeconds() {
    return (this.lastRandomLoadingTime/1000);
  }

  getRandomMessage(): String {
    const randomIndex = Math.floor(Math.random() * (this.loadingMessages.length - 1));
    return this.loadingMessages[randomIndex];
  }

  getRandomGif(): String {
    const randomIndex = Math.floor(Math.random() * (this.loadingGifs.length - 1));
    return this.loadingGifs[randomIndex];
  }


  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onUpdateQuestion(event: any): void {
    this.gramperlyQuestion = event.target.value;
  }

  onSubmit(): void {
     /** spinner starts onSubmit() */
    this.spinner.show();
    this.showResults = false;
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.showResults = true;
      this.spinner.hide();
      }, this.getRandomLoadingTime());
    // var search = this.gramperlyQuestion;
    // search.replace(/\s/g, '+');
    // window.location.href = `https://api.duckduckgo.com/?q=${search}`
  }

}
