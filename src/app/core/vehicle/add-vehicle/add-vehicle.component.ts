import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Vehicle } from '../../../models/vehicle.model';
import { form, min, minLength, required, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, FormField],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
})
export class AddVehicleComponent implements OnInit {
  @Input() public mode: 'add' | 'edit' = 'add';
  @Input() public vehicle: Vehicle | null = null;
  @Output() public close = new EventEmitter<void>();
  @Output() public save = new EventEmitter<Vehicle>();

  public newVehicle = signal<Vehicle>(new Vehicle());

  // ── 2. Form — schema (validators) in second arg ──
  protected vehicleForm = form(this.newVehicle, (f) => {
    required(f.name);
    minLength(f.name, 2);

    required(f.plate);
    minLength(f.plate, 4);

    // required(f.type);

    // required(f.year);
    // min(f.year, 1900);

    // required(f.fuel);

    // required(f.ratePerDay);
    // min(f.ratePerDay, 1);

    // required(f.mileage);
    // min(f.mileage, 0);
  });

  public imagePreview: string | null = null;
  public errorMessage: string | null = null;
  private selectedFile: File | null = null;

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  public ngOnInit(): void {
    if (this.vehicle) {
      this.newVehicle.set({ ...this.vehicle });
      if (this.vehicle.image) {
        this.imagePreview = this.vehicle.image;
      }
    }
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage = 'Image is too large. Please select an image under 5MB.';
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        return;
      }

      this.errorMessage = null;
      this.selectedFile = file;
      // Create a small preview for UI
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public triggerCamera(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  public async onSubmit(e: Event): Promise<void> {
    e.stopPropagation();
    // Compress image if file was selected
    if (this.selectedFile) {
      try {
        const compressed = await this.compressImage(this.selectedFile);
        this.newVehicle().image = compressed;
      } catch (err) {
        console.error('Image compression failed:', err);
        this.newVehicle().image = this.imagePreview!;
      }
    }

    const payload = this.vehicle ? { ...this.vehicle, ...this.newVehicle() } : new Vehicle(this.newVehicle());
    this.save.emit(payload);
  }

  private compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Max dimensions - smaller for faster upload
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 70% quality for smaller size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  public onCancel(): void {
    this.close.emit();
  }
}
