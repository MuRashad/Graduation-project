// src/app/medicine-details/medicine-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicinesService } from '../medicines.service';

@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.css']
})
export class MedicineDetailsComponent implements OnInit {
  medicine: any;  // Declare the medicine property

  constructor(
    private route: ActivatedRoute,
    private medicinesService: MedicinesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.medicinesService.getMedicineById(id).subscribe({
        next: (data: any) => {
          this.medicine = data;
        },
        error: (err: any) => {
          console.error('Error fetching medicine details:', err);
        }
      });
    }
  }
}
