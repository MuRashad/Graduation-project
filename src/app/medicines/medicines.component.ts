import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MedicinesService } from '../medicines.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.css']
})
export class MedicinesComponent implements OnInit {
  medicineForm: FormGroup;
  medicines: any[] = [];
  filteredMedicines: any[] = [];
  categories: string[] = [];
  filteredCategories: string[] = [];
  selectedCategory: string | null = null;
  searchControl: FormControl = new FormControl('');

  constructor(
    private medicinesService: MedicinesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicineForm = new FormGroup({
      drugbank_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      updated_at: new FormControl(new Date().toISOString()),
      created_at: new FormControl(new Date().toISOString()),
      // Add more form controls based on your medicine structure
    });
  }

  ngOnInit(): void {
    this.getMedicines();
    this.searchControl.valueChanges.subscribe((value: string) => {
      this.filterResults(value);
    });

    // Retrieve the selected category from the query params if available
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.filterByCategory(decodeURIComponent(category));
      } else {
        this.selectedCategory = null;
        this.filteredMedicines = [...this.medicines];
        this.filteredCategories = [...this.categories];
      }
    });
  }

  getMedicines(): void {
    this.medicinesService.getMedicines().subscribe({
      next: (data: any[]) => {
        this.medicines = data;
        this.filteredMedicines = data;
        this.extractCategories(data);
        this.filteredCategories = [...this.categories];
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
      this.filterCategories(query);
    }
  }

  filterMedicines(query: string | null): void {
    if (query) {
      this.filteredMedicines = this.medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(query.toLowerCase()) &&
        medicine.category === this.selectedCategory
      );
    } else {
      this.filteredMedicines = this.medicines.filter(medicine =>
        medicine.category === this.selectedCategory
      );
    }
  }

  filterCategories(query: string | null): void {
    if (query) {
      this.filteredCategories = this.categories.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredCategories = [...this.categories]; // Reset to show all categories
    }
  }

  filterByCategory(category: string): void {
    if (category) {
      this.selectedCategory = category;
      this.filterMedicines(null); // Reset the medicine filter with the selected category
      // Update the query params to reflect the selected category
      this.router.navigate([], { queryParams: { category } });
    } else {
      this.selectedCategory = null;
      this.filteredMedicines = [...this.medicines]; // Reset to show all medicines
      this.filteredCategories = [...this.categories];
      this.router.navigate([], { queryParams: {} });
    }
  }

  private extractCategories(medicines: any[]): void {
    const categorySet = new Set<string>();
    medicines.forEach(medicine => {
      if (medicine.category) {
        categorySet.add(medicine.category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  navigateToMedicineDetails(medicineId: string): void {
    // Navigate to medicine details page with the selected category
    this.router.navigate(['/medicine', medicineId], { queryParams: { category: this.selectedCategory } });
  }

  getCategoryIconColor(category: string): string {
    // Example: Add custom colors for each category
    const categoryColors: { [key: string]: string } = {
      'Pain Relief': '#ff6347',
      'Antibiotics': '#8a2be2',
      'Vitamins': '#ff7f50',
      // Add more categories and colors as needed
    };

    return categoryColors[category] || '#007bff'; // Default color if category not found
  }
}
