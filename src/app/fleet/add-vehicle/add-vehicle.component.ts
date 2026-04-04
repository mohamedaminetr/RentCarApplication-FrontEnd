import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../fleet.component';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
})
export class AddVehicleComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Vehicle>();

  newVehicle: Partial<Vehicle> = {
    name: '',
    plate: '',
    type: '',
    year: new Date().getFullYear(),
    ratePerDay: 0,
    mileage: 0,
    fuel: 'Petrol',
    status: 'available',
    utilization: 0,
  };

  imagePreview: string | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.newVehicle.image = this.imagePreview as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerCamera(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onSubmit() {
    // Generate a temporary ID
    const generatedId = Math.random().toString(36).substr(2, 9);

    const payload: Vehicle = {
      ...(this.newVehicle as Vehicle),
      id: generatedId,
    };
    this.save.emit(payload);
  }

  onCancel() {
    this.close.emit();
  }
}
