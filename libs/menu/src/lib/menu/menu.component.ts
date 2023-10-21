import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { generateRandomItem, ItemInterface } from "@rmm-task/api";
import { MatCardModule } from "@angular/material/card";
import { NgForOf, NgIf } from "@angular/common";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
  selector: 'libs-menu',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, NgIf, NgForOf, MatSnackBarModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  randomItemList: ItemInterface[] = [];
  selectedName: string | null = null;
  selectedIndex: number = -1;

  constructor(private snackBar: MatSnackBar) {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  addItem(): void {
    const getRandomItems = generateRandomItem()
    this.randomItemList.push(getRandomItems);
  }

  removeSelectedItems(): void {
    this.randomItemList = this.randomItemList.filter(item => !item.selected);
    this.selectedName = null;
    this.selectItem(this.selectedIndex - 1);
  }

  selectItem(index: number): void {
    if (index >= 0 && index < this.randomItemList.length) {
      const item = this.randomItemList[index];
      if (item) {
        if (this.selectedIndex !== index) {
          const previousItem = this.randomItemList[this.selectedIndex];

          if (previousItem) {
            previousItem.selected = false;
          }

          this.selectedIndex = index;
        }

        item.selected = !item.selected;
        this.selectedName = item.selected ? item.name : null;

      }
    }
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.removeSelectedItems();
    }
    if (event.key === 'Enter' && this.randomItemList && this.randomItemList.some(item => item.selected)) {
      this.showSnackBar();
    } else if (event.key === 'ArrowLeft') {
      this.selectItem(this.selectedIndex - 1);
    } else if (event.key === 'ArrowRight') {
      this.selectItem(this.selectedIndex + 1);
    } else if (event.key === 'ArrowUp') {
      this.selectItem(0);
    } else if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.randomItemList.length - 1) {
        this.selectItem(this.randomItemList.length - 1);
      }
    }
    event.stopPropagation();
  }

  showSnackBar(): void {
    const selectedItems = this.randomItemList.filter(item => item.selected);
    const selectedNames = selectedItems.map(item => item.name).join(', ');
    const message = `Приложение ${selectedNames} запущено `;

    this.snackBar.open(message, 'OK', {
      duration: 3000, verticalPosition: 'top', horizontalPosition: 'center',
    });
  }
}
