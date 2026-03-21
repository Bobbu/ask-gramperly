import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../services/search.service';

@Component({
    selector: 'app-ask-gramperly',
    templateUrl: './ask-gramperly.component.html',
    styleUrls: ['./ask-gramperly.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class AskGramperlyComponent {
  private searchService = inject(SearchService);

  gramperlyQuestion = '';
  highGear = false;
  showResults = false;
  isLoading = false;
  currentMessage = '';
  currentGif = '';
  lastRandomLoadingTime = 1000;
  searchResults: SearchResult[] = [];
  searchError = false;

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

  gramperlyQuestions = [
    'Is this our table?',
    'Where did I put my shoes?',
    'Where to buy Ensure?',
    'What time is the early bird special?',
    'How to increase font size on phone?',
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
    if (!this.gramperlyQuestion.trim()) {
      return;
    }

    this.isLoading = !this.highGear;
    this.showResults = false;
    this.searchResults = [];
    this.searchError = false;
    this.currentMessage = this.getRandomMessage();
    this.currentGif = this.getRandomGif();

    const delayTime = this.highGear ? 0 : this.getRandomLoadingTime();

    // Start the actual search immediately (it runs in the background)
    this.searchService.search(this.gramperlyQuestion).subscribe({
      next: (response) => {
        this.searchResults = response.results;
        if (this.highGear) {
          this.isLoading = false;
          this.showResults = true;
        }
      },
      error: () => {
        this.searchError = true;
        this.searchResults = [];
        if (this.highGear) {
          this.isLoading = false;
          this.showResults = true;
        }
      },
    });

    if (!this.highGear) {
      // Show results after the comedic delay
      setTimeout(() => {
        this.isLoading = false;
        this.showResults = true;
      }, delayTime);
    }
  }

  getDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
}
