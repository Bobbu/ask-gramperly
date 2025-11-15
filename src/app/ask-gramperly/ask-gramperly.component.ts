import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ask-gramperly',
    templateUrl: './ask-gramperly.component.html',
    styleUrls: ['./ask-gramperly.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AskGramperlyComponent {
  gramperlyQuestion = '';
  showResults = false;
  isLoading = false;
  currentMessage = '';
  currentGif = '';
  lastRandomLoadingTime = 1000;

  loadingMessages = [
    'I\'m doing the best I can...',
    'Thinking... thinking...',
    'Hold your horses...',
    'Hold your horses, sonny...',
    'Is this our table?...',
    'Hmmm... that\'s a tough one...',
    'What\'s your hurry?...',
    'Where\'s the fire?...',
    'Did I ever tell you the story about...',
    'Zzzzz... Zzzzz... Zzzzz...',
    'Mr. Bigshot. Eating dinner after 5...'
  ];

  loadingGifs = [
    '<img src=\'https://media.giphy.com/media/K6aZlaZEJjt4s/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/26tno5f6B0AwsTC9O/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/l3709n4zm8kgeoxyr8/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/gWNr07kKBUM3S/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/T1Ta8bcA6KkUM/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/ip9n5Cg3Pcfyo/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/l2JJO0D0JpgoU5OTe/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/de5bARu0SsXiU/giphy.gif\' />',
    '<img src=\'https://media.giphy.com/media/XpxVDWILLXC92/giphy.gif\' />'
  ];

  getRandomLoadingTime(): number {
    const min = 5000;
    const max = 15000;
    this.lastRandomLoadingTime = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.lastRandomLoadingTime;
  }

  lastRandomLoadingTimeInSeconds(): number {
    return (this.lastRandomLoadingTime / 1000);
  }

  getRandomMessage(): string {
    const randomIndex = Math.floor(Math.random() * (this.loadingMessages.length - 1));
    return this.loadingMessages[randomIndex];
  }

  getRandomGif(): string {
    const randomIndex = Math.floor(Math.random() * (this.loadingGifs.length - 1));
    return this.loadingGifs[randomIndex];
  }

  onUpdateQuestion(event: Event): void {
    this.gramperlyQuestion = (event.target as HTMLInputElement).value;
  }

  onSubmit(): void {
    /** Show loading overlay */
    this.isLoading = true;
    this.showResults = false;
    this.currentMessage = this.getRandomMessage();
    this.currentGif = this.getRandomGif();

    setTimeout(() => {
      /** Hide loading and show results */
      this.isLoading = false;
      this.showResults = true;
    }, this.getRandomLoadingTime());
  }

}
