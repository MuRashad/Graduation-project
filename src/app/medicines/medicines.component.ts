import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicinesService } from '../medicines.service';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.css']
})
export class MedicinesComponent implements OnInit {
  medicines: any[] = [];
  filteredMedicines: any[] = [];
  filteredCategories: string[] = [];
  selectedCategory: string | null = null;
  searchControl: FormControl = new FormControl('');

  constructor(
    private medicinesService: MedicinesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getMedicines();
    this.searchControl.valueChanges.subscribe((value: string) => {
      this.filterResults(value);
    });

    // Retrieve the selected category from the query params if available
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.filterByCategory(category);
      } else {
        this.selectedCategory = null;
        this.filteredMedicines = [...this.medicines];
        this.filteredCategories = this.extractCategories();
      }
    });
  }

  getMedicines(): void {
    this.medicinesService.getMedicines().subscribe({
      next: (data: any[]) => {
        this.medicines = data;
        this.filterResults(null); // Apply initial filters based on selected category or search
      },
      error: (err: any) => {
        console.error('Error fetching medicines:', err);
      }
    });
  }

  filterResults(query: string | null): void {
    if (this.selectedCategory) {
      this.filterMedicines(query);
    } else {
      this.filteredMedicines = this.medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(query?.toLowerCase() || '')
      );
      this.filteredCategories = this.extractCategories();
    }
  }

  filterMedicines(query: string | null): void {
    this.filteredMedicines = this.medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(query?.toLowerCase() || '') &&
      medicine.category === this.selectedCategory
    );
    this.filteredCategories = [];
  }

  extractCategories(): string[] {
    const categorySet = new Set<string>();
    this.medicines.forEach(medicine => {
      if (medicine.category) {
        categorySet.add(medicine.category);
      }
    });
    return Array.from(categorySet);
  }

  filterByCategory(category: string): void {
    if (category) {
      this.selectedCategory = category;
      this.filterMedicines(null); // Reset the medicine filter with the selected category
      // Update the query params to reflect the selected category
      this.router.navigate(['/medicines'], { queryParams: { category } });
    } else {
      this.selectedCategory = null;
      this.filteredMedicines = [...this.medicines]; // Reset to show all medicines
      this.filteredCategories = this.extractCategories();
      this.router.navigate(['/medicines']);
    }
  }

  navigateToMedicineDetails(medicineId: string): void {
    // Navigate to medicine details page with the selected category
    this.router.navigate(['/medicine', medicineId], { queryParams: { category: this.selectedCategory } });
  }

  categories: string[] = ['Pain relief', 'Antibiotics', 'Mental health', 'Cholesterol', 'Diabetes', 'Hypertension', 'Endocrine', 'Gastrointestinal', 'Hematologic', 'Psychiatric', 'lmmunosuppressant'];
  getCategoryImage(category: string): string {
    // Define image paths for each category
    const categoryImages: { [key: string]: string } = {
      'Pain relief': 'assets/images/happy-young-mom-holds-precious-little-child-gently-hugging-his-little-body-kid-laughing-joyfully-looking-camera-with-big-grey-eyes.jpg',
      'Antibiotics': 'assets/images/4300944_18187.jpg',
      'Mental health': 'assets/images/beauty-portrait-ginger-woman-with-long-hair-posing-with-green-leaf.jpg',
      'Cholesterol': 'assets/images/closeup-shot-fresh-fruits-with-different-medicine-wooden-spoon.jpg',
      'Diabetes': 'assets/images/packings-pills-capsules-medicines.jpg',
      'Hypertension': 'assets/images/doctor-taking-care-senior-woman-home.jpg',
      'Endocrine': 'assets/images/flat-lay-minimal-medicinal-pills-assortment.jpg',
      'Gastrointestinal': 'assets/images/arrangement-medical-objects-with-empty-frame.jpg',
      'Cardiovascular': 'assets/images/pleased-young-female-ginger-doctor-wearing-medical-robe-stethoscope-showing-pack-medical-pills-pointing-side-isolated-purple-wall.jpg',
      'Hematologic': 'assets/images/pills 3.png',
      'Psychiatric': 'assets/images/girl-touches-moisturized-skin-smiles-portrait-model-with-cream-face-isolated-wall.jpg',
      'Immunosuppressant': 'assets/images/close-up-clipboard-with-pills.jpg',
    };

    return categoryImages[category] || 'assets/images/default.png'; // Default image if category not found
  }
}
