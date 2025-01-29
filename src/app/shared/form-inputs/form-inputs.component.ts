import { Component, ElementRef, forwardRef, Input, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-form-inputs',
  standalone: true,
  imports: [NgIf,  FormsModule],
  templateUrl: './form-inputs.component.html',
  styleUrl: './form-inputs.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputsComponent),
      multi: true
    }
  ]
})
export class FormInputsComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() type: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';

  value: any = '';
  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit() {}

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Register the onChange function
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register the onTouched function
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // When the input changes, propagate the change to Angular's form system
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  // When the input field is blurred, mark it as touched
  onBlur(): void {
    this.onTouched();
  }
}